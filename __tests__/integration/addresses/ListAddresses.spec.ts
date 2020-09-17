import request from 'supertest';
import { Connection, getRepository, getConnection, Repository } from 'typeorm';
import { runSeeder } from 'typeorm-seeding';

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

describe('List all addresses', () => {
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

  it('should be able to list all customer addresses', async () => {
    const customer = await customersRepository.findOne({
      where: { phone: '14962649627' },
    });

    if (customer) {
      await addressesRepository.save(
        addressesRepository.create({
          customer_id: customer.id,
          name: 'Casa',
          city: 'Palmeira dos Índios',
          latitude: -9.3994335,
          longitude: -36.6405569,
          neighborhood: 'Palmeira de Fora',
          state: 'AL',
          street: 'Av. Fernando Calixto',
          complement: 'Ao lado da padaria do seu Zé',
          number: '3F',
        }),
      );

      await addressesRepository.save(
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
    }

    const response = await request(app).get(`/addresses`).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
  });

  it('should not be able to list all customer addresses without a token', async () => {
    const response = await request(app).get(`/addresses`);

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        status: expect.stringMatching('error'),
        message: expect.stringMatching('Token não informado.'),
      }),
    );
  });

  it('should not be able to list all customer addresses with a invalid token', async () => {
    const response = await request(app).get(`/addresses`).set('Authorization', `Bearer invalid.token`);

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        status: expect.stringMatching('error'),
        message: expect.stringMatching('Token inválido.'),
      }),
    );
  });
});
