import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ITenantsRepository from '@modules/tenants/repositories/ITenantsRepository';
import IFilesRepository from '@modules/files/repositories/IFilesRepository';
import IStorageProvider from '@modules/files/providers/StorageProvider/models/IStorageProvider';

import IProductsRepository from '../repositories/IProductsRepository';

interface Request {
  id: string;
  tenant_id: string;
}

@injectable()
class DeleteProductService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,

    @inject('TenantsRepository')
    private tenantsRepository: ITenantsRepository,

    @inject('FilesRepository')
    private filesRepository: IFilesRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {
    /* Anything */
  }

  public async execute({ id, tenant_id }: Request): Promise<void> {
    const checkTenantExists = await this.tenantsRepository.findById(tenant_id);

    if (!checkTenantExists) {
      throw new AppError('Loja não encontrada.', 404);
    }

    const product = await this.productsRepository.findById({ id, tenant_id });

    if (!product) {
      throw new AppError('Produto não encontrado.', 404);
    }

    if (product.image_id) {
      const image = await this.filesRepository.findById(product.image_id);

      if (image) {
        await this.storageProvider.deleteFile(image.path);
        await this.filesRepository.delete(image.id);
      }
    }

    await this.productsRepository.delete(id);
  }
}

export default DeleteProductService;
