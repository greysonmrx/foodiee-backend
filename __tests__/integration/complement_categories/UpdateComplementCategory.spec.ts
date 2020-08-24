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

describe('Update complement category', () => {
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

  it('should be able to update a complement category', async () => {
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

    const { id } = await complementCategoriesRepository.save(
      complementCategoriesRepository.create({
        name: 'Deseja Adicionar Algo?',
        max: 5,
        min: 1,
        required: true,
        product_id,
      }),
    );

    const response = await request(app)
      .put(`/complement_categories/${id}`)
      .send({
        name: 'Deseja Beber Algo?',
        max: 15,
        min: 0,
        required: false,
      })
      .set('Authorization', `Bearer ${token}`);

    const complementCategory = await complementCategoriesRepository.findOne({
      where: { name: 'Deseja Beber Algo?' },
    });

    expect(complementCategory).toBeTruthy();

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        id: expect.any(String),
      }),
    );
  });

  it('should not be able to update a complement category without a token', async () => {
    const response = await request(app).put(`/complement_categories/${v4()}`).send({
      name: 'Deseja Adicionar Algo?',
      max: 5,
      min: 1,
      required: true,
    });

    const complementCategory = await complementCategoriesRepository.findOne({
      where: { name: 'Deseja Adicionar Algo?' },
    });

    expect(complementCategory).toBeFalsy();

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        status: expect.stringMatching('error'),
        message: expect.stringMatching('Token não informado.'),
      }),
    );
  });

  it('should not be able to update a complement category with a invalid token', async () => {
    const response = await request(app)
      .put(`/complement_categories/${v4()}`)
      .send({
        name: 'Deseja Adicionar Algo?',
        max: 5,
        min: 1,
        required: true,
      })
      .set('Authorization', `Bearer invalid.token`);

    const complementCategory = await complementCategoriesRepository.findOne({
      where: { name: 'Deseja Adicionar Algo?' },
    });

    expect(complementCategory).toBeFalsy();

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        status: expect.stringMatching('error'),
        message: expect.stringMatching('Token inválido.'),
      }),
    );
  });

  it('should not be able to update a non-existing complement category', async () => {
    const response = await request(app)
      .put(`/complement_categories/${v4()}`)
      .send({
        name: 'Deseja Adicionar Algo?',
        max: 5,
        min: 1,
        required: true,
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        status: expect.stringMatching('error'),
        message: expect.stringMatching('Categoria de complementos não encontrada.'),
      }),
    );
  });

  it('should not be able to update a complement category with no name', async () => {
    const response = await request(app)
      .put(`/complement_categories/${v4()}`)
      .send({
        max: 5,
        min: 1,
        required: true,
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

  it('should not be able to update a complement category with a invalid id', async () => {
    const response = await request(app)
      .put(`/complement_categories/invalid-id`)
      .send({
        name: 'Deseja Adicionar Algo?',
        max: 5,
        min: 1,
        required: true,
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        error: expect.stringMatching('Bad Request'),
        message: expect.stringMatching('Insira uma categoria de complemento válida'),
      }),
    );
  });

  it('should not be able to update a complement category without a minimum amount', async () => {
    const response = await request(app)
      .put(`/complement_categories/${v4()}`)
      .send({
        name: 'Deseja Adicionar Algo?',
        max: 5,
        required: true,
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        error: expect.stringMatching('Bad Request'),
        message: expect.stringMatching("O campo 'qtd. mínima' não pode estar vazio"),
      }),
    );
  });

  it('should not be able to update a complement category with a invalid minimum amount', async () => {
    const response = await request(app)
      .put(`/complement_categories/${v4()}`)
      .send({
        name: 'Deseja Adicionar Algo?',
        max: 5,
        min: 'min',
        required: true,
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        error: expect.stringMatching('Bad Request'),
        message: expect.stringMatching("O campo 'qtd. mínima' precisa ser um número"),
      }),
    );
  });

  it('should not be able to update a complement category without a maximum amount', async () => {
    const response = await request(app)
      .put(`/complement_categories/${v4()}`)
      .send({
        name: 'Deseja Adicionar Algo?',
        min: 1,
        required: true,
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        error: expect.stringMatching('Bad Request'),
        message: expect.stringMatching("O campo 'qtd. máxima' não pode estar vazio"),
      }),
    );
  });

  it('should not be able to update a complement category with a invalid maximum amount', async () => {
    const response = await request(app)
      .put(`/complement_categories/${v4()}`)
      .send({
        name: 'Deseja Adicionar Algo?',
        max: 'max',
        min: 1,
        required: true,
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        error: expect.stringMatching('Bad Request'),
        message: expect.stringMatching("O campo 'qtd. máxima' precisa ser um número"),
      }),
    );
  });

  it('should not be able to update a complement category without a required value', async () => {
    const response = await request(app)
      .put(`/complement_categories/${v4()}`)
      .send({
        name: 'Deseja Adicionar Algo?',
        max: 5,
        min: 1,
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        error: expect.stringMatching('Bad Request'),
        message: expect.stringMatching("O campo 'complemento obrigatório' não pode estar vazio"),
      }),
    );
  });

  it('should not be able to update a complement category with a invalid required value', async () => {
    const response = await request(app)
      .put(`/complement_categories/${v4()}`)
      .send({
        name: 'Deseja Adicionar Algo?',
        max: 5,
        min: 1,
        required: 'required',
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        error: expect.stringMatching('Bad Request'),
        message: expect.stringMatching("O campo 'complemento obrigatório' precisa ser um booleano"),
      }),
    );
  });
});
