import { Router } from 'express';

import CustomersController from '../controllers/CustomersController';

import CustomerStoreValidator from '../validators/CustomerStoreValidator';
import CustomerUpdateValidator from '../validators/CustomerUpdateValidator';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const routes = Router();
const customersController = new CustomersController();

routes.post('/', CustomerStoreValidator, customersController.store);
routes.put('/', ensureAuthenticated, CustomerUpdateValidator, customersController.update);
routes.delete('/', ensureAuthenticated, customersController.destroy);

export default routes;
