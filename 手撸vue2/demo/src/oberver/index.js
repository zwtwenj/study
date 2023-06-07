// 数据劫持
import { ArrayMethods } from './arr.js'
import Dep from './dep.js'
export function observer (data) {
    // 判断
    if (typeof data !== 'object' || data === null) {
        return data
    }
    // 1.对象 通过一个类来劫持
    return new Observer(data)
}

class Observer {
    constructor (value) {
        Object.defineProperty(value, "__ob__", {
            enumerable: false,
            configurable: true,
            value: this
        })
        this.dep = new Dep()
        // 判断数据，如果是数组
        if (Array.isArray(value)) {
            // 对数组劫持的处理
            value.__proto__ = ArrayMethods
        }
        this.walk(value)
    }
    walk (data) {
        let keys = Object.keys(data)
        for (let i = 0; i < keys.length; i++) {
            // 对每个属性进行劫持
            let key = keys[i]
            let value = data[key]
            defineReactive(data, key, value)
        }
    }
    // 对数组中的元素进行劫持
    observeArray (value) {
        for (let i = 0; i < value.length; i++) {
            observer(value[i])
        }
    }
}

// 对对象中的属性进行劫持
function defineReactive (data, key, value) {
    // 深度劫持，当属性是个对象的时候，由于调用递归遍历所以性能上问题很大
    let childDep = observer(value)
    // 给没一个属性添加一个dep
    let dep = new Dep()
    Object.defineProperty(data, key, {
        get () {
            // console.log('获取')
            // 收集依赖
            if (Dep.target) {
                dep.depend()
                if (childDep.dep) {
                    // console.log(childDep)
                    // 数组收集
                    childDep.dep.depend()
                }
            }
            return value
        },
        set (newValue) {
            // console.log('设置')
            if (newValue === value) {
                return
            } else {
                // 如果用户设置的值是对象那么就递归
                observer(newValue)
                // data[key] = newValue
                value = newValue
                dep.notify()
            }
        }
    })
}

// 数组的劫持
// 函数劫持，重写数组方法