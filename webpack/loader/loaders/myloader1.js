module.exports = function (ctx) {
    console.log('loader1', ctx)
    // return ctx
    const callback = this.callback
    // 异步会等待这个完成了再执行callback以及后续的其他loader
    // callback = this.async()
    // 第一个参数是错误信息
    callback(null, ctx)
}