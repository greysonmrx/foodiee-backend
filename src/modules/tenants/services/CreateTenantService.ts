import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ITenantsRepository from '../repositories/ITenantsRepository';
import ITenant from '../entities/ITenant';

interface Request {
  name: string;
  slug: string;
}

@injectable()
class CreateTenantService {
  constructor(
    @inject('TenantsRepository')
    private tenantsRepository: ITenantsRepository,
  ) {
    /* Anything */
  }

  public async execute({ name, slug }: Request): Promise<ITenant> {
    const tenantExistsWithSlug = await this.tenantsRepository.findBySlug(slug);

    if (tenantExistsWithSlug) {
      throw new AppError('Este slug já está em uso. Tente outro.');
    }

    const tenant = await this.tenantsRepository.create({ name, slug });

    return tenant;
  }
}

export default CreateTenantService;
