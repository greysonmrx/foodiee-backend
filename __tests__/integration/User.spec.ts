import request from 'supertest';
import { Connection, getRepository, getConnection, Repository } from 'typeorm';
import { runSeeder } from 'typeorm-seeding';

import User from '../../src/modules/users/infra/typeorm/entities/User';
import TenantAdminSeed from '../../src/shared/infra/typeorm/seeds/create-tenant-admin';
import TenantUserSeed from '../../src/shared/infra/typeorm/seeds/create-tenant-user';
import createConnection from '../../src/shared/infra/typeorm/index';
import getTokenJWT from '../utils/getTokenJWT';

import app from '../../src/shared/infra/http/app';

let connection: Connection;
let usersRepository: Repository<User>;

describe('User', () => {
  beforeAll(async () => {
    connection = await createConnection('test');
    usersRepository = getRepository(User);
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

  describe('Create', () => {
    let token: string;

    beforeEach(async () => {
      await runSeeder(TenantAdminSeed);
      token = await getTokenJWT('fakeadmin@tenant.com.br', '123456');
    });

    it('should be able to create a new user', async () => {
      const response = await request(app)
        .post('/users')
        .send({
          name: 'Guilherme Martins',
          email: 'guilhermemartins@armyspy.com',
          password: 'jieNgae7',
        })
        .set('Authorization', `Bearer ${token}`);

      const user = await usersRepository.findOne({
        where: { email: 'guilhermemartins@armyspy.com' },
      });

      expect(user).toBeTruthy();

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject(
        expect.objectContaining({
          id: expect.any(String),
        }),
      );
    });

    it('should not be able to create a new user without a token', async () => {
      const response = await request(app).post('/users').send({
        name: 'Guilherme Martins',
        email: 'guilhermemartins@armyspy.com',
        password: 'jieNgae7',
      });

      const user = await usersRepository.findOne({
        where: { email: 'guilhermemartins@armyspy.com' },
      });

      expect(user).toBeFalsy();

      expect(response.status).toBe(401);
      expect(response.body).toMatchObject(
        expect.objectContaining({
          status: expect.stringMatching('error'),
          message: expect.stringMatching('Token não informado.'),
        }),
      );
    });

    it('should not be able to create a new user with a invalid token', async () => {
      const response = await request(app)
        .post('/users')
        .send({
          name: 'Guilherme Martins',
          email: 'guilhermemartins@armyspy.com',
          password: 'jieNgae7',
        })
        .set('Authorization', `Bearer invalid.token`);

      const user = await usersRepository.findOne({
        where: { email: 'guilhermemartins@armyspy.com' },
      });

      expect(user).toBeFalsy();

      expect(response.status).toBe(401);
      expect(response.body).toMatchObject(
        expect.objectContaining({
          status: expect.stringMatching('error'),
          message: expect.stringMatching('Token inválido.'),
        }),
      );
    });

    it('should not be able to create two users with the same email', async () => {
      await request(app)
        .post('/users')
        .send({
          name: 'Guilherme Martins',
          email: 'guilhermemartins@armyspy.com',
          password: 'jieNgae7',
        })
        .set('Authorization', `Bearer ${token}`);

      const response = await request(app)
        .post('/users')
        .send({
          name: 'Breno Almeida Ribeiro',
          email: 'guilhermemartins@armyspy.com',
          password: 'miQuoh5f',
        })
        .set('Authorization', `Bearer ${token}`);

      const user = await usersRepository.find({
        where: { email: 'guilhermemartins@armyspy.com' },
      });

      expect(user).toHaveLength(1);

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject(
        expect.objectContaining({
          status: expect.stringMatching('error'),
          message: expect.stringMatching('Este endereço de e-mail já está em uso. Tente outro.'),
        }),
      );
    });

    it('should not be able to create a new user with no name', async () => {
      const response = await request(app)
        .post('/users')
        .send({
          email: 'guilhermemartins@armyspy.com',
          password: 'jieNgae7',
        })
        .set('Authorization', `Bearer ${token}`);

      const user = await usersRepository.findOne({
        where: { email: 'guilhermemartins@armyspy.com' },
      });

      expect(user).toBeFalsy();

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject(
        expect.objectContaining({
          error: expect.stringMatching('Bad Request'),
        }),
      );
    });

    it('should not be able to create a new user without e-mail', async () => {
      const response = await request(app)
        .post('/users')
        .send({
          name: 'Guilherme Martins',
          password: 'jieNgae7',
        })
        .set('Authorization', `Bearer ${token}`);

      const user = await usersRepository.findOne({
        where: { email: 'guilhermemartins@armyspy.com' },
      });

      expect(user).toBeFalsy();

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject(
        expect.objectContaining({
          error: expect.stringMatching('Bad Request'),
          message: expect.stringMatching("O campo 'e-mail' não pode estar vazio"),
        }),
      );
    });

    it('should not be able to create a new user with an invalid e-mail', async () => {
      const response = await request(app)
        .post('/users')
        .send({
          name: 'Guilherme Martins',
          email: 'ajksdhgaskjdhasd',
          password: 'jieNgae7',
        })
        .set('Authorization', `Bearer ${token}`);

      const user = await usersRepository.findOne({
        where: { email: 'guilhermemartins@armyspy.com' },
      });

      expect(user).toBeFalsy();

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject(
        expect.objectContaining({
          error: expect.stringMatching('Bad Request'),
          message: expect.stringMatching('Insira um e-mail válido'),
        }),
      );
    });

    it('should not be able to create a new user without a password', async () => {
      const response = await request(app)
        .post('/users')
        .send({
          name: 'Guilherme Martins',
          email: 'guilhermemartins@armyspy.com',
        })
        .set('Authorization', `Bearer ${token}`);

      const user = await usersRepository.findOne({
        where: { email: 'guilhermemartins@armyspy.com' },
      });

      expect(user).toBeFalsy();

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject(
        expect.objectContaining({
          error: expect.stringMatching('Bad Request'),
          message: expect.stringMatching("O campo 'senha' não pode estar vazio"),
        }),
      );
    });

    it('should not be able to create a new user with a password of less than 6 digits', async () => {
      const response = await request(app)
        .post('/users')
        .send({
          name: 'Guilherme Martins',
          email: 'guilhermemartins@armyspy.com',
          password: '12345',
        })
        .set('Authorization', `Bearer ${token}`);

      const user = await usersRepository.findOne({
        where: { email: 'guilhermemartins@armyspy.com' },
      });

      expect(user).toBeFalsy();

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject(
        expect.objectContaining({
          error: expect.stringMatching('Bad Request'),
          message: expect.stringMatching("O campo 'senha' tem que ter pelo menos 6 dígitos"),
        }),
      );
    });
  });

  describe('Update', () => {
    let token: string;

    beforeEach(async () => {
      await runSeeder(TenantUserSeed);
      token = await getTokenJWT('fakeuser@tenant.com.br', '123456');
    });

    it('should be able to update a user profile', async () => {
      const response = await request(app)
        .put('/profiles')
        .send({
          name: 'Guilherme Martins',
          email: 'guilhermemartins@armyspy.com',
          current_password: '123456',
          password: 'jieNgae7',
        })
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject(
        expect.objectContaining({
          id: expect.any(String),
        }),
      );
    });

    it('should not be able to update the profile of a non-existent user', async () => {
      const user = await usersRepository.findOne({
        where: { email: 'fakeuser@tenant.com.br' },
      });

      if (user) {
        await usersRepository.delete(user.id);
      }

      const response = await request(app)
        .put('/profiles')
        .send({
          name: 'Guilherme Martins',
          email: 'guilhermemartins@armyspy.com',
        })
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body).toMatchObject(
        expect.objectContaining({
          status: expect.stringMatching('error'),
          message: expect.stringMatching('Usuário não encontrado.'),
        }),
      );
    });

    it('should not be able to update a user profile with no name', async () => {
      const response = await request(app)
        .put('/profiles')
        .send({
          email: 'guilhermemartins@armyspy.com',
        })
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject(
        expect.objectContaining({
          error: expect.stringMatching('Bad Request'),
          message: expect.stringMatching("O campo 'nome' não pode estar vazio"),
        }),
      );
    });

    it('should not be able to update a user profile without a e-mail', async () => {
      const response = await request(app)
        .put('/profiles')
        .send({
          name: 'Guilherme Martins',
        })
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject(
        expect.objectContaining({
          error: expect.stringMatching('Bad Request'),
          message: expect.stringMatching("O campo 'e-mail' não pode estar vazio"),
        }),
      );
    });

    it('should not be able to update user profile with duplicate email', async () => {
      const user = await usersRepository.create({
        name: 'Guilherme Martins',
        email: 'guilhermemartins@armyspy.com',
        password: 'jieNgae7',
      });

      await usersRepository.save(user);

      const response = await request(app)
        .put('/profiles')
        .send({
          name: 'Guilherme Martins',
          email: 'guilhermemartins@armyspy.com',
        })
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject(
        expect.objectContaining({
          status: expect.stringMatching('error'),
          message: expect.stringMatching('Este endereço de e-mail já está em uso. Tente outro.'),
        }),
      );
    });

    it('should not be able to update a user profile with a invalid e-mail', async () => {
      const response = await request(app)
        .put('/profiles')
        .send({
          name: 'Guilherme Martins',
          email: 'askjdgasfsfdgedfghklj',
        })
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject(
        expect.objectContaining({
          error: expect.stringMatching('Bad Request'),
          message: expect.stringMatching('Insira um e-mail válido'),
        }),
      );
    });

    it('should not be able to update a user profile without the current password when a new password exists', async () => {
      const response = await request(app)
        .put('/profiles')
        .send({
          name: 'Guilherme Martins',
          email: 'guilhermemartins@armyspy.com',
          password: 'miQuoh5f',
        })
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject(
        expect.objectContaining({
          status: expect.stringMatching('error'),
          message: expect.stringMatching('Você precisa informar a senha atual para criar uma nova.'),
        }),
      );
    });

    it('should not be able to update user profile with an incorrect password', async () => {
      const response = await request(app)
        .put('/profiles')
        .send({
          name: 'Guilherme Martins',
          email: 'guilhermemartins@armyspy.com',
          current_password: 'miQuoh5f',
          password: 'jieNgae7',
        })
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(401);
      expect(response.body).toMatchObject(
        expect.objectContaining({
          status: expect.stringMatching('error'),
          message: expect.stringMatching('Senha incorreta.'),
        }),
      );
    });

    it('should not be able to update user profile with a new password of less than 6 digits', async () => {
      const response = await request(app)
        .put('/profiles')
        .send({
          name: 'Guilherme Martins',
          email: 'guilhermemartins@armyspy.com',
          current_password: 'jieNgae7',
          password: '12345',
        })
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject(
        expect.objectContaining({
          error: expect.stringMatching('Bad Request'),
          message: expect.stringMatching("O campo 'senha' tem que ter pelo menos 6 dígitos"),
        }),
      );
    });

    it('should not be able to update user profile with a current password of less than 6 digits', async () => {
      const response = await request(app)
        .put('/profiles')
        .send({
          name: 'Guilherme Martins',
          email: 'guilhermemartins@armyspy.com',
          current_password: '12345',
          password: 'miQuoh5f',
        })
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject(
        expect.objectContaining({
          error: expect.stringMatching('Bad Request'),
          message: expect.stringMatching("O campo 'senha atual' tem que ter pelo menos 6 dígitos"),
        }),
      );
    });
  });
});
