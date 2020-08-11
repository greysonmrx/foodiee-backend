import ProductCategory from '@modules/product_categories/entities/fakes/ProductCategory';
import ICreateProductCategoriesDTO from '@modules/product_categories/dtos/ICreateProductCategoriesDTO';
import IFindProductCategoriesByNameDTO from '@modules/product_categories/dtos/IFindProductCategoriesByNameDTO';

import IFindProductCategoriesByIdDTO from '@modules/product_categories/dtos/IFindProductCategoriesByIdDTO';
import IProductCategoriesRepository from '../IProductCategoriesRepository';

class FakeProductCategoriesRepository implements IProductCategoriesRepository {
  private productCategories: ProductCategory[] = [];

  public async findById({ id, tenant_id }: IFindProductCategoriesByIdDTO): Promise<ProductCategory | undefined> {
    const findProductCategory = this.productCategories.find(
      productCategory => productCategory.id === id && productCategory.tenant_id === tenant_id,
    );

    return findProductCategory;
  }

  public async findByName({ name, tenant_id }: IFindProductCategoriesByNameDTO): Promise<ProductCategory | undefined> {
    const findProductCategory = this.productCategories.find(
      productCategory => productCategory.name === name && productCategory.tenant_id === tenant_id,
    );

    return findProductCategory;
  }

  public async findAll(tenant_id: string): Promise<ProductCategory[]> {
    const findProductCategories = this.productCategories.filter(
      productCategory => productCategory.tenant_id === tenant_id,
    );

    return findProductCategories;
  }

  public async create({ name, tenant_id }: ICreateProductCategoriesDTO): Promise<ProductCategory> {
    const productCategory = new ProductCategory();

    Object.assign(productCategory, { name, tenant_id });

    this.productCategories.push(productCategory);

    return productCategory;
  }

  public async update(productCateogry: ProductCategory): Promise<ProductCategory> {
    const findIndex = this.productCategories.findIndex(
      findProductCategory => findProductCategory.id === productCateogry.id,
    );

    this.productCategories[findIndex] = productCateogry;

    return productCateogry;
  }
}

export default FakeProductCategoriesRepository;
