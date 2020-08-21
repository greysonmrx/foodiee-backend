import { v4 } from 'uuid';

import AppError from '../../../src/shared/errors/AppError';

import FakeComplementsRepository from '../../../src/modules/complements/repositories/fakes/FakeComplementsRepository';
import UpdateComplementService from '../../../src/modules/complements/services/UpdateComplementService';

let fakeComplementsRepository: FakeComplementsRepository;
let updateComplementService: UpdateComplementService;

describe('Update Complement Service', () => {
  beforeEach(() => {
    fakeComplementsRepository = new FakeComplementsRepository();
    updateComplementService = new UpdateComplementService(fakeComplementsRepository);
  });

  it('should be able to update a complement', async () => {
    const { id } = await fakeComplementsRepository.create({
      name: 'Bacon',
      price: 3.5,
      category_id: v4(),
    });

    await expect(
      updateComplementService.execute({
        id,
        name: 'Cheddar',
        price: 5,
      }),
    ).resolves.toHaveProperty('id');
  });

  it('should not be able to update a non-existing complement', async () => {
    await expect(
      updateComplementService.execute({
        id: v4(),
        name: 'Bacon',
        price: 3.5,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
