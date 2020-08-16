import { v4 } from 'uuid';

import ComplementCategory from '@modules/complement_categories/entities/fakes/ComplementCategory';
import ICreateComplementCategoriesDTO from '@modules/complement_categories/dtos/ICreateComplementCategoriesDTO';

import IComplementCategoriesRepository from '../IComplementCategoriesRepository';

class ComplementCategoriesRepository implements IComplementCategoriesRepository {
  private complementCategories: ComplementCategory[] = [];

  public async findById(id: string): Promise<ComplementCategory | undefined> {
    const findComplementCategory = this.complementCategories.find(complementCategory => complementCategory.id === id);

    return findComplementCategory;
  }

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

  public async update(complementCategory: ComplementCategory): Promise<ComplementCategory> {
    const findIndex = this.complementCategories.findIndex(
      findComplementCategory => findComplementCategory.id === complementCategory.id,
    );

    this.complementCategories[findIndex] = complementCategory;

    return complementCategory;
  }

  public async delete(id: string): Promise<void> {
    this.complementCategories = this.complementCategories.filter(complementCategory => complementCategory.id !== id);
  }
}

export default ComplementCategoriesRepository;
