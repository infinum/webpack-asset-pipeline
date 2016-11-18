const path = require('path');
const RailsManifestPlugin = require('../');

module.exports = {
  entry: {
    application: path.resolve('application.js'),
    vendor: path.resolve('vendor.js')
  },
  output: {
    path: path.resolve('build'),
    filename: '[name].js',
    publicPath: './'
  },
  plugins: [
    new RailsManifestPlugin()
  ],
  module: {
    loaders: [{
      test: /\.svg$/,
      loader: 'file-loader?name=[hash].[ext]'
    }]
  }
};
