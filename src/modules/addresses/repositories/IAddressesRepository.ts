import IAddress from '../entities/IAddress';

import ICreateAddressesDTO from '../dtos/ICreateAddressesDTO';

interface IAddressesRepository {
  create(data: ICreateAddressesDTO): Promise<IAddress>;
}

export default IAddressesRepository;
