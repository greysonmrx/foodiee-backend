import { v4 } from 'uuid';

import AppError from '../../src/shared/errors/AppError';

import UpdateUserAvatarService from '../../src/modules/users/services/UpdateUserAvatarService';
import FakeUsersRepository from '../../src/modules/users/repositories/fakes/FakeUsersRepository';
import FakeFilesRepository from '../../src/modules/files/repositories/fakes/FakeFilesRepository';
import FakeStorageProvider from '../../src/modules/files/providers/StorageProvider/fakes/FakeStorageProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeFilesRepository: FakeFilesRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateUserAvatar: UpdateUserAvatarService;

describe('Update User Avatar Service', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeFilesRepository = new FakeFilesRepository();
    fakeStorageProvider = new FakeStorageProvider();
    updateUserAvatar = new UpdateUserAvatarService(fakeUsersRepository, fakeFilesRepository, fakeStorageProvider);
  });

  it('should be able to update the user avatar', async () => {
    const { id: avatar_id } = await fakeFilesRepository.create({
      name: 'fileName.jpeg',
      path: 'filePath.jpeg',
    });

    const { id: user_id } = await fakeUsersRepository.create({
      name: 'Guilherme Martins',
      email: 'guilhermemartins@armyspy.com',
      password: 'jieNgae7',
    });

    await expect(updateUserAvatar.execute({ user_id, avatar_id })).resolves.toHaveProperty('id');
  });

  it('should be able to delete the old user avatar when updating a new one', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const { id: avatar_id_1 } = await fakeFilesRepository.create({
      name: 'fileName1.jpeg',
      path: 'filePath1.jpeg',
    });

    const { id: avatar_id_2 } = await fakeFilesRepository.create({
      name: 'fileName2.jpeg',
      path: 'filePath2.jpeg',
    });

    const user = await fakeUsersRepository.create({
      name: 'Guilherme Martins',
      email: 'guilhermemartins@armyspy.com',
      password: 'jieNgae7',
    });

    await updateUserAvatar.execute({ user_id: user.id, avatar_id: avatar_id_1 });
    await updateUserAvatar.execute({ user_id: user.id, avatar_id: avatar_id_2 });

    expect(deleteFile).toHaveBeenCalledWith('filePath1.jpeg');
    expect(user.avatar_id).toBe(avatar_id_2);
  });

  it('should not be able to update avatar of a non-existing user', async () => {
    await expect(
      updateUserAvatar.execute({
        user_id: v4(),
        avatar_id: v4(),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update avatar with a non-existing file', async () => {
    const { id: user_id } = await fakeUsersRepository.create({
      name: 'Guilherme Martins',
      email: 'guilhermemartins@armyspy.com',
      password: 'jieNgae7',
    });

    await expect(
      updateUserAvatar.execute({
        user_id,
        avatar_id: v4(),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
