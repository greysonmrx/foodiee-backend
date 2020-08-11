import { Request, Response, NextFunction, RequestHandler } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';

export default (request: Request, response: Response, next: NextFunction): RequestHandler => {
  return celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      tenant: Joi.string().uuid().required().messages({
        'any.required': `O parâmetro 'loja' não pode estar vazio`,
        'string.empty': `O parâmetro 'loja' não pode estar vazio`,
        'string.guid': `Insira uma loja válida`,
      }),
    }),
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().required().messages({
        'any.required': `O campo 'nome' não pode estar vazio`,
        'string.empty': `O campo 'nome' não pode estar vazio`,
      }),
    }),
  })(request, response, next);
};
