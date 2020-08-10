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
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().required().messages({
        'any.required': `O campo 'nome' não pode estar vazio`,
        'string.empty': `O campo 'nome' não pode estar vazio`,
      }),
      email: Joi.string().email().required().messages({
        'any.required': `O campo 'e-mail' não pode estar vazio`,
        'string.empty': `O campo 'e-mail' não pode estar vazio`,
        'string.email': `Insira um e-mail válido`,
      }),
      password: Joi.string().min(6).required().messages({
        'any.required': `O campo 'senha' não pode estar vazio`,
        'string.empty': `O campo 'senha' não pode estar vazio`,
        'string.min': `O campo 'senha' tem que ter pelo menos {#limit} dígitos`,
      }),
    }),
  })(request, response, next);
};
