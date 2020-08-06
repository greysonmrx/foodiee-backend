import AppError from '../../src/shared/errors/AppError';

import FakeUsersRepository from '../../src/modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../../src/modules/users/providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from '../../src/modules/users/services/CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;

const fakeUserData = {
  name: 'Guilherme Martins',
  email: 'guilhermemartins@armyspy.com',
  password: 'jieNgae7',
};

describe('Create user service', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
  });

  it('should be able to register a new user', async () => {
    const user = await createUser.execute(fakeUserData);

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create two users with the same email', async () => {
    await createUser.execute(fakeUserData);

    await expect(createUser.execute(fakeUserData)).rejects.toBeInstanceOf(AppError);
  });
});
