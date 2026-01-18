const path = require("path");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

const config = {
    entry: "./src/index.tsx",
    module: {
        rules: [
            {
                test: /\.(js|jsx|ts|tsx)$/,
                exclude: /(node_modules|bower_components)/,
                loader: "babel-loader"
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.scss$/i,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "style-loader"
                    },
                    {
                        loader: "css-loader",
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            sourceMap: true,
                            api: "modern-compiler"
                        }
                    }
                ]
            },
            {
                test: /\.(png|jp(e*)g|svg|gif|eot|ttf|woff|woff2)$/,
                type: "asset",
                parser: {
                    dataUrlCondition: {
                        maxSize: 8000
                    }
                },
                generator: {
                    filename: "images/[hash]-[name][ext]"
                }
            }
        ]
    },
    resolve: {
        extensions: [".js", ".jsx", ".ts", ".tsx"]
    },
    plugins: [new ForkTsCheckerWebpackPlugin()],
    output: {
        path: path.resolve(__dirname, "dist/"),
        publicPath: "/dist/",
        filename: "bundle.js",
        clean: true
    },
    devServer: {
        allowedHosts: [".dcsdk12.local", ".localhost"],
        port: 9000,
        host: "spa.dcsdk12.local",
        historyApiFallback: true,
        hot: true,
        compress: true,
        server: {
            type: "https"
        },
        static: {
            directory: path.join(__dirname, "public"),
            serveIndex: false,
            publicPath: "/",
            watch: {
                ignored: /node_modules/
            }
        },
        onListening: (devServer) => {
            if (!devServer) {
                throw new Error("webpack-dev-server is not defined");
            }
        }
    }
};

module.exports = config;
