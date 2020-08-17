import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListComplementCategoriesService from '@modules/complement_categories/services/ListComplementCategoriesService';
import CreateComplementCategoryService from '@modules/complement_categories/services/CreateComplementCategoryService';
import UpdateComplementCategoryService from '@modules/complement_categories/services/UpdateComplementCategoryService';
import DeleteComplementCategoryService from '@modules/complement_categories/services/DeleteComplementCategoryService';

class ComplementCategoriesController {
  public async index(request: Request, response: Response): Promise<Response> {
    const listComplementCategories = container.resolve(ListComplementCategoriesService);

    const complementCategories = await listComplementCategories.execute({ product_id: request.params.product });

    return response.status(200).json(complementCategories);
  }

  public async store(request: Request, response: Response): Promise<Response> {
    const { name, min, max, required, product_id } = request.body;

    const createComplementCategory = container.resolve(CreateComplementCategoryService);

    const complementCategory = await createComplementCategory.execute({
      name,
      min,
      max,
      required,
      product_id,
      tenant_id: request.params.tenant,
    });

    return response.status(201).json(complementCategory);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { name, min, max, required } = request.body;

    const updateComplementCategory = container.resolve(UpdateComplementCategoryService);

    const complementCategory = await updateComplementCategory.execute({
      id: request.params.id,
      name,
      min,
      max,
      required,
    });

    return response.status(200).json(complementCategory);
  }

  public async destroy(request: Request, response: Response): Promise<Response> {
    const deleteComplementCategory = container.resolve(DeleteComplementCategoryService);

    await deleteComplementCategory.execute({ id: request.params.id });

    return response.status(204).json();
  }
}

export default ComplementCategoriesController;
