import { Seeder, Factory } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { hashSync } from 'bcryptjs';

const TenantUserValue = {
  name: 'Fake User',
  email: 'fakeuser@tenant.com.br',
  password: hashSync('123456', 8),
  created_at: new Date(),
  updated_at: new Date(),
};

export default class TenantUser implements Seeder {
  public async run(_factory: Factory, connection: Connection): Promise<void> {
    await connection.createQueryBuilder().insert().into('users').values(TenantUserValue).execute();
  }
}
