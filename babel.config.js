const presets = [
  [
    '@babel/preset-env', {
      targets: {
        browsers: [
          'last 2 major versions',
          'not dead',
          'safari >= 9',
          'iOS >= 9',
        ],
        node: 'current',
      },
      useBuiltIns: 'usage',
      corejs: '3',
    },
  ],
  '@babel/preset-react',
]

const config = {
  presets,
  plugins: [
    '@babel/plugin-transform-runtime',
    '@babel/plugin-transform-destructuring',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-object-rest-spread',
  ],
}


module.exports = config
