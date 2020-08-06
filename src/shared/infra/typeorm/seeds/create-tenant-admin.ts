import { Seeder, Factory } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { hashSync } from 'bcryptjs';

const TenantAdminValue = {
  name: 'Fake Admin',
  email: 'fakeadmin@tenant.com.br',
  password: hashSync('123456', 8),
  created_at: new Date(),
  updated_at: new Date(),
};

export default class TenantAdmin implements Seeder {
  public async run(_factory: Factory, connection: Connection): Promise<void> {
    await connection.createQueryBuilder().insert().into('users').values(TenantAdminValue).execute();
  }
}
