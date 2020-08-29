import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IComplementsRepository from '../repositories/IComplementsRepository';

interface Request {
  id: string;
}

@injectable()
class DeleteComplementService {
  constructor(
    @inject('ComplementsRepository')
    private complementsRepository: IComplementsRepository,
  ) {
    /* Anything */
  }

  public async execute({ id }: Request): Promise<void> {
    const complement = await this.complementsRepository.findById(id);

    if (!complement) {
      throw new AppError('Complemento não encontrado.', 404);
    }

    await this.complementsRepository.delete(id);
  }
}

export default DeleteComplementService;
