import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

import ProductsController from '../controllers/ProductsController';

import ProductsStoreValidator from '../validators/ProductsStoreValidator';

const routes = Router();
const productsController = new ProductsController();

routes.post('/:tenant', ensureAuthenticated, ProductsStoreValidator, productsController.store);

export default routes;
