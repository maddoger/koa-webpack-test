// assets.json provider
// it gets assets from json or from function and provides them from ctx.state
module.exports = (assetsJsonOrGetter, stateKey = 'assets') => {
  if (typeof assetsJsonOrGetter === 'function') {
    return async (ctx, next) => {
      ctx.state[stateKey] = assetsJsonOrGetter()

      await next()
    }
  }

  return async (ctx, next) => {
    ctx.state[stateKey] = assetsJsonOrGetter

    await next()
  }
}
