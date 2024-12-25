const path = require('path')
const { VueLoaderPlugin } = require('vue-loader')

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, './build'),
        filename: 'bundle.js'
    },
    resolveLoader: {
        modules: ['node_modules', './loaders']
    },
    module: {
        rules: [
            // {
            //     test: /\.js$/,
            //     use: ['myloader1', 'myloader2']
            // }
            // {
            //     test: /\.js$/,
            //     use: ['myloader1']
            // },
            // {
            //     test: /\.js$/,
            //     use: ['myloader2']
            // }
            {
                test: /\.js$/,
                use: ['babel-loader']
            },
            {
                test: /\.vue$/,
                use: ['vue-loader']
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin()
    ]
}