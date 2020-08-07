import { v4 } from 'uuid';

import AppError from '../../src/shared/errors/AppError';
import DeleteUserService from '../../src/modules/users/services/DeleteUserService';
import FakeUsersRepository from '../../src/modules/users/repositories/fakes/FakeUsersRepository';

let fakeUsersRepository: FakeUsersRepository;
let deleteUser: DeleteUserService;

describe('Delete User Service', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    deleteUser = new DeleteUserService(fakeUsersRepository);
  });

  it('should be able to delete a user', async () => {
    const { id } = await fakeUsersRepository.create({
      name: 'Guilherme Martins',
      email: 'guilhermemartins@armyspy.com',
      password: 'jieNgae7',
    });

    await expect(deleteUser.execute({ id })).resolves.toBe(undefined);
  });

  it('should not be able to delete a non-existing user', async () => {
    await expect(deleteUser.execute({ id: v4() })).rejects.toBeInstanceOf(AppError);
  });
});
