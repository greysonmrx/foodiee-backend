import { v4 } from 'uuid';

import ComplementCategory from '@modules/complement_categories/entities/fakes/ComplementCategory';
import ICreateComplementCategoriesDTO from '@modules/complement_categories/dtos/ICreateComplementCategoriesDTO';

import IComplementCategoriesRepository from '../IComplementCategoriesRepository';

class ComplementCategoriesRepository implements IComplementCategoriesRepository {
  private complementCategories: ComplementCategory[] = [];

  public async create({
    name,
    max,
    min,
    product_id,
    required,
  }: ICreateComplementCategoriesDTO): Promise<ComplementCategory> {
    const complementCategory = new ComplementCategory();

    Object.assign(complementCategory, {
      id: v4(),
      name,
      max,
      min,
      product_id,
      required,
      created_at: String(new Date()),
      updated_at: String(new Date()),
    });

    this.complementCategories.push(complementCategory);

    return complementCategory;
  }
}

export default ComplementCategoriesRepository;
