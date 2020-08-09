import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ITenantsRepository from '../repositories/ITenantsRepository';

interface Request {
  tenant_id: string;
}

@injectable()
class DeleteTenantService {
  constructor(
    @inject('TenantsRepository')
    private tenantsRepository: ITenantsRepository,
  ) {
    /* Anything */
  }

  public async execute({ tenant_id }: Request): Promise<void> {
    const tenant = await this.tenantsRepository.findById(tenant_id);

    if (!tenant) {
      throw new AppError('Loja não encontrada.', 404);
    }

    await this.tenantsRepository.delete(tenant_id);
  }
}

export default DeleteTenantService;
