export function patch (oldVnode, vnode) {
    // console.log(oldVnode, vnode)
    // vnode => 真实dom
    // (1)创建新DOM
    let el = createEl(vnode)
    // console.log(el)
    // (2)替换  1）获取父节点  2）插入  3）删除
    let parentEL = oldVnode.parentNode
    parentEL.insertBefore(el, oldVnode.nextibling)
    parentEL.removeChild(oldVnode)
    return el
}

// 创建dom
// vnode： {tag, text, data, children}
function createEl (vnode) {
    let {tag, children, key, data,text} = vnode
    if (typeof tag === 'string') {
        // 标签
        vnode.el = document.createElement(tag)  // 创建元素
        // console.log(vnode)
        if (children.length > 0) {
            children.forEach(child => {
                vnode.el.appendChild(createEl(child))
            })
        }
    } else {
        // 文本
        vnode.el = document.createTextNode(text)
    }
    return vnode.el
}

// vue渲染流程
// 数据初始化 => 对模块进行编译 => 变成render函数 => 通过render函数变成vnode => vnode变成真实dom