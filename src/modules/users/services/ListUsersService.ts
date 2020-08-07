import { inject, injectable } from 'tsyringe';
import { classToClass } from 'class-transformer';

import IUsersRepository from '../repositories/IUsersRepository';
import IUser from '../entities/IUser';

interface Request {
  except_user_id: string;
}

@injectable()
class ListUsersService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {
    /* Anything */
  }

  public async execute({ except_user_id }: Request): Promise<IUser[]> {
    const users = await this.usersRepository.findAll(except_user_id);

    return classToClass(users);
  }
}

export default ListUsersService;
