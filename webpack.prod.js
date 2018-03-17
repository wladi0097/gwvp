const merge = require('webpack-merge')
const common = require('./webpack.common.js')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = merge(common, {
  plugins: [
    new UglifyJsPlugin({
      uglifyOptions: {
        ie8: false,
        ecma: 6,
        output: {
          comments: false,
          beautify: false
        },
        warnings: true
      }
    }),
    new HtmlWebpackPlugin({
      template: 'src/html/entry.html',
      filename: 'index.html',
      favicon: 'src/img/Logo.png',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        conservativeCollapse: false,
        preserveLineBreaks: false
      }
    })]
})
