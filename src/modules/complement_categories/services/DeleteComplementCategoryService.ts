import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IComplementCategoriesRepository from '../repositories/IComplementCategoriesRepository';

interface Request {
  id: string;
}

@injectable()
class DeleteComplementCategoryService {
  constructor(
    @inject('ComplementCategoriesRepository')
    private complementCategoriesRepository: IComplementCategoriesRepository,
  ) {
    /* Anything */
  }

  public async execute({ id }: Request): Promise<void> {
    const complementCategory = await this.complementCategoriesRepository.findById(id);

    if (!complementCategory) {
      throw new AppError('Categoria de complementos não encontrada.', 404);
    }

    await this.complementCategoriesRepository.delete(complementCategory.id);
  }
}

export default DeleteComplementCategoryService;
