import { v4 } from 'uuid';

import AppError from '../../src/shared/errors/AppError';

import FakeProductCategoriesRepository from '../../src/modules/product_categories/repositories/fakes/FakeProductCategoriesRepository';
import FakeTenantsRepository from '../../src/modules/tenants/repositories/fakes/FakeTenantsRepository';
import DeleteProductCategoryService from '../../src/modules/product_categories/services/DeleteProductCategoryService';

let fakeTenantsRepository: FakeTenantsRepository;
let fakeProductCategoriesRepository: FakeProductCategoriesRepository;
let deleteProductCategory: DeleteProductCategoryService;

describe('Delete Product Category Service', () => {
  beforeEach(() => {
    fakeProductCategoriesRepository = new FakeProductCategoriesRepository();
    fakeTenantsRepository = new FakeTenantsRepository();
    deleteProductCategory = new DeleteProductCategoryService(fakeProductCategoriesRepository, fakeTenantsRepository);
  });

  it('should be able to delete a product category', async () => {
    const { id: tenant_id } = await fakeTenantsRepository.create({
      name: "McDonald's",
      slug: 'mc-donalds',
    });

    const { id } = await fakeProductCategoriesRepository.create({
      name: 'Pizza',
      tenant_id,
    });

    await expect(
      deleteProductCategory.execute({
        id,
        tenant_id,
      }),
    ).resolves.toBe(undefined);
  });

  it('should not be able to delete a product category with a non-existing tenant', async () => {
    const { id } = await fakeProductCategoriesRepository.create({
      name: 'Pizza',
      tenant_id: v4(),
    });

    await expect(
      deleteProductCategory.execute({
        id,
        tenant_id: v4(),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to delete a non-existing product category', async () => {
    const { id: tenant_id } = await fakeTenantsRepository.create({
      name: "McDonald's",
      slug: 'mc-donalds',
    });

    await expect(
      deleteProductCategory.execute({
        id: v4(),
        tenant_id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
