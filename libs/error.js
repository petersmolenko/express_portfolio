module.exports = async(ctx, next) => {
  try {
    await next();
    if (ctx.status === 404) {
      let err = {
        status: ctx.response.status,
        error: ctx.response.message
      }
     await ctx
        .render('error', {error: `${err.status}. Вы заблудились!`})
    }
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = err.message;
    console.log(err);
    await ctx
      .render('error', {error: `${err.status}. ${err.message}`})
  }
}