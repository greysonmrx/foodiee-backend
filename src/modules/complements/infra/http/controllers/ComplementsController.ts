import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateComplementService from '@modules/complements/services/CreateComplementService';
import UpdateComplementService from '@modules/complements/services/UpdateComplementService';
import DeleteComplementService from '@modules/complements/services/DeleteComplementService';

class ComplementsController {
  public async store(request: Request, response: Response): Promise<Response> {
    const { name, price, category_id } = request.body;

    const createComplement = container.resolve(CreateComplementService);

    const complement = await createComplement.execute({ name, price, category_id });

    return response.status(201).json(complement);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { name, price } = request.body;

    const updateComplement = container.resolve(UpdateComplementService);

    const complement = await updateComplement.execute({ id: request.params.id, name, price });

    return response.status(200).json(complement);
  }

  public async destroy(request: Request, response: Response): Promise<Response> {
    const deleteComplement = container.resolve(DeleteComplementService);

    await deleteComplement.execute({ id: request.params.id });

    return response.status(204).json();
  }
}

export default ComplementsController;
