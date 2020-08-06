import AppError from '../../src/shared/errors/AppError';

import FakeUsersRepository from '../../src/modules/users/repositories/fakes/FakeUsersRepository';
import AuthenticateUserService from '../../src/modules/users/services/AuthenticateUserService';
import FakeHashProvider from '../../src/modules/users/providers/HashProvider/fakes/FakeHashProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let authenticateUser: AuthenticateUserService;

describe('Authenticate User', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    authenticateUser = new AuthenticateUserService(fakeUsersRepository, fakeHashProvider);
  });

  it('should be able to authenticate a user', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Guilherme Martins',
      email: 'guilhermemartins@armyspy.com',
      password: 'jieNgae7',
    });

    const response = await authenticateUser.execute({
      email: 'guilhermemartins@armyspy.com',
      password: 'jieNgae7',
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('should not be able to authenticate a user with a non-existing user', async () => {
    await expect(
      authenticateUser.execute({
        email: 'guilhermemartins@armyspy.com',
        password: 'jieNgae7',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate a user with the wrong e-mail', async () => {
    await fakeUsersRepository.create({
      name: 'Guilherme Martins',
      email: 'guilhermemartins@armyspy.com',
      password: 'jieNgae7',
    });

    await expect(
      authenticateUser.execute({
        email: 'wrongEmail@email.com',
        password: 'jieNgae7',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate a user with the wrong password', async () => {
    await fakeUsersRepository.create({
      name: 'Guilherme Martins',
      email: 'guilhermemartins@armyspy.com',
      password: 'jieNgae7',
    });

    await expect(
      authenticateUser.execute({
        email: 'guilhermemartins@armyspy.com',
        password: 'wrongPassword',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
