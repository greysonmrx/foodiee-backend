import { Repository, getRepository } from 'typeorm';

import IComplementCategoriesRepository from '@modules/complement_categories/repositories/IComplementCategoriesRepository';

import ICreateComplementCategoriesDTO from '@modules/complement_categories/dtos/ICreateComplementCategoriesDTO';
import ComplementCategory from '../entities/ComplementCategory';

class ComplementCategoriesRepository implements IComplementCategoriesRepository {
  private ormRepository: Repository<ComplementCategory>;

  constructor() {
    this.ormRepository = getRepository(ComplementCategory);
  }

  public async findById(id: string): Promise<ComplementCategory | undefined> {
    const complementCategory = await this.ormRepository.findOne({ where: { id } });

    return complementCategory;
  }

  public async findAll(product_id: string): Promise<ComplementCategory[]> {
    const complementCategories = await this.ormRepository.find({ where: { product_id } });

    return complementCategories;
  }

  public async create({
    name,
    max,
    min,
    product_id,
    required,
  }: ICreateComplementCategoriesDTO): Promise<ComplementCategory> {
    const complementCategory = this.ormRepository.create({ name, max, min, product_id, required });

    await this.ormRepository.save(complementCategory);

    return complementCategory;
  }

  public async update(complementCategory: ComplementCategory): Promise<ComplementCategory> {
    await this.ormRepository.save(complementCategory);

    return complementCategory;
  }

  public async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }
}

export default ComplementCategoriesRepository;
