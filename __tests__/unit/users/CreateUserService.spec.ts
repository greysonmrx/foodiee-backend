import { v4 } from 'uuid';

import AppError from '../../../src/shared/errors/AppError';

import FakeUsersRepository from '../../../src/modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../../../src/modules/users/providers/HashProvider/fakes/FakeHashProvider';
import FakeTenantsRepository from '../../../src/modules/tenants/repositories/fakes/FakeTenantsRepository';
import CreateUserService from '../../../src/modules/users/services/CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeTenantsRepository: FakeTenantsRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;

describe('Create User Service', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeTenantsRepository = new FakeTenantsRepository();
    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider, fakeTenantsRepository);
  });

  it('should be able to register a new user', async () => {
    const { id: tenant_id } = await fakeTenantsRepository.create({
      name: "McDonald's",
      slug: 'mc-donalds',
    });

    const user = await createUser.execute({
      name: 'Guilherme Martins',
      email: 'guilhermemartins@armyspy.com',
      password: 'jieNgae7',
      tenant_id,
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create two users with the same email', async () => {
    const { id: tenant_id } = await fakeTenantsRepository.create({
      name: "McDonald's",
      slug: 'mc-donalds',
    });

    await createUser.execute({
      name: 'Guilherme Martins',
      email: 'guilhermemartins@armyspy.com',
      password: 'jieNgae7',
      tenant_id,
    });

    await expect(
      createUser.execute({
        name: 'Guilherme Martins',
        email: 'guilhermemartins@armyspy.com',
        password: 'jieNgae7',
        tenant_id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new user with a non-existing tenant', async () => {
    await expect(
      createUser.execute({
        name: 'Guilherme Martins',
        email: 'guilhermemartins@armyspy.com',
        password: 'jieNgae7',
        tenant_id: v4(),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
