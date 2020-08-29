import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ICustomersRepository from '../repositories/ICustomersRepository';

interface Request {
  id: string;
}

@injectable()
class DeleteCustomerService {
  constructor(
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {
    /* Anything */
  }

  public async execute({ id }: Request): Promise<void> {
    const customer = await this.customersRepository.findById(id);

    if (!customer) {
      throw new AppError('Cliente não encontrado.', 404);
    }

    await this.customersRepository.delete(id);
  }
}

export default DeleteCustomerService;
