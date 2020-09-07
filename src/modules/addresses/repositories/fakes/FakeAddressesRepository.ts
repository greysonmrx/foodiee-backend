import { v4 } from 'uuid';

import Address from '@modules/addresses/entities/fakes/Address';
import ICreateAddressesDTO from '@modules/addresses/dtos/ICreateAddressesDTO';

import IAddressesRepository from '../IAddressesRepository';

class FakeAddressesRepository implements IAddressesRepository {
  private addresses: Address[] = [];

  public async create({
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
  }: ICreateAddressesDTO): Promise<Address> {
    const address = new Address();

    Object.assign(address, {
      id: v4(),
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
      created_at: String(new Date()),
      updated_at: String(new Date()),
    });

    this.addresses.push(address);

    return address;
  }
}

export default FakeAddressesRepository;
