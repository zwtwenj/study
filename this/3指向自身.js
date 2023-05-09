// 遇到这样的问题时，许多开发者并不会深入思考为什么 this 的行为和预期的不一致，也不 会试图回答那些很难解决但却非常重要的问题。
// 他们只会回避这个问题并使用其他方法来 达到目的，比如创建另一个带有 count 属性的对象。
function foo(num) {
    console.log("foo: " + num); // 记录 foo 被调用的次数
    data.count++;
}
var data = { count: 0 };
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
console.log( data.count ); // 4

// 从某种角度来说这个方法确实“解决”了问题，但可惜它忽略了真正的问题——无法理解 this 的含义和工作原理——而是返回舒适区，使用了一种更熟悉的技术：词法作用域。