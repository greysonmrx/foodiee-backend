import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateCustomerService from '@modules/customers/services/CreateCustomerService';
import UpdateCustomerService from '@modules/customers/services/UpdateCustomerService';
import DeleteCustomerService from '@modules/customers/services/DeleteCustomerService';

class CustomersController {
  public async store(request: Request, response: Response): Promise<Response> {
    const { name, email, phone } = request.body;

    const createCustomer = container.resolve(CreateCustomerService);

    const customer = await createCustomer.execute({ name, email, phone });

    return response.status(201).json(customer);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { name, phone } = request.body;

    const updateCustomer = container.resolve(UpdateCustomerService);

    const customer = await updateCustomer.execute({ id: request.customer.id, name, phone });

    return response.status(200).json(customer);
  }

  public async destroy(request: Request, response: Response): Promise<Response> {
    const deleteCustomer = container.resolve(DeleteCustomerService);

    await deleteCustomer.execute({ id: request.customer.id });

    return response.status(204).json();
  }
}

export default CustomersController;
