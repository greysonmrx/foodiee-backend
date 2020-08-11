import Product from '@modules/products/entities/fakes/Product';
import ICreateProductsDTO from '@modules/products/dtos/ICreateProductsDTO';
import IProductsRepository from '../IProductsRepository';

class FakeProductsRepository implements IProductsRepository {
  private products: Product[] = [];

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
}

export default FakeProductsRepository;
