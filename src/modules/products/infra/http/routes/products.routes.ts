import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

import ProductsController from '../controllers/ProductsController';

import ProductsIndexValidator from '../validators/ProductsIndexValidator';
import ProductsStoreValidator from '../validators/ProductsStoreValidator';
import ProductsUpdateValidator from '../validators/ProductsUpdateValidator';

const routes = Router();
const productsController = new ProductsController();

routes.get('/:tenant', ensureAuthenticated, ProductsIndexValidator, productsController.index);
routes.post('/:tenant', ensureAuthenticated, ProductsStoreValidator, productsController.store);
routes.put('/:tenant', ensureAuthenticated, ProductsUpdateValidator, productsController.update);

export default routes;
