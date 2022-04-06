import Joi from 'joi';

module.exports = {
  schemaCastCode: Joi.object({
    castCode: Joi.string().pattern(/^[\w-]+$/),
  }).unknown(),
  sendSubtitle: Joi.object({
    message: Joi.string().empty(''),
    to: Joi.array()
      .min(1)
      .items(
        Joi.string()
          .min(2)
          .max(2)
          .pattern(/^[a-z]+$/),
      )
      .required(),
    from: Joi.string()
      .min(2)
      .max(2)
      .pattern(/^[a-z]+$/)
      .required(),
  }),
  schemaComment: Joi.object({
    type: Joi.any().valid('channel', 'live').required(),
    limit: Joi.number().integer().optional(),
    offset: Joi.number().integer().optional(),
  }).unknown(),
  schemaCommentMessage: Joi.object({
    type: Joi.any().valid('channel', 'live').required(),
    message: Joi.string().min(1).max(260).required(),
    castCode: Joi.string().min(2).max(100).optional(),
    castId: Joi.string().min(2).max(100).optional(),
  }),
  schemaType: Joi.object({
    type: Joi.any().valid('channel', 'live').required(),
    castCode: Joi.string().min(2).max(100).optional(),
    castId: Joi.string().min(2).max(100).optional(),
  }),
};
