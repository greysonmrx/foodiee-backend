import { v4 } from 'uuid';

import AppError from '../../../src/shared/errors/AppError';

import FakeComplementCategoriesRepository from '../../../src/modules/complement_categories/repositories/fakes/FakeComplementCategoriesRepository';
import UpdateComplementCategoryService from '../../../src/modules/complement_categories/services/UpdateComplementCategoryService';

let fakeComplementCategoriesRepository: FakeComplementCategoriesRepository;
let updateComplementCategoryService: UpdateComplementCategoryService;

describe('Update Complement Category Service', () => {
  beforeEach(() => {
    fakeComplementCategoriesRepository = new FakeComplementCategoriesRepository();
    updateComplementCategoryService = new UpdateComplementCategoryService(fakeComplementCategoriesRepository);
  });

  it('should be able to update a complement category', async () => {
    const { id } = await fakeComplementCategoriesRepository.create({
      name: 'Deseja Adicionar Algo?',
      max: 5,
      min: 1,
      required: true,
      product_id: v4(),
    });

    await expect(
      updateComplementCategoryService.execute({
        id,
        name: 'Deseja Adicionar Algo?',
        max: 5,
        min: 1,
        required: true,
      }),
    ).resolves.toHaveProperty('id');
  });

  it('should not be able to update a non-existing complement category', async () => {
    await expect(
      updateComplementCategoryService.execute({
        id: v4(),
        name: 'Deseja Adicionar Algo?',
        max: 5,
        min: 0,
        required: true,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update a complement category with the minimun quantity less than one when required is true', async () => {
    const { id } = await fakeComplementCategoriesRepository.create({
      name: 'Deseja Adicionar Algo?',
      max: 5,
      min: 1,
      required: true,
      product_id: v4(),
    });

    await expect(
      updateComplementCategoryService.execute({
        id,
        name: 'Deseja Adicionar Algo?',
        max: 5,
        min: 0,
        required: true,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
