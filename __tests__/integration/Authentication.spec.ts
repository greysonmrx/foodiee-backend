import request from 'supertest';
import { Connection, getConnection } from 'typeorm';
import { runSeeder } from 'typeorm-seeding';

import TenantAdminSeed from '../../src/shared/infra/typeorm/seeds/create-tenant-admin';
import createConnection from '../../src/shared/infra/typeorm/index';

import app from '../../src/shared/infra/http/app';

let connection: Connection;

describe('Authentication', () => {
  beforeAll(async () => {
    connection = await createConnection('test');
  });

  beforeEach(async () => {
    await runSeeder(TenantAdminSeed);
  });

  afterEach(async () => {
    await connection.query('DELETE FROM users');
  });

  afterAll(async () => {
    await connection.query('DELETE FROM users');
    const mainConnection = getConnection();

    await connection.close();
    await mainConnection.close();
  });

  it('should be able to authenticate a user with valid credentials', async () => {
    const response = await request(app).post('/sessions').send({
      email: 'fakeadmin@tenant.com.br',
      password: '123456',
    });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        token: expect.any(String),
        user: expect.any(Object),
      }),
    );
  });

  it('should not be able to authenticate a user with the wrong e-mail', async () => {
    const response = await request(app).post('/sessions').send({
      email: 'admin@gmail.com',
      password: '123456',
    });

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        status: expect.stringMatching('error'),
        message: expect.stringMatching('Endereço de e-mail ou senha incorretos.'),
      }),
    );
  });

  it('should not be able to authenticate a user with the wrong password', async () => {
    const response = await request(app).post('/sessions').send({
      email: 'admin@gmail.com',
      password: '012345',
    });

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        status: expect.stringMatching('error'),
        message: expect.stringMatching('Endereço de e-mail ou senha incorretos.'),
      }),
    );
  });

  it('should not be able to authenticate a user without e-mail', async () => {
    const response = await request(app).post('/sessions').send({
      password: '123456',
    });

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        error: expect.stringMatching('Bad Request'),
        message: expect.stringMatching("O campo 'e-mail' não pode estar vazio"),
      }),
    );
  });

  it('should not be able to authenticate a user with an invalid e-mail', async () => {
    const response = await request(app).post('/sessions').send({
      email: 'ajksdhgaskjdhasd',
      password: '123456',
    });

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        error: expect.stringMatching('Bad Request'),
        message: expect.stringMatching('Insira um e-mail válido'),
      }),
    );
  });

  it('should not be able to authenticate a user without a password', async () => {
    const response = await request(app).post('/sessions').send({
      email: 'fakeadmin@tenant.com.br',
    });

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        error: expect.stringMatching('Bad Request'),
        message: expect.stringMatching("O campo 'senha' não pode estar vazio"),
      }),
    );
  });

  it('should not be able to authenticate a user with a password of less than 6 digits', async () => {
    const response = await request(app).post('/sessions').send({
      email: 'fakeadmin@tenant.com.br',
      password: '12345',
    });

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        error: expect.stringMatching('Bad Request'),
        message: expect.stringMatching("O campo 'senha' tem que ter pelo menos 6 dígitos"),
      }),
    );
  });
});
