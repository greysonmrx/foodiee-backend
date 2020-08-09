import ITenant from '../entities/ITenant';

import ICreateTenantsDTO from '../dtos/ICreateTenantsDTO';

interface ITenantsRepository {
  findBySlug(slug: string): Promise<ITenant | undefined>;
  create(data: ICreateTenantsDTO): Promise<ITenant>;
}

export default ITenantsRepository;
