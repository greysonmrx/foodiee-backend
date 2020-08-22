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
import getTokenJWT from '../../utils/getTokenJWT';

import app from '../../../src/shared/infra/http/app';

let token: string;
let connection: Connection;
let tenantsRepository: Repository<Tenant>;
let productsRepository: Repository<Product>;
let productCategoriesRepository: Repository<ProductCategory>;
let filesRepository: Repository<File>;

describe('Update product', () => {
  beforeAll(async () => {
    connection = await createConnection('test');
    tenantsRepository = getRepository(Tenant);
    productsRepository = getRepository(Product);
    productCategoriesRepository = getRepository(ProductCategory);
    filesRepository = getRepository(File);
  });

  beforeEach(async () => {
    await runSeeder(TenantAdminSeed);
    token = await getTokenJWT('fakeadmin@tenant.com.br', '123456');
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

  it('should be able to update a product', async () => {
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

    const { id } = await productsRepository.save(
      productsRepository.create({
        name: 'Pizza de peperone',
        description: 'Uma pizza muito saborosa com os melhores ingredientes do mercado.',
        price: 80.5,
        promotion_price: 60,
        category_id,
        tenant_id,
        image_id,
        paused: false,
      }),
    );

    const response = await request(app)
      .put(`/products/${tenant_id}`)
      .send({
        id,
        name: 'Pizza de calabresa',
        description: 'Uma pizza muito saborosa com os melhores ingredientes do mercado.',
        price: 80.5,
        promotion_price: 60,
        category_id,
        image_id,
        paused: false,
      })
      .set('Authorization', `Bearer ${token}`);

    const product = await productsRepository.findOne({
      where: { name: 'Pizza de calabresa' },
    });

    expect(product).toBeTruthy();

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        id: expect.any(String),
      }),
    );
  });

  it('should not be able to update a product without a token', async () => {
    const response = await request(app).put(`/products/${v4()}`).send({
      id: v4(),
      name: 'Pizza de calabresa',
      description: 'Uma pizza muito saborosa com os melhores ingredientes do mercado.',
      price: 80.5,
      promotion_price: 60,
      category_id: v4(),
      image_id: v4(),
      paused: false,
    });

    const product = await productsRepository.findOne({
      where: { name: 'Pizza de calabresa' },
    });

    expect(product).toBeFalsy();

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        status: expect.stringMatching('error'),
        message: expect.stringMatching('Token não informado.'),
      }),
    );
  });

  it('should not be able to update a product with a invalid token', async () => {
    const response = await request(app)
      .put(`/products/${v4()}`)
      .send({
        id: v4(),
        name: 'Pizza de calabresa',
        description: 'Uma pizza muito saborosa com os melhores ingredientes do mercado.',
        price: 80.5,
        promotion_price: 60,
        category_id: v4(),
        image_id: v4(),
        paused: false,
      })
      .set('Authorization', `Bearer invalid.token`);

    const product = await productsRepository.findOne({
      where: { name: 'Pizza de calabresa' },
    });

    expect(product).toBeFalsy();

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        status: expect.stringMatching('error'),
        message: expect.stringMatching('Token inválido.'),
      }),
    );
  });

  it('should not be able to update a product with a non-existing tenant', async () => {
    const response = await request(app)
      .put(`/products/${v4()}`)
      .send({
        id: v4(),
        name: 'Pizza de calabresa',
        description: 'Uma pizza muito saborosa com os melhores ingredientes do mercado.',
        price: 80.5,
        promotion_price: 60,
        category_id: v4(),
        image_id: v4(),
        paused: false,
      })
      .set('Authorization', `Bearer ${token}`);

    const product = await productsRepository.findOne({
      where: { name: 'Pizza de calabresa' },
    });

    expect(product).toBeFalsy();

    expect(response.status).toBe(404);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        status: expect.stringMatching('error'),
        message: expect.stringMatching('Loja não encontrada.'),
      }),
    );
  });

  it('should not be able to update a product with a non-existing category', async () => {
    const { id: tenant_id } = await tenantsRepository.save(
      tenantsRepository.create({
        name: "McDonald's",
        slug: 'mc-donalds',
      }),
    );

    const response = await request(app)
      .put(`/products/${tenant_id}`)
      .send({
        id: v4(),
        name: 'Pizza de calabresa',
        description: 'Uma pizza muito saborosa com os melhores ingredientes do mercado.',
        price: 80.5,
        promotion_price: 60,
        category_id: v4(),
        image_id: v4(),
        paused: false,
      })
      .set('Authorization', `Bearer ${token}`);

    const product = await productsRepository.findOne({
      where: { name: 'Pizza de calabresa' },
    });

    expect(product).toBeFalsy();

    expect(response.status).toBe(404);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        status: expect.stringMatching('error'),
        message: expect.stringMatching('Categoria não encontrada.'),
      }),
    );
  });

  it('should not be able to update a non-existing product', async () => {
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

    const response = await request(app)
      .put(`/products/${tenant_id}`)
      .send({
        id: v4(),
        name: 'Pizza de calabresa',
        description: 'Uma pizza muito saborosa com os melhores ingredientes do mercado.',
        price: 80.5,
        promotion_price: 60,
        category_id,
        image_id: v4(),
        paused: false,
      })
      .set('Authorization', `Bearer ${token}`);

    const product = await productsRepository.findOne({
      where: { name: 'Pizza de calabresa' },
    });

    expect(product).toBeFalsy();

    expect(response.status).toBe(404);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        status: expect.stringMatching('error'),
        message: expect.stringMatching('Produto não encontrado.'),
      }),
    );
  });

  it('should not be able to update a product with a non-existing file', async () => {
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

    const { id } = await productsRepository.save(
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

    const response = await request(app)
      .put(`/products/${tenant_id}`)
      .send({
        id,
        name: 'Pizza de calabresa',
        description: 'Uma pizza muito saborosa com os melhores ingredientes do mercado.',
        price: 80.5,
        promotion_price: 60,
        category_id,
        image_id: v4(),
        paused: false,
      })
      .set('Authorization', `Bearer ${token}`);

    const product = await productsRepository.findOne({
      where: { name: 'Pizza de calabresa' },
    });

    expect(product).toBeFalsy();

    expect(response.status).toBe(404);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        status: expect.stringMatching('error'),
        message: expect.stringMatching('Arquivo não encontrado.'),
      }),
    );
  });

  it('should not be able to update a product with no name', async () => {
    const response = await request(app)
      .put(`/products/${v4()}`)
      .send({
        id: v4(),
        description: 'Uma pizza muito saborosa com os melhores ingredientes do mercado.',
        price: 80.5,
        promotion_price: 60,
        category_id: v4(),
        image_id: v4(),
        paused: false,
      })
      .set('Authorization', `Bearer ${token}`);

    const product = await productsRepository.findOne({
      where: { name: 'Pizza de peperone' },
    });

    expect(product).toBeFalsy();

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        error: expect.stringMatching('Bad Request'),
        message: expect.stringMatching("O campo 'nome' não pode estar vazio"),
      }),
    );
  });

  it('should not be able to update a product without a product id', async () => {
    const response = await request(app)
      .put(`/products/${v4()}`)
      .send({
        name: 'Pizza de peperone',
        description: 'Uma pizza muito saborosa com os melhores ingredientes do mercado.',
        price: 80.5,
        promotion_price: 60,
        category_id: v4(),
        image_id: v4(),
        paused: false,
      })
      .set('Authorization', `Bearer ${token}`);

    const product = await productsRepository.findOne({
      where: { name: 'Pizza de peperone' },
    });

    expect(product).toBeFalsy();

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        error: expect.stringMatching('Bad Request'),
        message: expect.stringMatching("O campo 'produto' não pode estar vazio"),
      }),
    );
  });

  it('should not be able to update a product with a invalid product id', async () => {
    const response = await request(app)
      .put(`/products/${v4()}`)
      .send({
        id: 'invalid-product-id',
        name: 'Pizza de peperone',
        description: 'Uma pizza muito saborosa com os melhores ingredientes do mercado.',
        price: 80.5,
        promotion_price: 60,
        category_id: v4(),
        image_id: v4(),
        paused: false,
      })
      .set('Authorization', `Bearer ${token}`);

    const product = await productsRepository.findOne({
      where: { name: 'Pizza de peperone' },
    });

    expect(product).toBeFalsy();

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        error: expect.stringMatching('Bad Request'),
        message: expect.stringMatching('Insira um produto válido'),
      }),
    );
  });

  it('should not be able to update a product without a description', async () => {
    const response = await request(app)
      .put(`/products/${v4()}`)
      .send({
        id: v4(),
        name: 'Pizza de peperone',
        price: 80.5,
        promotion_price: 60,
        category_id: v4(),
        image_id: v4(),
        paused: false,
      })
      .set('Authorization', `Bearer ${token}`);

    const product = await productsRepository.findOne({
      where: { name: 'Pizza de peperone' },
    });

    expect(product).toBeFalsy();

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        error: expect.stringMatching('Bad Request'),
        message: expect.stringMatching("O campo 'descrição' não pode estar vazio"),
      }),
    );
  });

  it('should not be able to update a product without a price', async () => {
    const response = await request(app)
      .put(`/products/${v4()}`)
      .send({
        id: v4(),
        name: 'Pizza de peperone',
        description: 'Uma pizza muito saborosa com os melhores ingredientes do mercado.',
        promotion_price: 60,
        category_id: v4(),
        image_id: v4(),
        paused: false,
      })
      .set('Authorization', `Bearer ${token}`);

    const product = await productsRepository.findOne({
      where: { name: 'Pizza de peperone' },
    });

    expect(product).toBeFalsy();

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        error: expect.stringMatching('Bad Request'),
        message: expect.stringMatching("O campo 'preço' não pode estar vazio"),
      }),
    );
  });

  it('should not be able to update a product with a invalid price', async () => {
    const response = await request(app)
      .put(`/products/${v4()}`)
      .send({
        id: v4(),
        name: 'Pizza de peperone',
        description: 'Uma pizza muito saborosa com os melhores ingredientes do mercado.',
        price: 'price',
        promotion_price: 60,
        category_id: v4(),
        image_id: v4(),
        paused: false,
      })
      .set('Authorization', `Bearer ${token}`);

    const product = await productsRepository.findOne({
      where: { name: 'Pizza de peperone' },
    });

    expect(product).toBeFalsy();

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        error: expect.stringMatching('Bad Request'),
        message: expect.stringMatching("O campo 'preço' precisa ser um número"),
      }),
    );
  });

  it('should not be able to update a product with a invalid promotion price', async () => {
    const response = await request(app)
      .put(`/products/${v4()}`)
      .send({
        id: v4(),
        name: 'Pizza de peperone',
        description: 'Uma pizza muito saborosa com os melhores ingredientes do mercado.',
        price: 80.5,
        promotion_price: 'promotion price',
        category_id: v4(),
        image_id: v4(),
        paused: false,
      })
      .set('Authorization', `Bearer ${token}`);

    const product = await productsRepository.findOne({
      where: { name: 'Pizza de peperone' },
    });

    expect(product).toBeFalsy();

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        error: expect.stringMatching('Bad Request'),
        message: expect.stringMatching("O campo 'promoção' precisa ser um número"),
      }),
    );
  });

  it('should not be able to update a product without a category id', async () => {
    const response = await request(app)
      .put(`/products/${v4()}`)
      .send({
        id: v4(),
        name: 'Pizza de peperone',
        description: 'Uma pizza muito saborosa com os melhores ingredientes do mercado.',
        price: 80.5,
        promotion_price: 60,
        image_id: v4(),
        paused: false,
      })
      .set('Authorization', `Bearer ${token}`);

    const product = await productsRepository.findOne({
      where: { name: 'Pizza de peperone' },
    });

    expect(product).toBeFalsy();

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        error: expect.stringMatching('Bad Request'),
        message: expect.stringMatching("O campo 'categoria' não pode estar vazio"),
      }),
    );
  });

  it('should not be able to update a product with a invalid category id', async () => {
    const response = await request(app)
      .put(`/products/${v4()}`)
      .send({
        id: v4(),
        name: 'Pizza de peperone',
        description: 'Uma pizza muito saborosa com os melhores ingredientes do mercado.',
        price: 80.5,
        promotion_price: 60,
        category_id: 'invalid-category-id',
        image_id: v4(),
        paused: false,
      })
      .set('Authorization', `Bearer ${token}`);

    const product = await productsRepository.findOne({
      where: { name: 'Pizza de peperone' },
    });

    expect(product).toBeFalsy();

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        error: expect.stringMatching('Bad Request'),
        message: expect.stringMatching('Insira uma categoria válida'),
      }),
    );
  });

  it('should not be able to update a product with a invalid image id', async () => {
    const response = await request(app)
      .put(`/products/${v4()}`)
      .send({
        id: v4(),
        name: 'Pizza de peperone',
        description: 'Uma pizza muito saborosa com os melhores ingredientes do mercado.',
        price: 80.5,
        promotion_price: 60,
        category_id: v4(),
        image_id: 'invalid-image-id',
        paused: false,
      })
      .set('Authorization', `Bearer ${token}`);

    const product = await productsRepository.findOne({
      where: { name: 'Pizza de peperone' },
    });

    expect(product).toBeFalsy();

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        error: expect.stringMatching('Bad Request'),
        message: expect.stringMatching('Insira uma imagem válida'),
      }),
    );
  });

  it('should not be able to update a product with a invalid paused value', async () => {
    const response = await request(app)
      .put(`/products/${v4()}`)
      .send({
        id: v4(),
        name: 'Pizza de peperone',
        description: 'Uma pizza muito saborosa com os melhores ingredientes do mercado.',
        price: 80.5,
        promotion_price: 60,
        category_id: v4(),
        image_id: v4(),
        paused: 'invalid-paused-value',
      })
      .set('Authorization', `Bearer ${token}`);

    const product = await productsRepository.findOne({
      where: { name: 'Pizza de peperone' },
    });

    expect(product).toBeFalsy();

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        error: expect.stringMatching('Bad Request'),
        message: expect.stringMatching("O campo 'pausar as vendas' precisa ser um booleano"),
      }),
    );
  });

  it('should not be able to update a product with a invalid tenant id', async () => {
    const response = await request(app)
      .put(`/products/invalid-tenant-id`)
      .send({
        id: v4(),
        name: 'Pizza de peperone',
        description: 'Uma pizza muito saborosa com os melhores ingredientes do mercado.',
        price: 80.5,
        promotion_price: 60,
        category_id: v4(),
        image_id: v4(),
        paused: false,
      })
      .set('Authorization', `Bearer ${token}`);

    const product = await productsRepository.findOne({
      where: { name: 'Pizza de peperone' },
    });

    expect(product).toBeFalsy();

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        error: expect.stringMatching('Bad Request'),
        message: expect.stringMatching('Insira uma loja válida'),
      }),
    );
  });
});
