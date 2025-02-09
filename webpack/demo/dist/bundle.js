(function(modules) {
    var installModules = {};
    function __webpack_require__(moduleId) {
        if (installModules[moduleId]) {
            return installModules[moduleId].exports;
        }
        var module = installModules[moduleId] = {
            i: moduleId,
            l: false,
            export: {}
        }
        modules[moduleId].call(module.exports, module, module.exports, __webpack_require__)
        module.l = true
        return module.exports
    }
    return __webpack_require__(__webpack_require__.s = "./src\main.js")
})

({
    
        "./src\main.js":
        (function(module, exports, __webpack_require__){
        eval(`let add = __webpack_require__("./src\\add.js");
__webpack_require__("./src\\style.less");
console.log(add(1, 2));`)
        }),
    
        "./src\add.js":
        (function(module, exports, __webpack_require__){
        eval(`function add(a, b) {
  return a + b;
}
module.exports = add;`)
        }),
    
        "./src\style.less":
        (function(module, exports, __webpack_require__){
        eval(`let style = document.createElement('style');
style.innerHTML = "body {\\n  background: red;\\n}\\nbody #a {\\n  color: #FFF;\\n}\\n";
document.head.appendChild(style);`)
        }),
    
})
