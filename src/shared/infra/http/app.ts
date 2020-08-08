import 'reflect-metadata';
import 'dotenv/config';

import express, { Express, Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import cors from 'cors';
import { errors } from 'celebrate';

import createConnection from '@shared/infra/typeorm';
import AppError from '@shared/errors/AppError';
import uploadConfig from '@config/upload';
import routes from './routes';

import '@shared/container';

class App {
  public server: Express;

  constructor() {
    createConnection();
    this.server = express();

    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

  private middlewares(): void {
    this.server.use(cors());
    this.server.use(express.json());
    this.server.use('/files', express.static(uploadConfig.uploadsFolder));
  }

  private routes(): void {
    this.server.use(routes);
  }

  private exceptionHandler(): void {
    this.server.use(errors());

    this.server.use((err: Error, request: Request, response: Response, _next: NextFunction) => {
      if (err instanceof AppError) {
        return response.status(err.statusCode).json({
          status: 'error',
          message: err.message,
        });
      }

      // eslint-disable-next-line
      console.log(err);

      return response.status(500).json({
        status: 'error',
        message: 'Erro interno do servidor.',
      });
    });
  }
}

export default new App().server;
