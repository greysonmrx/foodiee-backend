import { v4 } from 'uuid';

import AppError from '../../../src/shared/errors/AppError';

import FakeComplementCategoriesRepository from '../../../src/modules/complement_categories/repositories/fakes/FakeComplementCategoriesRepository';
import FakeTenantsRepository from '../../../src/modules/tenants/repositories/fakes/FakeTenantsRepository';
import FakeProductsRepository from '../../../src/modules/products/repositories/fakes/FakeProductsRepository';
import CreateComplementCategoryService from '../../../src/modules/complement_categories/services/CreateComplementCategoryService';

let fakeTenantsRepository: FakeTenantsRepository;
let fakeProductsRepository: FakeProductsRepository;
let fakeComplementCategoriesRepository: FakeComplementCategoriesRepository;
let createComplementCategoryService: CreateComplementCategoryService;

describe('Create Complement Category Service', () => {
  beforeEach(() => {
    fakeComplementCategoriesRepository = new FakeComplementCategoriesRepository();
    fakeTenantsRepository = new FakeTenantsRepository();
    fakeProductsRepository = new FakeProductsRepository();
    createComplementCategoryService = new CreateComplementCategoryService(
      fakeComplementCategoriesRepository,
      fakeProductsRepository,
    );
  });

  it('should be able to create a new complement category', async () => {
    const { id: tenant_id } = await fakeTenantsRepository.create({
      name: "McDonald's",
      slug: 'mc-donalds',
    });

    const { id: product_id } = await fakeProductsRepository.create({
      name: 'Pizza de peperone',
      description: 'Uma pizza muito saborosa com os melhores ingredientes do mercado.',
      price: 80.5,
      promotion_price: 60,
      category_id: v4(),
      image_id: v4(),
      tenant_id,
      paused: false,
    });

    await expect(
      createComplementCategoryService.execute({
        name: 'Deseja Adicionar Algo?',
        max: 5,
        min: 1,
        required: true,
        product_id,
        tenant_id,
      }),
    ).resolves.toHaveProperty('id');
  });

  it('should not be able to create a new complement category with a non-existing product', async () => {
    await expect(
      createComplementCategoryService.execute({
        name: 'Deseja Adicionar Algo?',
        max: 5,
        min: 1,
        required: true,
        product_id: v4(),
        tenant_id: v4(),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new complement category with the minimun quantity less than one when required is true', async () => {
    const { id: tenant_id } = await fakeTenantsRepository.create({
      name: "McDonald's",
      slug: 'mc-donalds',
    });

    const { id: product_id } = await fakeProductsRepository.create({
      name: 'Pizza de peperone',
      description: 'Uma pizza muito saborosa com os melhores ingredientes do mercado.',
      price: 80.5,
      promotion_price: 60,
      category_id: v4(),
      image_id: v4(),
      tenant_id,
      paused: false,
    });

    await expect(
      createComplementCategoryService.execute({
        name: 'Deseja Adicionar Algo?',
        max: 5,
        min: 0,
        required: true,
        product_id,
        tenant_id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
