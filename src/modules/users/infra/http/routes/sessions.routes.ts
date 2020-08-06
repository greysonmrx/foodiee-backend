import { Router } from 'express';

import SessionsController from '../controllers/SessionsController';

import SessionStoreValidator from '../validators/SessionStoreValidator';

const routes = Router();
const sessionsController = new SessionsController();

routes.post('/', SessionStoreValidator, sessionsController.store);

export default routes;
