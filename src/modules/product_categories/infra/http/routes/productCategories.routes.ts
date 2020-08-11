import { Router } from 'express';

import ProductCategoriesController from '../controllers/ProductCategoriesController';

import ProductCategoriesStoreValidator from '../validators/ProductCategoriesStoreValidator';

const routes = Router();
const productCategoriesController = new ProductCategoriesController();

routes.post('/:tenant', ProductCategoriesStoreValidator, productCategoriesController.store);

export default routes;
