module.exports = {
    webpack: (config) => {
        config.output.library = 'my-react'
        config.output.libraryTarget = 'umd'
        config.output.publicPath = '//localhost:30000'
    },
    devServer: (config) => {
        config.headers = {
            'Access-Control-Allow-Origin': '*'
        }
    }
}