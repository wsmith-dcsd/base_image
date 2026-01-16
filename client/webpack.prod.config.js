const { merge } = require("webpack-merge");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const base = require("./webpack.config");

const config = {
    mode: "production",
    plugins: [
        // Extracts CSS into separate files
        new MiniCssExtractPlugin({
            // Use 'contenthash' for better long-term caching
            filename: "[name].[contenthash].css",
            chunkFilename: "[id].[contenthash].css",
            ignoreOrder: false
        })
    ],
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                extractComments: true,
                parallel: true,
                terserOptions: {
                    mangle: true,
                    output: {
                        comments: false
                    },
                    toplevel: true
                }
            }),
            new CssMinimizerPlugin({})
        ]
    }
};

module.exports = merge(base, config);
