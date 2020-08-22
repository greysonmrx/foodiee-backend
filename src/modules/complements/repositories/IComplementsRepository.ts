import IComplement from '../entities/IComplement';

import ICreateComplementsDTO from '../dtos/ICreateComplementsDTO';

interface IComplementsRepository {
  findById(id: string): Promise<IComplement | undefined>;
  create(data: ICreateComplementsDTO): Promise<IComplement>;
  update(complement: IComplement): Promise<IComplement>;
  delete(id: string): Promise<void>;
}

export default IComplementsRepository;
