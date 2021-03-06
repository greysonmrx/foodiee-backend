import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IAddressesRepository from '../repositories/IAddressesRepository';

interface Request {
  id: string;
}

@injectable()
class DeleteAddressService {
  constructor(
    @inject('AddressesRepository')
    private addressesRepository: IAddressesRepository,
  ) {
    // Anything
  }

  public async execute({ id }: Request): Promise<void> {
    const address = await this.addressesRepository.findById(id);

    if (!address) {
      throw new AppError('Endereço não encontrado.', 404);
    }

    await this.addressesRepository.delete(id);
  }
}

export default DeleteAddressService;
