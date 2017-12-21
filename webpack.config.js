const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const PROD = false

module.exports = {
  entry: './src/index.js',
  output: {
    filename: PROD ? 'bundle.min.js' : 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
    contentBase: './dist'
  },
  module: {
    rules: [
      // SCSS
      {
        test: /\.scss$/,
        use: [{
          loader: 'style-loader' // creates style nodes from JS strings
        }, {
          loader: 'css-loader' // translates CSS into CommonJS
        }, {
          loader: 'sass-loader' // compiles Sass to CSS
        }]
      },
      // IMAGES
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader'
        ]
      },
      // FONTS
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          'file-loader'
        ]
      }
    ]
  },
  plugins: PROD ? [
    new UglifyJsPlugin({
      uglifyOptions: {
        ie8: false,
        ecma: 8,
        output: {
          comments: false,
          beautify: false
        },
        warnings: false
      }
    }),
    new HtmlWebpackPlugin({
      template: 'src/html/entry.html',
      filename: 'index.html',
      minify: {
          removeComments: true,
          collapseWhitespace: true,
          conservativeCollapse: false,
          preserveLineBreaks: false,
        }
    })] : [
    new HtmlWebpackPlugin({
      template: 'src/html/entry.html'
    })
  ]
}
