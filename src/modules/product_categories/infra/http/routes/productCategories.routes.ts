import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

import ProductCategoriesController from '../controllers/ProductCategoriesController';

import ProductCategoriesIndexValidator from '../validators/ProductCategoriesIndexValidator';
import ProductCategoriesStoreValidator from '../validators/ProductCategoriesStoreValidator';

const routes = Router();
const productCategoriesController = new ProductCategoriesController();

routes.get('/:tenant', ensureAuthenticated, ProductCategoriesIndexValidator, productCategoriesController.index);
routes.post('/:tenant', ensureAuthenticated, ProductCategoriesStoreValidator, productCategoriesController.store);

export default routes;
