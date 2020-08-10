import request from 'supertest';
import { Connection, getRepository, getConnection, Repository } from 'typeorm';
import { runSeeder } from 'typeorm-seeding';
import { v4 } from 'uuid';

import Tenant from '../../src/modules/tenants/infra/typeorm/entities/Tenant';
import TenantAdminSeed from '../../src/shared/infra/typeorm/seeds/create-tenant-admin';
import createConnection from '../../src/shared/infra/typeorm/index';
import getTokenJWT from '../utils/getTokenJWT';

import app from '../../src/shared/infra/http/app';

let token: string;
let connection: Connection;
let tenantsRepository: Repository<Tenant>;

describe('Delete tenant', () => {
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

  it('should be able to delete a tenant', async () => {
    const tenant = tenantsRepository.create({ name: "McDonald's", slug: 'mc-donalds' });

    await tenantsRepository.save(tenant);

    const response = await request(app).delete(`/tenants/${tenant.id}`).set('Authorization', `Bearer ${token}`);

    const tenantExists = await tenantsRepository.findOne({
      where: { slug: 'mc-donalds' },
    });

    expect(tenantExists).toBeFalsy();
    expect(response.status).toBe(204);
  });

  it('should not be able to delete a tenant without a token', async () => {
    const response = await request(app).delete(`/tenants/${v4()}`);

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        status: expect.stringMatching('error'),
        message: expect.stringMatching('Token não informado.'),
      }),
    );
  });

  it('should not be able to delete a tenant with a invalid token', async () => {
    const response = await request(app).delete(`/tenants/${v4()}`).set('Authorization', `Bearer invalid.token`);

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        status: expect.stringMatching('error'),
        message: expect.stringMatching('Token inválido.'),
      }),
    );
  });

  it('should not be able to delete a tenant with invalid id', async () => {
    const response = await request(app).delete(`/tenants/invalid-id`).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        error: expect.stringMatching('Bad Request'),
        message: expect.stringMatching('Insira um id válido'),
      }),
    );
  });

  it('should not be able to delete a non-existing tenant', async () => {
    const response = await request(app).delete(`/tenants/${v4()}`).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        status: expect.stringMatching('error'),
        message: expect.stringMatching('Loja não encontrada.'),
      }),
    );
  });
});
