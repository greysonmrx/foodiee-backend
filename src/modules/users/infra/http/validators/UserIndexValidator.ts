import { Request, Response, NextFunction, RequestHandler } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';

export default (request: Request, response: Response, next: NextFunction): RequestHandler => {
  return celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      tenant: Joi.string().uuid().required().messages({
        'any.required': `O campo 'loja' não pode estar vazio`,
        'string.empty': `O campo 'loja' não pode estar vazio`,
        'string.guid': `Insira uma loja válida`,
      }),
    }),
  })(request, response, next);
};
