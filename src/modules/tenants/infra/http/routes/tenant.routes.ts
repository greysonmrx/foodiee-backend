import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

import TenantsController from '../controllers/TenantsController';
import TenantLogoController from '../controllers/TenantLogoController';

import TenantStoreValidator from '../validators/TenantStoreValidator';
import TenantUpdateValidator from '../validators/TenantUpdateValidator';
import TenantLogoUpdateValidator from '../validators/TenantLogoUpdateValidator';
import TenantDeleteValidator from '../validators/TenantDeleteValidator';

const routes = Router();
const tenantsController = new TenantsController();
const tenantLogoController = new TenantLogoController();

routes.get('/', ensureAuthenticated, tenantsController.index);
routes.post('/', ensureAuthenticated, TenantStoreValidator, tenantsController.store);
routes.put('/:id', ensureAuthenticated, TenantUpdateValidator, tenantsController.update);
routes.patch('/:id', ensureAuthenticated, TenantLogoUpdateValidator, tenantLogoController.update);
routes.delete('/:id', ensureAuthenticated, TenantDeleteValidator, tenantsController.destroy);

export default routes;
