import AppError from '../../src/shared/errors/AppError';

import CreateTenantService from '../../src/modules/tenants/services/CreateTenantService';
import TenantsRepostiory from '../../src/modules/tenants/repositories/fakes/FakeTenantsRepository';

let tenantsRepostiory: TenantsRepostiory;
let createTenant: CreateTenantService;

describe('Create Tenant Service', () => {
  beforeAll(() => {
    tenantsRepostiory = new TenantsRepostiory();
    createTenant = new CreateTenantService(tenantsRepostiory);
  });

  it('should be able to create a tenant', async () => {
    const tenant = await createTenant.execute({ name: "McDonald's", slug: 'mc-donalds' });

    expect(tenant).toHaveProperty('id');
  });

  it('should not be able to create a tenant with duplicate slug', async () => {
    await tenantsRepostiory.create({ name: "McDonald's", slug: 'mc-donalds' });

    await expect(
      createTenant.execute({
        name: "McDonald's",
        slug: 'mc-donalds',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
