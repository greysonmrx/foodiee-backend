import { inject, injectable } from 'tsyringe';
import { classToClass } from 'class-transformer';

import IUsersRepository from '../repositories/IUsersRepository';
import IUser from '../entities/IUser';

interface Request {
  except_user_id: string;
  tenant_id: string;
}

@injectable()
class ListUsersService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {
    /* Anything */
  }

  public async execute({ except_user_id, tenant_id }: Request): Promise<IUser[]> {
    const users = await this.usersRepository.findAll({ tenant_id, except_user_id, relations: ['avatar'] });

    return classToClass(users);
  }
}

export default ListUsersService;
