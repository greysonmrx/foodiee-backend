import IProductCategory from '../entities/IProductCategory';

import ICreateProductCategoriesDTO from '../dtos/ICreateProductCategoriesDTO';
import IFindProductCategoriesByNameDTO from '../dtos/IFindProductCategoriesByNameDTO';

interface IProductCategoriesRepository {
  findByName(data: IFindProductCategoriesByNameDTO): Promise<IProductCategory | undefined>;
  create(data: ICreateProductCategoriesDTO): Promise<IProductCategory>;
}

export default IProductCategoriesRepository;
