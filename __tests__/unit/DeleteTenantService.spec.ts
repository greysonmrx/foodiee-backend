import { v4 } from 'uuid';

import AppError from '../../src/shared/errors/AppError';

import UpdateTenantLogoService from '../../src/modules/tenants/services/UpdateTenantLogoService';
import DeleteTenantService from '../../src/modules/tenants/services/DeleteTenantService';
import TenantsRepostiory from '../../src/modules/tenants/repositories/fakes/FakeTenantsRepository';
import FakeFilesRepository from '../../src/modules/files/repositories/fakes/FakeFilesRepository';
import FakeStorageProvider from '../../src/modules/files/providers/StorageProvider/fakes/FakeStorageProvider';

let fakeFilesRepository: FakeFilesRepository;
let fakeStorageProvider: FakeStorageProvider;
let tenantsRepostiory: TenantsRepostiory;
let deleteTenant: DeleteTenantService;
let updateTenantLogo: UpdateTenantLogoService;

describe('Delete Tenant Service', () => {
  beforeAll(() => {
    fakeFilesRepository = new FakeFilesRepository();
    fakeStorageProvider = new FakeStorageProvider();
    tenantsRepostiory = new TenantsRepostiory();
    deleteTenant = new DeleteTenantService(tenantsRepostiory, fakeFilesRepository, fakeStorageProvider);
    updateTenantLogo = new UpdateTenantLogoService(tenantsRepostiory, fakeFilesRepository, fakeStorageProvider);
  });

  it('should be able to delete a tenant', async () => {
    const { id: tenant_id } = await tenantsRepostiory.create({
      name: "McDonald's",
      slug: 'mc-donalds',
    });

    await expect(deleteTenant.execute({ tenant_id })).resolves.toBe(undefined);
  });

  it('should be able to delete the tenant logo when deleting a tenant', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const { id: logo_id } = await fakeFilesRepository.create({
      name: 'fileName.jpeg',
      path: 'filePath.jpeg',
    });

    const { id: tenant_id } = await tenantsRepostiory.create({
      name: "McDonald's",
      slug: 'mc-donalds',
    });

    await updateTenantLogo.execute({ logo_id, tenant_id });

    await deleteTenant.execute({ tenant_id });

    const tenant = await tenantsRepostiory.findById(tenant_id);

    expect(deleteFile).toHaveBeenCalledWith('filePath.jpeg');
    expect(tenant).toBeFalsy();
  });

  it('should not be able to delete a non-existing tenant', async () => {
    await expect(
      deleteTenant.execute({
        tenant_id: v4(),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
