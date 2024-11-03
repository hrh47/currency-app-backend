const Koa = require('koa');
const Router = require('@koa/router');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');
const Joi = require('joi');

const app = new Koa();
const router = new Router();

const rates = {
  TWD: 1,
  USD: 31.565,
  HKD: 3.954,
  GBP: 40.04,
  AUD: 20.59,
  CAD: 22.44,
  SGD: 23.57,
  CHF: 36.05,
  JPY: 0.2007,
  ZAR: 1.766,
  SEK: 2.92,
  NZD: 18.61,
  THB: 0.815,
  PHP: 0.4815,
  IDR: 0.00168,
  EUR: 33.95,
  KRW: 0.02146,
  VND: 0.00104,
  MYR: 6.266,
  CNY: 4.385
};

const querySchema = Joi.object({
  base_currency: Joi.string()
    .valid(...Object.keys(rates))
    .required(),
  target_currency: Joi.string()
    .valid(...Object.keys(rates))
    .required()
});

router.get('/exchange-rate', async (ctx) => {
  const { value, error } = querySchema.validate(ctx.query);

  if (error) {
    error.statusCode = 400;
    throw error;
  }

  const { base_currency: baseCurrency, target_currency: targetCurrency } = value;

  ctx.status = 200;
  ctx.body = {
    base_currency: baseCurrency,
    target_currency: targetCurrency,
    exchange_rate: rates[baseCurrency] / rates[targetCurrency],
    timestamp: new Date()
  };
});

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    const noStacktrace = process.env.NODE_ENV === 'production';
    ctx.status = error.statusCode || error.status || 500;
    ctx.body = {
      status: ctx.status,
      message: error.message,
      stacktrace: noStacktrace ? undefined : error.stack.replace(/\n\s+/g, ' ')
    };
    ctx.app.emit('error', error, ctx);
  }
});
app.use(cors());
app.use(bodyParser());
app.use(router.routes()).use(router.allowedMethods());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
