const path = require('path')
const fs = require('fs')
const babylon = require('babylon')
const types = require('@babel/types')
const traverse = require('@babel/traverse').default
const generator = require('@babel/generator').default

class Compiler{
    constructor(config){
        this.config = config
        this.entryId;
        this.entry = config.entry
        this.output = config.output

        // 当前工作目录
        this.root = process.cwd()
        // 用来保存所有模块依赖
        this.modules = {  }
    }
    // 读取模块内容
    getSource(modulePath) {
        return fs.readFileSync(modulePath, 'utf-8')
    }
    // 模块文件解析
    // source-->文件内容 parentPath-->文件目录
    parse(source, parentPath) {
        // console.log(source, parentPath)
        const ast = babylon.parse(source)
        // tokens: []
        // 存储子模块依赖
        let dependencies = []
        traverse(ast, {
            // enter(path) {
            //     // 如果是name为n的标识符标识符
            //     // const a = 1
            //     if (path.isIdentifier({name: 'a'})) {
            //         // console.log(path.node)
            //         path.node.name = 'x'
            //         // const x = 1;
            //     }
            // }
            CallExpression(token) {
                let node = token.node
                // require改为__webpack_require__
                if (node.callee.name === 'require') {
                    node.callee.name = '__webpack_require__'
                    let moduleName = node.arguments[0].value  // ./add.js
                    // 判断文件有没有扩展名
                    moduleName = moduleName + ((token.extname) ? "" : ".js")
                    moduleName = "./" + path.join(parentPath, moduleName) // ./src/add.js
                    // 收集依赖
                    dependencies.push(moduleName)
                    node.arguments = [types.stringLiteral(moduleName)]
                }
            }
        })
        const sourceCode = generator(ast).code
        // console.log(sourceCode)  // let add = __webpack_require__("./src\\add.js.js");console.log(add(1, 2));
        return { sourceCode, dependencies }
    }
    // 从root节点到所有的依赖模块
    // modulePath模块文件路径，isEntry是否是入口文件路径
    buildModule(modulePath, isEntry) {
        // console.log(this.getSource(modulePath))
        let source = this.getSource(modulePath)
        // path.relative用于计算两个路径之间的相对路径
        let moduleName = "./" + path.relative(this.root, modulePath)
        console.log(moduleName)
        if (isEntry) {
            this.entryId = moduleName // 存入口文件路径
        }
        // 解析结果
        let { sourceCode, dependencies } = this.parse(source, path.dirname(moduleName))
        // 保存解析的代码
        this.modules[moduleName] = sourceCode
        // 递归
        dependencies.forEach(dep => {
            this.buildModule(path.join(this.root, dep), false)
        })
    }

    run() {
        console.log('开始编译')
        this.buildModule(path.resolve(this.root, this.entry), true)
    }
}

module.exports = Compiler