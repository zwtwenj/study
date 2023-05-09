import { parseHTML } from "./parseAst.js"
import { generate } from "./generate.js"

export function compileToFunction (template) {
    // 1.将html变成ast语法树
    let ast = parseHTML(template)

    // 2.将语法树变成render函数
    //      （1）ast语法树变成字符串
    //      （2）字符串变成函数
    let code = generate(ast)
    //      （3）将render字符串变成函数
    let render = new Function(`with(this){return ${code}}`)
    // console.log(render)

    return render
}

