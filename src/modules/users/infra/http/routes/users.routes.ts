import { Router } from 'express';

import UsersController from '../controllers/UsersController';

import UserStoreValidator from '../validators/UserStoreValidator';
import UserDestroyValidator from '../validators/UserDestroyValidator';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const routes = Router();
const usersController = new UsersController();

routes.post('/', ensureAuthenticated, UserStoreValidator, usersController.store);
routes.delete('/:id', ensureAuthenticated, UserDestroyValidator, usersController.destroy);

export default routes;
