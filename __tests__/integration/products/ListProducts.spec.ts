import request from 'supertest';
import { Connection, getRepository, getConnection, Repository } from 'typeorm';
import { runSeeder } from 'typeorm-seeding';
import { v4 } from 'uuid';

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
let filesRepository: Repository<File>;

describe('List products', () => {
  beforeAll(async () => {
    connection = await createConnection('test');
    tenantsRepository = getRepository(Tenant);
    productsRepository = getRepository(Product);
    productCategoriesRepository = getRepository(ProductCategory);
    filesRepository = getRepository(File);
  });

  beforeEach(async () => {
    await runSeeder(TenantAdminSeed);
    token = await getUserTokenJWT('fakeadmin@tenant.com.br', '123456');
  });

  afterEach(async () => {
    await connection.query('DELETE FROM users');
    await connection.query('DELETE FROM tenants');
    await connection.query('DELETE FROM products');
    await connection.query('DELETE FROM files');
    await connection.query('DELETE FROM product_categories');
  });

  afterAll(async () => {
    const mainConnection = getConnection();

    await connection.close();
    await mainConnection.close();
  });

  it('should be able to list all products', async () => {
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

    await productsRepository.save(
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

    await productsRepository.save(
      productsRepository.create({
        name: 'Pizza de calabresa',
        description: 'Uma pizza muito saborosa com os melhores ingredientes do mercado.',
        price: 40.5,
        promotion_price: 25.5,
        category_id,
        image_id,
        tenant_id,
        paused: true,
      }),
    );

    const response = await request(app).get(`/products/${tenant_id}`).set('Authorization', `Bearer ${token}`);

    const products = await productsRepository.find({
      where: { tenant_id },
    });

    expect(products).toHaveLength(2);
    expect(response.status).toBe(200);
  });

  it('should not be able to list all products without a token', async () => {
    const response = await request(app).get(`/products/${v4()}`);

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        status: expect.stringMatching('error'),
        message: expect.stringMatching('Token não informado.'),
      }),
    );
  });

  it('should not be able to list all products with a invalid token', async () => {
    const response = await request(app).get(`/products/${v4()}`).set('Authorization', `Bearer invalid.token`);

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        status: expect.stringMatching('error'),
        message: expect.stringMatching('Token inválido.'),
      }),
    );
  });

  it('should not be able to list all products with a non-existing tenant', async () => {
    const response = await request(app).get(`/products/${v4()}`).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        status: expect.stringMatching('error'),
        message: expect.stringMatching('Loja não encontrada.'),
      }),
    );
  });
});
