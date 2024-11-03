import Koa from 'koa';
import Router from '@koa/router';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';

import validateQuery from './middlewares/validateQuery.js';
import handleError from './middlewares/handleError.js';
import getExchangeRate from './getExchangeRates.js';

const app = new Koa();
const router = new Router();

router.get('/exchange-rate', validateQuery, async (ctx) => {
  const { base_currency: baseCurrency, target_currency: targetCurrency } = ctx.query;
  const { rates, quotedDate } = await getExchangeRate();

  ctx.status = 200;
  ctx.body = {
    base_currency: baseCurrency,
    target_currency: targetCurrency,
    exchange_rate: rates[baseCurrency] / rates[targetCurrency],
    quoted_date: quotedDate
  };
});

app.use(handleError);
app.use(cors());
app.use(bodyParser());
app.use(router.routes()).use(router.allowedMethods());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
