import request from 'supertest';
import { Connection, getRepository, getConnection, Repository } from 'typeorm';
import { runSeeder } from 'typeorm-seeding';

import Tenant from '../../src/modules/tenants/infra/typeorm/entities/Tenant';
import TenantAdminSeed from '../../src/shared/infra/typeorm/seeds/create-tenant-admin';
import createConnection from '../../src/shared/infra/typeorm/index';
import getTokenJWT from '../utils/getTokenJWT';

import app from '../../src/shared/infra/http/app';

let token: string;
let connection: Connection;
let tenantsRepository: Repository<Tenant>;

describe('List tenants', () => {
  beforeAll(async () => {
    connection = await createConnection('test');
    tenantsRepository = getRepository(Tenant);
  });

  beforeEach(async () => {
    await runSeeder(TenantAdminSeed);
    token = await getTokenJWT('fakeadmin@tenant.com.br', '123456');
  });

  afterEach(async () => {
    await connection.query('DELETE FROM tenants');
    await connection.query('DELETE FROM users');
  });

  afterAll(async () => {
    await connection.query('DELETE FROM tenants');
    await connection.query('DELETE FROM users');
    const mainConnection = getConnection();

    await connection.close();
    await mainConnection.close();
  });

  it('should be able to list all tenants', async () => {
    await tenantsRepository.save(tenantsRepository.create({ name: "McDonald's", slug: 'mc-donalds' }));
    await tenantsRepository.save(tenantsRepository.create({ name: "Bob's", slug: 'bobs' }));

    const response = await request(app).get('/tenants').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
  });

  it('should not be able to list all tenants without a token', async () => {
    const response = await request(app).get('/tenants');

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        status: expect.stringMatching('error'),
        message: expect.stringMatching('Token não informado.'),
      }),
    );
  });

  it('should not be able to list all tenants with a invalid token', async () => {
    const response = await request(app).get('/tenants').set('Authorization', `Bearer invalid.token`);

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        status: expect.stringMatching('error'),
        message: expect.stringMatching('Token inválido.'),
      }),
    );
  });
});
