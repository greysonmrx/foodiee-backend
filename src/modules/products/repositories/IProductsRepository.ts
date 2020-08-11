import IProduct from '../entities/IProduct';

import ICreateProductsDTO from '../dtos/ICreateProductsDTO';

interface IProductsRepository {
  create(data: ICreateProductsDTO): Promise<IProduct>;
}

export default IProductsRepository;
