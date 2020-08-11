import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

import ProductCategoriesController from '../controllers/ProductCategoriesController';

import ProductCategoriesIndexValidator from '../validators/ProductCategoriesIndexValidator';
import ProductCategoriesStoreValidator from '../validators/ProductCategoriesStoreValidator';
import ProductCategoriesUpdateValidator from '../validators/ProductCategoriesUpdateValidator';
import ProductCategoriesDestroyValidator from '../validators/ProductCategoriesDestroyValidator';

const routes = Router();
const productCategoriesController = new ProductCategoriesController();

routes.get('/:tenant', ensureAuthenticated, ProductCategoriesIndexValidator, productCategoriesController.index);
routes.post('/:tenant', ensureAuthenticated, ProductCategoriesStoreValidator, productCategoriesController.store);
routes.patch('/:tenant', ensureAuthenticated, ProductCategoriesUpdateValidator, productCategoriesController.update);
routes.delete(
  '/:product_category/:tenant',
  ensureAuthenticated,
  ProductCategoriesDestroyValidator,
  productCategoriesController.destroy,
);

export default routes;
