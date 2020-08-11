import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ITenantsRepository from '@modules/tenants/repositories/ITenantsRepository';

import IProductCategoriesRepository from '../repositories/IProductCategoriesRepository';
import IProductCategory from '../entities/IProductCategory';

interface Request {
  id: string;
  name: string;
  tenant_id: string;
}

@injectable()
class UpdateProductCategoryService {
  constructor(
    @inject('ProductCategoriesRepository')
    private productCategoriesRepository: IProductCategoriesRepository,

    @inject('TenantsRepository')
    private tenantsRepository: ITenantsRepository,
  ) {
    /* Anything */
  }

  public async execute({ id, name, tenant_id }: Request): Promise<IProductCategory> {
    const checkTenantExists = await this.tenantsRepository.findById(tenant_id);

    if (!checkTenantExists) {
      throw new AppError('Loja não encontrada.', 404);
    }

    const productCategory = await this.productCategoriesRepository.findById({ id, tenant_id });

    if (!productCategory) {
      throw new AppError('Categoria não encontrada.', 404);
    }

    const checkProductCategoryExistsWithName = await this.productCategoriesRepository.findByName({ name, tenant_id });

    if (checkProductCategoryExistsWithName) {
      throw new AppError('Esta categoria já existe.');
    }

    Object.assign(productCategory, { name });

    await this.productCategoriesRepository.update(productCategory);

    return productCategory;
  }
}

export default UpdateProductCategoryService;
