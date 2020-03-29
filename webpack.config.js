const { resolve } = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const AssetsPlugin = require('assets-webpack-plugin')

const srcPath = __dirname
const distPath = __dirname


const mode = process.env.NODE_ENV || 'development'
const isDev = mode === 'development'

const base = {
  context: srcPath,
  devtool: isDev ? 'cheap-module-source-map' : 'source-map',
  mode: mode,
  module: {
    rules: [{
      oneOf: [{
          test: /\.js$/,
          // include: srcPath,
          exclude: /node_modules/,
          use: [{
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
            },
          }, ]
        },
        {
          test: /\.jpg$/,
          // include: srcPath,
          exclude: /node_modules/,
          use: [{
            loader: 'file-loader',
          }, ]
        },

      ]
    }],
  },
  resolve: {
    alias: {
      'client': resolve(srcPath, 'client'),
      'server': resolve(srcPath, 'server'),
    },
  },
  output: {
    filename: isDev ? '[name].js' : '[name].[contenthash:8].js',
    path: resolve(distPath, 'site-build'),
    publicPath: '/'
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: mode,
      BABEL_ENV: mode,
      API: process.env.API || '',
      VERSION: process.env.VERSION || 'dev',
    }),
    new AssetsPlugin({
      filename: 'assets.json',
      useCompilerPath: true,
      keepInMemory: true,
    }),
  ],
}

const client = merge(base, {
  name: 'client',
  entry: {
    client: resolve(srcPath, 'client', 'index.js'),
  },
})

const server = merge(base, {
  name: 'server',
  target: 'node',
  output: {
    libraryTarget: 'commonjs2',
    filename: 'server.js',
  },
  entry: {
    server: resolve(srcPath, 'server', 'index.js'),
  },
})

module.exports = [
  client,
  server,
]

// if (isDev) {
//   module.exports = merge(base, {
//     devtool: 'cheap-module-source-map',
//     // watch: true,
//     // watchOptions: {
//     //   poll: 500,
//     // },
//   })
// } else {
//   module.exports = merge(base, {
//     devtool: 'source-map',
//   })
// }