import { Repository, getRepository } from 'typeorm';
import ICustomerTokensRepository from '@modules/customers/repositories/ICustomerTokensRepository';
import ICreateCustomerTokensDTO from '@modules/customers/dtos/ICreateCustomerTokensDTO';
import CustomerToken from '../entities/CustomerToken';

class CustomerTokensRepository implements ICustomerTokensRepository {
  private ormRepository: Repository<CustomerToken>;

  constructor() {
    this.ormRepository = getRepository(CustomerToken);
  }

  public async findByToken(token: string): Promise<CustomerToken | undefined> {
    const customerToken = await this.ormRepository.findOne({
      where: { token },
    });

    return customerToken;
  }

  public async findByCustomer(customer_id: string): Promise<CustomerToken | undefined> {
    const customer = await this.ormRepository.findOne({
      where: { customer_id },
    });

    return customer;
  }

  public async generate({ token, customer_id }: ICreateCustomerTokensDTO): Promise<CustomerToken> {
    const customerToken = this.ormRepository.create({ token, customer_id });

    await this.ormRepository.save(customerToken);

    return customerToken;
  }

  public async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }
}

export default CustomerTokensRepository;
