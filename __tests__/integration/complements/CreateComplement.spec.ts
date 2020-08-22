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
import getTokenJWT from '../../utils/getTokenJWT';

import app from '../../../src/shared/infra/http/app';

let token: string;
let connection: Connection;
let tenantsRepository: Repository<Tenant>;
let productsRepository: Repository<Product>;
let complementsRepository: Repository<Complement>;
let productCategoriesRepository: Repository<ProductCategory>;
let complementCategoriesRepository: Repository<ComplementCategory>;

describe('Create complement', () => {
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
    token = await getTokenJWT('fakeadmin@tenant.com.br', '123456');
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

  it('should be able to create a new complement', async () => {
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

    const response = await request(app)
      .post('/complements')
      .send({
        name: 'Bacon',
        price: 2,
        category_id: complement_category_id,
      })
      .set('Authorization', `Bearer ${token}`);

    const complement = await complementsRepository.findOne({
      where: { name: 'Bacon' },
    });

    expect(complement).toBeTruthy();

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        id: expect.any(String),
      }),
    );
  });

  it('should not be able to create a new complement without a token', async () => {
    const response = await request(app).post('/complements').send({
      name: 'Bacon',
      price: 2,
      category_id: v4(),
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

  it('should not be able to create a new complement with a invalid token', async () => {
    const response = await request(app)
      .post('/complements')
      .send({
        name: 'Bacon',
        price: 2,
        category_id: v4(),
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

  it('should not be able to create a new complement with a non-existing category', async () => {
    const response = await request(app)
      .post('/complements')
      .send({
        name: 'Bacon',
        price: 2,
        category_id: v4(),
      })
      .set('Authorization', `Bearer ${token}`);

    const complement = await complementsRepository.findOne({
      where: { name: 'Bacon' },
    });

    expect(complement).toBeFalsy();

    expect(response.status).toBe(404);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        status: expect.stringMatching('error'),
        message: expect.stringMatching('Categoria de complementos não encontrada.'),
      }),
    );
  });

  it('should not be able to create a new complement with no name', async () => {
    const response = await request(app)
      .post('/complements')
      .send({
        price: 2,
        category_id: v4(),
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

  it('should not be able to create a new complement without a category id', async () => {
    const response = await request(app)
      .post('/complements')
      .send({
        name: 'Bacon',
        price: 2,
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        error: expect.stringMatching('Bad Request'),
        message: expect.stringMatching("O campo 'categoria' não pode estar vazio"),
      }),
    );
  });

  it('should not be able to create a new complement with a invalid category id', async () => {
    const response = await request(app)
      .post('/complements')
      .send({
        name: 'Bacon',
        price: 2,
        category_id: 'invalid-category-id',
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        error: expect.stringMatching('Bad Request'),
        message: expect.stringMatching('Insira uma categoria válida'),
      }),
    );
  });

  it('should not be able to create a new complement without a price', async () => {
    const response = await request(app)
      .post('/complements')
      .send({
        name: 'Bacon',
        category_id: 'invalid-category-id',
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

  it('should not be able to create a new complement with a invalid price', async () => {
    const response = await request(app)
      .post('/complements')
      .send({
        name: 'Bacon',
        price: 'price',
        category_id: 'invalid-category-id',
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
