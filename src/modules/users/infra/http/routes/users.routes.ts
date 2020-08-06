import { Router } from 'express';

import UsersController from '../controllers/UsersController';

import UserStoreValidator from '../validators/UserStoreValidator';

const routes = Router();
const usersController = new UsersController();

routes.post('/', UserStoreValidator, usersController.store);

export default routes;
