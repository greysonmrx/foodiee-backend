import { v4 } from 'uuid';

import AppError from '../../src/shared/errors/AppError';

import FakeTenantsRepository from '../../src/modules/tenants/repositories/fakes/FakeTenantsRepository';
import FakeProductsRepository from '../../src/modules/products/repositories/fakes/FakeProductsRepository';
import ListProductsService from '../../src/modules/products/services/ListProductsService';

let fakeTenantsRepository: FakeTenantsRepository;
let fakeProductsRepository: FakeProductsRepository;
let listProducts: ListProductsService;

describe('List Product Service', () => {
  beforeEach(() => {
    fakeTenantsRepository = new FakeTenantsRepository();
    fakeProductsRepository = new FakeProductsRepository();
    listProducts = new ListProductsService(fakeProductsRepository, fakeTenantsRepository);
  });

  it('should be able to list all products', async () => {
    const { id: tenant_id } = await fakeTenantsRepository.create({
      name: "McDonald's",
      slug: 'mc-donalds',
    });

    await fakeProductsRepository.create({
      name: 'Pizza de peperone',
      description: 'Uma pizza muito saborosa com os melhores ingredientes do mercado.',
      price: 80.5,
      promotion_price: 60,
      category_id: v4(),
      image_id: v4(),
      tenant_id,
      paused: false,
    });

    await fakeProductsRepository.create({
      name: 'Pizza de calabresa',
      description: 'Uma pizza muito saborosa com os melhores ingredientes do mercado.',
      price: 40.5,
      promotion_price: 25.5,
      category_id: v4(),
      image_id: v4(),
      tenant_id,
      paused: true,
    });

    await expect(listProducts.execute({ tenant_id })).resolves.toHaveLength(2);
  });

  it('should not be able to list all products with a non-existing tenant', async () => {
    await expect(
      listProducts.execute({
        tenant_id: v4(),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
