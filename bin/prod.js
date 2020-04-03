const path = require('path')
const Koa = require('koa')
const koaStatic = require('koa-static')
const assetsMiddleware = require('./kws/assetsMiddleware')

const port = process.env.PORT || 3000
const app = new Koa()

const { middleware } = require('../site-build/server')
const assetsJson = require('../site-build/assets.json')
  
app.use(koaStatic(path.resolve(__dirname, '..', 'site-build')))
app.use(assetsMiddleware(assetsJson, 'assets'))

for (let m of middleware) {
  app.use(m)    
}

app.listen(port, () => {
  console.log(`server started in prod at port %s`, port)
})