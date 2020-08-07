import { Request, Response } from 'express';
import { container } from 'tsyringe';

import UpdateProfileService from '@modules/users/services/UpdateProfileService';

class ProfileController {
  public async update(request: Request, response: Response): Promise<Response> {
    const { name, email, password, current_password } = request.body;

    const updateProfile = container.resolve(UpdateProfileService);

    const user = await updateProfile.execute({
      user_id: request.user.id,
      name,
      email,
      password,
      current_password,
    });

    return response.status(200).json(user);
  }
}

export default ProfileController;
