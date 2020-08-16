import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ITenantsRepository from '@modules/tenants/repositories/ITenantsRepository';
import IFilesRepository from '@modules/files/repositories/IFilesRepository';
import IProductCategoriesRepository from '@modules/product_categories/repositories/IProductCategoriesRepository';
import IStorageProvider from '@modules/files/providers/StorageProvider/models/IStorageProvider';

import IProductsRepository from '../repositories/IProductsRepository';
import Product from '../entities/fakes/Product';

interface Request {
  id: string;
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
class UpdateProductService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,

    @inject('TenantsRepository')
    private tenantsRepository: ITenantsRepository,

    @inject('FilesRepository')
    private filesRepository: IFilesRepository,

    @inject('ProductCategoriesRepository')
    private productCategoriesRepository: IProductCategoriesRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {
    /* Anything */
  }

  public async execute({
    id,
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

    const product = await this.productsRepository.findById({ id, tenant_id });

    if (!product) {
      throw new AppError('Produto não encontrado.', 404);
    }

    if (image_id) {
      const image = await this.filesRepository.findById(image_id);

      if (!image) {
        throw new AppError('Arquivo não encontrado.', 404);
      }

      if (product.image_id) {
        const currentProductImage = await this.filesRepository.findById(product.image_id);

        if (currentProductImage && image.id !== currentProductImage.id) {
          await this.storageProvider.deleteFile(currentProductImage.path);
          await this.filesRepository.delete(currentProductImage.id);
        }
      }
    }

    Object.assign(product, { name, price, description, category_id, tenant_id, image_id, paused, promotion_price });

    await this.productsRepository.update(product);

    return product;
  }
}

export default UpdateProductService;
