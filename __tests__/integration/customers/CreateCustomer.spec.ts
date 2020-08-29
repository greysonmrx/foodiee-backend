import request from 'supertest';
import { Connection, getRepository, getConnection, Repository } from 'typeorm';

import Customer from '../../../src/modules/customers/infra/typeorm/entities/Customer';
import createConnection from '../../../src/shared/infra/typeorm/index';

import app from '../../../src/shared/infra/http/app';

let connection: Connection;
let customersRepository: Repository<Customer>;

describe('Create customer', () => {
  beforeAll(async () => {
    connection = await createConnection('test');
  });

  beforeEach(async () => {
    customersRepository = getRepository(Customer);
  });

  afterEach(async () => {
    await connection.query('DELETE FROM customers');
  });

  afterAll(async () => {
    const mainConnection = getConnection();

    await connection.close();
    await mainConnection.close();
  });

  it('should be able to create a new customer', async () => {
    const response = await request(app).post('/customers').send({
      name: 'Greyson Mascarenhas Santos Filho',
      phone: '82999999999',
      email: 'greysonmrx@gmail.com',
    });

    const customer = await customersRepository.findOne({
      where: { phone: '82999999999' },
    });

    expect(customer).toBeTruthy();

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        id: expect.any(String),
      }),
    );
  });

  it('should not be able to create two customers with the same phone', async () => {
    await customersRepository.save(
      customersRepository.create({
        name: 'Greyson Mascarenhas Santos Filho',
        phone: '82999999999',
        email: 'greysonmrx@gmail.com',
      }),
    );

    const response = await request(app).post('/customers').send({
      name: 'Lucas Macedo da Silva',
      phone: '82999999999',
      email: 'lucasmacedo@gmail.com',
    });

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

  it('should not be able to create two customers with the same email', async () => {
    await customersRepository.save(
      customersRepository.create({
        name: 'Greyson Mascarenhas Santos Filho',
        phone: '82999999999',
        email: 'greysonmrx@gmail.com',
      }),
    );

    const response = await request(app).post('/customers').send({
      name: 'Lucas Macedo da Silva',
      phone: '82888888888',
      email: 'greysonmrx@gmail.com',
    });

    const customers = await customersRepository.find({
      where: { email: 'greysonmrx@gmail.com' },
    });

    expect(customers).toHaveLength(1);

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        status: expect.stringMatching('error'),
        message: expect.stringMatching('Este endereço de e-mail já está em uso. Tente outro.'),
      }),
    );
  });

  it('should not be able to create a new customer with no name', async () => {
    const response = await request(app).post('/customers').send({
      phone: '82999999999',
      email: 'greysonmrx@gmail.com',
    });

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        error: expect.stringMatching('Bad Request'),
        message: expect.stringMatching("O campo 'nome' não pode estar vazio"),
      }),
    );
  });

  it('should not be able to create a new customer without a email', async () => {
    const response = await request(app).post('/customers').send({
      name: 'Greyson Mascarenhas Santos Filho',
      phone: '82999999999',
    });

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        error: expect.stringMatching('Bad Request'),
        message: expect.stringMatching("O campo 'e-mail' não pode estar vazio"),
      }),
    );
  });

  it('should not be able to create a new customer with a invalid email', async () => {
    const response = await request(app).post('/customers').send({
      name: 'Greyson Mascarenhas Santos Filho',
      phone: '82999999999',
      email: 'inavlid-email',
    });

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        error: expect.stringMatching('Bad Request'),
        message: expect.stringMatching('Insira um e-mail válido'),
      }),
    );
  });

  it('should not be able to create a new customer without a phone', async () => {
    const response = await request(app).post('/customers').send({
      name: 'Greyson Mascarenhas Santos Filho',
      email: 'greysonmrx@gmail.com',
    });

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        error: expect.stringMatching('Bad Request'),
        message: expect.stringMatching("O campo 'telefone' não pode estar vazio"),
      }),
    );
  });

  it('should not be able to create a new customer with a invalid phone', async () => {
    const response = await request(app).post('/customers').send({
      name: 'Greyson Mascarenhas Santos Filho',
      phone: 'invalid-phone',
      email: 'greysonmrx@gmail.com',
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
