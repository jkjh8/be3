/** @format */

module.exports = {
  presets: ['@babel/preset-env'],
  plugins:
    process.env.NODE_ENV === 'production'
      ? [
          'transform-remove-console',
          '@babel/plugin-transform-runtime',
          ['module-resolver', { alias: { '@': './' } }]
        ]
      : [
          '@babel/plugin-transform-runtime',
          ['module-resolver', { alias: { '@': './' } }]
        ],
  ignore: ['./src/public/**/*.js']
}
