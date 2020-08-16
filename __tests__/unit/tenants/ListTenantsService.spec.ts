import ListTenantsService from '../../../src/modules/tenants/services/ListTenantsService';
import TenantsRepostiory from '../../../src/modules/tenants/repositories/fakes/FakeTenantsRepository';

let tenantsRepostiory: TenantsRepostiory;
let listTenants: ListTenantsService;

describe('List Tenants Service', () => {
  beforeAll(() => {
    tenantsRepostiory = new TenantsRepostiory();
    listTenants = new ListTenantsService(tenantsRepostiory);
  });

  it('should be able to list all tenants', async () => {
    await tenantsRepostiory.create({
      name: "McDonald's",
      slug: 'mc-donalds',
    });

    await tenantsRepostiory.create({
      name: "Bob's",
      slug: 'bobs',
    });

    await expect(listTenants.execute()).resolves.toHaveLength(2);
  });
});
