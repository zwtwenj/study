#! /usr/bin/env node
const fs = require('fs')
const path = require('path')
const Koa = require('koa')
// const send = require('koa-send')
const compilerSFC = require('@vue/compiler-sfc')
const compilerDOM = require('@vue/compiler-dom')

const app = new Koa()

app.use(async (ctx, next) => {
    const { url, query } = ctx.request
    // if (url === '/') {
    //     await send(ctx, ctx.path, {
    //         root: process.cwd(),
    //         index: 'index.html'
    //     })
    // } else {
    //     await send(ctx, ctx.path, {
    //         root: process.cwd(),
    //         index: rewoteImport(url)
    //     })
    // }
    if (url === '/') {
        ctx.type = 'text/html'
        ctx.body = rewriteImport(fs.readFileSync('./index.html', 'utf-8'))
    } else if (url.endsWith('.js')) {
        ctx.type = 'application/javascript'
        ctx.body = rewriteImport(fs.readFileSync(path.join(process.cwd(), url), 'utf-8'))
    } else if (url.startsWith('/@modules')) {
        // 获得裸模块名称
        const moduleName = url.replace('/@modules/', '')
        // 去node_modules目录中找
        const prefix = path.join(process.cwd(), '/node_modules', moduleName)
        // module中的package.json中获取的module字段
        const module = require(prefix + '/package.json').module
        // console.log(module)
        const filePath = path.join(prefix, module)
        // console.log(filePath)
        const ret = fs.readFileSync(filePath, 'utf8')
        ctx.type = "application/javascript"
        ctx.body = rewriteImport(ret)
    } else if (url.indexOf('.vue') !== -1) {
        if (!query.type) {
            // SFC请求
            // 读取./vue文件解析为js
            const p = path.join(process.cwd(), url)
            const ret = compilerSFC.parse(fs.readFileSync(p, 'utf-8'))
            // console.log(ret)
            // 获取脚本部分的内容
            const scriptContent = ret.descriptor.script.content
            // 替换默认导出为一个常量，方便后续修改
            const script = scriptContent.replace('export default', 'const __script = ')
            ctx.type = "application/javascript"
            // ctx.body = rewriteImport(script)
            ctx.body = `
                ${rewriteImport(script)}
                // 解析template
                import { render as __render } from '${url}?type=template'
                __script.render = __render
                export default __script
            `
        } else if (query.type === 'template') {
            const p = path.join(process.cwd(), url.split('?')[0])
            const ret = compilerSFC.parse(fs.readFileSync(p, 'utf-8'))
            const tpl = ret.descriptor.template.content
            const render = compilerDOM.compile(tpl, { mode: 'module' }).code
            ctx.type = 'application/javascript'
            ctx.body = rewriteImport(render)
        }
    }
})

// 裸模块地址重写
// from 'vue' => from '/@modules/vue
function rewriteImport(content) {
    return content.replace(/ from ['"](.*)/g, function(s1, s2) {
        if (s2.startsWith('.') || s2.startsWith('/') || s2.startsWith('../')) {
            return s1
        } else {
            if (s2.endsWith(';')) {
                s2 = s2.slice(0, s2.length - 1)
            }
            if (s2.endsWith('\'') || s2.endsWith('\"')) {
                s2 = s2.slice(0, s2.length - 1)
            }
            console.log(s2)
            return ` from '/@modules/${s2}' `
        }
    })
}

app.listen(8000, () => {
    console.log('koa runing @http://localhost:8000')
})