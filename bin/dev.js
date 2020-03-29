const Koa = require('koa')
const webpack = require('webpack')

const { webpackServer } = require('./kws')
const assetsMiddleware = require('./assetsMiddleware')
const config = require('../webpack.config')

const port = process.env.PORT || 3000
const app = new Koa()

webpackServer(app, {
  compilers: webpack(config),
  dev: Object.assign({
    noInfo: true,
    stats: 'minimal',
    serverSideRender: true,
    publicPath: '/',
  }, config.devServer || {}),
  hotClient: {
    allEntries: true
  },
}).then(({ assetsGetter, server }) => {
  const { middlewares } = server
  console.log(server)

  app.use(assetsMiddleware(assetsGetter))

  for (let middleware of middlewares) {
    app.use(middleware)    
  }

  app.listen(port, () => {
    console.log(`server started in dev at port %s`, port)
  })
}).catch((err) => {
  console.log(err)
})