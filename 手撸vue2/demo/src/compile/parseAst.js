/**
 * 解析HTML
 */
//  <div id="app">hello world{{msg}}</div>
// 匹配标签的名称
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`
// 匹配特殊标签名 类似<span:xx>
const qnameCapture = `((?:${ncname}\\:)?${ncname})`
// 匹配标签开头的正则
const startTagOpen = new RegExp(`^<${qnameCapture}`)
// 匹配标签结尾的</div>等
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)
// 匹配属性
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
// 匹配标签结束的>
const startTagClose = /^\s*(\/?)>/
// 匹配{{}}
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g

// <div id="app">hello world{{msg}}<h></h></div>
let root // 根元素
let creatParent // 当前元素的父亲
// 数据结构 栈
let stack = []

export function parseHTML (html) {
    while (html) {
        // 判断标签
        let textEnd = html.indexOf('<')
        // 为0的时候说明是个标签
        // console.log('1')
        if (textEnd === 0) {
            // 1.开始标签
            // 拿到开始标签的内容
            const startTagMatch = parseStartTag()
            if (startTagMatch) {
                start(startTagMatch.tagName, startTagMatch.attrs)
                continue
            }
            

            // 结束标签
            let endTagMatch = html.match(endTag)
            if (endTagMatch) {
                // ⑤
                advance(endTagMatch[0].length)
                end(endTagMatch[1])
                continue
            }
            
        }

        // 为1的时候说明是文本
        if (textEnd > 0) {
            // 获取文本内容
            let text = html.substring(0, textEnd)
            // hello world{{msg}}
            // console.log(text)
            if (text) {
                // ④
                advance(text.length)
                charts(text)
            }
        }
    }

    function parseStartTag () {
        const start = html.match(startTagOpen)
        if (!start) {
            return
        } 
        // ['<div', 'div', index: 0, input: '<div id="app">hello world{{msg}}</div>', groups: undefined]
        // console.log(start)
        // 创建一个语法树
        let match = {
            tagName: start[1],
            attrs: []
        }
        // ①删除开始标签
        advance(start[0].length)
        // 提取属性
        let attr
        let end
        while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
            // [' id="app"', 'id', '=', 'app', undefined, undefined, index: 0, input: ' id="app">hello world{{msg}}</div>', groups: undefined]
            // console.log(attr)
            match.attrs.push({ name: attr[1], value: attr[3] || attr[4] || attr[5] })
            // ②
            advance(attr[0].length)
        }
        // 删除结尾标签
        if (end) {
            //  ['>', '', index: 0, input: '>hello world{{msg}}</div>', groups: undefined]
            // console.log(end)
            // ③
            advance(end[0].length)
        }
        return match
    }

    function advance (n) {
        html = html.substring(n)
        // ① id="app">hello world{{msg}}</div>
        // ② >hello world{{msg}}</div>
        // ③ hello world{{msg}}</div>
        // ④ </div>
        // ⑤
        // console.log(html)
    }

    // 开始标签
    function start (tag, attrs) {
        // console.log(tag, attrs, '开始标签')
        let element = createASTElement(tag, attrs)
        if (!root) {
            root = element
        }
        creatParent = element
        stack.push(element)
    }

    // 获取文本
    function charts (text) {
        // console.log(text, '文本')
        // 空格 删除空格
        // text = text.replace(/a/g, '')
        text = text.trim()
        if (text) {
            creatParent.children.push({
                type: 3,
                text: text
            })
        }
    }

    // 结束标签
    function end (tag) {
        // console.log(tag, '结束')
        let element = stack.pop()
        creatParent = stack[stack.length - 1]
        if (creatParent) {
            element.parent = creatParent.tag
            creatParent.children.push(element)
        }
    }

    function createASTElement (tag, attrs) {
        return {
            tag, // 元素 div span
            attrs, // 属性
            children: [], // 子节点
            type: 1, // 元素类型
            parent: null  // 父元素
        }
    }
    // console.log(root)
    return root
}