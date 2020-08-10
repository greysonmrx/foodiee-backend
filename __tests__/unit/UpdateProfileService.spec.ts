import AppError from '../../src/shared/errors/AppError';

import FakeUsersRepository from '../../src/modules/users/repositories/fakes/FakeUsersRepository';
import FakeTenantsRepository from '../../src/modules/tenants/repositories/fakes/FakeTenantsRepository';
import FakeHashProvider from '../../src/modules/users/providers/HashProvider/fakes/FakeHashProvider';
import UpdateProfileService from '../../src/modules/users/services/UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let fakeTenantsRepository: FakeTenantsRepository;
let updateProfile: UpdateProfileService;

describe('Update Profile Service', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeTenantsRepository = new FakeTenantsRepository();
    updateProfile = new UpdateProfileService(fakeUsersRepository, fakeHashProvider);
  });

  it('should be able to update a user profile', async () => {
    const { id: tenant_id } = await fakeTenantsRepository.create({
      name: "McDonald's",
      slug: 'mc-donalds',
    });

    const { id: user_id } = await fakeUsersRepository.create({
      name: 'Guilherme Martins',
      email: 'guilhermemartins@armyspy.com',
      password: 'jieNgae7',
      tenant_id,
    });

    const updatedUser = await updateProfile.execute({
      user_id,
      name: 'Breno Almeida Ribeiro',
      email: 'BrenoAlmeidaRibeiro@jourrapide.com',
      password: 'miQuoh5f',
      current_password: 'jieNgae7',
    });

    expect(updatedUser).toHaveProperty('id');
  });

  it('should not be able to update user profile with duplicate e-mail', async () => {
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

    const { id: user_id } = await fakeUsersRepository.create({
      name: 'Breno Almeida Ribeiro',
      email: 'BrenoAlmeidaRibeiro@jourrapide.com',
      password: 'miQuoh5f',
      tenant_id,
    });

    await expect(
      updateProfile.execute({
        user_id,
        name: 'Breno Almeida Ribeiro',
        email: 'guilhermemartins@armyspy.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the profile of a non-existent user', async () => {
    await expect(
      updateProfile.execute({
        user_id: 'non-existing-user',
        name: 'Breno Almeida Ribeiro',
        email: 'guilhermemartins@armyspy.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update a user profile without the current password when a new password exists', async () => {
    const { id: tenant_id } = await fakeTenantsRepository.create({
      name: "McDonald's",
      slug: 'mc-donalds',
    });

    const { id: user_id } = await fakeUsersRepository.create({
      name: 'Guilherme Martins',
      email: 'guilhermemartins@armyspy.com',
      password: 'jieNgae7',
      tenant_id,
    });

    await expect(
      updateProfile.execute({
        user_id,
        name: 'Breno Almeida Ribeiro',
        email: 'guilhermemartins@armyspy.com',
        password: 'jieNgae7',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update user profile with an incorrect password', async () => {
    const { id: tenant_id } = await fakeTenantsRepository.create({
      name: "McDonald's",
      slug: 'mc-donalds',
    });

    const { id: user_id } = await fakeUsersRepository.create({
      name: 'Guilherme Martins',
      email: 'guilhermemartins@armyspy.com',
      password: 'jieNgae7',
      tenant_id,
    });

    await expect(
      updateProfile.execute({
        user_id,
        name: 'Breno Almeida Ribeiro',
        email: 'guilhermemartins@armyspy.com',
        password: 'jieNgae7',
        current_password: 'incorrectPassword',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
