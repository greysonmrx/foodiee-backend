import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IComplementCategoriesRepository from '@modules/complement_categories/repositories/IComplementCategoriesRepository';

import IComplementsRepository from '../repositories/IComplementsRepository';
import Complement from '../entities/fakes/Complement';

interface Request {
  name: string;
  price: number;
  category_id: string;
}

@injectable()
class CreateComplementService {
  constructor(
    @inject('ComplementsRepository')
    private complementsRepository: IComplementsRepository,

    @inject('ComplementCategoriesRepository')
    private complementCategoriesRepository: IComplementCategoriesRepository,
  ) {
    /* Anything */
  }

  public async execute({ name, price, category_id }: Request): Promise<Complement> {
    const complementCategoryExists = await this.complementCategoriesRepository.findById(category_id);

    if (!complementCategoryExists) {
      throw new AppError('Categoria de complementos não encontrada.', 404);
    }

    const complement = await this.complementsRepository.create({
      name,
      price,
      category_id,
    });

    return complement;
  }
}

export default CreateComplementService;
