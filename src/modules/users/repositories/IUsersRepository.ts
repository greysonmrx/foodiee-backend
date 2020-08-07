import IUser from '../entities/IUser';

import ICreateUsersDTO from '../dtos/ICreateUsersDTO';

interface IUsersRepository {
  findById(id: string): Promise<IUser | undefined>;
  findByEmail(email: string): Promise<IUser | undefined>;
  findAll(except_user_id?: string): Promise<IUser[]>;
  create(data: ICreateUsersDTO): Promise<IUser>;
  update(user: IUser): Promise<IUser>;
  delete(id: string): Promise<void>;
}

export default IUsersRepository;
