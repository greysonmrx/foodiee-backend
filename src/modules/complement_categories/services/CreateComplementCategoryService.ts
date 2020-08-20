import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';

import IComplementCategoriesRepository from '../repositories/IComplementCategoriesRepository';
import ComplementCategory from '../entities/fakes/ComplementCategory';

interface Request {
  name: string;
  min: number;
  max: number;
  required: boolean;
  product_id: string;
  tenant_id: string;
}

@injectable()
class CreateComplementCategoryService {
  constructor(
    @inject('ComplementCategoriesRepository')
    private complementCategoriesRepository: IComplementCategoriesRepository,

    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
  ) {
    /* Anything */
  }

  public async execute({ name, max, min, product_id, required, tenant_id }: Request): Promise<ComplementCategory> {
    const productExists = await this.productsRepository.findById({ id: product_id, tenant_id });

    if (!productExists) {
      throw new AppError('Produto não encontrado.', 404);
    }

    if (required && !min) {
      throw new AppError('A quantidade mínima de produtos precisa ser maior do que zero.');
    }

    const complementCategory = await this.complementCategoriesRepository.create({
      name,
      min,
      max,
      product_id,
      required,
    });

    return complementCategory;
  }
}

export default CreateComplementCategoryService;
