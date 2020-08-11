import { Repository, getRepository } from 'typeorm';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';

import ICreateProductsDTO from '@modules/products/dtos/ICreateProductsDTO';
import Product from '../entities/Product';

class ProductsRepository implements IProductsRepository {
  private ormRepository: Repository<Product>;

  constructor() {
    this.ormRepository = getRepository(Product);
  }

  public async findAll(tenant_id: string): Promise<Product[]> {
    const products = this.ormRepository.find({
      where: { tenant_id },
    });

    return products;
  }

  public async create({
    name,
    price,
    description,
    category_id,
    tenant_id,
    image_id,
    paused,
    promotion_price,
  }: ICreateProductsDTO): Promise<Product> {
    const product = this.ormRepository.create({
      name,
      price,
      description,
      category_id,
      tenant_id,
      image_id,
      paused,
      promotion_price,
    });

    await this.ormRepository.save(product);

    return product;
  }
}

export default ProductsRepository;
