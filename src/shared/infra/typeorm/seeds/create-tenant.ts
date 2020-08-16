import { Seeder, Factory } from 'typeorm-seeding';
import { Connection } from 'typeorm';

const TenantValue = {
  name: "McDonald's",
  slug: 'mc-donalds',
  created_at: new Date(),
  updated_at: new Date(),
};

export default class TenantAdmin implements Seeder {
  public async run(_factory: Factory, connection: Connection): Promise<void> {
    await connection.createQueryBuilder().insert().into('tenants').values(TenantValue).execute();
  }
}
