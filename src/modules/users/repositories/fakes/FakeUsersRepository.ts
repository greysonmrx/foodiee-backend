import { v4 } from 'uuid';

import User from '@modules/users/entities/fakes/User';
import ICreateUsersDTO from '@modules/users/dtos/ICreateUsersDTO';
import IFindAllUsersByTenantDTO from '@modules/users/dtos/IFindAllUsersDTO';

import IUsersRepository from '../IUsersRepository';

class FakeUsersRepository implements IUsersRepository {
  private users: User[] = [];

  public async findById(id: string): Promise<User | undefined> {
    const findUser = this.users.find(user => user.id === id);

    return findUser;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const findUser = this.users.find(user => user.email === email);

    return findUser;
  }

  public async findAll({ tenant_id, except_user_id }: IFindAllUsersByTenantDTO): Promise<User[]> {
    return this.users.filter(user => user.id !== except_user_id && user.tenant_id === tenant_id);
  }

  public async create({ name, email, password, tenant_id }: ICreateUsersDTO): Promise<User> {
    const user = new User();

    Object.assign(user, {
      id: v4(),
      name,
      email,
      password,
      tenant_id,
      created_at: String(new Date()),
      updated_at: String(new Date()),
    });

    this.users.push(user);

    return user;
  }

  public async update(user: User): Promise<User> {
    const findIndex = this.users.findIndex(findUser => findUser.id === user.id);

    this.users[findIndex] = user;

    return user;
  }

  public async delete(id: string): Promise<void> {
    this.users.filter(user => user.id !== id);
  }
}

export default FakeUsersRepository;
