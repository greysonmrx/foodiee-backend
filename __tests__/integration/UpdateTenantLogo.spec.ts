import request from 'supertest';
import { Connection, getRepository, getConnection, Repository } from 'typeorm';
import { runSeeder } from 'typeorm-seeding';
import { v4 } from 'uuid';

import File from '../../src/modules/files/infra/typeorm/entities/File';
import Tenant from '../../src/modules/tenants/infra/typeorm/entities/Tenant';
import TenantAdminSeed from '../../src/shared/infra/typeorm/seeds/create-tenant-admin';
import createConnection from '../../src/shared/infra/typeorm/index';
import getTokenJWT from '../utils/getTokenJWT';

import app from '../../src/shared/infra/http/app';

let token: string;
let connection: Connection;
let tenantsRepository: Repository<Tenant>;
let filesRepository: Repository<File>;

describe('Update tenant', () => {
  beforeAll(async () => {
    connection = await createConnection('test');
    tenantsRepository = getRepository(Tenant);
    filesRepository = getRepository(File);
  });

  beforeEach(async () => {
    await runSeeder(TenantAdminSeed);
    token = await getTokenJWT('fakeadmin@tenant.com.br', '123456');
  });

  afterEach(async () => {
    await connection.query('DELETE FROM users');
    await connection.query('DELETE FROM tenants');
    await connection.query('DELETE FROM files');
  });

  afterAll(async () => {
    await connection.query('DELETE FROM users');
    await connection.query('DELETE FROM tenants');
    await connection.query('DELETE FROM files');
    const mainConnection = getConnection();

    await connection.close();
    await mainConnection.close();
  });

  it('should be able to update a tenant logo', async () => {
    const tenant = tenantsRepository.create({
      name: "McDonald's",
      slug: 'mc-donalds',
    });

    await tenantsRepository.save(tenant);

    const logo = filesRepository.create({
      name: 'logoName.png',
      path: 'logoPath.png',
    });

    await filesRepository.save(logo);

    const response = await request(app)
      .patch(`/tenants/${tenant.id}`)
      .send({
        logo_id: logo.id,
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        id: expect.any(String),
      }),
    );
  });

  it('should not be able to update a tenant logo without a token', async () => {
    const response = await request(app).patch(`/tenants/${v4()}`).send({
      logo_id: v4(),
    });

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        status: expect.stringMatching('error'),
        message: expect.stringMatching('Token não informado.'),
      }),
    );
  });

  it('should not be able to update a tenant with a invalid token', async () => {
    const response = await request(app)
      .patch(`/tenants/${v4()}`)
      .send({
        logo_id: v4(),
      })
      .set('Authorization', `Bearer invalid.token`);

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        status: expect.stringMatching('error'),
        message: expect.stringMatching('Token inválido.'),
      }),
    );
  });

  it('should not be able to update the logo of a non-existing tenant', async () => {
    const response = await request(app)
      .patch(`/tenants/${v4()}`)
      .send({
        logo_id: v4(),
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        status: expect.stringMatching('error'),
        message: expect.stringMatching('Loja não encontrada.'),
      }),
    );
  });

  it('should not be able to update the logo with an invalid tenant id', async () => {
    const response = await request(app)
      .patch(`/tenants/invalid-id`)
      .send({
        logo_id: v4(),
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        error: expect.stringMatching('Bad Request'),
        message: expect.stringMatching('Insira um id válido'),
      }),
    );
  });

  it('should not be able to update the tenant logo with an invalid id', async () => {
    const response = await request(app)
      .patch(`/tenants/${v4()}`)
      .send({
        logo_id: 'invalid-id',
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        error: expect.stringMatching('Bad Request'),
        message: expect.stringMatching('Insira um logo válido'),
      }),
    );
  });

  it('should not be able to update the tenant logo with a non-existing file', async () => {
    const tenant = tenantsRepository.create({
      name: "McDonald's",
      slug: 'mc-donalds',
    });

    await tenantsRepository.save(tenant);

    const response = await request(app)
      .patch(`/tenants/${tenant.id}`)
      .send({
        logo_id: v4(),
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        status: expect.stringMatching('error'),
        message: expect.stringMatching('Arquivo não encontrado.'),
      }),
    );
  });
});
