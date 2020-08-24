import { Request, Response } from 'express';
import { container } from 'tsyringe';

import SendCustomerTokenService from '@modules/customers/services/SendCustomerTokenService';

class SendCustomerTokenController {
  public async store(request: Request, response: Response): Promise<Response> {
    const sendCustomerToken = container.resolve(SendCustomerTokenService);

    await sendCustomerToken.execute({ phone: request.body.phone });

    return response.status(204).json();
  }
}

export default SendCustomerTokenController;
