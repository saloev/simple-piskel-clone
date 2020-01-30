const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const NodeSass = require('node-sass');

module.exports = {
  entry: './src/app.js',
  output: {
    path: path.resolve(__dirname, './public'),
    filename: 'app.js',
  },
  resolve: {
    alias: {
      assets: path.resolve(__dirname, 'src/assets/'),
      src: path.resolve(__dirname, 'src/'),
    },
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'main.css',
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.html',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'postcss-loader',
          },
          {
            loader: 'sass-loader',
            options: {
              implementation: NodeSass,
              sassOptions: {
                // Nested dependancies not loaded @see https://github.com/rails/webpacker/issues/1951
                includePaths: ['./node_modules'],
              },
            },
          },
        ],
      },
    ],
  },
};
