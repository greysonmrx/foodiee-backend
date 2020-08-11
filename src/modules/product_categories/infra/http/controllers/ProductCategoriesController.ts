import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProductCategoriesService from '@modules/product_categories/services/ListProductCategoriesService';
import CreateProductCategoryService from '@modules/product_categories/services/CreateProductCategoryService';
import UpdateProductCategoryService from '@modules/product_categories/services/UpdateProductCategoryService';
import DeleteProductCategoryService from '@modules/product_categories/services/DeleteProductCategoryService';

class ProductCategoriesController {
  public async index(request: Request, response: Response): Promise<Response> {
    const listProductCategories = container.resolve(ListProductCategoriesService);

    const productCategories = await listProductCategories.execute({ tenant_id: request.params.tenant });

    return response.status(200).json(productCategories);
  }

  public async store(request: Request, response: Response): Promise<Response> {
    const createProductCategory = container.resolve(CreateProductCategoryService);

    const productCategory = await createProductCategory.execute({
      name: request.body.name,
      tenant_id: request.params.tenant,
    });

    return response.status(201).json(productCategory);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { id, name } = request.body;

    const updateProductCategory = container.resolve(UpdateProductCategoryService);

    const productCategory = await updateProductCategory.execute({
      id,
      name,
      tenant_id: request.params.tenant,
    });

    return response.status(200).json(productCategory);
  }

  public async destroy(request: Request, response: Response): Promise<Response> {
    const { product_category: id, tenant } = request.params;

    const deleteProductCategory = container.resolve(DeleteProductCategoryService);

    await deleteProductCategory.execute({ id, tenant_id: tenant });

    return response.status(204).json();
  }
}

export default ProductCategoriesController;
