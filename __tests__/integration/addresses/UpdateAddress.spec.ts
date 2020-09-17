import request from 'supertest';
import { Connection, getConnection, getRepository, Repository } from 'typeorm';
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

describe('Update address', () => {
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

  it('should be able to update a customer address', async () => {
    const customer = await customersRepository.findOne({
      where: { phone: '14962649627' },
    });

    let address_id = v4();

    if (customer) {
      const { id } = await addressesRepository.save(
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

      address_id = id;
    }

    const response = await request(app)
      .put(`/addresses/${address_id}`)
      .send({
        name: 'Trabalho',
        city: 'Palmeira dos Índios',
        latitude: -9.3994335,
        longitude: -36.6405569,
        neighborhood: 'Palmeira de Fora',
        state: 'AL',
        street: 'Av. Fernando Calixto',
        complement: 'Ao lado da padaria do seu Zé',
        number: '3F',
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        id: expect.any(String),
      }),
    );
  });

  it('should not be able to update a customer address without a token', async () => {
    const response = await request(app).put(`/addresses/${v4()}`);

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        status: expect.stringMatching('error'),
        message: expect.stringMatching('Token não informado.'),
      }),
    );
  });

  it('should not be able to update a customer address with a invalid token', async () => {
    const response = await request(app).put(`/addresses/${v4()}`).set('Authorization', `Bearer invalid.token`);

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        status: expect.stringMatching('error'),
        message: expect.stringMatching('Token inválido.'),
      }),
    );
  });

  it('should not be able to update a customer address without a street', async () => {
    const response = await request(app)
      .put(`/addresses/${v4()}`)
      .send({
        name: 'Trabalho',
        neighborhood: 'Vila Olímpia',
        number: '12',
        city: 'Pindamonhangaba',
        state: 'PE',
        complement: 'Ao lado do posto dois irmãos',
        latitude: -12.5434327,
        longitude: -36.6405569,
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        error: expect.stringMatching('Bad Request'),
        message: expect.stringMatching("O campo 'rua' não pode estar vazio"),
      }),
    );
  });

  it('should not be able to update a customer address without a neighborhood', async () => {
    const response = await request(app)
      .put(`/addresses/${v4()}`)
      .send({
        name: 'Trabalho',
        street: 'Av. Brasil',
        number: '12',
        city: 'Pindamonhangaba',
        state: 'PE',
        complement: 'Ao lado do posto dois irmãos',
        latitude: -12.5434327,
        longitude: -36.6405569,
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        error: expect.stringMatching('Bad Request'),
        message: expect.stringMatching("O campo 'bairro' não pode estar vazio"),
      }),
    );
  });

  it('should not be able to update a customer address without a city', async () => {
    const response = await request(app)
      .put(`/addresses/${v4()}`)
      .send({
        name: 'Trabalho',
        street: 'Av. Brasil',
        neighborhood: 'Vila Olímpia',
        number: '12',
        state: 'PE',
        complement: 'Ao lado do posto dois irmãos',
        latitude: -12.5434327,
        longitude: -36.6405569,
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        error: expect.stringMatching('Bad Request'),
        message: expect.stringMatching("O campo 'cidade' não pode estar vazio"),
      }),
    );
  });

  it('should not be able to update a customer address without a state', async () => {
    const response = await request(app)
      .put(`/addresses/${v4()}`)
      .send({
        name: 'Trabalho',
        street: 'Av. Brasil',
        neighborhood: 'Vila Olímpia',
        number: '12',
        city: 'Pindamonhangaba',
        complement: 'Ao lado do posto dois irmãos',
        latitude: -12.5434327,
        longitude: -36.6405569,
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        error: expect.stringMatching('Bad Request'),
        message: expect.stringMatching("O campo 'estado' não pode estar vazio"),
      }),
    );
  });

  it('should not be able to update a customer address without a latitude', async () => {
    const response = await request(app)
      .put(`/addresses/${v4()}`)
      .send({
        name: 'Trabalho',
        street: 'Av. Brasil',
        neighborhood: 'Vila Olímpia',
        number: '12',
        city: 'Pindamonhangaba',
        state: 'PE',
        complement: 'Ao lado do posto dois irmãos',
        longitude: -36.6405569,
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        error: expect.stringMatching('Bad Request'),
        message: expect.stringMatching("O campo 'latitude' não pode estar vazio"),
      }),
    );
  });

  it('should not be able to update a customer address without a longitude', async () => {
    const response = await request(app)
      .put(`/addresses/${v4()}`)
      .send({
        name: 'Trabalho',
        street: 'Av. Brasil',
        neighborhood: 'Vila Olímpia',
        number: '12',
        city: 'Pindamonhangaba',
        state: 'PE',
        complement: 'Ao lado do posto dois irmãos',
        latitude: -12.5434327,
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        error: expect.stringMatching('Bad Request'),
        message: expect.stringMatching("O campo 'longitude' não pode estar vazio"),
      }),
    );
  });
});
