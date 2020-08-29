import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ValidateCustomerTokenService from '@modules/customers/services/ValidateCustomerTokenService';

class ValidateCustomerTokenController {
  public async store(request: Request, response: Response): Promise<Response> {
    const { token: customerToken, phone } = request.body;

    const validateCustomerToken = container.resolve(ValidateCustomerTokenService);

    const { customer, token } = await validateCustomerToken.execute({ phone, token: customerToken });

    return response.status(201).json({ customer, token });
  }
}

export default ValidateCustomerTokenController;
