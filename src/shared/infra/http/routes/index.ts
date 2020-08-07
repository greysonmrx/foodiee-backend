import { Router } from 'express';

import usersRouter from '@modules/users/infra/http/routes/users.routes';
import profilesRouter from '@modules/users/infra/http/routes/profiles.routes';
import sessionsRouter from '@modules/users/infra/http/routes/sessions.routes';

const routes = Router();

routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/profiles', profilesRouter);

export default routes;
