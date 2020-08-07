import request from 'supertest';
import app from '../../src/shared/infra/http/app';

export default async function getTokenJWT(email: string, password: string): Promise<string> {
  const response = await request(app).post('/sessions').send({
    email,
    password,
  });

  return response.body.token;
}
