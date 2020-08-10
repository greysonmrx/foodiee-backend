import { inject, injectable } from 'tsyringe';
import { classToClass } from 'class-transformer';

import AppError from '@shared/errors/AppError';

import IFilesRepository from '@modules/files/repositories/IFilesRepository';
import IStorageProvider from '@modules/files/providers/StorageProvider/models/IStorageProvider';

import ITenantsRepository from '../repositories/ITenantsRepository';
import ITenant from '../entities/ITenant';

interface Request {
  tenant_id: string;
  logo_id: string;
}

@injectable()
class UpdateTenantLogoService {
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

  public async execute({ tenant_id, logo_id }: Request): Promise<ITenant> {
    const tenant = await this.tenantsRepository.findById(tenant_id);

    if (!tenant) {
      throw new AppError('Loja não encontrada.', 404);
    }

    const logo = await this.filesRepository.findById(logo_id);

    if (!logo) {
      throw new AppError('Arquivo não encontrado.', 404);
    }

    const tenantLogoExists = await this.filesRepository.findById(tenant.logo_id);

    if (tenantLogoExists && logo.id !== tenantLogoExists.id) {
      await this.storageProvider.deleteFile(tenantLogoExists.path);
      await this.filesRepository.delete(tenantLogoExists.id);
    }

    Object.assign(tenant, { logo_id });

    await this.tenantsRepository.update(tenant);

    Object.assign(tenant, { logo });

    return classToClass(tenant);
  }
}

export default UpdateTenantLogoService;
