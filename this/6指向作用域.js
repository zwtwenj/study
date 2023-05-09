// 放到浏览器中执行
function foo() {
    var a = 2;
    this.bar();
}
function bar() { 
    // console.log(this)
    console.log(this.a); 
} 
foo(); // ReferenceError: a is not defined

// 首先，这段代码试图通过 this.bar() 来引用 bar() 函数。
// 这是绝对不可能成功的，我们之后会解释原因。
// 调用 bar() 最自然的方法是省略前面的 this，直接使用词法引用标识符。
// 此外，编写这段代码的开发者还试图使用 this 联通 foo() 和 bar() 的词法作用域，从而让 bar() 可以访问 foo() 作用域里的变量 a。
// 这是不可能实现的，你不能使用 this 来引用一个词法作用域内部的东西。 每当你想要把 this 和词法作用域的查找混合使用时，一定要提醒自己，这是无法实现的。