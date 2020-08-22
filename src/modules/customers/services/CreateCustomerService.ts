import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Customer from '../entities/fakes/Customer';
import ICustomersRepository from '../repositories/ICustomersRepository';

interface Request {
  name: string;
  phone: string;
  email: string;
}

@injectable()
class CreateCustomerService {
  constructor(
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {
    /* Anything */
  }

  public async execute({ name, phone, email }: Request): Promise<Customer> {
    const customerExistsWithPhone = await this.customersRepository.findByPhone(phone);

    if (customerExistsWithPhone) {
      throw new AppError('Este telefone já está em uso. Tente outro.');
    }

    const customerExistsWithEmail = await this.customersRepository.findByEmail(email);

    if (customerExistsWithEmail) {
      throw new AppError('Este endereço de e-mail já está em uso. Tente outro.');
    }

    const customer = await this.customersRepository.create({
      name,
      phone,
      email,
    });

    return customer;
  }
}

export default CreateCustomerService;
