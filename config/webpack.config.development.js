const path = require("path");
const webpack = require("webpack");
const ESLintPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

const isDevelopment = process.env.NODE_ENV !== 'production';

const alias = require("./alias");
const chunks = require("./chunks");

module.exports = {
  mode: "development",
  devtool: "eval-cheap-module-source-map",
  entry: {
    index: ["./src/index.js"],
  },
  output: {
    path: path.resolve(path.dirname(__dirname), "assets"),
    filename: "[name].[fullhash].dev.js",
    publicPath: "http://localhost:9000/assets/",
    chunkFilename: "[name].[id].dev.js",
  }, // output
  resolve: {
    extensions: [".js", ".jsx"],
    alias: {
      ...alias,
    },
    mainFields: ["module", "main"],
  },
  optimization: {
    splitChunks: {
      // include all types of chunks
      chunks: "all",
      name: "vendor",
      cacheGroups: {
        // 优化: 把常用模块打包到独立的文件
        ...chunks,
      }, // cacheGroups
    },
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              plugins: [
                require.resolve("react-refresh/babel"),
              ],
            },
          },
        ],
        exclude: /node_modules|zip/,
      }, //JSX and JS -> babel-loader

      {
        test: /\.css$/,
        use: [{ loader: "style-loader" }, { loader: "css-loader" }],
      },

      {
        test: /\.less$/,
        exclude: /zip/,
        use: [
          { loader: "style-loader" },
          {
            loader: "css-loader",
            options: {
              modules: true,
            },
          },
          {
            loader: "less-loader",
          }, // less-loader
        ], // ues
      }, // less -> css

      {
        test: /\.(png|gif|jpg|jpeg|svg|xml|json)$/i,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 8192,
            },
          },
        ],
      }, // Images -> url
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: "url-loader",
        options: {
          limit: 10000,
          name: "video/[name].[ext]",
          esModule: false,
        },
      }, //videoloader added by xujinshui@2021-11-16
    ], // rules
  }, // module
  plugins: [
    new ReactRefreshWebpackPlugin(),
    new webpack.ProvidePlugin({
      React: "react",
    }),
    new ESLintPlugin({
      context: path.join(path.dirname(__dirname), "src"),
    }),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "./src/index.html",
      chunks: ["index"],
      hash: true,
    }), // HTML plugin - portal
    new webpack.DefinePlugin({
      NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      PATH_PREFIX: JSON.stringify(""),
      API_HOST: JSON.stringify("http://localhost:8000"),
      API_PREFIX: JSON.stringify("/api"),
    }), // Define plugin
    // Copy Cesium Assets, Widgets, and Workers to a static directory
  ], //plugins
  devServer: {
    allowedHosts: "all",
    bonjour: true,
    bonjour: {
      type: "http",
      protocol: "udp",
    },
    historyApiFallback: {
      rewrites: [{ from: /^\//, to: "/assets/index.html" }], // rewrites
    },
    static: {
      directory: path.join(__dirname, "../src/statics"),
      publicPath: "/statics",
      serveIndex: true,
    },
    compress: true,
    hot: true,
    port: 9000,
    host: "0.0.0.0",
    // proxy: { // proxy config
    //   "/api": {
    //     target: "https://freeyeti.net/",
    //     changeOrigin: true,
    //     pathRewrite: { "^/api": "" },
    //   },
    // },
  }, // devServer
};
