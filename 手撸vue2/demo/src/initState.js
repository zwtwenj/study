// 状态
import { observer } from "./oberver/index.js"
import { nextTick } from "./utils/nextTick.js"
export function initState (vm) {
    let opts = vm.$options
    // 判断
    if (opts.props) {
        initProps(vm)
    }
    if (opts.data) {
        initData(vm)
    }
    if (opts.watch) {
        initWatch(vm)
    }
    if (opts.computed) {
        initComputed()
    }
    if (opts.methods) {
        initMethods()
    }
}

function initProps () {}
// vue2对data初始化
function initData (vm) {
    // 判断data的情况，data可能是个对象也可能是个函数
    let data = vm.$options.data
    // 注意此时this指向问题
    data = vm._data = typeof data === "function" ? data.call(this) : data
    // 将data上的所有属性代理到实例上即vm
    for (let key in data) {
        proxy(vm, "_data", key)
    }
    // 数据进行劫持
    observer(data)
}

function proxy (vm, source, key) {
    Object.defineProperty(vm, key, {
        get () {
            return vm[source][key]
        },
        set (newValue) {
            vm[source][key] = newValue
        }
    })
}

function initWatch (vm) {
    // 获取watch
    let watch = vm.$options.watch
    console.log(watch)
    for (let key in watch) {
        let handler = watch[key]
        if (Array.isArray(handler)) {
            handler.forEach(item => {
                createrWatcher(vm, key, handler)
            })
        } else {
            createrWatcher(vm, key, handler)
        }
    }
}

function initComputed () {}

function initMethods () {}

function createrWatcher (vm, exprOrfn, handler, options) {
    if (typeof handler === 'object') {
        handler = handler.handler
    }
}

export function stateMixin (vm) {
    // 数据更新之后获取到最新的dom
    vm.prototype.$nextTick = function (cb) {
        nextTick()
    }
}