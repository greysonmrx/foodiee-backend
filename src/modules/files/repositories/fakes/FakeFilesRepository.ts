import { v4 } from 'uuid';

import File from '@modules/files/entities/fakes/File';
import ICreateFilesDTO from '@modules/files/dtos/ICreateFilesDTO';

import IFilesRepository from '../IFilesRepository';

class FilesRepository implements IFilesRepository {
  private files: File[] = [];

  public async findByPath(path: string): Promise<File | undefined> {
    const findFile = this.files.find(file => file.path === path);

    return findFile;
  }

  public async create({ name, path }: ICreateFilesDTO): Promise<File> {
    const file = new File();

    Object.assign(file, {
      id: v4(),
      name,
      path,
      created_at: String(new Date()),
      updated_at: String(new Date()),
    });

    this.files.push(file);

    return file;
  }
}

export default FilesRepository;
