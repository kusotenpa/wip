const path = require('path')

module.exports = {
  devtool: 'source-map',

  entry: './src/client/hoge.js',

  output: {
    filename: 'bundle.js',
    path: path.join('build/stat'),
  },

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
