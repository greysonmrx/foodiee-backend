import ITenant from '../entities/ITenant';

import ICreateTenantsDTO from '../dtos/ICreateTenantsDTO';

interface ITenantsRepository {
  findById(id: string, relations?: Array<string>): Promise<ITenant | undefined>;
  findBySlug(slug: string, relations?: Array<string>): Promise<ITenant | undefined>;
  findAll(relations?: Array<string>): Promise<ITenant[]>;
  create(data: ICreateTenantsDTO): Promise<ITenant>;
  update(tenant: ITenant): Promise<ITenant>;
  delete(id: string): Promise<void>;
}

export default ITenantsRepository;
