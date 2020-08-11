import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateProductCategoryService from '@modules/product_categories/services/CreateProductCategoryService';

class ProductCategoriesController {
  public async store(request: Request, response: Response): Promise<Response> {
    const createProductCategory = container.resolve(CreateProductCategoryService);

    const productCategory = await createProductCategory.execute({
      name: request.body.name,
      tenant_id: request.params.tenant,
    });

    return response.status(201).json(productCategory);
  }
}

export default ProductCategoriesController;
