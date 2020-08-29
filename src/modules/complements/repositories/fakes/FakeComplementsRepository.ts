import { v4 } from 'uuid';

import Complement from '@modules/complements/entities/fakes/Complement';
import ICreateComplementsDTO from '@modules/complements/dtos/ICreateComplementsDTO';

import IComplementsRepository from '../IComplementsRepository';

class FakeComplementsRepository implements IComplementsRepository {
  private complements: Complement[] = [];

  public async findById(id: string): Promise<Complement | undefined> {
    const findComplement = this.complements.find(complement => complement.id === id);

    return findComplement;
  }

  public async create({ name, price, category_id }: ICreateComplementsDTO): Promise<Complement> {
    const complement = new Complement();

    Object.assign(complement, {
      id: v4(),
      name,
      price,
      category_id,
      created_at: String(new Date()),
      updated_at: String(new Date()),
    });

    this.complements.push(complement);

    return complement;
  }

  public async update(complement: Complement): Promise<Complement> {
    const findIndex = this.complements.findIndex(findComplement => findComplement.id === complement.id);

    this.complements[findIndex] = complement;

    return complement;
  }

  public async delete(id: string): Promise<void> {
    this.complements = this.complements.filter(complement => complement.id !== id);
  }
}

export default FakeComplementsRepository;
