import Product from '@modules/products/entities/fakes/Product';
import ICreateProductsDTO from '@modules/products/dtos/ICreateProductsDTO';
import IProductsRepository from '../IProductsRepository';

class FakeProductsRepository implements IProductsRepository {
  private products: Product[] = [];

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

    return product;
  }
}

export default FakeProductsRepository;
