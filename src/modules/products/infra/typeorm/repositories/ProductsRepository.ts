import { Repository, getRepository } from 'typeorm';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import IFindProductsByIdDTO from '@modules/products/dtos/IFindProductsByIdDTO';
import ICreateProductsDTO from '@modules/products/dtos/ICreateProductsDTO';

import Product from '../entities/Product';

class ProductsRepository implements IProductsRepository {
  private ormRepository: Repository<Product>;

  constructor() {
    this.ormRepository = getRepository(Product);
  }

  public async findById({ id, tenant_id }: IFindProductsByIdDTO): Promise<Product | undefined> {
    const product = await this.ormRepository.findOne({
      where: { id, tenant_id },
    });

    return product;
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

  public async update(product: Product): Promise<Product> {
    await this.ormRepository.save(product);

    return product;
  }

  public async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }
}

export default ProductsRepository;
