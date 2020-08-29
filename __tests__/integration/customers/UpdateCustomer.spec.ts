import request from 'supertest';
import { Connection, getRepository, getConnection, Repository } from 'typeorm';
import { runSeeder } from 'typeorm-seeding';

import Customer from '../../../src/modules/customers/infra/typeorm/entities/Customer';
import CustomerSeed from '../../../src/shared/infra/typeorm/seeds/create-customer';
import createConnection from '../../../src/shared/infra/typeorm/index';
import getCustomerTokenJWT from '../../utils/getCustomerTokenJWT';

import app from '../../../src/shared/infra/http/app';

let token: string;
let connection: Connection;
let customersRepository: Repository<Customer>;

describe('Update customer', () => {
  beforeAll(async () => {
    connection = await createConnection('test');
  });

  beforeEach(async () => {
    await runSeeder(CustomerSeed);
    token = await getCustomerTokenJWT('14962649627', '9090');
    customersRepository = getRepository(Customer);
  });

  afterEach(async () => {
    await connection.query('DELETE FROM customers');
    await connection.query('DELETE FROM customer_tokens');
  });

  afterAll(async () => {
    const mainConnection = getConnection();

    await connection.close();
    await mainConnection.close();
  });

  it('should be able to update a customer', async () => {
    const response = await request(app)
      .put('/customers')
      .send({
        name: 'Greyson Mascarenhas Santos Filho',
        phone: '82999999999',
        social_security: '80837744563',
      })
      .set('Authorization', `Bearer ${token}`);

    const customer = await customersRepository.findOne({
      where: { phone: '82999999999' },
    });

    expect(customer).toBeTruthy();

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        id: expect.any(String),
      }),
    );
  });

  it('should not be able to update a customer without a token', async () => {
    const response = await request(app).put('/customers').send({
      name: 'Greyson Mascarenhas Santos Filho',
      phone: '82999999999',
      social_security: '80837744563',
    });

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        status: expect.stringMatching('error'),
        message: expect.stringMatching('Token não informado.'),
      }),
    );
  });

  it('should not be able to update a customer with a invalid token', async () => {
    const response = await request(app)
      .put('/customers')
      .send({
        name: 'Greyson Mascarenhas Santos Filho',
        phone: '82999999999',
        social_security: '80837744563',
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

  it('should not be able to update a non-existing customer', async () => {
    const customer = await customersRepository.findOne({
      where: { phone: '14962649627' },
    });

    if (customer) {
      await customersRepository.delete(customer.id);
    }

    const response = await request(app)
      .put('/customers')
      .send({
        name: 'Lucas Macedo da Silva',
        phone: '82999999999',
        social_security: '80837744563',
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        status: expect.stringMatching('error'),
        message: expect.stringMatching('Cliente não encontrado.'),
      }),
    );
  });

  it('should not be able to update a customer with duplicate phone', async () => {
    await customersRepository.save(
      customersRepository.create({
        name: 'Greyson Mascarenhas Santos Filho',
        phone: '82999999999',
        email: 'greysonmrx@gmail.com',
      }),
    );

    const response = await request(app)
      .put('/customers')
      .send({
        name: 'Lucas Macedo da Silva',
        phone: '82999999999',
        social_security: '80837744563',
      })
      .set('Authorization', `Bearer ${token}`);

    const customers = await customersRepository.find({
      where: { phone: '82999999999' },
    });

    expect(customers).toHaveLength(1);

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        status: expect.stringMatching('error'),
        message: expect.stringMatching('Este telefone já está em uso. Tente outro.'),
      }),
    );
  });

  it('should not be able to update a customer with no name', async () => {
    const response = await request(app)
      .put('/customers')
      .send({
        phone: '82999999999',
        social_security: '80837744563',
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

  it('should not be able to update a customer without a phone', async () => {
    const response = await request(app)
      .put('/customers')
      .send({
        name: 'Greyson Mascarenhas Santos Filho',
        social_security: '80837744563',
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        error: expect.stringMatching('Bad Request'),
        message: expect.stringMatching("O campo 'telefone' não pode estar vazio"),
      }),
    );
  });

  it('should not be able to update a customer with a invalid phone', async () => {
    const response = await request(app)
      .put('/customers')
      .send({
        name: 'Greyson Mascarenhas Santos Filho',
        phone: 'invalid-phone',
        social_security: '80837744563',
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        error: expect.stringMatching('Bad Request'),
        message: expect.stringMatching("O campo 'telefone' precisa ser um número"),
      }),
    );
  });

  it('should not be able to update a customer with a invalid social security', async () => {
    const response = await request(app)
      .put('/customers')
      .send({
        name: 'Greyson Mascarenhas Santos Filho',
        phone: '82999999999',
        social_security: 'invalid-social-security',
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        error: expect.stringMatching('Bad Request'),
        message: expect.stringMatching("O campo 'CPF' precisa ser um número"),
      }),
    );
  });
});
