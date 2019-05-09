const debug = process.env.NODE_ENV !== 'production';
const path = require('path');
const webpack = require('webpack');

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin/dist/clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'production',

    entry: [
        'bootstrap-loader', path.join(__dirname, './src/main.js')
    ],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].[chunkhash:8].js',
        chunkFilename: '[name].[chunkhash:8].chunk.js'
    },
    plugins: [
        new CleanWebpackPlugin(),
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
            },
            {
                test: /\.(ogg|mp3)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'audio/[name].[ext]',
                        },
                    },
                ],
            }
        ]
    }
};
