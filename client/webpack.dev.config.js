const { merge } = require("webpack-merge");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const base = require("./webpack.config");

const config = {
    entry: "./src/index.tsx",
    plugins: [
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css"
        })
    ],
    devtool: "eval-cheap-module-source-map",
    devServer: {
        allowedHosts: ["spa.dcsdk12.local"],
        historyApiFallback: true,
        port: 9000,
        host: "spa.dcsdk12.local",
        server: {
            type: "https"
        }
    }
};

module.exports = merge(base, config);
