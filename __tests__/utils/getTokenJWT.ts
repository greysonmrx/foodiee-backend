import request from 'supertest';
import app from '../../src/shared/infra/http/app';

export default async function getTokenJWT(): Promise<string> {
  const response = await request(app).post('/sessions').send({
    email: 'fakeadmin@tenant.com.br',
    password: '123456',
  });

  return response.body.token;
}
