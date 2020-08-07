import { Request, Response, NextFunction, RequestHandler } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';

export default (request: Request, response: Response, next: NextFunction): RequestHandler => {
  return celebrate({
    [Segments.BODY]: Joi.object().keys({
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
