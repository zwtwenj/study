#! /usr/bin/env node

console.log('测试打包')
const path = require('path')
const config = require(path.resolve('webpack.config.js'))

// 编译器
let Compiler = require("../lib/Compiler")
let compiler = new Compiler(config)

// 编译
compiler.run()