import { Request, Response, NextFunction, RequestHandler } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';

export default (request: Request, response: Response, next: NextFunction): RequestHandler => {
  return celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().empty(),
      street: Joi.string().required().messages({
        'any.required': `O campo 'rua' não pode estar vazio`,
        'string.empty': `O campo 'rua' não pode estar vazio`,
      }),
      neighborhood: Joi.string().required().messages({
        'any.required': `O campo 'bairro' não pode estar vazio`,
        'string.empty': `O campo 'bairro' não pode estar vazio`,
      }),
      number: Joi.string().empty(),
      city: Joi.string().required().messages({
        'any.required': `O campo 'cidade' não pode estar vazio`,
        'string.empty': `O campo 'cidade' não pode estar vazio`,
      }),
      state: Joi.string().required().messages({
        'any.required': `O campo 'estado' não pode estar vazio`,
        'string.empty': `O campo 'estado' não pode estar vazio`,
      }),
      complement: Joi.string().empty(),
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
