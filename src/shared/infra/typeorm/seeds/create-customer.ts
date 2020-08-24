import { Seeder, Factory } from 'typeorm-seeding';
import { Connection } from 'typeorm';

const CustomerValue = {
  name: 'Rebeca Araujo Martins',
  phone: '14962649627',
  email: 'RebecaAraujoMartins@teleworm.us',
  created_at: new Date(),
  updated_at: new Date(),
};

export default class TenantAdmin implements Seeder {
  public async run(_factory: Factory, connection: Connection): Promise<void> {
    await connection.createQueryBuilder().insert().into('customers').values(CustomerValue).execute();
  }
}
