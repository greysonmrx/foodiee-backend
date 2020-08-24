import CustomerToken from '../entities/fakes/CustomerToken';

import ICreateCustomerTokensDTO from '../dtos/ICreateCustomerTokensDTO';

interface ICustomerTokensRepository {
  findByToken(token: string): Promise<CustomerToken | undefined>;
  findByCustomer(customer_id: string): Promise<CustomerToken | undefined>;
  generate(data: ICreateCustomerTokensDTO): Promise<CustomerToken>;
  delete(id: string): Promise<void>;
}

export default ICustomerTokensRepository;
