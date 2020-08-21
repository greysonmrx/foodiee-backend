import { Request, Response, NextFunction, RequestHandler } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';

export default (request: Request, response: Response, next: NextFunction): RequestHandler => {
  return celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.string().uuid().required().messages({
        'any.required': `O parâmetro 'complemento' não pode estar vazio`,
        'string.empty': `O parâmetro 'complemento' não pode estar vazio`,
        'string.guid': `Insira um complemento válido`,
      }),
    }),
  })(request, response, next);
};
