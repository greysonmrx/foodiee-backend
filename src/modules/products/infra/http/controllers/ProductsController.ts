import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProductsService from '@modules/products/services/ListProductsService';
import CreateProductService from '@modules/products/services/CreateProductService';
import UpdateProductService from '@modules/products/services/UpdateProductService';
import DeleteProductService from '@modules/products/services/DeleteProductService';

class ProductsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const listProducts = container.resolve(ListProductsService);

    const products = await listProducts.execute({ tenant_id: request.params.tenant });

    return response.status(200).json(products);
  }

  public async store(request: Request, response: Response): Promise<Response> {
    const { name, description, price, promotion_price, paused, category_id, image_id } = request.body;

    const createProduct = container.resolve(CreateProductService);

    const product = await createProduct.execute({
      name,
      description,
      price,
      promotion_price,
      category_id,
      image_id,
      paused,
      tenant_id: request.params.tenant,
    });

    return response.status(201).json(product);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { id, name, description, price, promotion_price, paused, category_id, image_id } = request.body;
    const { tenant } = request.params;

    const updateProduct = container.resolve(UpdateProductService);

    const product = await updateProduct.execute({
      id,
      name,
      description,
      price,
      promotion_price,
      paused,
      category_id,
      image_id,
      tenant_id: tenant,
    });

    return response.status(200).json(product);
  }

  public async destroy(request: Request, response: Response): Promise<Response> {
    const { product, tenant } = request.params;

    const deleteProduct = container.resolve(DeleteProductService);

    await deleteProduct.execute({ id: product, tenant_id: tenant });

    return response.status(204).json();
  }
}

export default ProductsController;
