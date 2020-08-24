import request from 'supertest';
import { Connection, getRepository, getConnection, Repository } from 'typeorm';

import Customer from '../../../src/modules/customers/infra/typeorm/entities/Customer';
import CustomerToken from '../../../src/modules/customers/infra/typeorm/entities/CustomerToken';
import createConnection from '../../../src/shared/infra/typeorm/index';

import app from '../../../src/shared/infra/http/app';

let connection: Connection;
let customersRepository: Repository<Customer>;
let customerTokensRepository: Repository<CustomerToken>;

describe('Send customer token', () => {
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

  it('should be able to send a customer token', async () => {
    const customer = await customersRepository.save(
      customersRepository.create({
        name: 'Greyson Mascarenhas Santos Filho',
        phone: '82999999999',
        email: 'greysonmrx@gmail.com',
      }),
    );

    const response = await request(app).post('/customer_tokens/send').send({
      phone: '82999999999',
    });

    const customerToken = await customerTokensRepository.findOne({
      where: { customer_id: customer.id },
    });

    expect(customerToken).toBeTruthy();

    expect(response.status).toBe(204);
  });

  it('should not be able to send a customer token with a non-existing customer', async () => {
    const response = await request(app).post('/customer_tokens/send').send({
      phone: '82999999999',
    });

    expect(response.status).toBe(404);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        status: expect.stringMatching('error'),
        message: expect.stringMatching('Cliente não encontrado.'),
      }),
    );
  });

  it('should not be able to send a customer token without a phone', async () => {
    const response = await request(app).post('/customer_tokens/send');

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        error: expect.stringMatching('Bad Request'),
        message: expect.stringMatching("O campo 'telefone' não pode estar vazio"),
      }),
    );
  });

  it('should not be able to send a customer token with a invalid phone', async () => {
    const response = await request(app).post('/customer_tokens/send').send({
      phone: 'invalid-phone',
    });

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        error: expect.stringMatching('Bad Request'),
        message: expect.stringMatching("O campo 'telefone' precisa ser um número"),
      }),
    );
  });
});
