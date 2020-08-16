import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IUsersRepository from '../repositories/IUsersRepository';

interface Request {
  id: string;
  tenant_id: string;
}

@injectable()
class DeleteUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {
    /* Anything */
  }

  public async execute({ id, tenant_id }: Request): Promise<void> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new AppError('Usuário não encontrado.', 404);
    }

    if (user.tenant_id !== tenant_id) {
      throw new AppError('Este usuário não faz parte da sua loja.', 401);
    }

    await this.usersRepository.delete(id);
  }
}

export default DeleteUserService;
