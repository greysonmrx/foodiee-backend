import { container } from 'tsyringe';

import '@modules/users/providers';
import '@modules/files/providers';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';

import IFilesRepository from '@modules/files/repositories/IFilesRepository';
import FilesRepository from '@modules/files/infra/typeorm/repositories/FilesRepository';

import ITenantsRepository from '@modules/tenants/repositories/ITenantsRepository';
import TenantsRepository from '@modules/tenants/infra/typeorm/repositories/TenantsRepository';

import IProductCategoriesRepository from '@modules/product_categories/repositories/IProductCategoriesRepository';
import ProductCategoriesRepository from '@modules/product_categories/infra/typeorm/repositories/ProductCategoriesRepository';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ProductsRepository from '@modules/products/infra/typeorm/repositories/ProductsRepository';

import IComplementCategory from '@modules/complement_categories/repositories/IComplementCategoriesRepository';
import ComplementCategoriesRepository from '@modules/complement_categories/infra/typeorm/repositories/ComplementCategoriesRepository';

import IComplement from '@modules/complements/repositories/IComplementsRepository';
import ComplementsRepository from '@modules/complements/infra/typeorm/repositories/ComplementsRepository';

container.registerSingleton<IUsersRepository>('UsersRepository', UsersRepository);

container.registerSingleton<IFilesRepository>('FilesRepository', FilesRepository);

container.registerSingleton<ITenantsRepository>('TenantsRepository', TenantsRepository);

container.registerSingleton<IProductCategoriesRepository>('ProductCategoriesRepository', ProductCategoriesRepository);

container.registerSingleton<IProductsRepository>('ProductsRepository', ProductsRepository);

container.registerSingleton<IComplementCategory>('ComplementCategoriesRepository', ComplementCategoriesRepository);

container.registerSingleton<IComplement>('ComplementsRepository', ComplementsRepository);
