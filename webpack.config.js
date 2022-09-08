/**
 * this file is only intended to be used in production
 * this is to generate the tiniest possible production-grade files
 * this file can also be debugged easily using inline-source-map
 */
const path = require("path");
const nodeExternals = require("webpack-node-externals");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const APP_DIR = path.join(__dirname, "src");

module.exports = {
  mode: "production",

  entry: {
    app: APP_DIR + "/index.ts",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
    pathinfo: false,
  },

  devtool: "inline-source-map",

  module: {
    rules: [
      {
        test: /\.(ts|js)?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
              "@babel/preset-typescript",
            ],
          },
        },
      },
    ],
  },

  plugins: [
    new ForkTsCheckerWebpackPlugin({
      async: false,
    }),
  ],

  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },

  resolve: {
    extensions: [".ts", ".js"],
  },

  target: "node", // use require() & use NodeJs CommonJS style
  externals: [nodeExternals()], // in order to ignore all modules in node_modules folder
  externalsPresets: {
    node: true, // in order to ignore built-in modules like path, fs, etc.
  },
};
