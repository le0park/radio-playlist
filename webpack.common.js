const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    app: './src/content-script.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Production',
      template: path.join(__dirname, './src/index.html'),
      inject: false,
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'public', to: '' }
      ]
    })
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
};