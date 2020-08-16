import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ITenantsRepository from '@modules/tenants/repositories/ITenantsRepository';

import IProductsRepository from '../repositories/IProductsRepository';
import Product from '../entities/fakes/Product';

interface Request {
  tenant_id: string;
}

@injectable()
class ListProductsService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,

    @inject('TenantsRepository')
    private tenantsRepository: ITenantsRepository,
  ) {
    /* Anything */
  }

  public async execute({ tenant_id }: Request): Promise<Product[]> {
    const checkTenantExists = await this.tenantsRepository.findById(tenant_id);

    if (!checkTenantExists) {
      throw new AppError('Loja não encontrada.', 404);
    }

    const products = await this.productsRepository.findAll(tenant_id);

    return products;
  }
}

export default ListProductsService;
