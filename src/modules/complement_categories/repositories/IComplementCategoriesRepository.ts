import IComplementCategory from '../entities/IComplementCategory';

import ICreateComplementCategoriesDTO from '../dtos/ICreateComplementCategoriesDTO';

interface IComplementCategoriesRepository {
  create(data: ICreateComplementCategoriesDTO): Promise<IComplementCategory>;
}

export default IComplementCategoriesRepository;
