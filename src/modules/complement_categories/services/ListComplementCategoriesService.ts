import { inject, injectable } from 'tsyringe';

import IComplementCategoriesRepository from '../repositories/IComplementCategoriesRepository';
import ComplementCategory from '../entities/fakes/ComplementCategory';

interface Request {
  product_id: string;
}

@injectable()
class ListComplementCategoriesService {
  constructor(
    @inject('ComplementCategoriesRepository')
    private complementCategoriesRepository: IComplementCategoriesRepository,
  ) {
    /* Anything */
  }

  public async execute({ product_id }: Request): Promise<ComplementCategory[]> {
    const complementCategories = await this.complementCategoriesRepository.findAll(product_id);

    return complementCategories;
  }
}

export default ListComplementCategoriesService;
