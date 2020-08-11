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
      id: Joi.string().uuid().required().messages({
        'any.required': `O campo 'produto' não pode estar vazio`,
        'string.empty': `O campo 'produto' não pode estar vazio`,
        'string.guid': `Insira um produto válido`,
      }),
      name: Joi.string().required().messages({
        'any.required': `O campo 'nome' não pode estar vazio`,
        'string.empty': `O campo 'nome' não pode estar vazio`,
      }),
      description: Joi.string().required().messages({
        'any.required': `O campo 'descrição' não pode estar vazio`,
        'string.empty': `O campo 'descrição' não pode estar vazio`,
      }),
      price: Joi.number().required().messages({
        'any.required': `O campo 'preço' não pode estar vazio`,
        'number.base': `O campo 'preço' precisa ser um número`,
      }),
      promotion_price: Joi.number().messages({ 'number.base': `O campo 'promoção' precisa ser um número` }),
      category_id: Joi.string().uuid().required().messages({
        'any.required': `O campo 'categoria' não pode estar vazio`,
        'string.empty': `O campo 'categoria' não pode estar vazio`,
        'string.guid': `Insira uma categoria válida`,
      }),
      image_id: Joi.string().uuid().messages({
        'string.empty': `O campo 'imagem' não pode estar vazio`,
        'string.guid': `Insira uma imagem válida`,
      }),
      paused: Joi.boolean().messages({
        'boolean.base': `O campo 'pausar as vendas' precisa ser um booleano`,
      }),
    }),
  })(request, response, next);
};
