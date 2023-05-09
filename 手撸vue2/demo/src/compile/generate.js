export function generate (el) {
    let children = genChildren(el)
    let code = `_c('${el.tag}', ${el.attrs.length ? `${genProps(el.attrs)}` : 'undefined'}, ${children ? `${children}` : 'null'})`
    // console.log(code)
    return code
}

// 处理属性
function genProps (attrs) {
    let str = ''
    for (let i = 0; i < attrs.length; i++) {
        let attr = attrs[i]
        if (attr.name === 'style') {
            let obj = {}
            attr.value.split(';').forEach(item => {
                let [key, val] = item.split(':')
                obj[key] = val
            })
            attr.value = obj
        }
        // console.log(attr)
        str += `${attr.name}:${JSON.stringify(attr.value)},`
    }
    // console.log(`{${str.slice(0, -1)}}`)
    return `{${str.slice(0, -1)}}`
}

// 处理元素子节点1
function genChildren (el) {
    let children = el.children
    if (children) {
        return children.map(child => gen(child)).join(',')
    }
}

// 处理子节点2
// {{msg}}
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g
function gen (node) {
    // console.log(node)
    // 两种情况，一种是文本，一种是元素
    if (node.type === 1) {
        // 元素
        return generate(node)
    } else {
        // 文本
        // 文本有两种情况
        // 1.只是文本
        // 2.插值表达式 {{msg}}
        let text = node.text // 获取文本
        if (!defaultTagRE.test(text)) {
            // 没有插值表达式的
            return `_v(${JSON.stringify(text)})`
        } else {
            // 带插值表达式的
            // 这里有BUG
            let tokens = []
            let lastIndex = defaultTagRE.lastIndex = 0
            let match
            while (match = defaultTagRE.exec(text)) {
                let index = match.index
                if (index > lastIndex) {
                    tokens.push(JSON.stringify(text.slice(0, index)))
                    // tokens.push(JSON.stringify(text.slice(lastIndex))) // 内容
                }
                tokens.push(`_s(${match[1].trim()})`)
                lastIndex = index + match[0].length
            }
            // 如果插值表达式后面还有内容
            if (lastIndex < text.length) {
                tokens.push(JSON.stringify(text.slice(lastIndex)))
            }
            return `_v(${tokens.join('+')})`
        }
    }
}