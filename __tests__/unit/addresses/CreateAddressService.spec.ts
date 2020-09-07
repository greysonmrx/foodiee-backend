import { v4 } from 'uuid';

import AppError from '../../../src/shared/errors/AppError';

import FakeAddressesRepository from '../../../src/modules/addresses/repositories/fakes/FakeAddressesRepository';
import FakeCustomersRepository from '../../../src/modules/customers/repositories/fakes/FakeCustomersRepository';
import CreateAddressService from '../../../src/modules/addresses/services/CreateAddressService';

let fakeAddressesRepository: FakeAddressesRepository;
let fakeCustomersRepository: FakeCustomersRepository;
let createAddressService: CreateAddressService;

describe('Create Address Service', () => {
  beforeEach(() => {
    fakeAddressesRepository = new FakeAddressesRepository();
    fakeCustomersRepository = new FakeCustomersRepository();
    createAddressService = new CreateAddressService(fakeAddressesRepository, fakeCustomersRepository);
  });

  it('should be able to create a new address', async () => {
    const { id: customer_id } = await fakeCustomersRepository.create({
      name: 'Greyson Mascarenhas Santos Filho',
      phone: '82999999999',
      email: 'greysonmrx@gmail.com',
    });

    await expect(
      createAddressService.execute({
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
      }),
    ).resolves.toHaveProperty('id');
  });

  it('should not be able to create a new address with a non-existing customer', async () => {
    await expect(
      createAddressService.execute({
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
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
