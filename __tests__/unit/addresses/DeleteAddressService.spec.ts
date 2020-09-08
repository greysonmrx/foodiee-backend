import { v4 } from 'uuid';

import AppError from '../../../src/shared/errors/AppError';

import FakeAddressesRepository from '../../../src/modules/addresses/repositories/fakes/FakeAddressesRepository';
import DeleteAddressService from '../../../src/modules/addresses/services/DeleteAddressService';

let fakeAddressesRepository: FakeAddressesRepository;
let deleteAddressService: DeleteAddressService;

describe('Delete Address Service', () => {
  beforeEach(() => {
    fakeAddressesRepository = new FakeAddressesRepository();
    deleteAddressService = new DeleteAddressService(fakeAddressesRepository);
  });

  it('should be able to delete a address', async () => {
    const { id } = await fakeAddressesRepository.create({
      customer_id: v4(),
      name: 'Casa',
      city: 'Palmeira dos Índios',
      latitude: -9.3994335,
      longitude: -36.6405569,
      neighborhood: 'Palmeira de Fora',
      state: 'AL',
      street: 'Av. Fernando Calixto',
      complement: 'Ao lado da padaria do seu Zé',
      number: '3F',
    });

    await expect(
      deleteAddressService.execute({
        id,
      }),
    ).resolves.toBe(undefined);
  });

  it('should not be able to delete a non-existing address', async () => {
    await expect(
      deleteAddressService.execute({
        id: v4(),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
