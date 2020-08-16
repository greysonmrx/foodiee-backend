import { Router } from 'express';

import usersRouter from '@modules/users/infra/http/routes/users.routes';
import profilesRouter from '@modules/users/infra/http/routes/profiles.routes';
import sessionsRouter from '@modules/users/infra/http/routes/sessions.routes';
import filesRouter from '@modules/files/infra/http/routes/files.routes';
import tenantsRouer from '@modules/tenants/infra/http/routes/tenant.routes';
import productCategoriesRouter from '@modules/product_categories/infra/http/routes/productCategories.routes';
import productsRouter from '@modules/products/infra/http/routes/products.routes';

const routes = Router();

routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/profiles', profilesRouter);
routes.use('/files', filesRouter);
routes.use('/tenants', tenantsRouer);
routes.use('/product_categories', productCategoriesRouter);
routes.use('/products', productsRouter);

export default routes;
