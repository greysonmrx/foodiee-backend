import ProductCategory from '@modules/product_categories/entities/fakes/ProductCategory';
import ICreateProductCategoriesDTO from '@modules/product_categories/dtos/ICreateProductCategoriesDTO';
import IFindProductCategoriesByNameDTO from '@modules/product_categories/dtos/IFindProductCategoriesByNameDTO';

import IProductCategoriesRepository from '../IProductCategoriesRepository';

class FakeProductCategoriesRepository implements IProductCategoriesRepository {
  private productCategories: ProductCategory[] = [];

  public async findByName({ name, tenant_id }: IFindProductCategoriesByNameDTO): Promise<ProductCategory | undefined> {
    const findProductCategory = this.productCategories.find(
      productCategory => productCategory.name === name && productCategory.tenant_id === tenant_id,
    );

    return findProductCategory;
  }

  public async create({ name, tenant_id }: ICreateProductCategoriesDTO): Promise<ProductCategory> {
    const productCategory = new ProductCategory();

    Object.assign(productCategory, { name, tenant_id });

    this.productCategories.push(productCategory);

    return productCategory;
  }
}

export default FakeProductCategoriesRepository;
