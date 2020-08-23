import { inject, injectable } from 'tsyringe';
import { sign } from 'jsonwebtoken';
import { addMinutes, isAfter } from 'date-fns';

import AppError from '@shared/errors/AppError';

import authConfig from '@config/auth';

import ICustomersRepository from '../repositories/ICustomersRepository';
import ICustomer from '../entities/ICustomer';
import ICustomerTokensRepository from '../repositories/ICustomerTokensRepository';

interface Request {
  token: string;
  phone: string;
}

interface Response {
  customer: ICustomer;
  token: string;
}

@injectable()
class ValidateCustomerTokenService {
  constructor(
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,

    @inject('CustomerTokensRepository')
    private customerTokensRepository: ICustomerTokensRepository,
  ) {
    /* Anything */
  }

  public async execute({ token, phone }: Request): Promise<Response> {
    const customer = await this.customersRepository.findByPhone(phone);

    if (!customer) {
      throw new AppError('Cliente não encontrado.', 404);
    }

    const customerToken = await this.customerTokensRepository.findByToken(token);

    if (!customerToken) {
      throw new AppError('Código inválido.', 401);
    }

    if (customerToken.customer_id !== customer.id) {
      throw new AppError('Este código não pertence ao cliente informado.', 401);
    }

    const tokenCraetedAt = customerToken.created_at;
    const compareDate = addMinutes(tokenCraetedAt, 15);

    if (isAfter(Date.now(), compareDate)) {
      throw new AppError('Código expirado.', 401);
    }

    await this.customerTokensRepository.delete(customerToken.id);

    const { secret, expiresIn } = authConfig.jwt;

    const jwtToken = sign({}, secret, {
      subject: customer.id,
      expiresIn,
    });

    return {
      customer,
      token: jwtToken,
    };
  }
}

export default ValidateCustomerTokenService;
