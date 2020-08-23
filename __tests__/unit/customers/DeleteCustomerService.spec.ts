import { v4 } from 'uuid';

import AppError from '../../../src/shared/errors/AppError';

import FakeCustomersRepository from '../../../src/modules/customers/repositories/fakes/FakeCustomersRepository';
import DeleteCustomerService from '../../../src/modules/customers/services/DeleteCustomerService';

let fakeCustomersRepository: FakeCustomersRepository;
let deleteCustomer: DeleteCustomerService;

describe('Delete Customer Service', () => {
  beforeEach(() => {
    fakeCustomersRepository = new FakeCustomersRepository();
    deleteCustomer = new DeleteCustomerService(fakeCustomersRepository);
  });

  it('should be able to delete customer', async () => {
    const { id } = await fakeCustomersRepository.create({
      name: 'Greyson Mascarenhas Santos Filho',
      phone: '82999999999',
      email: 'greysonmrx@gmail.com',
    });

    const customer = await deleteCustomer.execute({ id });

    expect(customer).toBe(undefined);
  });

  it('should not be able to delete a non-existing customer', async () => {
    await expect(
      deleteCustomer.execute({
        id: v4(),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
