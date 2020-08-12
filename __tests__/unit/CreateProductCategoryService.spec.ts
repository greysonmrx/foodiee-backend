import { v4 } from 'uuid';

import AppError from '../../src/shared/errors/AppError';

import FakeProductCategoriesRepository from '../../src/modules/product_categories/repositories/fakes/FakeProductCategoriesRepository';
import FakeTenantsRepository from '../../src/modules/tenants/repositories/fakes/FakeTenantsRepository';
import CreateProductCategoryService from '../../src/modules/product_categories/services/CreateProductCategoryService';

let fakeTenantsRepository: FakeTenantsRepository;
let fakeProductCategoriesRepository: FakeProductCategoriesRepository;
let createProductCategory: CreateProductCategoryService;

describe('Create Product Category Service', () => {
  beforeEach(() => {
    fakeProductCategoriesRepository = new FakeProductCategoriesRepository();
    fakeTenantsRepository = new FakeTenantsRepository();
    createProductCategory = new CreateProductCategoryService(fakeProductCategoriesRepository, fakeTenantsRepository);
  });

  it('should be able to create a new product category', async () => {
    const { id: tenant_id } = await fakeTenantsRepository.create({
      name: "McDonald's",
      slug: 'mc-donalds',
    });

    await expect(
      createProductCategory.execute({
        name: 'Pizza',
        tenant_id,
      }),
    ).resolves.toHaveProperty('id');
  });

  it('should not be able to create a new product category with a non-existing tenant', async () => {
    await expect(
      createProductCategory.execute({
        name: 'Pizza',
        tenant_id: v4(),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new product category with duplicate name', async () => {
    const { id: tenant_id } = await fakeTenantsRepository.create({
      name: "McDonald's",
      slug: 'mc-donalds',
    });

    await createProductCategory.execute({ name: 'Pizza', tenant_id });

    await expect(
      createProductCategory.execute({
        name: 'Pizza',
        tenant_id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
