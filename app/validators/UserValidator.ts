import * as Joi from '@hapi/joi'

export const userValidationSchema = Joi.object({
    id: Joi.string(),
    login: Joi.string().required(),
    password: Joi.string()
    .regex(new RegExp('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$')).required(),
    age: Joi.number().min(4).max(130).required(),
});

export const loginValidationScheme = Joi.object({
    login: Joi.string().required(),
    password: Joi.string()
    .regex(new RegExp('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$')).required(),
});
