import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

import ProductsController from '../controllers/ProductsController';

import ProductsIndexValidator from '../validators/ProductsIndexValidator';
import ProductsStoreValidator from '../validators/ProductsStoreValidator';
import ProductsUpdateValidator from '../validators/ProductsUpdateValidator';
import ProductsDestroyValidator from '../validators/ProductsDestroyValidator';

const routes = Router();
const productsController = new ProductsController();

routes.get('/:tenant', ensureAuthenticated, ProductsIndexValidator, productsController.index);
routes.post('/:tenant', ensureAuthenticated, ProductsStoreValidator, productsController.store);
routes.put('/:tenant', ensureAuthenticated, ProductsUpdateValidator, productsController.update);
routes.delete('/:product/:tenant', ensureAuthenticated, ProductsDestroyValidator, productsController.destroy);

export default routes;
