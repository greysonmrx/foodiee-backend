import { Request, Response } from 'express';
import { container } from 'tsyringe';

import UpdateTenantLogoService from '@modules/tenants/services/UpdateTenantLogoService';

class TenantLogoController {
  public async update(request: Request, response: Response): Promise<Response> {
    const updateLogoTenant = container.resolve(UpdateTenantLogoService);

    const tenant = await updateLogoTenant.execute({
      tenant_id: request.params.id,
      logo_id: request.body.logo_id,
    });

    return response.status(200).json(tenant);
  }
}

export default TenantLogoController;
