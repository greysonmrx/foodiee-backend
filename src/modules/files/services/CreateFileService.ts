import { inject, injectable } from 'tsyringe';
import { classToClass } from 'class-transformer';

import IStorageProvider from '../providers/StorageProvider/models/IStorageProvider';

import IFilesRepository from '../repositories/IFilesRepository';
import File from '../entities/fakes/File';

interface Request {
  name: string;
  path: string;
}

@injectable()
class CreateFileService {
  constructor(
    @inject('StorageProvider')
    private storageProvider: IStorageProvider,

    @inject('FilesRepository')
    private filesRepository: IFilesRepository,
  ) {
    /* Anything */
  }

  public async execute({ name, path }: Request): Promise<File> {
    await this.storageProvider.saveFile(path);

    const file = await this.filesRepository.create({ name, path });

    return classToClass(file);
  }
}

export default CreateFileService;
