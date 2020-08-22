import { v4 } from 'uuid';

import Customer from '@modules/customers/entities/fakes/Customer';
import ICreateCustomersDTO from '@modules/customers/dtos/ICreateCustomersDTO';

import ICustomersRepository from '../ICustomersRepository';

class FakeCustomersRepository implements ICustomersRepository {
  private customers: Customer[] = [];

  public async findByPhone(phone: string): Promise<Customer | undefined> {
    const findCustomer = this.customers.find(customer => customer.phone === phone);

    return findCustomer;
  }

  public async findByEmail(email: string): Promise<Customer | undefined> {
    const findCustomer = this.customers.find(customer => customer.email === email);

    return findCustomer;
  }

  public async create({ name, phone, email }: ICreateCustomersDTO): Promise<Customer> {
    const customer = new Customer();

    Object.assign(customer, {
      id: v4(),
      name,
      phone,
      email,
      created_at: String(new Date()),
      updated_at: String(new Date()),
    });

    this.customers.push(customer);

    return customer;
  }
}

export default FakeCustomersRepository;
