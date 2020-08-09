import IFile from '../entities/IFile';

import ICreateFilesDTO from '../dtos/ICreateFilesDTO';

interface IFilesRepository {
  findById(id: string): Promise<IFile | undefined>;
  findByPath(path: string): Promise<IFile | undefined>;
  create(data: ICreateFilesDTO): Promise<IFile>;
  delete(id: string): Promise<void>;
}

export default IFilesRepository;
