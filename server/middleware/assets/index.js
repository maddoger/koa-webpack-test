const assets = async (ctx, next) => {
  const clientStats = ctx.state.webpackStats.toJson().children.find((stats) => stats.name === 'client')
  
  ctx.assets = clientStats.assetsByChunkName

  await next()
}

export default assets