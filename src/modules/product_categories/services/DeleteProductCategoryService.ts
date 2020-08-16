import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ITenantsRepository from '@modules/tenants/repositories/ITenantsRepository';

import IProductCategoriesRepository from '../repositories/IProductCategoriesRepository';

interface Request {
  id: string;
  tenant_id: string;
}

@injectable()
class DeleteProductCategoryService {
  constructor(
    @inject('ProductCategoriesRepository')
    private productCategoriesRepository: IProductCategoriesRepository,

    @inject('TenantsRepository')
    private tenantsRepository: ITenantsRepository,
  ) {
    /* Anything */
  }

  public async execute({ id, tenant_id }: Request): Promise<void> {
    const checkTenantExists = await this.tenantsRepository.findById(tenant_id);

    if (!checkTenantExists) {
      throw new AppError('Loja não encontrada.', 404);
    }

    const productCategory = await this.productCategoriesRepository.findById({ id, tenant_id });

    if (!productCategory) {
      throw new AppError('Categoria não encontrada.', 404);
    }

    await this.productCategoriesRepository.delete(productCategory.id);
  }
}

export default DeleteProductCategoryService;
