const path = require('path');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const RailsManifestPlugin = require('../');

const port = 8080;

const config = {
  entry: path.resolve('application.js'),
  output: {
    path: path.resolve('build'),
    filename: '[name].js',
    publicPath: './'
  },
  plugins: [
    new RailsManifestPlugin({
      writeToFileEmit: true
    })
  ]
};

new WebpackDevServer(webpack(config), Object.assign({
  contentBase: path.join(__dirname, '../build'),
  inline: true,
  progress: true,
  compress: true,
  stats: {
    colors: true,
    hash: true,
    timings: true,
    chunks: false
  },
  historyApiFallback: true
}))
.listen(port, '0.0.0.0');
