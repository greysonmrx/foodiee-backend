import { v4 } from 'uuid';

import AppError from '../../../src/shared/errors/AppError';

import FakeComplementCategoriesRepository from '../../../src/modules/complement_categories/repositories/fakes/FakeComplementCategoriesRepository';
import DeleteComplementCategoryService from '../../../src/modules/complement_categories/services/DeleteComplementCategoryService';

let fakeComplementCategoriesRepository: FakeComplementCategoriesRepository;
let deleteComplementCategoryService: DeleteComplementCategoryService;

describe('Delete Complement Category Service', () => {
  beforeEach(() => {
    fakeComplementCategoriesRepository = new FakeComplementCategoriesRepository();
    deleteComplementCategoryService = new DeleteComplementCategoryService(fakeComplementCategoriesRepository);
  });

  it('should be able to delete a complement category', async () => {
    const { id } = await fakeComplementCategoriesRepository.create({
      name: 'Deseja Adicionar Algo?',
      max: 5,
      min: 1,
      required: true,
      product_id: v4(),
    });

    await expect(
      deleteComplementCategoryService.execute({
        id,
      }),
    ).resolves.toBe(undefined);
  });

  it('should not be able to delete a non-existing complement category', async () => {
    await expect(
      deleteComplementCategoryService.execute({
        id: v4(),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
