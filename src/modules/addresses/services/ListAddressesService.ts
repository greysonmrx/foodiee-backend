import AppError from '@shared/errors/AppError';

import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import IAddressesRepository from '../repositories/IAddressesRepository';
import Address from '../entities/fakes/Address';

interface Request {
  customer_id: string;
}

class ListAddressesService {
  constructor(private addressesRepository: IAddressesRepository, private customersRepository: ICustomersRepository) {
    // Anything
  }

  public async execute({ customer_id }: Request): Promise<Address[]> {
    const customerExists = await this.customersRepository.findById(customer_id);

    if (!customerExists) {
      throw new AppError('Cliente não encontrado.', 404);
    }

    const addresses = await this.addressesRepository.findAllByCustomer(customer_id);

    return addresses;
  }
}

export default ListAddressesService;
