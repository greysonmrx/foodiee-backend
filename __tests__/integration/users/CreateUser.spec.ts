import request from 'supertest';
import { Connection, getRepository, getConnection, Repository } from 'typeorm';
import { runSeeder } from 'typeorm-seeding';
import { v4 } from 'uuid';

import Tenant from '../../../src/modules/tenants/infra/typeorm/entities/Tenant';
import User from '../../../src/modules/users/infra/typeorm/entities/User';
import TenantAdminSeed from '../../../src/shared/infra/typeorm/seeds/create-tenant-admin';
import createConnection from '../../../src/shared/infra/typeorm/index';
import getTokenJWT from '../../utils/getTokenJWT';

import app from '../../../src/shared/infra/http/app';

let token: string;
let connection: Connection;
let usersRepository: Repository<User>;
let tenantsRepository: Repository<Tenant>;

describe('Create user', () => {
  beforeAll(async () => {
    connection = await createConnection('test');
    usersRepository = getRepository(User);
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
    await connection.query('DELETE FROM users');
    await connection.query('DELETE FROM tenants');
    const mainConnection = getConnection();

    await connection.close();
    await mainConnection.close();
  });

  it('should be able to create a new user', async () => {
    const { id: tenant_id } = await tenantsRepository.save(
      tenantsRepository.create({
        name: "McDonald's",
        slug: 'mc-donalds',
      }),
    );

    const response = await request(app)
      .post(`/users/${tenant_id}`)
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
    const response = await request(app).post(`/users/${v4()}`).send({
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
      .post(`/users/${v4()}`)
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

  it('should not be able to create a new user with a non-existing tenant', async () => {
    const response = await request(app)
      .post(`/users/${v4()}`)
      .send({
        name: 'Breno Almeida Ribeiro',
        email: 'guilhermemartins@armyspy.com',
        password: 'miQuoh5f',
      })
      .set('Authorization', `Bearer ${token}`);

    const user = await usersRepository.findOne({
      where: { email: 'guilhermemartins@armyspy.com' },
    });

    expect(user).toBeFalsy();

    expect(response.status).toBe(404);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        status: expect.stringMatching('error'),
        message: expect.stringMatching('Loja não encontrada.'),
      }),
    );
  });

  it('should not be able to create a new user with an invalid tenant id', async () => {
    const response = await request(app)
      .post(`/users/invalid-tenant-id`)
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
        message: expect.stringMatching('Insira uma loja válida'),
      }),
    );
  });

  it('should not be able to create two users with the same email', async () => {
    const { id: tenant_id } = await tenantsRepository.save(
      tenantsRepository.create({
        name: "McDonald's",
        slug: 'mc-donalds',
      }),
    );

    await request(app)
      .post(`/users/${tenant_id}`)
      .send({
        name: 'Guilherme Martins',
        email: 'guilhermemartins@armyspy.com',
        password: 'jieNgae7',
      })
      .set('Authorization', `Bearer ${token}`);

    const response = await request(app)
      .post(`/users/${tenant_id}`)
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
      .post(`/users/${v4()}`)
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
      .post(`/users/${v4()}`)
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
      .post(`/users/${v4()}`)
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
      .post(`/users/${v4()}`)
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
      .post(`/users/${v4()}`)
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
