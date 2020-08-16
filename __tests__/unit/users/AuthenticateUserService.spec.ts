import AppError from '../../../src/shared/errors/AppError';

import FakeUsersRepository from '../../../src/modules/users/repositories/fakes/FakeUsersRepository';
import FakeTenantsRepository from '../../../src/modules/tenants/repositories/fakes/FakeTenantsRepository';
import AuthenticateUserService from '../../../src/modules/users/services/AuthenticateUserService';
import FakeHashProvider from '../../../src/modules/users/providers/HashProvider/fakes/FakeHashProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let fakeTenantsRepository: FakeTenantsRepository;
let authenticateUser: AuthenticateUserService;

describe('Authenticate User', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeTenantsRepository = new FakeTenantsRepository();
    authenticateUser = new AuthenticateUserService(fakeUsersRepository, fakeHashProvider);
  });

  it('should be able to authenticate a user', async () => {
    const { id: tenant_id } = await fakeTenantsRepository.create({
      name: "McDonald's",
      slug: 'mc-donalds',
    });

    const user = await fakeUsersRepository.create({
      name: 'Guilherme Martins',
      email: 'guilhermemartins@armyspy.com',
      password: 'jieNgae7',
      tenant_id,
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
    const { id: tenant_id } = await fakeTenantsRepository.create({
      name: "McDonald's",
      slug: 'mc-donalds',
    });

    await fakeUsersRepository.create({
      name: 'Guilherme Martins',
      email: 'guilhermemartins@armyspy.com',
      password: 'jieNgae7',
      tenant_id,
    });

    await expect(
      authenticateUser.execute({
        email: 'wrongEmail@email.com',
        password: 'jieNgae7',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate a user with the wrong password', async () => {
    const { id: tenant_id } = await fakeTenantsRepository.create({
      name: "McDonald's",
      slug: 'mc-donalds',
    });

    await fakeUsersRepository.create({
      name: 'Guilherme Martins',
      email: 'guilhermemartins@armyspy.com',
      password: 'jieNgae7',
      tenant_id,
    });

    await expect(
      authenticateUser.execute({
        email: 'guilhermemartins@armyspy.com',
        password: 'wrongPassword',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
