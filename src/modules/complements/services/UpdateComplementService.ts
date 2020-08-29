import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IComplementsRepository from '../repositories/IComplementsRepository';
import Complement from '../entities/fakes/Complement';

interface Request {
  id: string;
  name: string;
  price: number;
}

@injectable()
class UpdateComplementService {
  constructor(
    @inject('ComplementsRepository')
    private complementsRepository: IComplementsRepository,
  ) {
    /* Anything */
  }

  public async execute({ id, name, price }: Request): Promise<Complement> {
    const complement = await this.complementsRepository.findById(id);

    if (!complement) {
      throw new AppError('Complemento não encontrado.', 404);
    }

    Object.assign(complement, { name, price });

    await this.complementsRepository.update(complement);

    return complement;
  }
}

export default UpdateComplementService;
