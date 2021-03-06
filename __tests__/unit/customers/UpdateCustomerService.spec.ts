import { v4 } from 'uuid';

import AppError from '../../../src/shared/errors/AppError';

import FakeCustomersRepository from '../../../src/modules/customers/repositories/fakes/FakeCustomersRepository';
import UpdateCustomerService from '../../../src/modules/customers/services/UpdateCustomerService';

let fakeCustomersRepository: FakeCustomersRepository;
let updateCustomer: UpdateCustomerService;

describe('Update Customer Service', () => {
  beforeEach(() => {
    fakeCustomersRepository = new FakeCustomersRepository();
    updateCustomer = new UpdateCustomerService(fakeCustomersRepository);
  });

  it('should be able to update customer', async () => {
    const { id } = await fakeCustomersRepository.create({
      name: 'Greyson Mascarenhas Santos Filho',
      phone: '82999999999',
      email: 'greysonmrx@gmail.com',
    });

    const customer = await updateCustomer.execute({
      id,
      name: 'Lucas Macedo da Silva',
      phone: '82888888888',
      social_security: '80837744563',
    });

    expect(customer).toHaveProperty('id');
  });

  it('should not be able to update a non-existing customer', async () => {
    await expect(
      updateCustomer.execute({
        id: v4(),
        name: 'Lucas Macedo da Silva',
        phone: '82888888888',
        social_security: '80837744563',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update customer with duplicate phone', async () => {
    await fakeCustomersRepository.create({
      name: 'Greyson Mascarenhas Santos Filho',
      phone: '82999999999',
      email: 'greysonmrx@gmail.com',
    });

    const { id } = await fakeCustomersRepository.create({
      name: 'Lucas Macedo da Silva',
      phone: '82888888888',
      email: 'lucasmacedo@gmail.com',
    });

    await expect(
      updateCustomer.execute({
        id,
        name: 'Greyson Mascarenhas Santos Filho',
        phone: '82999999999',
        social_security: '80837744563',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
