import { Router } from 'express';

import UsersController from '../controllers/UsersController';
import UserAvatarController from '../controllers/UserAvatarController';

import UserStoreValidator from '../validators/UserStoreValidator';
import UserAvatarUpdateValidator from '../validators/UserAvatarUpdateValidator';
import UserDestroyValidator from '../validators/UserDestroyValidator';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const routes = Router();
const usersController = new UsersController();
const userAvatarController = new UserAvatarController();

routes.get('/', ensureAuthenticated, usersController.index);
routes.post('/', ensureAuthenticated, UserStoreValidator, usersController.store);
routes.patch('/', ensureAuthenticated, UserAvatarUpdateValidator, userAvatarController.update);
routes.delete('/:id', ensureAuthenticated, UserDestroyValidator, usersController.destroy);

export default routes;
