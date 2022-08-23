const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const alias = require("./alias");
const chunks = require("./chunks");

module.exports = {
  mode: "production",
  entry: {
    index: ["./src/index.js"],
  },
  output: {
    path: path.resolve(path.dirname(__dirname), "assets"),
    filename: "[name].[fullhash].bundle.js",
    publicPath: "/",
    chunkFilename: "[name].[id].js",
  }, // output
  resolve: {
    extensions: [".js", ".jsx"],
    alias: alias,
  },
  optimization: {
    splitChunks: {
      // include all types of chunks
      chunks: "all",
      name: "vendor",
      cacheGroups: {
        // optimize for bundle chunks
        ...chunks,
      }, // cacheGroups
    }, // splitChunks
  }, //optimization
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: [{ loader: "babel-loader" }],
        include: path.join(path.dirname(__dirname), "src"),
        exclude: /node_modules|zip/,
      }, //JSX and JS -> babel-loader

      {
        test: /\.css$/,
        use: [{ loader: "style-loader" }, { loader: "css-loader" }],
      },

      {
        test: /\.less$/,
        exclude: /node_modules|zip/,
        use: [
          MiniCssExtractPlugin.loader,
          // { loader: "style-loader" },
          {
            loader: "css-loader",
            options: {
              modules: true,
            },
          },
          { loader: "less-loader" },
        ],
      }, // less -> css

      {
        test: /\.(png|jpg|gif|svg)$/i,
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
      }, //videoloader
    ], // rules
  }, // module
  plugins: [
    new webpack.ProvidePlugin({
      React: "react",
    }),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "./src/index.html",
      chunks: ["index"],
      hash: true,
    }), // HTML plugin - index
    new webpack.DefinePlugin({
      NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      PATH_PREFIX: JSON.stringify(process.env.PATH_PREFIX),
      API_HOST: JSON.stringify(process.env.API_HOST),
      API_PREFIX: JSON.stringify(process.env.API_PREFIX),
    }), // Define plugin
    new MiniCssExtractPlugin({
      chunkFilename: "[name].[hash].bundle.css",
      filename: "[name].css",
    }), // MiniCssExtractPlugin
    // new BundleAnalyzerPlugin(), //BundleAnalyzerPlugin
  ], //plugins
  performance: {
    hints: false,
  },
};
