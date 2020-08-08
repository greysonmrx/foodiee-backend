import { Repository, getRepository } from 'typeorm';

import IFilesRepository from '@modules/files/repositories/IFilesRepository';
import ICreateFilesDTO from '@modules/files/dtos/ICreateFilesDTO';

import File from '../entities/File';

class FilesRepository implements IFilesRepository {
  private ormRepository: Repository<File>;

  constructor() {
    this.ormRepository = getRepository(File);
  }

  public async findByPath(path: string): Promise<File | undefined> {
    const findFile = await this.ormRepository.findOne({
      where: {
        path,
      },
    });

    return findFile;
  }

  public async create({ name, path }: ICreateFilesDTO): Promise<File> {
    const user = this.ormRepository.create({
      name,
      path,
    });

    await this.ormRepository.save(user);

    return user;
  }
}

export default FilesRepository;
