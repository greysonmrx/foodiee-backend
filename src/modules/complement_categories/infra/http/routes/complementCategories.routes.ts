import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

import ComplementCategoriesController from '../controllers/ComplementCategoriesController';

import ComplementCategoriesIndexValidator from '../validators/ComplementCategoriesIndexValidator';
import ComplementCategoriesStoreValidator from '../validators/ComplementCategoriesStoreValidator';
import ComplementCategoriesUpdateValidator from '../validators/ComplementCategoriesUpdateValidator';
import ComplementCategoriesDestroyValidator from '../validators/ComplementCategoriesDestroyValidator';

const routes = Router();
const complementCategoriesController = new ComplementCategoriesController();

routes.get('/:product', ensureAuthenticated, ComplementCategoriesIndexValidator, complementCategoriesController.index);
routes.post('/:tenant', ensureAuthenticated, ComplementCategoriesStoreValidator, complementCategoriesController.store);
routes.put('/:id', ensureAuthenticated, ComplementCategoriesUpdateValidator, complementCategoriesController.update);
routes.delete(
  '/:id',
  ensureAuthenticated,
  ComplementCategoriesDestroyValidator,
  complementCategoriesController.destroy,
);

export default routes;
