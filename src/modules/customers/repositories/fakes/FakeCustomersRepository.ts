import { v4 } from 'uuid';

import Customer from '@modules/customers/entities/fakes/Customer';
import ICreateCustomersDTO from '@modules/customers/dtos/ICreateCustomersDTO';

import ICustomersRepository from '../ICustomersRepository';

class FakeCustomersRepository implements ICustomersRepository {
  private customers: Customer[] = [];

  public async findById(id: string): Promise<Customer | undefined> {
    const findCustomer = this.customers.find(customer => customer.id === id);

    return findCustomer;
  }

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

  public async update(customer: Customer): Promise<Customer> {
    const findIndex = this.customers.findIndex(findCustomer => findCustomer.id === customer.id);

    this.customers[findIndex] = customer;

    return customer;
  }

  public async delete(id: string): Promise<void> {
    this.customers = this.customers.filter(customer => customer.id !== id);
  }
}

export default FakeCustomersRepository;
