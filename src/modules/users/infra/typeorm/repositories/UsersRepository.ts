import { Repository, getRepository, Not } from 'typeorm';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUsersDTO from '@modules/users/dtos/ICreateUsersDTO';

import User from '../entities/User';

class UsersRepository implements IUsersRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
  }

  public async findById(id: string, relations?: Array<string>): Promise<User | undefined> {
    const findUser = await this.ormRepository.findOne({
      where: { id },
      relations,
    });

    return findUser;
  }

  public async findByEmail(email: string, relations?: Array<string>): Promise<User | undefined> {
    const findUser = await this.ormRepository.findOne({ where: { email }, relations });

    return findUser;
  }

  public async findAll(except_user_id?: string, relations?: Array<string>): Promise<User[]> {
    if (except_user_id) {
      return this.ormRepository.find({
        where: { id: Not(except_user_id) },
        relations,
      });
    }

    return this.ormRepository.find();
  }

  public async create({ name, email, password }: ICreateUsersDTO): Promise<User> {
    const user = this.ormRepository.create({
      name,
      email,
      password,
    });

    await this.ormRepository.save(user);

    return user;
  }

  public async update(user: User): Promise<User> {
    await this.ormRepository.save(user);

    return user;
  }

  public async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }
}

export default UsersRepository;
