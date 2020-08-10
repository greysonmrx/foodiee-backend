import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateTenantService from '@modules/tenants/services/CreateTenantService';
import UpdateTenantService from '@modules/tenants/services/UpdateTenantService';
import DeleteTenantService from '@modules/tenants/services/DeleteTenantService';
import ListTenantsService from '@modules/tenants/services/ListTenantsService';

class TenantsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const listTenants = container.resolve(ListTenantsService);

    const tenants = await listTenants.execute();

    return response.status(200).json(tenants);
  }

  public async store(request: Request, response: Response): Promise<Response> {
    const { name, slug } = request.body;

    const createTenant = container.resolve(CreateTenantService);

    const tenant = await createTenant.execute({ name, slug });

    return response.status(201).json(tenant);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { name, slug } = request.body;

    const updateTenant = container.resolve(UpdateTenantService);

    const tenant = await updateTenant.execute({ tenant_id: request.params.id, name, slug });

    return response.status(200).json(tenant);
  }

  public async destroy(request: Request, response: Response): Promise<Response> {
    const deleteTenant = container.resolve(DeleteTenantService);

    await deleteTenant.execute({ tenant_id: request.params.id });

    return response.status(204).json();
  }
}

export default TenantsController;
