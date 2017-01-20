var path = require('path');
var webpack = require('webpack');

module.exports = {
  cache: true,
  entry: './index.js',
  output: {
    path: path.resolve('./build'),
    filename: 'lib.js'
  },
  module: {
   rules: [
     {
      test: /\.js?$/,
      exclude: /(node_modules)/,
      loader: 'babel-loader',
      options: {
        cacheDirectory: true
      }
     },
   ]
  }
}
