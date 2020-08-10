import { container } from 'tsyringe';

import '@modules/users/providers';
import '@modules/files/providers';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';

import IFilesRepository from '@modules/files/repositories/IFilesRepository';
import FilesRepository from '@modules/files/infra/typeorm/repositories/FilesRepository';

import ITenantsRepository from '@modules/tenants/repositories/ITenantsRepository';
import TenantsRepository from '@modules/tenants/infra/typeorm/repositories/TenantsRepository';

container.registerSingleton<IUsersRepository>('UsersRepository', UsersRepository);

container.registerSingleton<IFilesRepository>('FilesRepository', FilesRepository);

container.registerSingleton<ITenantsRepository>('TenantsRepository', TenantsRepository);
