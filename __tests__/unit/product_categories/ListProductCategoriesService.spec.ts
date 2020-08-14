import { v4 } from 'uuid';

import AppError from '../../../src/shared/errors/AppError';

import FakeProductCategoriesRepository from '../../../src/modules/product_categories/repositories/fakes/FakeProductCategoriesRepository';
import FakeTenantsRepository from '../../../src/modules/tenants/repositories/fakes/FakeTenantsRepository';
import ListProductCategoriesService from '../../../src/modules/product_categories/services/ListProductCategoriesService';

let fakeTenantsRepository: FakeTenantsRepository;
let fakeProductCategoriesRepository: FakeProductCategoriesRepository;
let listProductCategories: ListProductCategoriesService;

describe('List Product Categories Service', () => {
  beforeEach(() => {
    fakeProductCategoriesRepository = new FakeProductCategoriesRepository();
    fakeTenantsRepository = new FakeTenantsRepository();
    listProductCategories = new ListProductCategoriesService(fakeProductCategoriesRepository, fakeTenantsRepository);
  });

  it('should be able to list all product categories', async () => {
    const { id: tenant_id } = await fakeTenantsRepository.create({
      name: "McDonald's",
      slug: 'mc-donalds',
    });

    await fakeProductCategoriesRepository.create({
      name: 'Pizza',
      tenant_id,
    });

    await fakeProductCategoriesRepository.create({
      name: 'Snacks',
      tenant_id,
    });

    await expect(
      listProductCategories.execute({
        tenant_id,
      }),
    ).resolves.toHaveLength(2);
  });

  it('should not be able to list all product categories with a non-existing tenant', async () => {
    await expect(
      listProductCategories.execute({
        tenant_id: v4(),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
