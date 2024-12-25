const babel = require('@babel/core')

module.exports = function (ctx) {
    // console.log('babel-loader', ctx)
    const callback = this.async()
    babel.transform(ctx, {}, (err, result) => {
        if (err) {
            callback(err)
        } else {
            callback(null, ctx)
        }
    })
}