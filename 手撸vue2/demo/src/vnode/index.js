// (1)vm._render 将render函数变成虚拟dom
// (2)vm._updata将vnode变成真实dom放到页面
export function renderMixin (Vue) {
    Vue.prototype._render = function () {
        let vm = this
        let render = vm.$options.render
        // console.log(render)
        let vnode = render.call(this)
        // console.log(vnode)
        return vnode
    }

    // 标签
    Vue.prototype._c = function () {
        // 创建标签
        return createElement(...arguments)
    }

    // 文本
    Vue.prototype._v = function (text) {
        return createText(text)
    }

    // 变量
    Vue.prototype._s = function (val) {
        return val == null ? "" : (typeof val === 'object') ? JSON.stringify(val) : val
    }
}

// 创建元素
function createElement (tag, data = {}, ...children) {
    // console.log(tag)
    return vnode(tag, data, data.key, children)
}

// 创建vnode
function vnode (tag, data, key, children, text) {
    let a = {
        tag,
        data,
        key,
        children,
        text
    }
    return a
}

// 创建文本
function createText (text) {
    return vnode(undefined, undefined, undefined, undefined, text)
}

// with(this){
//     return _c(
//         'div', {id:"app",style:{"color":"red","font-size":"20px"}}, _v("\n            hello world{{msg}} okokok\n            "+_s(msg)+" okokok\n            "),
//     _c('div', null, _v("dqwdqw")),
//     _v("\n        "))}