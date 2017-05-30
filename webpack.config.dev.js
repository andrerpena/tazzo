const webpack = require('webpack');

module.exports = {

    entry: [
        'babel-polyfill',
        './src/client/index.js'
    ],

    output: {
        filename: 'bundle.js',
        path: '/',
        publicPath: 'http://localhost:8080/'
    },

    externals: undefined,

    devtool: 'source-map',

    module: {
        rules: [
            { test: /\.js|\.jsx/, use: ['react-hot-loader/webpack', 'babel-loader'], exclude: /node_modules/ },
            { test: /\.css/, use: ['style-loader', 'css-loader'] },
            { test: /\.scss$/, use: ['style-loader', 'css-loader', 'sass-loader'] },
            { test: /\.jpe?g$|\.gif$|\.png$|\.ico$/, use: ['file-loader?name=[name].[ext]'] },
            { test: /\.eot|\.ttf|\.svg|\.woff2?/, use: ['file-loader?name=[name].[ext]'] }
        ]
    },

    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('development'),
                APP_ENV: JSON.stringify('browser')
            }
        })
    ],

    devServer: {
        port: 8080,
        headers: {
            'Access-Control-Allow-Origin': '*'
        }
    }

};
