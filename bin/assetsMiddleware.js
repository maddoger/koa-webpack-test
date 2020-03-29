// assets.json provider
// it gets assets from json or from function
module.exports = (assetsJsonOrGetter) => {
  if (typeof assetsJsonOrGetter === 'function') {
    return async (ctx, next) => {
      ctx.state.assets = assetsJsonOrGetter()

      await next()
    }
  } 
  
  return async (ctx, next) => {
    ctx.state.assets = assetsJsonOrGetter

    await next()
  }
}
