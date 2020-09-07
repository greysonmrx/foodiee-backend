import IAddress from '../entities/IAddress';

import ICreateAddressesDTO from '../dtos/ICreateAddressesDTO';

interface IAddressesRepository {
  findById(id: string): Promise<IAddress | undefined>;
  create(data: ICreateAddressesDTO): Promise<IAddress>;
  update(address: IAddress): Promise<IAddress>;
}

export default IAddressesRepository;
