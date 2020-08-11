import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ITenantsRepository from '@modules/tenants/repositories/ITenantsRepository';
import IFilesRepository from '@modules/files/repositories/IFilesRepository';
import IProductCategoriesRepository from '@modules/product_categories/repositories/IProductCategoriesRepository';

import IProductsRepository from '../repositories/IProductsRepository';
import Product from '../entities/fakes/Product';

interface Request {
  name: string;
  price: number;
  description: string;
  category_id: string;
  tenant_id: string;
  image_id?: string;
  paused?: boolean;
  promotion_price?: number;
}

@injectable()
class CreateProductService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,

    @inject('TenantsRepository')
    private tenantsRepository: ITenantsRepository,

    @inject('FilesRepository')
    private filesRepository: IFilesRepository,

    @inject('ProductCategoriesRepository')
    private productCategoriesRepository: IProductCategoriesRepository,
  ) {
    /* Anything */
  }

  public async execute({
    name,
    price,
    description,
    category_id,
    tenant_id,
    image_id,
    paused,
    promotion_price,
  }: Request): Promise<Product> {
    const checkTenantExists = await this.tenantsRepository.findById(tenant_id);

    if (!checkTenantExists) {
      throw new AppError('Loja não encontrada.', 404);
    }

    const checkCategoryExists = await this.productCategoriesRepository.findById({ id: category_id, tenant_id });

    if (!checkCategoryExists) {
      throw new AppError('Categoria não encontrada.', 404);
    }

    if (image_id) {
      const checkImageExists = await this.filesRepository.findById(image_id);

      if (!checkImageExists) {
        throw new AppError('Arquivo não encontrado.', 404);
      }
    }

    const product = await this.productsRepository.create({
      name,
      price,
      description,
      category_id,
      tenant_id,
      image_id,
      paused,
      promotion_price,
    });

    return product;
  }
}

export default CreateProductService;
