import { Request, Response, NextFunction, RequestHandler } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';

export default (request: Request, response: Response, next: NextFunction): RequestHandler => {
  return celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().required().messages({
        'any.required': `O campo 'nome' não pode estar vazio`,
        'string.empty': `O campo 'nome' não pode estar vazio`,
      }),
      price: Joi.number().required().min(0).messages({
        'any.required': `O campo 'preço' não pode estar vazio`,
        'number.base': `O campo 'preço' precisa ser um número`,
        'number.min': `O campo 'preço' precisa ser maior que zero`,
      }),
      category_id: Joi.string().uuid().required().messages({
        'any.required': `O campo 'categoria' não pode estar vazio`,
        'string.empty': `O campo 'categoria' não pode estar vazio`,
        'string.guid': `Insira uma categoria válida`,
      }),
    }),
  })(request, response, next);
};
