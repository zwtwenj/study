const path = require('path')
const MyPlugin = require('./plugin/myPlugin')

module.exports = {
    mode: 'development',
    entry: './src/main.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.less/,
                use: [
                    // "style-loader",  // 把style写入html
                    // "css-loader",
                    // "less-loader"   // less转成css
                    path.resolve(__dirname, 'loader', 'style-loader'),
                    path.resolve(__dirname, 'loader', 'less-loader')
                ]
            }
        ],
        plugins: [
            new MyPlugin()
        ]
    }
}