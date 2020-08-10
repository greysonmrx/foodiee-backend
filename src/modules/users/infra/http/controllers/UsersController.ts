import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListUsersService from '@modules/users/services/ListUsersService';
import CreateUserService from '@modules/users/services/CreateUserService';
import DeleteUserService from '@modules/users/services/DeleteUserService';

class UsersController {
  public async index(request: Request, response: Response): Promise<Response> {
    const listUsers = container.resolve(ListUsersService);

    const users = await listUsers.execute({
      except_user_id: request.user.id,
      tenant_id: request.params.tenant,
    });

    return response.status(200).json(users);
  }

  public async store(request: Request, response: Response): Promise<Response> {
    const { name, email, password } = request.body;

    const createUser = container.resolve(CreateUserService);

    const user = await createUser.execute({
      name,
      email,
      password,
      tenant_id: request.params.tenant,
    });

    return response.status(201).json(user);
  }

  public async destroy(request: Request, response: Response): Promise<Response> {
    const { user, tenant } = request.params;

    const deleteUser = container.resolve(DeleteUserService);

    await deleteUser.execute({ id: user, tenant_id: tenant });

    return response.status(204).json();
  }
}

export default UsersController;
