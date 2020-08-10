import { v4 } from 'uuid';

import Tenant from '@modules/tenants/entities/fakes/Tenant';
import ICreateTenantDTO from '@modules/tenants/dtos/ICreateTenantsDTO';

import ITenant from '@modules/tenants/entities/ITenant';
import ITenantsRepository from '../ITenantsRepository';

class FakeTenantsRepository implements ITenantsRepository {
  private tenants: Tenant[] = [];

  public async findById(id: string): Promise<Tenant | undefined> {
    const findTenant = this.tenants.find(tenant => tenant.id === id);

    return findTenant;
  }

  public async findBySlug(slug: string): Promise<Tenant | undefined> {
    const findTenant = this.tenants.find(tenant => tenant.slug === slug);

    return findTenant;
  }

  public async findAll(): Promise<Tenant[]> {
    return this.tenants;
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

  public async update(tenant: ITenant): Promise<ITenant> {
    const findIndex = this.tenants.findIndex(findTenant => findTenant.id === tenant.id);

    this.tenants[findIndex] = tenant;

    return tenant;
  }

  public async delete(id: string): Promise<void> {
    this.tenants = this.tenants.filter(tenant => tenant.id !== id);
  }
}

export default FakeTenantsRepository;
