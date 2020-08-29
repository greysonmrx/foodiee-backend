import { v4 } from 'uuid';

import CustomerToken from '@modules/customers/entities/fakes/CustomerToken';
import ICreateCustomerTokensDTO from '@modules/customers/dtos/ICreateCustomerTokensDTO';

import ICustomerTokensRepository from '../ICustomerTokensRepository';

class FakeCustomerTokensRepository implements ICustomerTokensRepository {
  private customerTokens: CustomerToken[] = [];

  public async findByToken(token: string): Promise<CustomerToken | undefined> {
    const findCustomerToken = this.customerTokens.find(customerToken => customerToken.token === token);

    return findCustomerToken;
  }

  public async findByCustomer(customer_id: string): Promise<CustomerToken | undefined> {
    const findCustomerToken = this.customerTokens.find(customer => customer.customer_id === customer_id);

    return findCustomerToken;
  }

  public async generate({ token, customer_id }: ICreateCustomerTokensDTO): Promise<CustomerToken> {
    const customerToken = new CustomerToken();

    Object.assign(customerToken, {
      id: v4(),
      token,
      customer_id,
      created_at: new Date(),
      updated_at: new Date(),
    });

    this.customerTokens.push(customerToken);

    return customerToken;
  }

  public async delete(id: string): Promise<void> {
    this.customerTokens = this.customerTokens.filter(customer => customer.id !== id);
  }
}

export default FakeCustomerTokensRepository;
