import { v4 } from 'uuid';

import Tenant from '@modules/tenants/entities/fakes/Tenant';
import ICreateTenantDTO from '@modules/tenants/dtos/ICreateTenantsDTO';

import ITenantsRepository from '../ITenantsRepository';

class FakeTenantsRepository implements ITenantsRepository {
  private tenants: Tenant[] = [];

  public async findBySlug(slug: string): Promise<Tenant | undefined> {
    const findTenant = this.tenants.find(tenant => tenant.slug === slug);

    return findTenant;
  }

  public async create({ name, slug }: ICreateTenantDTO): Promise<Tenant> {
    const tenant = new Tenant();

    Object.assign(tenant, {
      id: v4(),
      name,
      slug,
      created_at: String(new Date()),
      updated_at: String(new Date()),
    });

    this.tenants.push(tenant);

    return tenant;
  }
}

export default FakeTenantsRepository;
