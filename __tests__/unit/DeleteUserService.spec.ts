import { v4 } from 'uuid';

import AppError from '../../src/shared/errors/AppError';
import DeleteUserService from '../../src/modules/users/services/DeleteUserService';
import FakeTenantsRepository from '../../src/modules/tenants/repositories/fakes/FakeTenantsRepository';
import FakeUsersRepository from '../../src/modules/users/repositories/fakes/FakeUsersRepository';

let fakeUsersRepository: FakeUsersRepository;
let fakeTenantsRepostiory: FakeTenantsRepository;
let deleteUser: DeleteUserService;

describe('Delete User Service', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeTenantsRepostiory = new FakeTenantsRepository();
    deleteUser = new DeleteUserService(fakeUsersRepository);
  });

  it('should be able to delete a user', async () => {
    const { id: tenant_id } = await fakeTenantsRepostiory.create({
      name: "McDonald's",
      slug: 'mc-donalds',
    });

    const { id } = await fakeUsersRepository.create({
      name: 'Guilherme Martins',
      email: 'guilhermemartins@armyspy.com',
      password: 'jieNgae7',
      tenant_id,
    });

    await expect(deleteUser.execute({ id, tenant_id })).resolves.toBe(undefined);
  });

  it('should not be able to delete a non-existing user', async () => {
    const { id: tenant_id } = await fakeTenantsRepostiory.create({
      name: "McDonald's",
      slug: 'mc-donalds',
    });

    await expect(deleteUser.execute({ id: v4(), tenant_id })).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to delete a user with a non-existing tenant', async () => {
    const { id: tenant_id } = await fakeTenantsRepostiory.create({
      name: "McDonald's",
      slug: 'mc-donalds',
    });

    const { id } = await fakeUsersRepository.create({
      name: 'Guilherme Martins',
      email: 'guilhermemartins@armyspy.com',
      password: 'jieNgae7',
      tenant_id,
    });

    await expect(deleteUser.execute({ id, tenant_id: v4() })).rejects.toBeInstanceOf(AppError);
  });
});
