import IProduct from '../entities/IProduct';

import ICreateProductsDTO from '../dtos/ICreateProductsDTO';

interface IProductsRepository {
  findAll(tenant_id: string): Promise<IProduct[]>;
  create(data: ICreateProductsDTO): Promise<IProduct>;
}

export default IProductsRepository;
