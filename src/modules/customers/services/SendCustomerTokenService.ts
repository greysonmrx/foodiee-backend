import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ICustomersRepository from '../repositories/ICustomersRepository';
import ICustomerTokensRepository from '../repositories/ICustomerTokensRepository';
import ISMSProvider from '../providers/SMSProvider/models/ISMSProvider';

interface Request {
  phone: string;
}

@injectable()
class SendCustomerTokenService {
  constructor(
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,

    @inject('CustomerTokensRepository')
    private customerTokensRepository: ICustomerTokensRepository,

    @inject('SMSProvider')
    private smsProvider: ISMSProvider,
  ) {
    /* Anything */
  }

  public async execute({ phone }: Request): Promise<void> {
    const customer = await this.customersRepository.findByPhone(phone);

    if (!customer) {
      throw new AppError('Cliente não encontrado.', 404);
    }

    const tokenExists = await this.customerTokensRepository.findByCustomer(customer.id);

    if (tokenExists) {
      await this.customerTokensRepository.delete(tokenExists.id);
    }

    const { token } = await this.customerTokensRepository.generate({
      customer_id: customer.id,
      token: String(Math.floor(Math.random() * (9999 - 1000)) + 1000),
    });

    await this.smsProvider.sendSMS({ to: phone, text: `Seu código de autorização é ${token}` });
  }
}

export default SendCustomerTokenService;
