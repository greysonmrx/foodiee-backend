import { v4 } from 'uuid';

import AppError from '../../../src/shared/errors/AppError';

import UpdateTenantService from '../../../src/modules/tenants/services/UpdateTenantService';
import FakeTenantsRepository from '../../../src/modules/tenants/repositories/fakes/FakeTenantsRepository';

let fakeTenantsRepository: FakeTenantsRepository;
let updateTenant: UpdateTenantService;

describe('Update Tenant Service', () => {
  beforeAll(() => {
    fakeTenantsRepository = new FakeTenantsRepository();
    updateTenant = new UpdateTenantService(fakeTenantsRepository);
  });

  it('should be able to update a tenant', async () => {
    const { id: tenant_id } = await fakeTenantsRepository.create({
      name: "McDonald's",
      slug: 'mc-donalds',
    });

    await expect(updateTenant.execute({ tenant_id, name: "Bob's", slug: 'bobs' })).resolves.toHaveProperty('id');
  });

  it('should not be able to update a non-existing tenant', async () => {
    await expect(
      updateTenant.execute({
        tenant_id: v4(),
        name: "Bob's",
        slug: 'bobs',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update a tenant with duplicate slug', async () => {
    await fakeTenantsRepository.create({
      name: "McDonald's",
      slug: 'mc-donalds',
    });

    const { id: tenant_id } = await fakeTenantsRepository.create({
      name: "Bob's",
      slug: 'bobs',
    });

    await expect(
      updateTenant.execute({
        tenant_id,
        name: "McDonald's",
        slug: 'mc-donalds',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
