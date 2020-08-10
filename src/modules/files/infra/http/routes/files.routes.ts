import { Router } from 'express';
import multer from 'multer';

import uploadConfig from '@config/upload';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

import FilesController from '../controllers/FilesController';

const upload = multer(uploadConfig.multer);

const routes = Router();
const filesController = new FilesController();

routes.post('/', ensureAuthenticated, upload.single('file'), filesController.store);

export default routes;
