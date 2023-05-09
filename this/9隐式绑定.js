function foo() {
    console.log(this.a);
}
var obj = {
    a: 2,
    foo: foo
};
obj.foo(); // 2
// 另一条需要考虑的规则是调用位置是否有上下文对象，或者说是否被某个对象拥有或者包含，不过这种说法可能会造成一些误导。
// 首先需要注意的是 foo() 的声明方式，及其之后是如何被当作引用属性添加到 obj 中的。 
// 但是无论是直接在 obj 中定义还是先定义再添加为引用属性，这个函数严格来说都不属于 obj 对象。
// 对象属性引用链中只有最顶层或者说最后一层会影响调用位置。

// function foo() { 
//     console.log( this.a ); 
// }
// var obj2 = { 
//     a: 42, 
//     foo: foo 
// };
// var obj1 = { 
//     a: 2, 
//     obj2: obj2 
// };
// obj1.obj2.foo(); // 42