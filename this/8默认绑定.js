function foo() {
    // console.log(this)
    "use strict";
    console.log(this.a); 
}
var a = 2; 
foo(); // 2
// 你应该注意到的第一件事是，声明在全局作用域中的变量（比如 var a = 2）就是全局对象的一个同名属性。
// 它们本质上就是同一个东西，并不是通过复制得到的，就像一个硬币的两面一样。
// 接下来我们可以看到当调用 foo() 时，this.a 被解析成了全局变量 a。为什么？因为在本例中，函数调用时应用了 this 的默认绑定，因此 this 指向全局对象。
// 如果使用严格模式（strict mode），那么全局对象将无法使用默认绑定，因此 this 会绑定 到 undefined：