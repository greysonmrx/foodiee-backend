import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import { Repository, getRepository } from 'typeorm';
import ICreateCustomersDTO from '@modules/customers/dtos/ICreateCustomersDTO';
import Customer from '../entities/Customer';

class CustomersRepository implements ICustomersRepository {
  private ormRepository: Repository<Customer>;

  constructor() {
    this.ormRepository = getRepository(Customer);
  }

  public async findById(id: string): Promise<Customer | undefined> {
    const customer = await this.ormRepository.findOne({
      where: { id },
    });

    return customer;
  }

  public async findByPhone(phone: string): Promise<Customer | undefined> {
    const customer = await this.ormRepository.findOne({
      where: { phone },
    });

    return customer;
  }

  public async findByEmail(email: string): Promise<Customer | undefined> {
    const customer = await this.ormRepository.findOne({
      where: { email },
    });

    return customer;
  }

  public async create({ name, email, phone }: ICreateCustomersDTO): Promise<Customer> {
    const customer = this.ormRepository.create({
      name,
      phone,
      email,
    });

    await this.ormRepository.save(customer);

    return customer;
  }

  public async update(customer: Customer): Promise<Customer> {
    await this.ormRepository.save(customer);

    return customer;
  }

  public async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }
}

export default CustomersRepository;
