import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

import ProductsController from '../controllers/ProductsController';

import ProductsIndexValidator from '../validators/ProductsIndexValidator';
import ProductsStoreValidator from '../validators/ProductsStoreValidator';

const routes = Router();
const productsController = new ProductsController();

routes.get('/:tenant', ensureAuthenticated, ProductsIndexValidator, productsController.index);
routes.post('/:tenant', ensureAuthenticated, ProductsStoreValidator, productsController.store);

export default routes;
