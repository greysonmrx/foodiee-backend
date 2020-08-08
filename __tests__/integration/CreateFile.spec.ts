import request from 'supertest';
import { Connection, getRepository, getConnection, Repository } from 'typeorm';
import { runSeeder } from 'typeorm-seeding';
import { resolve } from 'path';

import File from '../../src/modules/files/infra/typeorm/entities/File';
import TenantAdminSeed from '../../src/shared/infra/typeorm/seeds/create-tenant-admin';
import createConnection from '../../src/shared/infra/typeorm/index';
import getTokenJWT from '../utils/getTokenJWT';

import app from '../../src/shared/infra/http/app';

let token: string;
let connection: Connection;
let filesRepository: Repository<File>;

const FILE_NAME = 'profile.jpg';

describe('Create file', () => {
  beforeAll(async () => {
    connection = await createConnection('test');
    filesRepository = getRepository(File);
  });

  beforeEach(async () => {
    await runSeeder(TenantAdminSeed);
    token = await getTokenJWT('fakeadmin@tenant.com.br', '123456');
  });

  afterEach(async () => {
    await connection.query('DELETE FROM files');
    await connection.query('DELETE FROM users');
  });

  afterAll(async () => {
    await connection.query('DELETE FROM users');
    await connection.query('DELETE FROM files');
    const mainConnection = getConnection();

    await connection.close();
    await mainConnection.close();
  });

  it('should be able to create a new file', async () => {
    const response = await request(app)
      .post(`/files`)
      .attach('file', resolve(__dirname, '..', 'files', FILE_NAME))
      .set('Authorization', `Bearer ${token}`);

    const file = await filesRepository.findOne({
      where: { name: FILE_NAME },
    });

    expect(file).toBeTruthy();

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        id: expect.any(String),
      }),
    );
  });

  it('should not be able to create a new file without a token', async () => {
    const response = await request(app).post(`/files`);

    const file = await filesRepository.findOne({
      where: { name: FILE_NAME },
    });

    expect(file).toBeFalsy();

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        status: expect.stringMatching('error'),
        message: expect.stringMatching('Token não informado.'),
      }),
    );
  });

  it('should not be able to create a new file with a invalid token', async () => {
    const response = await request(app).post(`/files`).set('Authorization', `Bearer invalid.token`);

    const file = await filesRepository.findOne({
      where: { name: FILE_NAME },
    });

    expect(file).toBeFalsy();

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        status: expect.stringMatching('error'),
        message: expect.stringMatching('Token inválido.'),
      }),
    );
  });
});
