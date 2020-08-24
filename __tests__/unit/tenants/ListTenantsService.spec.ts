import ListTenantsService from '../../../src/modules/tenants/services/ListTenantsService';
import FakeTenantsRepository from '../../../src/modules/tenants/repositories/fakes/FakeTenantsRepository';

let fakeTenantsRepository: FakeTenantsRepository;
let listTenants: ListTenantsService;

describe('List Tenants Service', () => {
  beforeAll(() => {
    fakeTenantsRepository = new FakeTenantsRepository();
    listTenants = new ListTenantsService(fakeTenantsRepository);
  });

  it('should be able to list all tenants', async () => {
    await fakeTenantsRepository.create({
      name: "McDonald's",
      slug: 'mc-donalds',
    });

    await fakeTenantsRepository.create({
      name: "Bob's",
      slug: 'bobs',
    });

    await expect(listTenants.execute()).resolves.toHaveLength(2);
  });
});
