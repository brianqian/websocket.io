const path = require("path");

const { NODE_ENV = "production" } = process.env;

module.exports = {
  entry: "./src/app.ts",
  mode: NODE_ENV,
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },
  resolve: {
    extensions: [".ts", ".js", ".json"],
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.ts$/,
        use: [
          {
            loader: "awesome-typescript-loader",
            options: {
              useBabel: true,
              babelCore: "@babel/core",
            },
          },
        ],
      },
      {
        test: /\.js$/,
        use: ["source-map-loader"],
        enforce: "pre",
        exclude: /node_modules/,
      },
    ],
  },
};
