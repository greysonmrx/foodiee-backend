import { Repository, getRepository } from 'typeorm';

import IComplementsRepository from '@modules/complements/repositories/IComplementsRepository';
import ICreateComplementsDTO from '@modules/complements/dtos/ICreateComplementsDTO';

import Complement from '../entities/Complement';

class ComplementsRepository implements IComplementsRepository {
  private ormRepository: Repository<Complement>;

  constructor() {
    this.ormRepository = getRepository(Complement);
  }

  public async findById(id: string): Promise<Complement | undefined> {
    const complement = await this.ormRepository.findOne({
      where: { id },
    });

    return complement;
  }

  public async create({ name, price, category_id }: ICreateComplementsDTO): Promise<Complement> {
    const complement = this.ormRepository.create({
      name,
      price,
      category_id,
    });

    await this.ormRepository.save(complement);

    return complement;
  }

  public async update(complement: Complement): Promise<Complement> {
    await this.ormRepository.save(complement);

    return complement;
  }

  public async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }
}

export default ComplementsRepository;
