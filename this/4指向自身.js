// 如果要从函数对象内部引用它自身，那只使用 this 是不够的。一般来说你需要通过一个指向函数对象的词法标识符（变量）来引用它。
// function foo() {
//     foo.count = 4; // foo 指向它自身
// }
// setTimeout(function () {
//     // 匿名（没有名字的）函数无法指向自身 
// }, 10);


// 另一种解决方法是使用 foo 标识符替代 this 来引用函数对象：
function foo(num) {
    console.log("foo: " + num); // 记录 foo 被调用的次数 
    foo.count++;
}
foo.count = 0
var i;
for (i = 0; i < 10; i++) {
    if (i > 5) {
        foo(i);
    }
}
// foo: 6 
// foo: 7 
// foo: 8 
// foo: 9 
// foo 被调用了多少次？ 
console.log(foo.count); // 4
// 这种方法同样回避了 this 的问题，并且完全依赖于变量 foo 的词法作用域。