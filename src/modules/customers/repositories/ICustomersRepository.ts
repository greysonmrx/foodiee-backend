import ICustomer from '../entities/ICustomer';

import ICreateCustomersDTO from '../dtos/ICreateCustomersDTO';

interface ICustomersRepository {
  findByPhone(phone: string): Promise<ICustomer | undefined>;
  findByEmail(email: string): Promise<ICustomer | undefined>;
  create(data: ICreateCustomersDTO): Promise<ICustomer>;
}

export default ICustomersRepository;
