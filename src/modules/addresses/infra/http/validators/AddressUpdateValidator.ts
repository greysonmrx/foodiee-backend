import { Request, Response, NextFunction, RequestHandler } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';

export default (request: Request, response: Response, next: NextFunction): RequestHandler => {
  return celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.string().uuid().required().messages({
        'any.required': `O parâmetro 'endereço' não pode estar vazio`,
        'string.empty': `O parâmetro 'endereço' não pode estar vazio`,
        'string.guid': `Insira um endereço válido`,
      }),
    }),
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().messages({
        'string.empty': `O campo 'nome' não pode estar vazio`,
      }),
      street: Joi.string().required().messages({
        'any.required': `O campo 'rua' não pode estar vazio`,
        'string.empty': `O campo 'rua' não pode estar vazio`,
      }),
      neighborhood: Joi.string().required().messages({
        'any.required': `O campo 'bairro' não pode estar vazio`,
        'string.empty': `O campo 'bairro' não pode estar vazio`,
      }),
      number: Joi.string().messages({
        'string.empty': `O campo 'número' não pode estar vazio`,
      }),
      city: Joi.string().required().messages({
        'any.required': `O campo 'cidade' não pode estar vazio`,
        'string.empty': `O campo 'cidade' não pode estar vazio`,
      }),
      state: Joi.string().required().messages({
        'any.required': `O campo 'estado' não pode estar vazio`,
        'string.empty': `O campo 'estado' não pode estar vazio`,
      }),
      complement: Joi.string().messages({
        'string.empty': `O campo 'complemento' não pode estar vazio`,
      }),
      latitude: Joi.number().required().messages({
        'any.required': `O campo 'latitude' não pode estar vazio`,
        'number.base': `O campo 'longitude' precisa ser um número`,
      }),
      longitude: Joi.number().required().messages({
        'any.required': `O campo 'longitude' não pode estar vazio`,
        'number.base': `O campo 'longitude' precisa ser um número`,
      }),
    }),
  })(request, response, next);
};
