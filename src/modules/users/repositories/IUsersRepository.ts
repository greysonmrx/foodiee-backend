import IUser from '../entities/IUser';

import ICreateUsersDTO from '../dtos/ICreateUsersDTO';

interface IUsersRepository {
  findById(id: string, relations?: Array<string>): Promise<IUser | undefined>;
  findByEmail(email: string, relations?: Array<string>): Promise<IUser | undefined>;
  findAll(except_user_id?: string, relations?: Array<string>): Promise<IUser[]>;
  create(data: ICreateUsersDTO): Promise<IUser>;
  update(user: IUser): Promise<IUser>;
  delete(id: string): Promise<void>;
}

export default IUsersRepository;
