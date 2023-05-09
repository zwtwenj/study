// 重写数组函数来进行劫持
// vue为什么要重写原数组方法
// Vue 的响应式是通过 Object.defineProperty() 实现的，这个 api 没办法监听数组长度的变化，也就没办法监听数组的新增。
// Vue 无法检测通过数组索引改变数组的操作，这不是 Object.defineProperty() api 的原因，而是尤大认为性能消耗与带来的用户体验不成正比。对数组进行响应式检测会带来很大的性能消耗，因为数组项可能会大，比如1000条、10000条。
// 所以为了更友好的操作数组并触发响应式检测，Vue 重写了对数组引起副作用（改变原数组）的方法。
// 1.获取原来数组的方法
let oldArrayProtoMethods = Array.prototype

// 2.继承原来数组的方法
export let ArrayMethods = Object.create(oldArrayProtoMethods)

// 3.劫持
let methods = [
    "push",
    "pop",
    "unshift",
    "shift",
    "splice"
]

methods.forEach(item => {
    ArrayMethods[item] = function (...args) {
        console.log('劫持数组')
        let result = oldArrayProtoMethods[item].apply(this, args)
        // 问题：数组长度变化的情况
        let inserted
        switch (item) {
            case 'push':
                inserted = args
                break
            case 'unshift':
                inserted = args
                break
            case 'splice':
                inserted = args.splice(2)
                break
        }
        // console.log(inserted)
        let ob = this.__ob__
        if (inserted) {
            ob.observeArray(inserted) // 对我们添加的对象进行劫持
        }
        ob.dep.notify()
        return result
    }
})