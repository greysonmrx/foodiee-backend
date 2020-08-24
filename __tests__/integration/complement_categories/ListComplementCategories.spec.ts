import request from 'supertest';
import { Connection, getRepository, getConnection, Repository } from 'typeorm';
import { runSeeder } from 'typeorm-seeding';
import { v4 } from 'uuid';

import ComplementCategory from '../../../src/modules/complement_categories/infra/typeorm/entities/ComplementCategory';
import File from '../../../src/modules/files/infra/typeorm/entities/File';
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
let productCategoriesRepository: Repository<ProductCategory>;
let complementCategoriesRepository: Repository<ComplementCategory>;
let filesRepository: Repository<File>;

describe('List complement categories', () => {
  beforeAll(async () => {
    connection = await createConnection('test');
    filesRepository = getRepository(File);
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
    await connection.query('DELETE FROM complement_categories');
    await connection.query('DELETE FROM products');
    await connection.query('DELETE FROM files');
    await connection.query('DELETE FROM product_categories');
  });

  afterAll(async () => {
    const mainConnection = getConnection();

    await connection.close();
    await mainConnection.close();
  });

  it('should be able to list all complement categories', async () => {
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

    const { id: image_id } = await filesRepository.save(
      filesRepository.create({
        name: 'fileName.png',
        path: 'filePath.png',
      }),
    );

    const { id: product_id } = await productsRepository.save(
      productsRepository.create({
        name: 'Pizza de peperone',
        description: 'Uma pizza muito saborosa com os melhores ingredientes do mercado.',
        price: 80.5,
        promotion_price: 60,
        category_id,
        image_id,
        tenant_id,
        paused: false,
      }),
    );

    await complementCategoriesRepository.save(
      complementCategoriesRepository.create({
        name: 'Deseja Adicionar Algo?',
        max: 5,
        min: 1,
        required: true,
        product_id,
      }),
    );

    await complementCategoriesRepository.save(
      complementCategoriesRepository.create({
        name: 'Deseja Beber Algo?',
        max: 15,
        min: 0,
        required: false,
        product_id,
      }),
    );

    const response = await request(app)
      .get(`/complement_categories/${product_id}`)
      .set('Authorization', `Bearer ${token}`);

    const complementCategories = await complementCategoriesRepository.find({
      where: { product_id },
    });

    expect(complementCategories).toHaveLength(2);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
  });

  it('should not be able to list all complement categories without a token', async () => {
    const response = await request(app).get(`/complement_categories/${v4()}`);

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        status: expect.stringMatching('error'),
        message: expect.stringMatching('Token não informado.'),
      }),
    );
  });

  it('should not be able to list all complement categories with a invalid token', async () => {
    const response = await request(app)
      .get(`/complement_categories/${v4()}`)
      .set('Authorization', `Bearer invalid.token`);

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        status: expect.stringMatching('error'),
        message: expect.stringMatching('Token inválido.'),
      }),
    );
  });

  it('should not be able to list all complement categories with invalid product id', async () => {
    const response = await request(app)
      .get(`/complement_categories/invalid-product-id`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        error: expect.stringMatching('Bad Request'),
        message: expect.stringMatching('Insira um produto válido'),
      }),
    );
  });
});
