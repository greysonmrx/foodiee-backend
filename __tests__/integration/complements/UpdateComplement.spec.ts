import request from 'supertest';
import { Connection, getRepository, getConnection, Repository } from 'typeorm';
import { runSeeder } from 'typeorm-seeding';
import { v4 } from 'uuid';

import Complement from '../../../src/modules/complements/infra/typeorm/entities/Complement';
import ComplementCategory from '../../../src/modules/complement_categories/infra/typeorm/entities/ComplementCategory';
import Tenant from '../../../src/modules/tenants/infra/typeorm/entities/Tenant';
import Product from '../../../src/modules/products/infra/typeorm/entities/Product';
import ProductCategory from '../../../src/modules/product_categories/infra/typeorm/entities/ProductCategory';
import TenantAdminSeed from '../../../src/shared/infra/typeorm/seeds/create-tenant-admin';
import createConnection from '../../../src/shared/infra/typeorm/index';
import getUserTokenJWT from '../../utils/getUserTokenJWT';

import app from '../../../src/shared/infra/http/app';

let token: string;
let connection: Connection;
let tenantsRepository: Repository<Tenant>;
let productsRepository: Repository<Product>;
let complementsRepository: Repository<Complement>;
let productCategoriesRepository: Repository<ProductCategory>;
let complementCategoriesRepository: Repository<ComplementCategory>;

describe('Update complement', () => {
  beforeAll(async () => {
    connection = await createConnection('test');
    complementsRepository = getRepository(Complement);
    tenantsRepository = getRepository(Tenant);
    productsRepository = getRepository(Product);
    productCategoriesRepository = getRepository(ProductCategory);
    complementCategoriesRepository = getRepository(ComplementCategory);
  });

  beforeEach(async () => {
    await runSeeder(TenantAdminSeed);
    token = await getUserTokenJWT('fakeadmin@tenant.com.br', '123456');
  });

  afterEach(async () => {
    await connection.query('DELETE FROM users');
    await connection.query('DELETE FROM tenants');
    await connection.query('DELETE FROM complements');
    await connection.query('DELETE FROM complement_categories');
    await connection.query('DELETE FROM products');
    await connection.query('DELETE FROM product_categories');
  });

  afterAll(async () => {
    const mainConnection = getConnection();

    await connection.close();
    await mainConnection.close();
  });

  it('should be able to update a complement', async () => {
    const { id: tenant_id } = await tenantsRepository.save(
      tenantsRepository.create({
        name: "McDonald's",
        slug: 'mc-donalds',
      }),
    );

    const { id: category_id } = await productCategoriesRepository.save(
      productCategoriesRepository.create({
        name: 'Pizza',
        tenant_id,
      }),
    );

    const { id: product_id } = await productsRepository.save(
      productsRepository.create({
        name: 'Pizza de peperone',
        description: 'Uma pizza muito saborosa com os melhores ingredientes do mercado.',
        price: 80.5,
        promotion_price: 60,
        category_id,
        tenant_id,
        paused: false,
      }),
    );

    const { id: complement_category_id } = await complementCategoriesRepository.save(
      complementCategoriesRepository.create({
        name: 'Deseja Adicionar Algo?',
        max: 5,
        min: 1,
        required: true,
        product_id,
      }),
    );

    const { id } = await complementsRepository.save(
      complementsRepository.create({
        name: 'Bacon',
        price: 2,
        category_id: complement_category_id,
      }),
    );

    const response = await request(app)
      .put(`/complements/${id}`)
      .send({
        name: 'Cheddar',
        price: 4,
      })
      .set('Authorization', `Bearer ${token}`);

    const complement = await complementsRepository.findOne({
      where: { name: 'Cheddar' },
    });

    expect(complement).toBeTruthy();

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        id: expect.any(String),
      }),
    );
  });

  it('should not be able to update a complement without a token', async () => {
    const response = await request(app).put(`/complements/${v4()}`).send({
      name: 'Cheddar',
      price: 4,
    });

    const complement = await complementsRepository.findOne({
      where: { name: 'Bacon' },
    });

    expect(complement).toBeFalsy();

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        status: expect.stringMatching('error'),
        message: expect.stringMatching('Token não informado.'),
      }),
    );
  });

  it('should not be able to update a complement with a invalid token', async () => {
    const response = await request(app)
      .put(`/complements/${v4()}`)
      .send({
        name: 'Cheddar',
        price: 4,
      })
      .set('Authorization', `Bearer invalid.token`);

    const complement = await complementsRepository.findOne({
      where: { name: 'Bacon' },
    });

    expect(complement).toBeFalsy();

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        status: expect.stringMatching('error'),
        message: expect.stringMatching('Token inválido.'),
      }),
    );
  });

  it('should not be able to update a non-existing complement', async () => {
    const response = await request(app)
      .put(`/complements/${v4()}`)
      .send({
        name: 'Cheddar',
        price: 4,
      })
      .set('Authorization', `Bearer ${token}`);

    const complement = await complementsRepository.findOne({
      where: { name: 'Cheddar' },
    });

    expect(complement).toBeFalsy();

    expect(response.status).toBe(404);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        status: expect.stringMatching('error'),
        message: expect.stringMatching('Complemento não encontrado.'),
      }),
    );
  });

  it('should not be able to update a complement with no name', async () => {
    const response = await request(app)
      .put(`/complements/${v4()}`)
      .send({
        price: 4,
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

  it('should not be able to update a complement without a price', async () => {
    const response = await request(app)
      .put(`/complements/${v4()}`)
      .send({
        name: 'Cheddar',
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        error: expect.stringMatching('Bad Request'),
        message: expect.stringMatching("O campo 'preço' não pode estar vazio"),
      }),
    );
  });

  it('should not be able to update a complement with a invalid price', async () => {
    const response = await request(app)
      .put(`/complements/${v4()}`)
      .send({
        name: 'Cheddar',
        price: 'price',
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        error: expect.stringMatching('Bad Request'),
        message: expect.stringMatching("O campo 'preço' precisa ser um número"),
      }),
    );
  });
});
