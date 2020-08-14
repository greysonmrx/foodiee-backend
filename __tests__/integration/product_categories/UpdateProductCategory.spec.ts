import request from 'supertest';
import { Connection, getRepository, getConnection, Repository } from 'typeorm';
import { runSeeder } from 'typeorm-seeding';
import { v4 } from 'uuid';

import Tenant from '../../../src/modules/tenants/infra/typeorm/entities/Tenant';
import ProductCategory from '../../../src/modules/product_categories/infra/typeorm/entities/ProductCategory';
import TenantAdminSeed from '../../../src/shared/infra/typeorm/seeds/create-tenant-admin';
import createConnection from '../../../src/shared/infra/typeorm/index';
import getTokenJWT from '../../utils/getTokenJWT';

import app from '../../../src/shared/infra/http/app';

let token: string;
let connection: Connection;
let tenantsRepository: Repository<Tenant>;
let productCategoriesRepository: Repository<ProductCategory>;

describe('Update product category', () => {
  beforeAll(async () => {
    connection = await createConnection('test');
    tenantsRepository = getRepository(Tenant);
    productCategoriesRepository = getRepository(ProductCategory);
  });

  beforeEach(async () => {
    await runSeeder(TenantAdminSeed);
    token = await getTokenJWT('fakeadmin@tenant.com.br', '123456');
  });

  afterEach(async () => {
    await connection.query('DELETE FROM users');
    await connection.query('DELETE FROM tenants');
    await connection.query('DELETE FROM product_categories');
  });

  afterAll(async () => {
    await connection.query('DELETE FROM users');
    await connection.query('DELETE FROM tenants');
    await connection.query('DELETE FROM product_categories');
    const mainConnection = getConnection();

    await connection.close();
    await mainConnection.close();
  });

  it('should be able to update a product category', async () => {
    const { id: tenant_id } = await tenantsRepository.save(
      tenantsRepository.create({
        name: "McDonald's",
        slug: 'mc-donalds',
      }),
    );

    const { id } = await productCategoriesRepository.save(
      productCategoriesRepository.create({
        name: 'Pizza',
        tenant_id,
      }),
    );

    const response = await request(app)
      .patch(`/product_categories/${tenant_id}`)
      .send({
        id,
        name: 'Hamburguer',
      })
      .set('Authorization', `Bearer ${token}`);

    const productCategory = await productCategoriesRepository.findOne({
      where: { name: 'Hamburguer' },
    });

    expect(productCategory).toBeTruthy();

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        id: expect.any(String),
      }),
    );
  });

  it('should not be able to update a product category without a token', async () => {
    const response = await request(app).patch(`/product_categories/${v4()}`).send({
      id: v4(),
      name: 'Pizza',
    });

    const productCategory = await productCategoriesRepository.findOne({
      where: { name: 'Pizza' },
    });

    expect(productCategory).toBeFalsy();

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        status: expect.stringMatching('error'),
        message: expect.stringMatching('Token não informado.'),
      }),
    );
  });

  it('should not be able to update a product category with a invalid token', async () => {
    const response = await request(app)
      .patch(`/product_categories/${v4()}`)
      .send({
        id: v4(),
        name: 'Pizza',
      })
      .set('Authorization', `Bearer invalid.token`);

    const productCategory = await productCategoriesRepository.findOne({
      where: { name: 'Pizza' },
    });

    expect(productCategory).toBeFalsy();

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        status: expect.stringMatching('error'),
        message: expect.stringMatching('Token inválido.'),
      }),
    );
  });

  it('should not be able to update a product category with a non-existing tenant', async () => {
    const response = await request(app)
      .patch(`/product_categories/${v4()}`)
      .send({
        id: v4(),
        name: 'Pizza',
      })
      .set('Authorization', `Bearer ${token}`);

    const productCategory = await productCategoriesRepository.findOne({
      where: { name: 'Pizza' },
    });

    expect(productCategory).toBeFalsy();

    expect(response.status).toBe(404);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        status: expect.stringMatching('error'),
        message: expect.stringMatching('Loja não encontrada.'),
      }),
    );
  });

  it('should not be able to update a non-existing product category', async () => {
    const { id: tenant_id } = await tenantsRepository.save(
      tenantsRepository.create({
        name: "McDonald's",
        slug: 'mc-donalds',
      }),
    );

    const response = await request(app)
      .patch(`/product_categories/${tenant_id}`)
      .send({
        id: v4(),
        name: 'Pizza',
      })
      .set('Authorization', `Bearer ${token}`);

    const productCategory = await productCategoriesRepository.findOne({
      where: { name: 'Pizza' },
    });

    expect(productCategory).toBeFalsy();

    expect(response.status).toBe(404);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        status: expect.stringMatching('error'),
        message: expect.stringMatching('Categoria não encontrada.'),
      }),
    );
  });

  it('should not be able to update a product category with duplicate name', async () => {
    const { id: tenant_id } = await tenantsRepository.save(
      tenantsRepository.create({
        name: "McDonald's",
        slug: 'mc-donalds',
      }),
    );

    await productCategoriesRepository.save(
      productCategoriesRepository.create({
        name: 'Pizza',
        tenant_id,
      }),
    );

    const { id } = await productCategoriesRepository.save(
      productCategoriesRepository.create({
        name: 'Hamburguer',
        tenant_id,
      }),
    );

    const response = await request(app)
      .patch(`/product_categories/${tenant_id}`)
      .send({
        id,
        name: 'Pizza',
      })
      .set('Authorization', `Bearer ${token}`);

    const productCategories = await productCategoriesRepository.find({
      where: { name: 'Pizza' },
    });

    expect(productCategories).toHaveLength(1);

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        status: expect.stringMatching('error'),
        message: expect.stringMatching('Esta categoria já existe.'),
      }),
    );
  });

  it('should not be able to update a product category with no name', async () => {
    const response = await request(app)
      .patch(`/product_categories/${v4()}`)
      .send({ id: v4() })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        error: expect.stringMatching('Bad Request'),
        message: expect.stringMatching("O campo 'nome' não pode estar vazio"),
      }),
    );
  });

  it('should not be able to update a product category with a invalid tenant id', async () => {
    const response = await request(app)
      .patch(`/product_categories/invalid-tenant-id`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        error: expect.stringMatching('Bad Request'),
        message: expect.stringMatching('Insira uma loja válida'),
      }),
    );
  });

  it('should not be able to update a product category without id', async () => {
    const response = await request(app).patch(`/product_categories/${v4()}`).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        error: expect.stringMatching('Bad Request'),
        message: expect.stringMatching("O campo 'categoria' não pode estar vazio"),
      }),
    );
  });

  it('should not be able to update a product category with a invalid id', async () => {
    const response = await request(app)
      .patch(`/product_categories/${v4()}`)
      .send({ id: 'invalid-id' })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        error: expect.stringMatching('Bad Request'),
        message: expect.stringMatching('Insira uma categoria válida'),
      }),
    );
  });
});
