import ITenant from '../entities/ITenant';

import ICreateTenantsDTO from '../dtos/ICreateTenantsDTO';

interface ITenantsRepository {
  findById(id: string): Promise<ITenant | undefined>;
  findBySlug(slug: string): Promise<ITenant | undefined>;
  create(data: ICreateTenantsDTO): Promise<ITenant>;
  delete(id: string): Promise<void>;
}

export default ITenantsRepository;
