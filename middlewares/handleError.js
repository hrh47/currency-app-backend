const handleError = async (ctx, next) => {
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
};

export default handleError;
