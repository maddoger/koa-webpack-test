const Koa = require('koa')
const { webpackServer } = require('./kws')
const webpack = require('webpack');

const config = require('../webpack.config')

const port = process.env.PORT || 3000
const app = new Koa()

webpackServer(app, {
  compilers: webpack(config),
  dev: {
    noInfo: false,
    quiet: true,
    serverSideRender: true,
    publicPath: '/',
  },
  hotClient: {
    allEntries: true
  },
}).then(({ middlewares }) => {
  // hot-middlewares: you may try making any changes from middlewares,
  // it will automatically rebuild and reload,
  // so that you don't have to reboot your server to see the changes.

  const { assets, renderPage } = middlewares
  
  app.use(assets)
  app.use(renderPage)

  app.listen(port, () => {
    console.log(`server started at port %s`, port)
  })
}).catch((err) => {
  console.log(err)
})