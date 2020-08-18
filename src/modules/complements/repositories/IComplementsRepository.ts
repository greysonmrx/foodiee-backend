import IComplement from '../entities/IComplement';

import ICreateComplementsDTO from '../dtos/ICreateComplementsDTO';

interface IComplementsRepository {
  create(data: ICreateComplementsDTO): Promise<IComplement>;
}

export default IComplementsRepository;
