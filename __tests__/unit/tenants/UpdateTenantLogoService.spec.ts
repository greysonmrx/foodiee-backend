import { v4 } from 'uuid';

import AppError from '../../../src/shared/errors/AppError';

import UpdateTenantLogoService from '../../../src/modules/tenants/services/UpdateTenantLogoService';
import FakeTenantsRepository from '../../../src/modules/tenants/repositories/fakes/FakeTenantsRepository';
import FakeFilesRepository from '../../../src/modules/files/repositories/fakes/FakeFilesRepository';
import FakeStorageProvider from '../../../src/modules/files/providers/StorageProvider/fakes/FakeStorageProvider';

let fakeFilesRepository: FakeFilesRepository;
let fakeTenantsRepository: FakeTenantsRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateLogoTenant: UpdateTenantLogoService;

describe('Update Tenant Logo Service', () => {
  beforeAll(() => {
    fakeFilesRepository = new FakeFilesRepository();
    fakeTenantsRepository = new FakeTenantsRepository();
    fakeStorageProvider = new FakeStorageProvider();
    updateLogoTenant = new UpdateTenantLogoService(fakeTenantsRepository, fakeFilesRepository, fakeStorageProvider);
  });

  it('should be able to update a tenant logo', async () => {
    const { id: logo_id } = await fakeFilesRepository.create({
      name: 'fileName.jpeg',
      path: 'filePath.jpeg',
    });

    const { id: tenant_id } = await fakeTenantsRepository.create({
      name: "McDonald's",
      slug: 'mc-donalds',
    });

    await expect(updateLogoTenant.execute({ tenant_id, logo_id })).resolves.toHaveProperty('id');
  });

  it('should be able to delete the old tenant logo when updating a new one', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const { id: logo_id_1 } = await fakeFilesRepository.create({
      name: 'fileName1.jpeg',
      path: 'filePath1.jpeg',
    });

    const { id: logo_id_2 } = await fakeFilesRepository.create({
      name: 'fileName2.jpeg',
      path: 'filePath2.jpeg',
    });

    const tenant = await fakeTenantsRepository.create({
      name: "McDonald's",
      slug: 'mc-donalds',
    });

    await updateLogoTenant.execute({ tenant_id: tenant.id, logo_id: logo_id_1 });
    await updateLogoTenant.execute({ tenant_id: tenant.id, logo_id: logo_id_2 });

    expect(deleteFile).toHaveBeenCalledWith('filePath1.jpeg');
    expect(tenant.logo_id).toBe(logo_id_2);
  });

  it('should not be able to update logo of a non-existing tenant', async () => {
    await expect(
      updateLogoTenant.execute({
        tenant_id: v4(),
        logo_id: v4(),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update logo with a non-existing file', async () => {
    await expect(
      updateLogoTenant.execute({
        tenant_id: v4(),
        logo_id: v4(),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
