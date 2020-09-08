import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import IAddressesRepository from '../repositories/IAddressesRepository';
import Address from '../entities/fakes/Address';

interface Request {
  customer_id: string;
  name?: string;
  street: string;
  neighborhood: string;
  number?: string;
  city: string;
  state: string;
  complement?: string;
  latitude: number;
  longitude: number;
}

@injectable()
class CreateAddressService {
  constructor(
    @inject('AddressesRepository')
    private addressesRepository: IAddressesRepository,

    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {
    // Anything
  }

  public async execute({
    customer_id,
    name,
    street,
    neighborhood,
    number,
    city,
    state,
    complement,
    latitude,
    longitude,
  }: Request): Promise<Address> {
    const customerExists = await this.customersRepository.findById(customer_id);

    if (!customerExists) {
      throw new AppError('Cliente não encontrado.', 404);
    }

    const address = await this.addressesRepository.create({
      customer_id,
      name,
      number,
      city,
      latitude,
      longitude,
      neighborhood,
      state,
      street,
      complement,
    });

    return address;
  }
}

export default CreateAddressService;
