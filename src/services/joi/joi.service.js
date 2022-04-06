import Joi from 'joi';

export const validateSchema = Joi.object({
  nickname: Joi.string().min(2).max(20),
  name: Joi.string().min(2).max(20),
  phone: Joi.string().max(13),
  bankName: Joi.string().min(2).max(20),
  bankOwner: Joi.string().min(2).max(20),
  bankAccount: Joi.string().min(2).max(100),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ['com', 'net'] },
  }),
  deleteBankImage: Joi.boolean(),
  // username: Joi.string().alphanum().min(3).max(30).required(),
  // password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
  // repeat_password: Joi.ref('password'),
  // access_token: [Joi.string(), Joi.number()],
  // birth_year: Joi.number().integer().min(1900).max(2013),
});
