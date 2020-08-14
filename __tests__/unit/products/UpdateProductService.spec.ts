import { v4 } from 'uuid';

import AppError from '../../../src/shared/errors/AppError';

import FakeStorageProvider from '../../../src/modules/files/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeProductCategoriesRepository from '../../../src/modules/product_categories/repositories/fakes/FakeProductCategoriesRepository';
import FakeTenantsRepository from '../../../src/modules/tenants/repositories/fakes/FakeTenantsRepository';
import FakeProductsRepository from '../../../src/modules/products/repositories/fakes/FakeProductsRepository';
import FakeFilesRespository from '../../../src/modules/files/repositories/fakes/FakeFilesRepository';
import UpdateProductService from '../../../src/modules/products/services/UpdateProductService';

let fakeStorageProvider: FakeStorageProvider;
let fakeTenantsRepository: FakeTenantsRepository;
let fakeProductCategoriesRepository: FakeProductCategoriesRepository;
let fakeProductsRepository: FakeProductsRepository;
let fakeFilesRespository: FakeFilesRespository;
let updateProduct: UpdateProductService;

describe('Update Product Service', () => {
  beforeEach(() => {
    fakeStorageProvider = new FakeStorageProvider();
    fakeProductCategoriesRepository = new FakeProductCategoriesRepository();
    fakeTenantsRepository = new FakeTenantsRepository();
    fakeProductsRepository = new FakeProductsRepository();
    fakeFilesRespository = new FakeFilesRespository();
    updateProduct = new UpdateProductService(
      fakeProductsRepository,
      fakeTenantsRepository,
      fakeFilesRespository,
      fakeProductCategoriesRepository,
      fakeStorageProvider,
    );
  });

  it('should be able to update a product', async () => {
    const { id: tenant_id } = await fakeTenantsRepository.create({
      name: "McDonald's",
      slug: 'mc-donalds',
    });

    const { id: category_id } = await fakeProductCategoriesRepository.create({
      name: 'Pizza',
      tenant_id,
    });

    const { id: image_id } = await fakeFilesRespository.create({
      name: 'fileName.png',
      path: 'filePath.png',
    });

    const product = await fakeProductsRepository.create({
      name: 'Pizza de peperone',
      description: 'Uma pizza muito saborosa com os melhores ingredientes do mercado.',
      price: 80.5,
      promotion_price: 60,
      category_id,
      image_id,
      tenant_id,
      paused: false,
    });

    await expect(
      updateProduct.execute({
        ...product,
        id: product.id,
      }),
    ).resolves.toHaveProperty('id');
  });

  it('should be able to delete a product image when updating a product with a new image', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const { id: tenant_id } = await fakeTenantsRepository.create({
      name: "McDonald's",
      slug: 'mc-donalds',
    });

    const { id: category_id } = await fakeProductCategoriesRepository.create({
      name: 'Pizza',
      tenant_id,
    });

    const { id: image_id_1 } = await fakeFilesRespository.create({
      name: 'fileName1.png',
      path: 'filePath1.png',
    });

    const product = await fakeProductsRepository.create({
      name: 'Pizza de peperone',
      description: 'Uma pizza muito saborosa com os melhores ingredientes do mercado.',
      price: 80.5,
      promotion_price: 60,
      category_id,
      image_id: image_id_1,
      tenant_id,
      paused: false,
    });

    const { id: image_id_2 } = await fakeFilesRespository.create({
      name: 'fileName2.png',
      path: 'filePath2.png',
    });

    await expect(
      updateProduct.execute({
        ...product,
        id: product.id,
        image_id: image_id_2,
      }),
    ).resolves.toHaveProperty('id');

    expect(deleteFile).toHaveBeenCalledWith('filePath1.png');
  });

  it('should not be able to update a product with a non-existing tenant', async () => {
    const { id: category_id } = await fakeProductCategoriesRepository.create({
      name: 'Pizza',
      tenant_id: v4(),
    });

    const { id: image_id } = await fakeFilesRespository.create({
      name: 'fileName.png',
      path: 'filePath.png',
    });

    const product = await fakeProductsRepository.create({
      name: 'Pizza de peperone',
      description: 'Uma pizza muito saborosa com os melhores ingredientes do mercado.',
      price: 80.5,
      promotion_price: 60,
      category_id,
      image_id,
      tenant_id: v4(),
      paused: false,
    });

    await expect(
      updateProduct.execute({
        ...product,
        id: product.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update a product with a non-existing category', async () => {
    const { id: tenant_id } = await fakeTenantsRepository.create({
      name: "McDonald's",
      slug: 'mc-donalds',
    });

    const { id: image_id } = await fakeFilesRespository.create({
      name: 'fileName.png',
      path: 'filePath.png',
    });

    const product = await fakeProductsRepository.create({
      name: 'Pizza de peperone',
      description: 'Uma pizza muito saborosa com os melhores ingredientes do mercado.',
      price: 80.5,
      promotion_price: 60,
      category_id: v4(),
      image_id,
      tenant_id,
      paused: false,
    });

    await expect(
      updateProduct.execute({
        ...product,
        id: product.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update a non-existing product', async () => {
    const { id: tenant_id } = await fakeTenantsRepository.create({
      name: "McDonald's",
      slug: 'mc-donalds',
    });

    const { id: category_id } = await fakeProductCategoriesRepository.create({
      name: 'Pizza',
      tenant_id,
    });

    const { id: image_id } = await fakeFilesRespository.create({
      name: 'fileName.png',
      path: 'filePath.png',
    });

    await expect(
      updateProduct.execute({
        id: v4(),
        name: 'Pizza de peperone',
        description: 'Uma pizza muito saborosa com os melhores ingredientes do mercado.',
        price: 80.5,
        promotion_price: 60,
        paused: false,
        tenant_id,
        category_id,
        image_id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update a product with a non-existing file', async () => {
    const { id: tenant_id } = await fakeTenantsRepository.create({
      name: "McDonald's",
      slug: 'mc-donalds',
    });

    const { id: category_id } = await fakeProductCategoriesRepository.create({
      name: 'Pizza',
      tenant_id,
    });

    const product = await fakeProductsRepository.create({
      name: 'Pizza de peperone',
      description: 'Uma pizza muito saborosa com os melhores ingredientes do mercado.',
      price: 80.5,
      promotion_price: 60,
      category_id,
      image_id: v4(),
      tenant_id,
      paused: false,
    });

    await expect(
      updateProduct.execute({
        ...product,
        id: product.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
