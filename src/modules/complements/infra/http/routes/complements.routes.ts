import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

import ComplementsController from '../controllers/ComplementsController';

import ComplementsStoreValidator from '../validators/ComplementsStoreValidator';
import ComplementsUpdateValidator from '../validators/ComplementsUpdateValidator';
import ComplementsDestroyValidator from '../validators/ComplementsDestroyValidator';

const routes = Router();
const complementsController = new ComplementsController();

routes.post('/', ensureAuthenticated, ComplementsStoreValidator, complementsController.store);
routes.put('/:id', ensureAuthenticated, ComplementsUpdateValidator, complementsController.update);
routes.delete('/:id', ensureAuthenticated, ComplementsDestroyValidator, complementsController.destroy);

export default routes;
