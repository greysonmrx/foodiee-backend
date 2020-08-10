import { Router } from 'express';

import usersRouter from '@modules/users/infra/http/routes/users.routes';
import profilesRouter from '@modules/users/infra/http/routes/profiles.routes';
import sessionsRouter from '@modules/users/infra/http/routes/sessions.routes';
import filesRouter from '@modules/files/infra/http/routes/files.routes';
import tenantsRouer from '@modules/tenants/infra/http/routes/tenant.routes';

const routes = Router();

routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/profiles', profilesRouter);
routes.use('/files', filesRouter);
routes.use('/tenants', tenantsRouer);

export default routes;
