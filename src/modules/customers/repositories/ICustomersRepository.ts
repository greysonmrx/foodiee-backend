import ICustomer from '../entities/ICustomer';

import ICreateCustomersDTO from '../dtos/ICreateCustomersDTO';

interface ICustomersRepository {
  findById(id: string): Promise<ICustomer | undefined>;
  findByPhone(phone: string): Promise<ICustomer | undefined>;
  findByEmail(email: string): Promise<ICustomer | undefined>;
  create(data: ICreateCustomersDTO): Promise<ICustomer>;
  update(customer: ICustomer): Promise<ICustomer>;
}

export default ICustomersRepository;
