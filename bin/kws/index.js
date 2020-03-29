'use strict'

const path = require('path')
const requireFromString = require('require-from-string')
const devMiddleware = require('./dev')

let init = false
let assetsCache = null
let cache

const findCompiler = (compilers, name) => {
  let result = null
  if (compilers && Array.isArray(compilers.compilers)) {
    result = compilers.compilers.find(compiler => compiler.name === name)
  } else if (compilers && compilers.name === name) {
    result = compilers
  }

  if (!result) {
    throw new Error(`No webpack compiler found named '${name}', please check your configuration.`)
  }
  return result
}

const findStats = (stats, name) => {
  let result = null
  if (stats && Array.isArray(stats.stats)) {
    result = stats.stats.find(node => node.compilation.name === name)
  } else if (stats && stats.compilation.name === name) {
    result = stats
  }
  if (!result) {
    throw new Error(`No webpack stats found named '${name}', please check your configuration.`)
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
    compilers.hooks.done.tap('koa-webpack-server' , () => {
      const serverCompiler = findCompiler(compilers, serverName)
      try {
        const result = handleChanges(serverCompiler)
        resolve(result)
      } catch (err) {
        reject(err)
      }
    })
    compilers.hooks.invalid.tap('koa-webpack-server', (err) => {
      reject(err)
    })
  })
}

const assetsGetter = () => {
  return assetsCache
}

/**
 * handles webpack build changes
 * @param {*} compiler
 */
const handleChanges = (compiler) => {
  console.error('HANDLE CHANGE')

  const server = {}

  const outputFileSystem = compiler.outputFileSystem
  const outputPath = compiler.outputPath
  const mainFilename = path.join(outputPath, compiler.options.output.filename || 'main.js')
  const assetsFilename = path.join(outputPath, 'assets.json')

  const buffer = outputFileSystem.readFileSync(mainFilename)
  cache = requireFromString(buffer.toString())

  const assetsBuffer = outputFileSystem.readFileSync(assetsFilename)
  assetsCache = JSON.parse(assetsBuffer.toString())

  if (!init) {
    Object.keys(cache).forEach((key) => {
      if (key === 'middlewares') {
        // wrap all middlewares for code reloading
        server[key] = cache[key].map((middleware, index) => {
          return async function () {
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

  return { server, assetsGetter }
}

exports.findCompiler = findCompiler

exports.findStats = findStats

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