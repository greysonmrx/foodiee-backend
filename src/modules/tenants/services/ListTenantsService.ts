import { inject, injectable } from 'tsyringe';
import { classToClass } from 'class-transformer';

import ITenant from '../entities/ITenant';
import ITenantsRepository from '../repositories/ITenantsRepository';

@injectable()
class ListTenantsService {
  constructor(
    @inject('TenantsRepository')
    private tenantsRepository: ITenantsRepository,
  ) {
    /* Anything */
  }

  public async execute(): Promise<ITenant[]> {
    const tenants = await this.tenantsRepository.findAll(['logo']);

    return classToClass(tenants);
  }
}

export default ListTenantsService;
