import AppError from '../../../src/shared/errors/AppError';

import FakeCustomersRepository from '../../../src/modules/customers/repositories/fakes/FakeCustomersRepository';
import FakeCustomerTokensRepository from '../../../src/modules/customers/repositories/fakes/FakeCustomerTokensRepository';
import FakeSMSProvider from '../../../src/modules/customers/providers/SMSProvider/fakes/FakeSMSProvider';
import SendCustomerTokenService from '../../../src/modules/customers/services/SendCustomerTokenService';

let fakeCustomersRepository: FakeCustomersRepository;
let fakeCustomerTokensRepository: FakeCustomerTokensRepository;
let fakeSMSProvider: FakeSMSProvider;
let sendCustomerToken: SendCustomerTokenService;

describe('Send Customer Token Service', () => {
  beforeEach(() => {
    fakeCustomersRepository = new FakeCustomersRepository();
    fakeCustomerTokensRepository = new FakeCustomerTokensRepository();
    fakeSMSProvider = new FakeSMSProvider();
    sendCustomerToken = new SendCustomerTokenService(
      fakeCustomersRepository,
      fakeCustomerTokensRepository,
      fakeSMSProvider,
    );
  });

  it('should be able to send a customer token', async () => {
    const sendSMS = spyOn(fakeSMSProvider, 'sendSMS');

    const { phone } = await fakeCustomersRepository.create({
      name: 'Greyson Mascarenhas Santos Filho',
      phone: '82999999999',
      email: 'greysonmrx@gmail.com',
    });

    await sendCustomerToken.execute({ phone });

    expect(sendSMS).toBeCalled();
  });

  it('should be able to delete a customer token when send a new one', async () => {
    const deleteCustomerToken = spyOn(fakeCustomerTokensRepository, 'delete');

    const { phone } = await fakeCustomersRepository.create({
      name: 'Greyson Mascarenhas Santos Filho',
      phone: '82999999999',
      email: 'greysonmrx@gmail.com',
    });

    await sendCustomerToken.execute({ phone });

    await sendCustomerToken.execute({ phone });

    expect(deleteCustomerToken).toBeCalled();
  });

  it('should not be able to send a customer token with a non-existing customer', async () => {
    await expect(
      sendCustomerToken.execute({
        phone: '82999999999',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
