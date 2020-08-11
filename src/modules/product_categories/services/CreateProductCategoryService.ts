import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ITenantsRepository from '@modules/tenants/repositories/ITenantsRepository';

import IProductCategoriesRepository from '../repositories/IProductCategoriesRepository';
import IProductCategory from '../entities/IProductCategory';

interface Request {
  name: string;
  tenant_id: string;
}

@injectable()
class CreateProductCategoryService {
  constructor(
    @inject('ProductCategoriesRepository')
    private productCategoriesRepository: IProductCategoriesRepository,

    @inject('TenantsRepository')
    private tenantsRepository: ITenantsRepository,
  ) {
    /* Anything */
  }

  public async execute({ name, tenant_id }: Request): Promise<IProductCategory> {
    const checkTenantExists = await this.tenantsRepository.findById(tenant_id);

    if (!checkTenantExists) {
      throw new AppError('Loja não encontrada.', 404);
    }

    const checkProductCategoryExists = await this.productCategoriesRepository.findByName({ name, tenant_id });

    if (checkProductCategoryExists) {
      throw new AppError('Esta categoria já existe.');
    }

    const productCategory = await this.productCategoriesRepository.create({ name, tenant_id });

    return productCategory;
  }
}

export default CreateProductCategoryService;
