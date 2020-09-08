import { Repository, getRepository } from 'typeorm';

import IAddressesRepository from '@modules/addresses/repositories/IAddressesRepository';
import ICreateAddressesDTO from '@modules/addresses/dtos/ICreateAddressesDTO';

import Address from '../entities/Address';

class AddressesRepository implements IAddressesRepository {
  private ormRepository: Repository<Address>;

  constructor() {
    this.ormRepository = getRepository(Address);
  }

  public async findById(id: string): Promise<Address | undefined> {
    const address = await this.ormRepository.findOne({ where: { id } });

    return address;
  }

  public async findAllByCustomer(customer_id: string): Promise<Address[]> {
    const addresses = await this.ormRepository.find({ where: { customer_id } });

    return addresses;
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
    const address = this.ormRepository.create({
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
    });

    await this.ormRepository.save(address);

    return address;
  }

  public async update(address: Address): Promise<Address> {
    await this.ormRepository.save(address);

    return address;
  }

  public async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }
}

export default AddressesRepository;
