import { v4 } from 'uuid';

import AppError from '../../src/shared/errors/AppError';

import FakeProductCategoriesRepository from '../../src/modules/product_categories/repositories/fakes/FakeProductCategoriesRepository';
import FakeTenantsRepository from '../../src/modules/tenants/repositories/fakes/FakeTenantsRepository';
import UpdateProductCategoryService from '../../src/modules/product_categories/services/UpdateProductCategoryService';

let fakeTenantsRepository: FakeTenantsRepository;
let fakeProductCategoriesRepository: FakeProductCategoriesRepository;
let updateProductCategory: UpdateProductCategoryService;

describe('Update Product Category Service', () => {
  beforeEach(() => {
    fakeProductCategoriesRepository = new FakeProductCategoriesRepository();
    fakeTenantsRepository = new FakeTenantsRepository();
    updateProductCategory = new UpdateProductCategoryService(fakeProductCategoriesRepository, fakeTenantsRepository);
  });

  it('should be able to update product category', async () => {
    const { id: tenant_id } = await fakeTenantsRepository.create({
      name: "McDonald's",
      slug: 'mc-donalds',
    });

    const { id } = await fakeProductCategoriesRepository.create({
      name: 'Pizza',
      tenant_id,
    });

    await expect(
      updateProductCategory.execute({
        id,
        name: 'Snacks',
        tenant_id,
      }),
    ).resolves.toHaveProperty('id');
  });

  it('should not be able to update a product category with a non-existing tenant', async () => {
    const { id } = await fakeProductCategoriesRepository.create({
      name: 'Pizza',
      tenant_id: v4(),
    });

    await expect(
      updateProductCategory.execute({
        id,
        name: 'Pizza',
        tenant_id: v4(),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update a non-existing product category', async () => {
    const { id: tenant_id } = await fakeTenantsRepository.create({
      name: "McDonald's",
      slug: 'mc-donalds',
    });

    await expect(
      updateProductCategory.execute({
        id: v4(),
        name: 'Pizza',
        tenant_id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update a product category with duplicate name', async () => {
    const { id: tenant_id } = await fakeTenantsRepository.create({
      name: "McDonald's",
      slug: 'mc-donalds',
    });

    await fakeProductCategoriesRepository.create({
      name: 'Pizza',
      tenant_id,
    });

    const { id } = await fakeProductCategoriesRepository.create({
      name: 'Snacks',
      tenant_id,
    });

    await expect(
      updateProductCategory.execute({
        id,
        name: 'Pizza',
        tenant_id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
