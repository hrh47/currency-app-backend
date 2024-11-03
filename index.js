const Koa = require('koa');
const Router = require('@koa/router');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');

const app = new Koa();
const router = new Router();

router.get('/exchange-rate', async (ctx) => {
  ctx.status = 200;
  ctx.body = {
    base_currency: 'TWD',
    target_currency: 'USD',
    exchange_rate: 0.03102,
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
