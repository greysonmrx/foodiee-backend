import { Request, Response, NextFunction, RequestHandler } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';

export default (request: Request, response: Response, next: NextFunction): RequestHandler => {
  return celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.string().uuid().required().messages({
        'any.required': `O parâmetro 'categoria de complemento' não pode estar vazio`,
        'string.empty': `O parâmetro 'categoria de complemento' não pode estar vazio`,
        'string.guid': `Insira uma categoria de complemento válida`,
      }),
    }),
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().required().messages({
        'any.required': `O campo 'nome' não pode estar vazio`,
        'string.empty': `O campo 'nome' não pode estar vazio`,
      }),
      max: Joi.number().required().min(1).messages({
        'any.required': `O campo 'qtd. máxima' não pode estar vazio`,
        'number.base': `O campo 'qtd. máxima' precisa ser um número`,
        'number.min': `O campo 'qtd. máxima' precisa ser maior que zero`,
      }),
      min: Joi.number().required().min(0).messages({
        'any.required': `O campo 'qtd. mínima' não pode estar vazio`,
        'number.base': `O campo 'qtd. mínima' precisa ser um número`,
        'number.min': `O campo 'qtd. mínima' precisa ser maior ou igual a zero`,
      }),
      required: Joi.boolean().required().messages({
        'any.required': `O campo 'complemento obrigatório' não pode estar vazio`,
        'boolean.base': `O campo 'complemento obrigatório' precisa ser um booleano`,
      }),
    }),
  })(request, response, next);
};
