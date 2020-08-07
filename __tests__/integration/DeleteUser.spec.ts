import request from 'supertest';
import { Connection, getRepository, getConnection, Repository } from 'typeorm';
import { runSeeder } from 'typeorm-seeding';
import { v4 } from 'uuid';

import User from '../../src/modules/users/infra/typeorm/entities/User';
import TenantAdminSeed from '../../src/shared/infra/typeorm/seeds/create-tenant-admin';
import createConnection from '../../src/shared/infra/typeorm/index';
import getTokenJWT from '../utils/getTokenJWT';

import app from '../../src/shared/infra/http/app';

let token: string;
let connection: Connection;
let usersRepository: Repository<User>;

describe('Delete user', () => {
  beforeAll(async () => {
    connection = await createConnection('test');
    usersRepository = getRepository(User);
  });

  beforeEach(async () => {
    await runSeeder(TenantAdminSeed);
    token = await getTokenJWT('fakeadmin@tenant.com.br', '123456');
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

  it('should be able to delete a user', async () => {
    const user = await usersRepository.create({
      name: 'Guilherme Martins',
      email: 'guilhermemartins@armyspy.com',
      password: 'jieNgae7',
    });

    const { id } = await usersRepository.save(user);

    const response = await request(app).delete(`/users/${id}`).set('Authorization', `Bearer ${token}`);

    const deletedUser = await usersRepository.findOne({
      where: { email: 'guilhermemartins@armyspy.com' },
    });

    expect(deletedUser).toBeFalsy();

    expect(response.status).toBe(204);
  });

  it('should not be able to delete a user without a token', async () => {
    const response = await request(app).delete(`/users/${v4()}`);

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        status: expect.stringMatching('error'),
        message: expect.stringMatching('Token não informado.'),
      }),
    );
  });

  it('should not be able to delete a user with a invalid token', async () => {
    const response = await request(app).delete(`/users/${v4()}`).set('Authorization', `Bearer invalid.token`);

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        status: expect.stringMatching('error'),
        message: expect.stringMatching('Token inválido.'),
      }),
    );
  });

  it('should not be able to delete a user with invalid id', async () => {
    const response = await request(app).delete(`/users/invalid-id`).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        error: expect.stringMatching('Bad Request'),
        message: expect.stringMatching('Insira um id válido'),
      }),
    );
  });

  it('should not be able to delete a non-existing user', async () => {
    const response = await request(app).delete(`/users/${v4()}`).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        status: expect.stringMatching('error'),
        message: expect.stringMatching('Usuário não encontrado.'),
      }),
    );
  });
});
