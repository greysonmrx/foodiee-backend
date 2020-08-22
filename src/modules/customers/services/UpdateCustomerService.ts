import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Customer from '../entities/fakes/Customer';
import ICustomersRepository from '../repositories/ICustomersRepository';

interface Request {
  id: string;
  name: string;
  phone: string;
  social_security?: string;
}

@injectable()
class UpdateCustomerService {
  constructor(
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {
    /* Anything */
  }

  public async execute({ id, name, phone, social_security }: Request): Promise<Customer> {
    const customer = await this.customersRepository.findById(id);

    if (!customer) {
      throw new AppError('Cliente não encontrado.', 404);
    }

    const customerExistsWithPhone = await this.customersRepository.findByPhone(phone);

    if (customerExistsWithPhone && customerExistsWithPhone.id !== id) {
      throw new AppError('Este telefone já está em uso. Tente outro.');
    }

    Object.assign(customer, {
      name,
      phone,
      social_security,
    });

    await this.customersRepository.update(customer);

    return customer;
  }
}

export default UpdateCustomerService;
