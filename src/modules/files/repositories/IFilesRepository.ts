import IFile from '../entities/IFile';

import ICreateFilesDTO from '../dtos/ICreateFilesDTO';

interface IFilesRepository {
  findByPath(path: string): Promise<IFile | undefined>;
  create(data: ICreateFilesDTO): Promise<IFile>;
}

export default IFilesRepository;
