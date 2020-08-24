import request from 'supertest';
import { Connection, getRepository, getConnection, Repository } from 'typeorm';

import Customer from '../../../src/modules/customers/infra/typeorm/entities/Customer';
import CustomerToken from '../../../src/modules/customers/infra/typeorm/entities/CustomerToken';
import createConnection from '../../../src/shared/infra/typeorm/index';

import app from '../../../src/shared/infra/http/app';

let connection: Connection;
let customersRepository: Repository<Customer>;
let customerTokensRepository: Repository<CustomerToken>;

describe('Validate customer token', () => {
  beforeAll(async () => {
    connection = await createConnection('test');
  });

  beforeEach(async () => {
    customersRepository = getRepository(Customer);
    customerTokensRepository = getRepository(CustomerToken);
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

  it('should be able to validate a customer token', async () => {
    const { id: customer_id } = await customersRepository.save(
      customersRepository.create({
        name: 'Greyson Mascarenhas Santos Filho',
        phone: '82999999999',
        email: 'greysonmrx@gmail.com',
      }),
    );

    const token = String(Math.floor(Math.random() * (9999 - 1000)) + 1000);

    await customerTokensRepository.save(
      customerTokensRepository.create({
        token,
        customer_id,
      }),
    );

    const response = await request(app).post('/customer_tokens/validate').send({
      phone: '82999999999',
      token,
    });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        token: expect.any(String),
        customer: expect.any(Object),
      }),
    );
  });

  it('should not be able to validate a customer token with a non-existing customer', async () => {
    const response = await request(app).post('/customer_tokens/validate').send({
      phone: '82999999999',
      token: '9090',
    });

    expect(response.status).toBe(404);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        status: expect.stringMatching('error'),
        message: expect.stringMatching('Cliente não encontrado.'),
      }),
    );
  });

  it('should not be able to validate a non-existing customer token', async () => {
    await customersRepository.save(
      customersRepository.create({
        name: 'Greyson Mascarenhas Santos Filho',
        phone: '82999999999',
        email: 'greysonmrx@gmail.com',
      }),
    );

    const response = await request(app).post('/customer_tokens/validate').send({
      phone: '82999999999',
      token: '9090',
    });

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        status: expect.stringMatching('error'),
        message: expect.stringMatching('Código inválido.'),
      }),
    );
  });

  it('should not be able to validate a customer token from a different customer', async () => {
    const { id: customer_id } = await customersRepository.save(
      customersRepository.create({
        name: 'Greyson Mascarenhas Santos Filho',
        phone: '82999999999',
        email: 'greysonmrx@gmail.com',
      }),
    );

    await customersRepository.save(
      customersRepository.create({
        name: 'Lucas Macedo da Silva',
        phone: '82888888888',
        email: 'lucasmacedo@gmail.com',
      }),
    );

    const token = String(Math.floor(Math.random() * (9999 - 1000)) + 1000);

    await customerTokensRepository.save(
      customerTokensRepository.create({
        token,
        customer_id,
      }),
    );

    const response = await request(app).post('/customer_tokens/validate').send({
      phone: '82888888888',
      token,
    });

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        status: expect.stringMatching('error'),
        message: expect.stringMatching('Este código não pertence ao cliente informado.'),
      }),
    );
  });

  it('should not be able to validate a customer token if passed more than fifteen minutes', async () => {
    const { id: customer_id } = await customersRepository.save(
      customersRepository.create({
        name: 'Greyson Mascarenhas Santos Filho',
        phone: '82999999999',
        email: 'greysonmrx@gmail.com',
      }),
    );

    const token = String(Math.floor(Math.random() * (9999 - 1000)) + 1000);

    await customerTokensRepository.save(
      customerTokensRepository.create({
        token,
        customer_id,
      }),
    );

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date();

      return customDate.setMinutes(customDate.getMinutes() + 16);
    });

    const response = await request(app).post('/customer_tokens/validate').send({
      phone: '82999999999',
      token,
    });

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        status: expect.stringMatching('error'),
        message: expect.stringMatching('Código expirado.'),
      }),
    );
  });

  it('should not be able to validate a customer token without a phone', async () => {
    const response = await request(app).post('/customer_tokens/validate').send({
      token: '9090',
    });

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        error: expect.stringMatching('Bad Request'),
        message: expect.stringMatching("O campo 'telefone' não pode estar vazio"),
      }),
    );
  });

  it('should not be able to validate a customer token with a invalid phone', async () => {
    const response = await request(app).post('/customer_tokens/validate').send({
      phone: 'invalid-phone',
      token: '9090',
    });

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        error: expect.stringMatching('Bad Request'),
        message: expect.stringMatching("O campo 'telefone' precisa ser um número"),
      }),
    );
  });

  it('should not be able to validate a customer token without a token', async () => {
    const response = await request(app).post('/customer_tokens/validate').send({
      phone: '82999999999',
    });

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        error: expect.stringMatching('Bad Request'),
        message: expect.stringMatching("O campo 'código' não pode estar vazio"),
      }),
    );
  });

  it('should not be able to validate a customer token with a invalid token', async () => {
    const response = await request(app).post('/customer_tokens/validate').send({
      phone: '82999999999',
      token: 'token',
    });

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        error: expect.stringMatching('Bad Request'),
        message: expect.stringMatching("O campo 'código' precisa ser um número"),
      }),
    );
  });
});
