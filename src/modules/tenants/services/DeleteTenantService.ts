import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IFilesRepository from '@modules/files/repositories/IFilesRepository';
import IStorageProvider from '@modules/files/providers/StorageProvider/models/IStorageProvider';

import ITenantsRepository from '../repositories/ITenantsRepository';

interface Request {
  tenant_id: string;
}

@injectable()
class DeleteTenantService {
  constructor(
    @inject('TenantsRepository')
    private tenantsRepository: ITenantsRepository,

    @inject('FilesRepository')
    private filesRepository: IFilesRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {
    /* Anything */
  }

  public async execute({ tenant_id }: Request): Promise<void> {
    const tenant = await this.tenantsRepository.findById(tenant_id);

    if (!tenant) {
      throw new AppError('Loja não encontrada.', 404);
    }

    const tenantLogo = await this.filesRepository.findById(tenant.logo_id);

    if (tenantLogo) {
      await this.storageProvider.deleteFile(tenantLogo.path);
      await this.filesRepository.delete(tenantLogo.id);
    }

    await this.tenantsRepository.delete(tenant_id);
  }
}

export default DeleteTenantService;
