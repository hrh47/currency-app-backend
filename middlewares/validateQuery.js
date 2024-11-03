const Joi = require('joi');

const validCurrencyCodes = [
  'TWD',
  'USD',
  'HKD',
  'GBP',
  'AUD',
  'CAD',
  'SGD',
  'CHF',
  'JPY',
  'ZAR',
  'SEK',
  'NZD',
  'THB',
  'PHP',
  'IDR',
  'EUR',
  'KRW',
  'VND',
  'MYR',
  'CNY'
];
const querySchema = Joi.object({
  base_currency: Joi.string()
    .valid(...validCurrencyCodes)
    .required(),
  target_currency: Joi.string()
    .valid(...validCurrencyCodes)
    .required()
});

const validateQuery = async (ctx, next) => {
  const { error } = querySchema.validate(ctx.query);

  if (error) {
    error.statusCode = 400;
    throw error;
  }

  await next();
};

module.exports = validateQuery;
