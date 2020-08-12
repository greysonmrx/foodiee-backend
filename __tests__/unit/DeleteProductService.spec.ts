import { v4 } from 'uuid';

import AppError from '../../src/shared/errors/AppError';

import FakeStorageProvider from '../../src/modules/files/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeTenantsRepository from '../../src/modules/tenants/repositories/fakes/FakeTenantsRepository';
import FakeProductsRepository from '../../src/modules/products/repositories/fakes/FakeProductsRepository';
import FakeFilesRepository from '../../src/modules/files/repositories/fakes/FakeFilesRepository';
import DeleteProductService from '../../src/modules/products/services/DeleteProductService';

let fakeTenantsRepository: FakeTenantsRepository;
let fakeStorageProvider: FakeStorageProvider;
let fakeProductsRepository: FakeProductsRepository;
let fakeFilesRepository: FakeFilesRepository;
let deleteProduct: DeleteProductService;

describe('Delete Product Service', () => {
  beforeEach(() => {
    fakeStorageProvider = new FakeStorageProvider();
    fakeTenantsRepository = new FakeTenantsRepository();
    fakeProductsRepository = new FakeProductsRepository();
    fakeFilesRepository = new FakeFilesRepository();
    deleteProduct = new DeleteProductService(
      fakeProductsRepository,
      fakeTenantsRepository,
      fakeFilesRepository,
      fakeStorageProvider,
    );
  });

  it('should be able to delete a product', async () => {
    const { id: tenant_id } = await fakeTenantsRepository.create({
      name: "McDonald's",
      slug: 'mc-donalds',
    });

    const { id } = await fakeProductsRepository.create({
      name: 'Pizza de peperone',
      description: 'Uma pizza muito saborosa com os melhores ingredientes do mercado.',
      price: 80.5,
      promotion_price: 60,
      category_id: v4(),
      image_id: v4(),
      tenant_id,
      paused: false,
    });

    await expect(deleteProduct.execute({ id, tenant_id })).resolves.toBe(undefined);
  });

  it('should be able to delete a product image when deleting a product', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const { id: tenant_id } = await fakeTenantsRepository.create({
      name: "McDonald's",
      slug: 'mc-donalds',
    });

    const { id: image_id } = await fakeFilesRepository.create({
      name: 'fileName.jpeg',
      path: 'filePath.jpeg',
    });

    const { id } = await fakeProductsRepository.create({
      name: 'Pizza de peperone',
      description: 'Uma pizza muito saborosa com os melhores ingredientes do mercado.',
      price: 80.5,
      promotion_price: 60,
      category_id: v4(),
      image_id,
      tenant_id,
      paused: false,
    });

    await expect(deleteProduct.execute({ id, tenant_id })).resolves.toBe(undefined);
    expect(deleteFile).toHaveBeenCalledWith('filePath.jpeg');
  });

  it('should not be able to delete a non-existing product', async () => {
    const { id: tenant_id } = await fakeTenantsRepository.create({
      name: "McDonald's",
      slug: 'mc-donalds',
    });

    await expect(
      deleteProduct.execute({
        id: v4(),
        tenant_id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
