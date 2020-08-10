import { Repository, getRepository } from 'typeorm';

import ICreateTenantsDTO from '@modules/tenants/dtos/ICreateTenantsDTO';
import ITenantsRepository from '@modules/tenants/repositories/ITenantsRepository';

import Tenant from '../entities/Tenant';

class TenantsRepository implements ITenantsRepository {
  private ormRepository: Repository<Tenant>;

  constructor() {
    this.ormRepository = getRepository(Tenant);
  }

  public async findById(id: string, relations: Array<string>): Promise<Tenant | undefined> {
    const findTenant = await this.ormRepository.findOne({
      where: { id },
      relations,
    });

    return findTenant;
  }

  public async findBySlug(slug: string, relations: Array<string>): Promise<Tenant | undefined> {
    const findTenant = await this.ormRepository.findOne({
      where: { slug },
      relations,
    });

    return findTenant;
  }

  public async findAll(relations: Array<string>): Promise<Tenant[]> {
    const tenants = await this.ormRepository.find({
      relations,
    });

    return tenants;
  }

  public async create(data: ICreateTenantsDTO): Promise<Tenant> {
    const tenant = this.ormRepository.create(data);

    await this.ormRepository.save(tenant);

    return tenant;
  }

  public async update(tenant: Tenant): Promise<Tenant> {
    await this.ormRepository.save(tenant);

    return tenant;
  }

  public async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }
}

export default TenantsRepository;
