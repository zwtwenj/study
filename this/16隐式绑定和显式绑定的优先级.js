// 隐式绑定和显式绑定哪个优先级更高？我们来测试一下：
function foo() {
    console.log(this.a);
}
var obj1 = {
    a: 2,
    foo: foo
};
var obj2 = {
    a: 3,
    foo: foo
};
obj1.foo(); // 2 
obj2.foo(); // 3 
obj1.foo.call(obj2); // 3 
obj2.foo.call(obj1); // 2
// 可以看到，显式绑定优先级更高，也就是说在判断时应当先考虑是否可以应用显式绑定。