import AppError from '../../../src/shared/errors/AppError';

import FakeCustomersRepository from '../../../src/modules/customers/repositories/fakes/FakeCustomersRepository';
import FakeCustomerTokensRepository from '../../../src/modules/customers/repositories/fakes/FakeCustomerTokensRepository';
import ValidateCustomerTokenService from '../../../src/modules/customers/services/ValidateCustomerTokenService';

let fakeCustomersRepository: FakeCustomersRepository;
let fakeCustomerTokensRepository: FakeCustomerTokensRepository;
let validateCustomerToken: ValidateCustomerTokenService;

describe('Validate Customer Token Service', () => {
  beforeEach(() => {
    fakeCustomersRepository = new FakeCustomersRepository();
    fakeCustomerTokensRepository = new FakeCustomerTokensRepository();
    validateCustomerToken = new ValidateCustomerTokenService(fakeCustomersRepository, fakeCustomerTokensRepository);
  });

  it('should be able to validate a customer token', async () => {
    const { id: customer_id } = await fakeCustomersRepository.create({
      name: 'Greyson Mascarenhas Santos Filho',
      phone: '82999999999',
      email: 'greysonmrx@gmail.com',
    });

    await fakeCustomerTokensRepository.generate({ token: '9090', customer_id });

    const response = await validateCustomerToken.execute({
      phone: '82999999999',
      token: '9090',
    });

    expect(response).toHaveProperty('token');
    expect(response).toHaveProperty('customer');
  });

  it('should not be able to validate a customer token with a non-existing customer', async () => {
    await expect(
      validateCustomerToken.execute({
        phone: '82999999999',
        token: '9090',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to validate a non-existing customer token', async () => {
    await fakeCustomersRepository.create({
      name: 'Greyson Mascarenhas Santos Filho',
      phone: '82999999999',
      email: 'greysonmrx@gmail.com',
    });

    await expect(
      validateCustomerToken.execute({
        phone: '82999999999',
        token: '9090',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to validate a customer token from a different customer', async () => {
    const { id: customer_id } = await fakeCustomersRepository.create({
      name: 'Greyson Mascarenhas Santos Filho',
      phone: '82999999999',
      email: 'greysonmrx@gmail.com',
    });

    await fakeCustomersRepository.create({
      name: 'Lucas Macedo da Silva',
      phone: '82888888888',
      email: 'lucasmacedo@gmail.com',
    });

    await fakeCustomerTokensRepository.generate({ token: '9090', customer_id });

    await expect(
      validateCustomerToken.execute({
        phone: '82888888888',
        token: '9090',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset the password if passed more than fifteen minutes', async () => {
    const { id: customer_id } = await fakeCustomersRepository.create({
      name: 'Greyson Mascarenhas Santos Filho',
      phone: '82999999999',
      email: 'greysonmrx@gmail.com',
    });

    await fakeCustomerTokensRepository.generate({ token: '9090', customer_id });

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date();

      return customDate.setMinutes(customDate.getMinutes() + 16);
    });

    await expect(
      validateCustomerToken.execute({
        phone: '82999999999',
        token: '9090',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
