import { Repository, getRepository } from 'typeorm';

import IProductCategoriesRepository from '@modules/product_categories/repositories/IProductCategoriesRepository';
import IFindProductCategoriesByNameDTO from '@modules/product_categories/dtos/IFindProductCategoriesByNameDTO';
import ICreateProductCategoriesDTO from '@modules/product_categories/dtos/ICreateProductCategoriesDTO';
import IFindProductCategoriesByIdDTO from '@modules/product_categories/dtos/IFindProductCategoriesByIdDTO';

import ProductCategory from '../entities/ProductCategory';

class ProductCategoriesRepository implements IProductCategoriesRepository {
  private ormRepository: Repository<ProductCategory>;

  constructor() {
    this.ormRepository = getRepository(ProductCategory);
  }

  public async findById({ id, tenant_id }: IFindProductCategoriesByIdDTO): Promise<ProductCategory | undefined> {
    const findProductCategory = await this.ormRepository.findOne({
      where: { id, tenant_id },
    });

    return findProductCategory;
  }

  public async findByName({ name, tenant_id }: IFindProductCategoriesByNameDTO): Promise<ProductCategory | undefined> {
    const findProductCategory = await this.ormRepository.findOne({
      where: { name, tenant_id },
    });

    return findProductCategory;
  }

  public async findAll(tenant_id: string): Promise<ProductCategory[]> {
    const findProductCategories = await this.ormRepository.find({
      where: { tenant_id },
    });

    return findProductCategories;
  }

  public async create({ name, tenant_id }: ICreateProductCategoriesDTO): Promise<ProductCategory> {
    const produtCategory = this.ormRepository.create({ name, tenant_id });

    await this.ormRepository.save(produtCategory);

    return produtCategory;
  }

  public async update(productCategory: ProductCategory): Promise<ProductCategory> {
    await this.ormRepository.save(productCategory);

    return productCategory;
  }
}

export default ProductCategoriesRepository;
