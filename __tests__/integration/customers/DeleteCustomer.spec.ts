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

describe('Delete customer', () => {
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

  it('should be able to delete a customer', async () => {
    const response = await request(app).delete('/customers').set('Authorization', `Bearer ${token}`);

    const customer = await customersRepository.findOne({
      where: { phone: '82999999999' },
    });

    expect(customer).toBeFalsy();

    expect(response.status).toBe(204);
  });

  it('should not be able to delete a customer without a token', async () => {
    const response = await request(app).delete('/customers');

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        status: expect.stringMatching('error'),
        message: expect.stringMatching('Token não informado.'),
      }),
    );
  });

  it('should not be able to delete a customer with a invalid token', async () => {
    const response = await request(app).delete('/customers').set('Authorization', `Bearer invalid.token`);

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        status: expect.stringMatching('error'),
        message: expect.stringMatching('Token inválido.'),
      }),
    );
  });

  it('should not be able to delete a non-existing customer', async () => {
    const customer = await customersRepository.findOne({
      where: { phone: '14962649627' },
    });

    if (customer) {
      await customersRepository.delete(customer.id);
    }

    const response = await request(app).delete('/customers').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        status: expect.stringMatching('error'),
        message: expect.stringMatching('Cliente não encontrado.'),
      }),
    );
  });
});
