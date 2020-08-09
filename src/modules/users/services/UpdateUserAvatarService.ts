import { inject, injectable } from 'tsyringe';
import { classToClass } from 'class-transformer';

import AppError from '@shared/errors/AppError';
import IStorageProvider from '@modules/files/providers/StorageProvider/models/IStorageProvider';
import IFilesRepository from '@modules/files/repositories/IFilesRepository';

import IUsersRepository from '../repositories/IUsersRepository';
import IUser from '../entities/IUser';

interface Request {
  user_id: string;
  avatar_id: string;
}

@injectable()
class UpdateUserAvatarService {
  constructor(
    @inject('UsersRepository')
    private userRepository: IUsersRepository,

    @inject('FilesRepository')
    private filesRepository: IFilesRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {
    /* Anything */
  }

  public async execute({ user_id, avatar_id }: Request): Promise<IUser> {
    const user = await this.userRepository.findById(user_id);

    if (!user) {
      throw new AppError('Usuário não encontrado.', 404);
    }

    const avatar = await this.filesRepository.findById(avatar_id);

    if (!avatar) {
      throw new AppError('Arquivo não encontrado.', 404);
    }

    const userAvatarExists = await this.filesRepository.findById(user.avatar_id);

    if (userAvatarExists && avatar.id !== userAvatarExists.id) {
      await this.storageProvider.deleteFile(userAvatarExists.path);
      await this.filesRepository.delete(userAvatarExists.id);
    }

    user.avatar_id = avatar.id;

    await this.userRepository.update(user);

    return classToClass(user);
  }
}

export default UpdateUserAvatarService;
