const path = require('path');

module.exports = {
  entry: path.join(__dirname, 'application.js'),
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[hash].js',
    publicPath: '/'
  },
  plugins: []
};
