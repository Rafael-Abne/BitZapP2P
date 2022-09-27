const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    entry: {
        'app': './src/index.js'
    },
    output: {
        filename: 'bundle.js'
    },
    resolve: {
        extensions: ['.js', '.jsx', 'ts']
    },
    node: {
        child_process: 'empty',
        fs: 'empty',
        net: 'empty',
        readline: 'empty',
        tls: 'empty'
    },
    module: {
        rules: [
            {
                test: /\.js|\.jsx$/,
                use: [{
                    loader: 'babel-loader',
                    options: {
                        babelrc: true
                    }
                }],
                exclude: /node_modules/,
                
            },
            { test: /\.css$/, loader: 'style-loader!css-loader' },
            { test: /\.scss$/, loaders: ['style', 'css?sourceMap', 'sass?sourceMap']},
            // inline base64 URLs for <=8k images, direct URLs for the rest
            { test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192'},
            // helps to load bootstrap's css.
            { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
              loader: 'url?limit=10000&minetype=application/font-woff' },
            { test: /\.woff2$/,
              loader: 'url?limit=10000&minetype=application/font-woff' },
            { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
              loader: 'url?limit=10000&minetype=application/octet-stream' },
            { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
              loader: 'file' },
            { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
              loader: 'url?limit=10000&minetype=image/svg+xml' }
        ],
    },
    plugins: [
       new HtmlWebpackPlugin({
            title: "Bitmessage Chat",
            template: './public/index.html'
       })
    ],
    optimization: {
        splitChunks: {
            chunks: 'all'
        }
    }

}