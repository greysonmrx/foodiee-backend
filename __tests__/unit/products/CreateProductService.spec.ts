import { v4 } from 'uuid';

import AppError from '../../../src/shared/errors/AppError';

import FakeProductCategoriesRepository from '../../../src/modules/product_categories/repositories/fakes/FakeProductCategoriesRepository';
import FakeTenantsRepository from '../../../src/modules/tenants/repositories/fakes/FakeTenantsRepository';
import FakeProductsRepository from '../../../src/modules/products/repositories/fakes/FakeProductsRepository';
import FakeFilesRespository from '../../../src/modules/files/repositories/fakes/FakeFilesRepository';
import CreateProductService from '../../../src/modules/products/services/CreateProductService';

let fakeTenantsRepository: FakeTenantsRepository;
let fakeProductCategoriesRepository: FakeProductCategoriesRepository;
let fakeProductsRepository: FakeProductsRepository;
let fakeFilesRespository: FakeFilesRespository;
let createProduct: CreateProductService;

describe('Create Product Service', () => {
  beforeEach(() => {
    fakeProductCategoriesRepository = new FakeProductCategoriesRepository();
    fakeTenantsRepository = new FakeTenantsRepository();
    fakeProductsRepository = new FakeProductsRepository();
    fakeFilesRespository = new FakeFilesRespository();
    createProduct = new CreateProductService(
      fakeProductsRepository,
      fakeTenantsRepository,
      fakeFilesRespository,
      fakeProductCategoriesRepository,
    );
  });

  it('should be able to create a new product', async () => {
    const { id: tenant_id } = await fakeTenantsRepository.create({
      name: "McDonald's",
      slug: 'mc-donalds',
    });

    const { id: category_id } = await fakeProductCategoriesRepository.create({
      name: 'Pizza',
      tenant_id,
    });

    const { id: image_id } = await fakeFilesRespository.create({
      name: 'fileName.png',
      path: 'filePath.png',
    });

    await expect(
      createProduct.execute({
        name: 'Pizza de peperone',
        description: 'Uma pizza muito saborosa com os melhores ingredientes do mercado.',
        price: 80.5,
        promotion_price: 60,
        category_id,
        image_id,
        tenant_id,
        paused: false,
      }),
    ).resolves.toHaveProperty('id');
  });

  it('should not be able to create a new product with a non-existing tenant', async () => {
    const { id: category_id } = await fakeProductCategoriesRepository.create({
      name: 'Pizza',
      tenant_id: v4(),
    });

    const { id: image_id } = await fakeFilesRespository.create({
      name: 'fileName.png',
      path: 'filePath.png',
    });

    await expect(
      createProduct.execute({
        name: 'Pizza de peperone',
        description: 'Uma pizza muito saborosa com os melhores ingredientes do mercado.',
        price: 80.5,
        promotion_price: 60,
        category_id,
        image_id,
        tenant_id: v4(),
        paused: false,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new product with a non-existing category', async () => {
    const { id: tenant_id } = await fakeTenantsRepository.create({
      name: "McDonald's",
      slug: 'mc-donalds',
    });

    const { id: image_id } = await fakeFilesRespository.create({
      name: 'fileName.png',
      path: 'filePath.png',
    });

    await expect(
      createProduct.execute({
        name: 'Pizza de peperone',
        description: 'Uma pizza muito saborosa com os melhores ingredientes do mercado.',
        price: 80.5,
        promotion_price: 60,
        category_id: v4(),
        image_id,
        tenant_id,
        paused: false,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new product with a non-existing file', async () => {
    const { id: tenant_id } = await fakeTenantsRepository.create({
      name: "McDonald's",
      slug: 'mc-donalds',
    });

    const { id: category_id } = await fakeProductCategoriesRepository.create({
      name: 'Pizza',
      tenant_id,
    });

    await expect(
      createProduct.execute({
        name: 'Pizza de peperone',
        description: 'Uma pizza muito saborosa com os melhores ingredientes do mercado.',
        price: 80.5,
        promotion_price: 60,
        category_id,
        image_id: v4(),
        tenant_id,
        paused: false,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
