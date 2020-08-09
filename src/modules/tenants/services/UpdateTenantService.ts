import { inject, injectable } from 'tsyringe';
import { classToClass } from 'class-transformer';

import AppError from '@shared/errors/AppError';

import ITenantsRepository from '../repositories/ITenantsRepository';
import ITenant from '../entities/ITenant';

interface Request {
  tenant_id: string;
  name: string;
  slug: string;
}

@injectable()
class UpdateTenantService {
  constructor(
    @inject('TenantsRepository')
    private tenantsRepository: ITenantsRepository,
  ) {
    /* Anything */
  }

  public async execute({ tenant_id, name, slug }: Request): Promise<ITenant> {
    const tenant = await this.tenantsRepository.findById(tenant_id);

    if (!tenant) {
      throw new AppError('Loja não encontrada.', 404);
    }

    const tenantExistsWithSlug = await this.tenantsRepository.findBySlug(slug);

    if (tenantExistsWithSlug && tenantExistsWithSlug.id !== tenant_id) {
      throw new AppError('Este slug já está em uso. Tente outro.');
    }

    Object.assign(tenant, { name, slug });

    await this.tenantsRepository.update(tenant);

    return classToClass(tenant);
  }
}

export default UpdateTenantService;
