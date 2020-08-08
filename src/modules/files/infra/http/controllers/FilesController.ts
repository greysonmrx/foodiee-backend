import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateFileService from '@modules/files/services/CreateFileService';

class FilesController {
  public async store(request: Request, response: Response): Promise<Response> {
    const { originalname: name, filename: path } = request.file;
    const createFile = container.resolve(CreateFileService);

    const file = await createFile.execute({ name, path });

    return response.status(201).json(file);
  }
}

export default FilesController;
