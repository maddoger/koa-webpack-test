const Koa = require('koa')
const webpack = require('webpack')

const { webpackServer, assetsMiddleware } = require('./kws')
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
  const { middleware } = server

  app.use(assetsMiddleware(assetsGetter('assets.json'), 'assets'))

  for (let m of middleware) {
    app.use(m)    
  }

  app.listen(port, () => {
    console.log(`server started in dev at port %s`, port)
  })
}).catch((err) => {
  console.log(err)
})