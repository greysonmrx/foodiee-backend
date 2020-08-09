import { v4 } from 'uuid';

import AppError from '../../src/shared/errors/AppError';

import DeleteTenantService from '../../src/modules/tenants/services/DeleteTenantService';
import TenantsRepostiory from '../../src/modules/tenants/repositories/fakes/FakeTenantsRepository';

let tenantsRepostiory: TenantsRepostiory;
let deleteTenant: DeleteTenantService;

describe('Delete Tenant Service', () => {
  beforeAll(() => {
    tenantsRepostiory = new TenantsRepostiory();
    deleteTenant = new DeleteTenantService(tenantsRepostiory);
  });

  it('should be able to delete a tenant', async () => {
    const { id: tenant_id } = await tenantsRepostiory.create({
      name: "McDonald's",
      slug: 'mc-donalds',
    });

    await expect(deleteTenant.execute({ tenant_id })).resolves.toBe(undefined);
  });

  it('should not be able to delete a non-existing tenant', async () => {
    await expect(
      deleteTenant.execute({
        tenant_id: v4(),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
