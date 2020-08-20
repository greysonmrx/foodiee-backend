import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IComplementCategoriesRepository from '../repositories/IComplementCategoriesRepository';
import ComplementCategory from '../entities/fakes/ComplementCategory';

interface Request {
  id: string;
  name: string;
  min: number;
  max: number;
  required: boolean;
}

@injectable()
class UpdateComplementCategoryService {
  constructor(
    @inject('ComplementCategoriesRepository')
    private complementCategoriesRepository: IComplementCategoriesRepository,
  ) {
    /* Anything */
  }

  public async execute({ id, name, max, min, required }: Request): Promise<ComplementCategory> {
    const complementCategory = await this.complementCategoriesRepository.findById(id);

    if (!complementCategory) {
      throw new AppError('Categoria de complementos não encontrada.', 404);
    }

    if (required && !min) {
      throw new AppError('A quantidade mínima de produtos precisa ser maior do que zero.');
    }

    Object.assign(complementCategory, {
      name,
      min,
      max,
      required,
    });

    await this.complementCategoriesRepository.update(complementCategory);

    return complementCategory;
  }
}

export default UpdateComplementCategoryService;
