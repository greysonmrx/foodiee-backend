import FakeCustomersRepository from '../../../src/modules/customers/repositories/fakes/FakeCustomersRepository';
import CreateCustomerService from '../../../src/modules/customers/services/CreateCustomerService';
import AppError from '../../../src/shared/errors/AppError';

let fakeCustomersRepository: FakeCustomersRepository;
let createCustomer: CreateCustomerService;

describe('Create Customer Service', () => {
  beforeEach(() => {
    fakeCustomersRepository = new FakeCustomersRepository();
    createCustomer = new CreateCustomerService(fakeCustomersRepository);
  });

  it('should be able to create a new customer', async () => {
    const customer = await createCustomer.execute({
      name: 'Greyson Mascarenhas Santos Filho',
      phone: '82999999999',
      email: 'greysonmrx@gmail.com',
    });

    expect(customer).toHaveProperty('id');
  });

  it('should not be able to create two customers with the same phone', async () => {
    await createCustomer.execute({
      name: 'Greyson Mascarenhas Santos Filho',
      phone: '82999999999',
      email: 'greysonmrx@gmail.com',
    });

    await expect(
      createCustomer.execute({
        name: 'Lucas Macedo da Silva',
        phone: '82999999999',
        email: 'lucasmacedo@gmail.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create two customers with the same email', async () => {
    await createCustomer.execute({
      name: 'Greyson Mascarenhas Santos Filho',
      phone: '82996615836',
      email: 'greysonmrx@gmail.com',
    });

    await expect(
      createCustomer.execute({
        name: 'Lucas Macedo da Silva',
        phone: '82888888888',
        email: 'greysonmrx@gmail.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
