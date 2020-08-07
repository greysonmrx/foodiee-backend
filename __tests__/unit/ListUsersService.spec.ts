import ListUsersService from '../../src/modules/users/services/ListUsersService';
import FakeUsersRepository from '../../src/modules/users/repositories/fakes/FakeUsersRepository';

let fakeUsersRepository: FakeUsersRepository;
let listUsers: ListUsersService;

describe('List Users Service', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    listUsers = new ListUsersService(fakeUsersRepository);
  });

  it('should be able to list all users', async () => {
    const { id } = await fakeUsersRepository.create({
      name: 'Guilherme Martins',
      email: 'guilhermemartins@armyspy.com',
      password: 'jieNgae7',
    });

    await fakeUsersRepository.create({
      name: 'Breno Almeida Ribeiro',
      email: 'BrenoAlmeidaRibeiro@jourrapide.com',
      password: 'miQuoh5f',
    });

    await expect(listUsers.execute({ except_user_id: id })).resolves.toHaveLength(1);
  });
});
