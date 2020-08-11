import { Repository, getRepository } from 'typeorm';

import IProductCategoriesRepository from '@modules/product_categories/repositories/IProductCategoriesRepository';
import IFindProductCategoriesByNameDTO from '@modules/product_categories/dtos/IFindProductCategoriesByNameDTO';
import ICreateProductCategoriesDTO from '@modules/product_categories/dtos/ICreateProductCategoriesDTO';

import ProductCategory from '../entities/ProductCategory';

class ProductCategoriesRepository implements IProductCategoriesRepository {
  private ormRepository: Repository<ProductCategory>;

  constructor() {
    this.ormRepository = getRepository(ProductCategory);
  }

  public async findByName({ name, tenant_id }: IFindProductCategoriesByNameDTO): Promise<ProductCategory | undefined> {
    const findProductCategory = await this.ormRepository.findOne({
      where: { name, tenant_id },
    });

    return findProductCategory;
  }

  public async create({ name, tenant_id }: ICreateProductCategoriesDTO): Promise<ProductCategory> {
    const produtCategory = this.ormRepository.create({ name, tenant_id });

    await this.ormRepository.save(produtCategory);

    return produtCategory;
  }
}

export default ProductCategoriesRepository;
