import { v4 } from 'uuid';

import FakeComplementCategoriesRepository from '../../../src/modules/complement_categories/repositories/fakes/FakeComplementCategoriesRepository';
import ListComplementCategoriesService from '../../../src/modules/complement_categories/services/ListComplementCategoriesService';
import FakeProductsRepository from '../../../src/modules/products/repositories/fakes/FakeProductsRepository';

let fakeProductsRepository: FakeProductsRepository;
let fakeComplementCategoriesRepository: FakeComplementCategoriesRepository;
let listComplementCategoriesService: ListComplementCategoriesService;

describe('List Complement Categories Service', () => {
  beforeEach(() => {
    fakeProductsRepository = new FakeProductsRepository();
    fakeComplementCategoriesRepository = new FakeComplementCategoriesRepository();
    listComplementCategoriesService = new ListComplementCategoriesService(fakeComplementCategoriesRepository);
  });

  it('should be able to list all complement categories', async () => {
    const { id: product_id } = await fakeProductsRepository.create({
      name: 'Pizza de peperone',
      description: 'Uma pizza muito saborosa com os melhores ingredientes do mercado.',
      price: 80.5,
      promotion_price: 60,
      category_id: v4(),
      image_id: v4(),
      tenant_id: v4(),
      paused: false,
    });

    await fakeComplementCategoriesRepository.create({
      name: 'Deseja Adicionar Algo?',
      max: 5,
      min: 1,
      required: true,
      product_id,
    });

    await fakeComplementCategoriesRepository.create({
      name: 'Deseja Beber Algo?',
      max: 10,
      min: 0,
      required: false,
      product_id,
    });

    await expect(
      listComplementCategoriesService.execute({
        product_id,
      }),
    ).resolves.toHaveLength(2);
  });
});
