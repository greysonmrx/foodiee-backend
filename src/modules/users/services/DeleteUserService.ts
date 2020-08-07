import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IUsersRepository from '../repositories/IUsersRepository';

interface Request {
  id: string;
}

@injectable()
class DeleteUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {
    /* Anything */
  }

  public async execute({ id }: Request): Promise<void> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new AppError('Usuário não encontrado.', 404);
    }

    await this.usersRepository.delete(id);
  }
}

export default DeleteUserService;
