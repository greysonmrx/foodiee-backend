import { Router } from 'express';

import ensureAuthenticated from '@modules/customers/infra/http/middlewares/ensureAuthenticated';

import AddressesController from '../controllers/AddressesController';

import AddressStoreValidator from '../validators/AddressStoreValidator';
import AddressUpdateValidator from '../validators/AddressUpdateValidator';
import AddressDestroyValidator from '../validators/AddressDestroyValidator';

const routes = Router();
const addressesController = new AddressesController();

routes.get('/', ensureAuthenticated, addressesController.index);
routes.post('/', ensureAuthenticated, AddressStoreValidator, addressesController.store);
routes.put('/:id', ensureAuthenticated, AddressUpdateValidator, addressesController.update);
routes.delete('/:id', ensureAuthenticated, AddressDestroyValidator, addressesController.destroy);

export default routes;
