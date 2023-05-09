function foo(num) {
    console.log("foo: " + num); // 记录 foo 被调用的次数
    this.count++;
}
foo.count = 0;
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
console.log(foo.count);


// 如果我增加的 count 属性和预期的不一样，那我增加的是哪个 count ？
// 实际上，这段代码在无意中创建了一个全局变量 count，它的值为 NaN。（原理暂不讨论）