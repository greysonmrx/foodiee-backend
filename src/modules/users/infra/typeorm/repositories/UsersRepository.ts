import { Repository, getRepository, Not } from 'typeorm';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUsersDTO from '@modules/users/dtos/ICreateUsersDTO';
import IFindAllUsersDTO from '@modules/users/dtos/IFindAllUsersDTO';

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

  public async findAll({ tenant_id, except_user_id, relations }: IFindAllUsersDTO): Promise<User[]> {
    const users = await this.ormRepository.find({
      where: { id: Not(except_user_id), tenant_id },
      relations,
    });

    return users;
  }

  public async create({ name, email, password, tenant_id }: ICreateUsersDTO): Promise<User> {
    const user = this.ormRepository.create({
      name,
      email,
      password,
      tenant_id,
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
