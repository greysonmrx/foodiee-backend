import IProduct from '../entities/IProduct';

import IFindProductsByIdDTO from '../dtos/IFindProductsByIdDTO';
import ICreateProductsDTO from '../dtos/ICreateProductsDTO';

interface IProductsRepository {
  findById(data: IFindProductsByIdDTO): Promise<IProduct | undefined>;
  findAll(tenant_id: string): Promise<IProduct[]>;
  create(data: ICreateProductsDTO): Promise<IProduct>;
  update(product: IProduct): Promise<IProduct>;
}

export default IProductsRepository;
