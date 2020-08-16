import ListUsersService from '../../../src/modules/users/services/ListUsersService';
import FakeTenantsRepository from '../../../src/modules/tenants/repositories/fakes/FakeTenantsRepository';
import FakeUsersRepository from '../../../src/modules/users/repositories/fakes/FakeUsersRepository';

let fakeUsersRepository: FakeUsersRepository;
let fakeTenantsRepository: FakeTenantsRepository;
let listUsers: ListUsersService;

describe('List Users Service', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeTenantsRepository = new FakeTenantsRepository();
    listUsers = new ListUsersService(fakeUsersRepository);
  });

  it('should be able to list all users', async () => {
    const { id: tenant_id } = await fakeTenantsRepository.create({
      name: "McDonald's",
      slug: 'mc-donalds',
    });

    const { id } = await fakeUsersRepository.create({
      name: 'Guilherme Martins',
      email: 'guilhermemartins@armyspy.com',
      password: 'jieNgae7',
      tenant_id,
    });

    await fakeUsersRepository.create({
      name: 'Breno Almeida Ribeiro',
      email: 'BrenoAlmeidaRibeiro@jourrapide.com',
      password: 'miQuoh5f',
      tenant_id,
    });

    await expect(listUsers.execute({ except_user_id: id, tenant_id })).resolves.toHaveLength(1);
  });
});
