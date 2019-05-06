const debug = process.env.NODE_ENV !== 'production';
const path = require('path');
const webpack = require('webpack');

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    devServer: {
        contentBase: path.join(__dirname, 'src/game'),
        compress: true,
        port: 9000,
        proxy: {'/api': 'http://localhost:3000'}
    },
    devtool: "source-map",
    watch: true,
    entry: [
        'bootstrap-loader', path.join(__dirname, './src/main.js')
    ],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].bundle.js'
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Phaser + Vue Example',
            template: path.join(__dirname, 'src/index.html'),
        }),
        new webpack.DefinePlugin({
            CANVAS_RENDERER: JSON.stringify(true),
            WEBGL_RENDERER: JSON.stringify(true)
        })
    ],
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            vue: 'vue/dist/vue.js',
            '@': path.join(__dirname, 'src'),
        }
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'images/[name].[ext]',
                        },
                    }
                ]
            },
            {
                test: /\.html$/i,
                exclude: [path.join(__dirname, "src/index.html")],
                include: [
                    path.join(__dirname, "src/templates")
                ],
                use: 'raw-loader',
            }
        ]
    }
};
