const path = require('path');
const {
  CleanWebpackPlugin
} = require("clean-webpack-plugin")

// 客户端 react 应用的入口文件
const adminBrowserFilePath = path.resolve(__dirname, './app/web/page/browser/admin');
// 服务端 react 应用的入口文件
const adminServerFilePath = path.resolve(__dirname, './app/web/page/server/admin');
const browserBuildPath = path.resolve(__dirname, './build');
const serverBuildPath = path.resolve(__dirname, './app/view');
const webpack = require('webpack');

const {
  getStyleCongfigs,
  MiniCssExtractPlugin
} = require('./webpack/utils');

const dev = true

module.exports = [
  {
    name: 'browser',
    entry: {
      admin: ["webpack-hot-middleware/client?path=http://127.0.0.1:3000/__webpack_hmr&noInfo=false&reload=true&quiet=false",adminBrowserFilePath]
    },
    output: {
      path: browserBuildPath,
      filename: 'static/js/[name].js',
      chunkFilename: 'static/js/[name].chunk.js',
      publicPath: '/'
    },
    target: 'web',
    resolve: {
      extensions: ['.js', '.jsx']
    },
    optimization: {
      runtimeChunk: "single",
    },
    devtool: "cheap-module-source-map",
    module: {
      rules: [{
          test: /\.(js|jsx)$/,
          exclude: /(node_modules\/)/,
          use: {
            loader: require.resolve('babel-loader'),
            options: {
              babelrc: true,
              presets: [
                [require.resolve('babel-preset-beidou-client')],
              ],
              // This is a feature of `babel-loader` for webpack (not Babel itself).
              // It enables caching results in ./node_modules/.cache/babel-loader/
              // directory for faster rebuilds.
              cacheDirectory: dev,
              compact: !dev,
              highlightCode: true,
            },
          },
        },
        ...getStyleCongfigs(dev, {
          cssExtract: false,
        })
      ],
    },
    plugins: [
      new CleanWebpackPlugin(),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('development'),
        'process.env.BABEL_ENV': JSON.stringify('development'),
        __CLIENT__: true,
        __DEV__: true,
        __SERVER__: false,
      }),
      new webpack.HotModuleReplacementPlugin(),
      new MiniCssExtractPlugin({
        // 类似 webpackOptions.output里面的配置 可以忽略
        filename: '[name].css',
        chunkFilename: '[id].css',
      })
    ]
  },
];