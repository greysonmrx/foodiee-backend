import IProductCategory from '../entities/IProductCategory';

import ICreateProductCategoriesDTO from '../dtos/ICreateProductCategoriesDTO';
import IFindProductCategoriesByNameDTO from '../dtos/IFindProductCategoriesByNameDTO';

interface IProductCategoriesRepository {
  findByName(data: IFindProductCategoriesByNameDTO): Promise<IProductCategory | undefined>;
  findAll(tenant_id: string): Promise<IProductCategory[]>;
  create(data: ICreateProductCategoriesDTO): Promise<IProductCategory>;
}

export default IProductCategoriesRepository;
