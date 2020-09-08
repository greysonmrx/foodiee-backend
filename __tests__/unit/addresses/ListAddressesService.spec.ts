import { v4 } from 'uuid';

import AppError from '../../../src/shared/errors/AppError';

import FakeAddressesRepository from '../../../src/modules/addresses/repositories/fakes/FakeAddressesRepository';
import FakeCustomersRepository from '../../../src/modules/customers/repositories/fakes/FakeCustomersRepository';
import ListAddressesService from '../../../src/modules/addresses/services/ListAddressesService';

let fakeAddressesRepository: FakeAddressesRepository;
let fakeCustomersRepository: FakeCustomersRepository;
let listAddressesService: ListAddressesService;

describe('List Addresses Service', () => {
  beforeEach(() => {
    fakeAddressesRepository = new FakeAddressesRepository();
    fakeCustomersRepository = new FakeCustomersRepository();
    listAddressesService = new ListAddressesService(fakeAddressesRepository, fakeCustomersRepository);
  });

  it('should be able to list all customer addresses', async () => {
    const { id: customer_id } = await fakeCustomersRepository.create({
      name: 'Greyson Mascarenhas Santos Filho',
      phone: '82999999999',
      email: 'greysonmrx@gmail.com',
    });

    await fakeAddressesRepository.create({
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
      listAddressesService.execute({
        customer_id,
      }),
    ).resolves.toHaveLength(1);
  });

  it('should not be able to list all addresses with a non-existing customer', async () => {
    await expect(
      listAddressesService.execute({
        customer_id: v4(),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
