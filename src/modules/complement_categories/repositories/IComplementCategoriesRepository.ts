import IComplementCategory from '../entities/IComplementCategory';

import ICreateComplementCategoriesDTO from '../dtos/ICreateComplementCategoriesDTO';

interface IComplementCategoriesRepository {
  findById(id: string): Promise<IComplementCategory | undefined>;
  create(data: ICreateComplementCategoriesDTO): Promise<IComplementCategory>;
  update(complementCategory: IComplementCategory): Promise<IComplementCategory>;
  delete(id: string): Promise<void>;
}

export default IComplementCategoriesRepository;
