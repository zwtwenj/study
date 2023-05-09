// 另一种方法是强制 this 指向 foo 函数对象：
function foo(num) {
    console.log("foo: " + num);
    // 记录 foo 被调用的次数
    // 注意，在当前的调用方式下（参见下方代码），this 确实指向 foo
    this.count++;
} 
foo.count = 0;
var i;
for (i = 0; i < 10; i++) {
    if (i > 5) {
        // 使用 call(..) 可以确保 this 指向函数对象 foo 本身 
        foo.call(foo, i);
    }
}
// foo: 6 
// foo: 7 
// foo: 8 
// foo: 9 
// foo 被调用了多少次？ 
console.log(foo.count); // 4

// 这次我们接受了 this，没有回避它。