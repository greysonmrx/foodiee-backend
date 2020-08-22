import request from 'supertest';
import { Connection, getRepository, getConnection, Repository } from 'typeorm';
import { runSeeder } from 'typeorm-seeding';

import Tenant from '../../../src/modules/tenants/infra/typeorm/entities/Tenant';
import TenantAdminSeed from '../../../src/shared/infra/typeorm/seeds/create-tenant-admin';
import createConnection from '../../../src/shared/infra/typeorm/index';
import getTokenJWT from '../../utils/getTokenJWT';

import app from '../../../src/shared/infra/http/app';

let token: string;
let connection: Connection;
let tenantsRepository: Repository<Tenant>;

describe('Create tenant', () => {
  beforeAll(async () => {
    connection = await createConnection('test');
    tenantsRepository = getRepository(Tenant);
  });

  beforeEach(async () => {
    await runSeeder(TenantAdminSeed);
    token = await getTokenJWT('fakeadmin@tenant.com.br', '123456');
  });

  afterEach(async () => {
    await connection.query('DELETE FROM users');
    await connection.query('DELETE FROM tenants');
  });

  afterAll(async () => {
    const mainConnection = getConnection();

    await connection.close();
    await mainConnection.close();
  });

  it('should be able to create a new tenant', async () => {
    const response = await request(app)
      .post('/tenants')
      .send({
        name: "McDonald's",
        slug: 'mc-donalds',
      })
      .set('Authorization', `Bearer ${token}`);

    const tenant = await tenantsRepository.findOne({
      where: { slug: 'mc-donalds' },
    });

    expect(tenant).toBeTruthy();

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        id: expect.any(String),
      }),
    );
  });

  it('should not be able to create a new tenant without a token', async () => {
    const response = await request(app).post('/tenants').send({
      name: "McDonald's",
      slug: 'mc-donalds',
    });

    const tenant = await tenantsRepository.findOne({
      where: { slug: 'mc-donalds' },
    });

    expect(tenant).toBeFalsy();

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        status: expect.stringMatching('error'),
        message: expect.stringMatching('Token não informado.'),
      }),
    );
  });

  it('should not be able to create a new tenant with a invalid token', async () => {
    const response = await request(app)
      .post('/tenants')
      .send({
        name: "McDonald's",
        slug: 'mc-donalds',
      })
      .set('Authorization', `Bearer invalid.token`);

    const tenant = await tenantsRepository.findOne({
      where: { slug: 'mc-donalds' },
    });

    expect(tenant).toBeFalsy();

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        status: expect.stringMatching('error'),
        message: expect.stringMatching('Token inválido.'),
      }),
    );
  });

  it('should not be able to create a new tenant with duplicate slug', async () => {
    await request(app)
      .post('/tenants')
      .send({
        name: "McDonald's",
        slug: 'mc-donalds',
      })
      .set('Authorization', `Bearer ${token}`);

    const response = await request(app)
      .post('/tenants')
      .send({
        name: "McDonald's",
        slug: 'mc-donalds',
      })
      .set('Authorization', `Bearer ${token}`);

    const tenants = await tenantsRepository.find({
      where: { slug: 'mc-donalds' },
    });

    expect(tenants).toHaveLength(1);

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        status: expect.stringMatching('error'),
        message: expect.stringMatching('Este slug já está em uso. Tente outro.'),
      }),
    );
  });

  it('should not be able to create a new tenant with no name', async () => {
    const response = await request(app)
      .post('/tenants')
      .send({
        slug: 'mc-donalds',
      })
      .set('Authorization', `Bearer ${token}`);

    const tenants = await tenantsRepository.findOne({
      where: { slug: 'mc-donalds' },
    });

    expect(tenants).toBeFalsy();

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        error: expect.stringMatching('Bad Request'),
        message: expect.stringMatching("O campo 'nome' não pode estar vazio"),
      }),
    );
  });

  it('should not be able to create a new tenant without a slug', async () => {
    const response = await request(app)
      .post('/tenants')
      .send({
        name: "McDonald's",
      })
      .set('Authorization', `Bearer ${token}`);

    const tenants = await tenantsRepository.findOne({
      where: { name: "McDonald's" },
    });

    expect(tenants).toBeFalsy();

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        error: expect.stringMatching('Bad Request'),
        message: expect.stringMatching("O campo 'slug' não pode estar vazio"),
      }),
    );
  });
});
