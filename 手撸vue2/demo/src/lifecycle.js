// 生命周期
// render()函数 => vnode => 真实的dom
import { patch } from "./vnode/patch.js"
import watcher from "./oberver/watcher.js"
export function mounetComponent (vm, el) {
    callHook(vm, "beforeMounted")
    // vm._updata(vm._render())
    
    let updataComponent = () => {
        vm._updata(vm._render())
    }
    // true表示用来处理渲染的
    new watcher(vm, updataComponent, () => {
        callHook(vm, 'updated')
    }, true)
    callHook(vm, "mounted")
}

export function lifecycleMixin (Vue) {
    Vue.prototype._updata = function (vnode) {
        let vm = this
        vm.$el = patch(vm.$el, vnode)
    }
}

export function callHook(vm, hook) {
    const handlers = vm.$options[hook]
    if (handlers) {
        for (let i = 0; i < handlers.length; i++) {
            handlers[i].call(vm) // 改变生命周期中的this指向问题
        }
    }
}