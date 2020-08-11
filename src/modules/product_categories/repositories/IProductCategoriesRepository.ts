import IProductCategory from '../entities/IProductCategory';

import ICreateProductCategoriesDTO from '../dtos/ICreateProductCategoriesDTO';
import IFindProductCategoriesByNameDTO from '../dtos/IFindProductCategoriesByNameDTO';
import IFindProductCategoriesByIdDTO from '../dtos/IFindProductCategoriesByIdDTO';

interface IProductCategoriesRepository {
  findById(data: IFindProductCategoriesByIdDTO): Promise<IProductCategory | undefined>;
  findByName(data: IFindProductCategoriesByNameDTO): Promise<IProductCategory | undefined>;
  findAll(tenant_id: string): Promise<IProductCategory[]>;
  create(data: ICreateProductCategoriesDTO): Promise<IProductCategory>;
  update(productCategory: IProductCategory): Promise<IProductCategory>;
}

export default IProductCategoriesRepository;
