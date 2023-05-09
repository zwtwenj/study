import babel from 'rollup-plugin-babel'
import serve from 'rollup-plugin-serve'

export default {
    // 打包的入口文件
    input : './src/index.js',
    output: {
        file: 'dist/vue.js',
        // umd打包会给window添加一个vue实例
        format: 'umd', // 打包模式
        name: 'Vue',
        sourcemap: true // 支持映射
    },
    plugins: [
        babel({
            // 排除，排除掉node_modules下面的所有文件
            exclude: 'node_modules/**'
        }),
        serve({
            port: 3000,
            // 如果是空字符串表示在当前目录
            contentBase: '',
            openPage: '/index.html'
        })
    ]
}