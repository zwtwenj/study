// 初始化
import { initState } from "./initState"
import { compileToFunction } from "./compile/index.js"
import { callHook, mounetComponent } from "./lifecycle.js"
import { mergeOptions } from "./utils/index.js"
export function initMixin (Vue) {
    Vue.prototype._init = function (options) {
        let vm = this
        vm.$options = mergeOptions(Vue.options, options)
        callHook(vm, 'beforeCreated')
        // 初始化状态
        initState(vm)
        callHook(vm, 'created')

        // 渲染模板
        if (vm.$options.el) {
            vm.$mount(vm.$options.el)
        }

    }

    // 创建$mount
    Vue.prototype.$mount = function (el) {
        let vm = this
        el = document.querySelector(el)
        let options = vm.$options
        vm.$el = el
        if (!options.render) {
            let template = options.template
            if (!template && el) {
                // 获取html
                el = el.outerHTML
                let render = compileToFunction(el)
                // （1）将render函数变成vnode
                // （2）vnode变成真实dom放到页面上去
                vm.$options.render = render
            }
        }
        // 挂载组件
        mounetComponent(vm, el)
    }
}

// AST语法树 Vnode

