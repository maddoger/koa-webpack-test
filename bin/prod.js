const path = require('path')
const Koa = require('koa')
const koaStatic = require('koa-static')
const assetsMiddleware = require('./assetsMiddleware')

const port = process.env.PORT || 3000
const app = new Koa()

const { middlewares } = require('../site-build/server')
const assetsJson = require('../site-build/assets.json')
  
app.use(koaStatic(path.resolve(__dirname, '..', 'site-build')))
app.use(assetsMiddleware(assetsJson))

for (let middleware of middlewares) {
  app.use(middleware)    
}

app.listen(port, () => {
  console.log(`server started in prod at port %s`, port)
})