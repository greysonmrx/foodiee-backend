import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListAddressesService from '@modules/addresses/services/ListAddressesService';
import CreateAddressService from '@modules/addresses/services/CreateAddressService';
import UpdateAddressService from '@modules/addresses/services/UpdateAddressService';
import DeleteAddressService from '@modules/addresses/services/DeleteAddressService';

class AddressesController {
  public async index(request: Request, response: Response): Promise<Response> {
    const listAddresses = container.resolve(ListAddressesService);

    const addresses = await listAddresses.execute({ customer_id: request.customer.id });

    return response.status(200).json(addresses);
  }

  public async store(request: Request, response: Response): Promise<Response> {
    const { name, street, neighborhood, number, city, state, complement, latitude, longitude } = request.body;

    const createAddress = container.resolve(CreateAddressService);

    const address = await createAddress.execute({
      customer_id: request.customer.id,
      name,
      street,
      neighborhood,
      number,
      city,
      state,
      complement,
      latitude,
      longitude,
    });

    return response.status(201).json(address);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { name, street, neighborhood, number, city, state, complement, latitude, longitude } = request.body;

    const updateAddress = container.resolve(UpdateAddressService);

    const address = await updateAddress.execute({
      id: request.params.id,
      name,
      street,
      neighborhood,
      number,
      city,
      state,
      complement,
      latitude,
      longitude,
    });

    return response.status(200).json(address);
  }

  public async destroy(request: Request, response: Response): Promise<Response> {
    const deleteAddress = container.resolve(DeleteAddressService);

    await deleteAddress.execute({ id: request.params.id });

    return response.status(204).json();
  }
}

export default AddressesController;
