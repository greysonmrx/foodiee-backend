import { v4 } from 'uuid';

import AppError from '../../../src/shared/errors/AppError';

import FakeComplementsRepository from '../../../src/modules/complements/repositories/fakes/FakeComplementsRepository';
import FakeComplementCategoriesRepository from '../../../src/modules/complement_categories/repositories/fakes/FakeComplementCategoriesRepository';
import CreateComplementService from '../../../src/modules/complements/services/CreateComplementService';

let fakeComplementsRepository: FakeComplementsRepository;
let fakeComplementCategoriesRepository: FakeComplementCategoriesRepository;
let createComplementService: CreateComplementService;

describe('Create Complement Service', () => {
  beforeEach(() => {
    fakeComplementsRepository = new FakeComplementsRepository();
    fakeComplementCategoriesRepository = new FakeComplementCategoriesRepository();
    createComplementService = new CreateComplementService(
      fakeComplementsRepository,
      fakeComplementCategoriesRepository,
    );
  });

  it('should be able to create a new complement', async () => {
    const { id: category_id } = await fakeComplementCategoriesRepository.create({
      name: 'Deseja Adicionar Algo?',
      max: 5,
      min: 1,
      required: true,
      product_id: v4(),
    });

    await expect(
      createComplementService.execute({
        name: 'Bacon',
        price: 3.5,
        category_id,
      }),
    ).resolves.toHaveProperty('id');
  });

  it('should not be able to create a new complement with a non-existing complement category', async () => {
    await expect(
      createComplementService.execute({
        name: 'Bacon',
        price: 3.5,
        category_id: v4(),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
