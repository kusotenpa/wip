const path = require('path')
const webpack = require('webpack')

const NODE_ENV = JSON.stringify(process.env.NODE_ENV || 'local')

const plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV,
    },
  }),
]

// if (NODE_ENV.indexOf('production') !== -1) {
//   plugins.push(new webpack.optimize.UglifyJsPlugin())
// }

module.exports = {
  devtool: 'source-map',

  entry: './src/client/hoge.js',

  output: {
    filename: 'bundle.js',
    path: path.join('build/stat'),
  },

  plugins,

  module:{
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
            },
          },
        ],
      },
    ],
  },
}
