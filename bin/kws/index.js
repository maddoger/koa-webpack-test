const path = require('path')
const requireFromString = require('require-from-string')
const devMiddleware = require('./devMiddleware')
const assetsMiddleware = require('./assetsMiddleware')


const findCompiler = (compilers, name) => {
  let result = null
  if (compilers && Array.isArray(compilers.compilers)) {
    result = compilers.compilers.find((compiler) => compiler.name === name)
  }
  else if (compilers && compilers.name === name) {
    result = compilers
  }

  if (!result) {
    throw new Error(`No webpack compiler found named '${name}', please check your configuration.`)
  }
  return result
}

/**
 * register webpack 'done' event listener
 * @param {*} compilers server and client webpack compilers
 * @param {*} serverName server compiler name
 */
const listen = (compilers, serverName) => {
  return new Promise((resolve, reject) => {
    compilers.hooks.done.tap('koa-webpack-server', () => {
      const serverCompiler = findCompiler(compilers, serverName)
      try {
        const result = handleChanges(serverCompiler)
        resolve(result)
      }
      catch (err) {
        reject(err)
      }
    })
    compilers.hooks.invalid.tap('koa-webpack-server', (err) => {
      reject(err)
    })
  })
}

let init = false
let cache
let assetsCache = {}

// assets getter creator, it returns json from assets by filename
const getAssetsGetter = (compiler) => (filename) => () => {
  if (!assetsCache[filename]) {
    const outputFileSystem = compiler.outputFileSystem
    const outputPath = compiler.outputPath
    const assetsFilename = path.join(outputPath, filename)

    const assetsBuffer = outputFileSystem.readFileSync(assetsFilename)
    assetsCache[filename] = JSON.parse(assetsBuffer.toString())
  }

  return assetsCache[filename]
}

/**
 * handles webpack build changes
 * @param {*} compiler
 */
const handleChanges = (compiler) => {
  const server = {}

  const outputFileSystem = compiler.outputFileSystem
  const outputPath = compiler.outputPath
  const mainFilename = path.join(outputPath, compiler.options.output.filename || 'main.js')

  const buffer = outputFileSystem.readFileSync(mainFilename)
  cache = requireFromString(buffer.toString())

  // clear assets cache
  assetsCache = {}

  if (!init) {
    // return server to create a dev server only once
    Object.keys(cache).forEach((key) => {
      if (key === 'middleware') {
        // wrap all middleware for code reloading
        server[key] = cache[key].map((middleware, index) => {
          return async function () {
            // eslint-disable-next-line prefer-rest-params
            await cache[key][index](...arguments)
          }
        })
      }
      else {
        server[key] = cache[key]
      }
    })

    init = true
  }

  return { server, assetsGetter: getAssetsGetter(compiler) }
}

exports.assetsMiddleware = assetsMiddleware

exports.webpackServer = (app, options) => {
  const { compilers, serverName, dev, server } = options

  const serverNameOption = serverName || 'server'
  const devOptions = dev || {}
  const serverOptions = server

  app.use(devMiddleware(compilers, devOptions))

  if (!serverOptions || !serverOptions.use) {
    return new Promise((resolve, reject) => {
      listen(compilers, serverNameOption).then((result) => {
        resolve(result)
      }).catch((err) => {
        reject(err)
      })
    })
  }
}
