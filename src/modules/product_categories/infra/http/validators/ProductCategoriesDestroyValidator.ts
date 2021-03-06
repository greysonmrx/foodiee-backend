import { Request, Response, NextFunction, RequestHandler } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';

export default (request: Request, response: Response, next: NextFunction): RequestHandler => {
  return celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      product_category: Joi.string().uuid().required().messages({
        'any.required': `O parâmetro 'categoria' não pode estar vazio`,
        'string.empty': `O parâmetro 'categoria' não pode estar vazio`,
        'string.guid': `Insira uma categoria válida`,
      }),
      tenant: Joi.string().uuid().required().messages({
        'any.required': `O parâmetro 'loja' não pode estar vazio`,
        'string.empty': `O parâmetro 'loja' não pode estar vazio`,
        'string.guid': `Insira uma loja válida`,
      }),
    }),
  })(request, response, next);
};
