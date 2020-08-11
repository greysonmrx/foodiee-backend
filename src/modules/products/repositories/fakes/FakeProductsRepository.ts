import Product from '@modules/products/entities/fakes/Product';
import ICreateProductsDTO from '@modules/products/dtos/ICreateProductsDTO';
import IFindProductsByIdDTO from '@modules/products/dtos/IFindProductsByIdDTO';

import IProductsRepository from '../IProductsRepository';

class FakeProductsRepository implements IProductsRepository {
  private products: Product[] = [];

  public async findById({ id, tenant_id }: IFindProductsByIdDTO): Promise<Product | undefined> {
    const findProduct = this.products.find(product => product.id === id && product.tenant_id === tenant_id);

    return findProduct;
  }

  public async findAll(tenant_id: string): Promise<Product[]> {
    const findProducts = this.products.filter(product => product.tenant_id === tenant_id);

    return findProducts;
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
    const product = new Product();

    Object.assign(product, {
      name,
      price,
      description,
      category_id,
      tenant_id,
      image_id,
      paused,
      promotion_price,
    });

    this.products.push(product);

    return product;
  }

  public async update(product: Product): Promise<Product> {
    const findIndex = this.products.findIndex(findProduct => findProduct.id === product.id);

    this.products[findIndex] = product;

    return product;
  }

  public async delete(id: string): Promise<void> {
    this.products = this.products.filter(product => product.id === id);
  }
}

export default FakeProductsRepository;
