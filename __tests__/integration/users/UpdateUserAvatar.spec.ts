import request from 'supertest';
import { Connection, getRepository, getConnection, Repository } from 'typeorm';
import { runSeeder } from 'typeorm-seeding';
import { v4 } from 'uuid';

import File from '../../../src/modules/files/infra/typeorm/entities/File';
import TenantAdminSeed from '../../../src/shared/infra/typeorm/seeds/create-tenant-admin';
import createConnection from '../../../src/shared/infra/typeorm/index';
import getUserTokenJWT from '../../utils/getUserTokenJWT';

import app from '../../../src/shared/infra/http/app';

let token: string;
let connection: Connection;
let filesRepository: Repository<File>;

describe('Update user avatar', () => {
  beforeAll(async () => {
    connection = await createConnection('test');
    filesRepository = getRepository(File);
  });

  beforeEach(async () => {
    await runSeeder(TenantAdminSeed);
    token = await getUserTokenJWT('fakeadmin@tenant.com.br', '123456');
  });

  afterEach(async () => {
    await connection.query('DELETE FROM users');
    await connection.query('DELETE FROM files');
  });

  afterAll(async () => {
    const mainConnection = getConnection();

    await connection.close();
    await mainConnection.close();
  });

  it('should be able to update the user avatar', async () => {
    const { id: avatar_id } = await filesRepository.save(
      filesRepository.create({
        name: 'fileName.jpeg',
        path: 'filePath.jpeg',
      }),
    );

    const response = await request(app)
      .patch('/users')
      .send({
        avatar_id,
      })
      .set('Authorization', `Bearer ${token}`);

    const avatarExists = await filesRepository.findOne({
      where: { name: 'fileName.jpeg' },
    });

    expect(avatarExists).toBeTruthy();

    expect(response.status).toBe(200);
  });

  it('should not be able to update the user avatar without a token', async () => {
    const response = await request(app).patch('/users');

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        status: expect.stringMatching('error'),
        message: expect.stringMatching('Token não informado.'),
      }),
    );
  });

  it('should not be able to update the user avatar with a invalid token', async () => {
    const response = await request(app).patch('/users').set('Authorization', 'Bearer invalid.token');

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        status: expect.stringMatching('error'),
        message: expect.stringMatching('Token inválido.'),
      }),
    );
  });

  it('should not be able to update the user avatar with invalid file id', async () => {
    const response = await request(app)
      .patch('/users')
      .send({
        avatar_id: 'invalid-id',
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

  it('should not be able to update avatar with a non-existing file', async () => {
    const response = await request(app)
      .patch('/users')
      .send({
        avatar_id: v4(),
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
