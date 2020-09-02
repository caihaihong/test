const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const cssnano = require('cssnano');

module.exports = {
  // 开发环境
  entry: "./src/index.js",
  mode: "production",
  // 命令行输出显示控制
  stats: {
    children: false,
    modules: false,
  },
  // loader
  module: {
    rules: [
      {
        test: /\.(css|scss|less)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: "css-loader",
            options: {
              modules: {
                localIdentName: "[name]__[local]--[hash:base64:5]",
              },
            },
          },
          {
            loader: "postcss-loader",
            options: {
              plugins: (loader) => {
                return [
                  cssnano(),
                ];
              },
            },
          },
          {
            loader: "less-loader", //  编译 Less 为 CSS
            options: {
              sourceMap: false,
              lessOptions: {
                strictMath: true,
              },
            },
          },
        ],
      },

      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: require.resolve("babel-loader"),
      },
    ],
  },
  recordsPath: path.join(__dirname, "../dist/records.json"),
  plugins: [
    // 添加 进度条
    new CleanWebpackPlugin({
      cleanStaleWebpackAssets: "../dist",
    }),
    new HtmlWebpackPlugin({
      title: "xes-app",
      template: "./src/index.ejs",
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        useShortDoctype: true,
      },
      inject: false,
    }),

    new MiniCssExtractPlugin({
      filename: "./css/[id][contenthash].css",
      chunkFilename: "./css/[id].[contenthash].css",
    }),
  ],
  optimization: {
    minimize: false,
    // minimizer:[],
    runtimeChunk: true,
    splitChunks: {
      cacheGroups: {
        styles: {
          name: "styles",
          test: /\.(less)$/,
          chunks: "all",
          enforce: true,
        },
      },
    },
  },
  output: {
    filename: "[id].[contenthash:8].js",
    chunkFilename: "[id].[contenthash:8].js",
  },
};
