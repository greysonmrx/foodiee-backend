import { Router } from 'express';

import ProfileController from '../controllers/ProfileController';

import ProfileUpdateValidator from '../validators/ProfileUpdateValidator';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const routes = Router();
const profileController = new ProfileController();

routes.put('/', ensureAuthenticated, ProfileUpdateValidator, profileController.update);

export default routes;
