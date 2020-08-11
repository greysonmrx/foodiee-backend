import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ITenantsRepository from '@modules/tenants/repositories/ITenantsRepository';

import IProductCategoriesRepository from '../repositories/IProductCategoriesRepository';
import IProductCategory from '../entities/IProductCategory';

interface Request {
  tenant_id: string;
}

@injectable()
class ListProductCategoriesService {
  constructor(
    @inject('ProductCategoriesRepository')
    private productCategoriesRepository: IProductCategoriesRepository,

    @inject('TenantsRepository')
    private tenantsRepository: ITenantsRepository,
  ) {
    /* Anything */
  }

  public async execute({ tenant_id }: Request): Promise<IProductCategory[]> {
    const checkTenantExists = await this.tenantsRepository.findById(tenant_id);

    if (!checkTenantExists) {
      throw new AppError('Loja não encontrada.', 404);
    }

    const productCategories = await this.productCategoriesRepository.findAll(tenant_id);

    return productCategories;
  }
}

export default ListProductCategoriesService;
