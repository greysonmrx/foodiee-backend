import { Request, Response, NextFunction, RequestHandler } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';

export default (request: Request, response: Response, next: NextFunction): RequestHandler => {
  return celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      product: Joi.string().uuid().required().messages({
        'any.required': `O parâmetro 'produto' não pode estar vazio`,
        'string.empty': `O parâmetro 'produto' não pode estar vazio`,
        'string.guid': `Insira um produto válido`,
      }),
      tenant: Joi.string().uuid().required().messages({
        'any.required': `O parâmetro 'loja' não pode estar vazio`,
        'string.empty': `O parâmetro 'loja' não pode estar vazio`,
        'string.guid': `Insira uma loja válida`,
      }),
    }),
  })(request, response, next);
};
