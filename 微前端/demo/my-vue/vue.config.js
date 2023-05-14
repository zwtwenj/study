module.exports = {
    lintOnSave: false,
    publicPath: '//localhost:20000', // 保证子应用静态资源都是向20000端口上发送的
    devServer: {
        port: 20000, // 用fetch去请求20000，但fetch默认不支持跨域所以需要允许跨域
        // 允许跨域
        headers: {
            'Access-Control-Allow-Origin': '*'
        }
    },
    configureWebpack: {
        output: {
            // 需要获取打包的内容
            libraryTarget: 'umd',
            library: 'my-vue'
        }
    }
}