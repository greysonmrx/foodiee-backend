import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IAddressesRepository from '../repositories/IAddressesRepository';
import Address from '../entities/fakes/Address';

interface Request {
  id: string;
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
class UpdateAddressService {
  constructor(
    @inject('AddressesRepository')
    private addressesRepository: IAddressesRepository,
  ) {
    // Anything
  }

  public async execute({
    id,
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
    const address = await this.addressesRepository.findById(id);

    if (!address) {
      throw new AppError('Endereço não encontrado.', 404);
    }

    Object.assign(address, {
      name,
      street,
      neighborhood,
      number,
      city,
      state,
      complement,
      latitude,
      longitude,
    });

    await this.addressesRepository.update(address);

    return address;
  }
}

export default UpdateAddressService;
