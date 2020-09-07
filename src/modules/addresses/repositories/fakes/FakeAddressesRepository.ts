import { v4 } from 'uuid';

import Address from '@modules/addresses/entities/fakes/Address';
import ICreateAddressesDTO from '@modules/addresses/dtos/ICreateAddressesDTO';

import IAddressesRepository from '../IAddressesRepository';

class FakeAddressesRepository implements IAddressesRepository {
  private addresses: Address[] = [];

  public async findById(id: string): Promise<Address | undefined> {
    const findAddress = this.addresses.find(address => address.id === id);

    return findAddress;
  }

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

  public async update(address: Address): Promise<Address> {
    const findIndex = this.addresses.findIndex(findAddress => findAddress.id === address.id);

    this.addresses[findIndex] = address;

    return address;
  }
}

export default FakeAddressesRepository;
