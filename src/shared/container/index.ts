import { container } from 'tsyringe';

import '@modules/users/providers';
import '@modules/files/providers';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';

import IFilesRepository from '@modules/files/repositories/IFilesRepository';
import FilesRepository from '@modules/files/infra/typeorm/repositories/FilesRepository';

container.registerSingleton<IUsersRepository>('UsersRepository', UsersRepository);

container.registerSingleton<IFilesRepository>('FilesRepository', FilesRepository);
