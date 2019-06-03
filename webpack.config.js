const path = require("path");

module.exports = {
  entry: "./src/app.ts",
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
