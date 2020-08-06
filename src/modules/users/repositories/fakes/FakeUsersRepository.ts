import { v4 } from 'uuid';

import User from '@modules/users/entities/fakes/User';
import ICreateUsersDTO from '@modules/users/dtos/ICreateUsersDTO';

import IUsersRepository from '../IUsersRepository';

class FakeUsersRepository implements IUsersRepository {
  private users: User[] = [];

  public async findByEmail(email: string): Promise<User | undefined> {
    const findUser = this.users.find(user => user.email === email);

    return findUser;
  }

  public async create({ name, email, password }: ICreateUsersDTO): Promise<User> {
    const user = new User();

    Object.assign(user, {
      id: v4(),
      name,
      email,
      password,
      created_at: String(new Date()),
      updated_at: String(new Date()),
    });

    this.users.push(user);

    return user;
  }
}

export default FakeUsersRepository;
