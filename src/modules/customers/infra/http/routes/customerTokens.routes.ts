import { Router } from 'express';

import SendCustomerTokenController from '../controllers/SendCustomerTokenController';
import ValidateCustomerTokenController from '../controllers/ValidateCustomerTokenController';

import SendCustomerTokenStoreValidator from '../validators/SendCustomerTokenStoreValidator';
import ValidateCustomerTokenStoreValidator from '../validators/ValidateCustomerTokenStoreValidator';

const routes = Router();
const sendCustomerTokenController = new SendCustomerTokenController();
const validateCustomerTokenController = new ValidateCustomerTokenController();

routes.post('/send', SendCustomerTokenStoreValidator, sendCustomerTokenController.store);

routes.post('/validate', ValidateCustomerTokenStoreValidator, validateCustomerTokenController.store);

export default routes;
