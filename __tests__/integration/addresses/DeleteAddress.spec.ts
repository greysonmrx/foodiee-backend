import request from 'supertest';
import { Connection, getRepository, getConnection, Repository } from 'typeorm';
import { runSeeder } from 'typeorm-seeding';
import { v4 } from 'uuid';

import Customer from '../../../src/modules/customers/infra/typeorm/entities/Customer';
import Address from '../../../src/modules/addresses/infra/typeorm/entities/Address';
import createConnection from '../../../src/shared/infra/typeorm/index';
import CustomerSeed from '../../../src/shared/infra/typeorm/seeds/create-customer';
import getCustomerTokenJWT from '../../utils/getCustomerTokenJWT';

import app from '../../../src/shared/infra/http/app';

let token: string;
let connection: Connection;
let customersRepository: Repository<Customer>;
let addressesRepository: Repository<Address>;

describe('Delete address', () => {
  beforeAll(async () => {
    connection = await createConnection('test');
  });

  beforeEach(async () => {
    await runSeeder(CustomerSeed);
    token = await getCustomerTokenJWT('14962649627', '9090');

    customersRepository = getRepository(Customer);
    addressesRepository = getRepository(Address);
  });

  afterEach(async () => {
    await connection.query('DELETE FROM addresses');
    await connection.query('DELETE FROM customers');
    await connection.query('DELETE FROM customer_tokens');
  });

  afterAll(async () => {
    const mainConnection = getConnection();

    await connection.close();
    await mainConnection.close();
  });

  it('should be able to delete a customer address', async () => {
    const customer = await customersRepository.findOne({
      where: { phone: '14962649627' },
    });

    let address_id = v4();

    if (customer) {
      const { id } = await addressesRepository.save(
        addressesRepository.create({
          customer_id: customer.id,
          name: 'Trabalho',
          city: 'Pindamonhangaba',
          latitude: -12.5434327,
          longitude: -36.6405569,
          neighborhood: 'Vila Olímpia',
          state: 'PE',
          street: 'Av. Brasil',
          complement: 'Ao lado do posto dois irmãos',
          number: '12',
        }),
      );

      address_id = id;
    }

    const response = await request(app).delete(`/addresses/${address_id}`).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(204);
  });

  it('should not be able to delete a customer address without a token', async () => {
    const response = await request(app).delete(`/addresses/${v4()}`);

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        status: expect.stringMatching('error'),
        message: expect.stringMatching('Token não informado.'),
      }),
    );
  });

  it('should not be able to delete a customer address with a invalid token', async () => {
    const response = await request(app).delete(`/addresses/${v4()}`).set('Authorization', `Bearer invalid.token`);

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        status: expect.stringMatching('error'),
        message: expect.stringMatching('Token inválido.'),
      }),
    );
  });

  it('should not be able to delete a customer address with a invalid address id', async () => {
    const response = await request(app).delete(`/addresses/invalid-address-id`).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        error: expect.stringMatching('Bad Request'),
        message: expect.stringMatching('Insira um endereço válido'),
      }),
    );
  });
});
