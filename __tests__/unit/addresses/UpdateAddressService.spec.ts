import { v4 } from 'uuid';

import AppError from '../../../src/shared/errors/AppError';

import FakeAddressesRepository from '../../../src/modules/addresses/repositories/fakes/FakeAddressesRepository';
import FakeCustomersRepository from '../../../src/modules/customers/repositories/fakes/FakeCustomersRepository';
import UpdateAddressService from '../../../src/modules/addresses/services/UpdateAddressService';

let fakeAddressesRepository: FakeAddressesRepository;
let fakeCustomersRepository: FakeCustomersRepository;
let updateAddressService: UpdateAddressService;

describe('Update Address Service', () => {
  beforeEach(() => {
    fakeAddressesRepository = new FakeAddressesRepository();
    fakeCustomersRepository = new FakeCustomersRepository();
    updateAddressService = new UpdateAddressService(fakeAddressesRepository);
  });

  it('should be able to update a address', async () => {
    const { id: customer_id } = await fakeCustomersRepository.create({
      name: 'Greyson Mascarenhas Santos Filho',
      phone: '82999999999',
      email: 'greysonmrx@gmail.com',
    });

    const { id } = await fakeAddressesRepository.create({
      customer_id,
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
      updateAddressService.execute({
        id,
        name: 'Trabalho',
        city: 'Palmeira dos Índios',
        latitude: -9.3994335,
        longitude: -36.6405569,
        neighborhood: 'Palmeira de Fora',
        state: 'AL',
        street: 'Av. Fernando Calixto',
        complement: 'Ao lado da padaria do seu Zé',
        number: '3F',
      }),
    ).resolves.toHaveProperty('id');
  });

  it('should not be able to update a non-existing address', async () => {
    await expect(
      updateAddressService.execute({
        id: v4(),
        name: 'Casa',
        city: 'Palmeira dos Índios',
        latitude: -9.3994335,
        longitude: -36.6405569,
        neighborhood: 'Palmeira de Fora',
        state: 'AL',
        street: 'Av. Fernando Calixto',
        complement: 'Ao lado da padaria do seu Zé',
        number: '3F',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
