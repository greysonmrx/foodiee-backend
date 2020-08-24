import request from 'supertest';
import { getRepository } from 'typeorm';

import CustomerToken from '../../src/modules/customers/infra/typeorm/entities/CustomerToken';
import Customer from '../../src/modules/customers/infra/typeorm/entities/Customer';

import app from '../../src/shared/infra/http/app';

async function getCustomerTokenJWT(phone: string, token: string): Promise<string> {
  const customersRepository = getRepository(Customer);
  const customerTokensRepository = getRepository(CustomerToken);

  const customer = await customersRepository.findOne({
    where: { phone },
  });

  if (customer) {
    await customerTokensRepository.save(
      customerTokensRepository.create({
        token,
        customer_id: customer.id,
      }),
    );
  }

  const response = await request(app).post('/customer_tokens/validate').send({
    phone,
    token,
  });

  return response.body.token;
}

export default getCustomerTokenJWT;
