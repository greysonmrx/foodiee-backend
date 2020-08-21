import { v4 } from 'uuid';

import AppError from '../../../src/shared/errors/AppError';

import FakeComplementsRepository from '../../../src/modules/complements/repositories/fakes/FakeComplementsRepository';
import DeleteComplementService from '../../../src/modules/complements/services/DeleteComplementService';

let fakeComplementsRepository: FakeComplementsRepository;
let deleteComplementService: DeleteComplementService;

describe('Delete Complement Service', () => {
  beforeEach(() => {
    fakeComplementsRepository = new FakeComplementsRepository();
    deleteComplementService = new DeleteComplementService(fakeComplementsRepository);
  });

  it('should be able to delete a complement', async () => {
    const { id } = await fakeComplementsRepository.create({
      name: 'Bacon',
      price: 3.5,
      category_id: v4(),
    });

    await expect(
      deleteComplementService.execute({
        id,
      }),
    ).resolves.toBe(undefined);
  });

  it('should not be able to delete a non-existing complement', async () => {
    await expect(
      deleteComplementService.execute({
        id: v4(),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
