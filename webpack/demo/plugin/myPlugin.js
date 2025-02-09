class MyPlugin {
    apply(compiler) {
        console.log('start')
        // 注册订阅
        compiler.hooks.emit.tap('emit', function () {
            console.log('emit')
        })
        compiler.hooks.emit.tap('afterCompile', function () {
            console.log('afterCompile')
        })
    }
}

module.exports = MyPlugin