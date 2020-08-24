import AppError from '../../../src/shared/errors/AppError';

import CreateTenantService from '../../../src/modules/tenants/services/CreateTenantService';
import FakeTenantsRepository from '../../../src/modules/tenants/repositories/fakes/FakeTenantsRepository';

let fakeTenantsRepository: FakeTenantsRepository;
let createTenant: CreateTenantService;

describe('Create Tenant Service', () => {
  beforeAll(() => {
    fakeTenantsRepository = new FakeTenantsRepository();
    createTenant = new CreateTenantService(fakeTenantsRepository);
  });

  it('should be able to create a tenant', async () => {
    const tenant = await createTenant.execute({ name: "McDonald's", slug: 'mc-donalds' });

    expect(tenant).toHaveProperty('id');
  });

  it('should not be able to create a tenant with duplicate slug', async () => {
    await fakeTenantsRepository.create({ name: "McDonald's", slug: 'mc-donalds' });

    await expect(
      createTenant.execute({
        name: "McDonald's",
        slug: 'mc-donalds',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
