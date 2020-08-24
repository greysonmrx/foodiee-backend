import request from 'supertest';

import app from '../../src/shared/infra/http/app';

async function getUserTokenJWT(email: string, password: string): Promise<string> {
  const response = await request(app).post('/sessions').send({
    email,
    password,
  });

  return response.body.token;
}

export default getUserTokenJWT;
