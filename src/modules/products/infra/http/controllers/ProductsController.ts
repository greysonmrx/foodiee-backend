import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateProductService from '@modules/products/services/CreateProductService';

class ProductsController {
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
}

export default ProductsController;
