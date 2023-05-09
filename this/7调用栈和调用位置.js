function baz() {
    // 当前调用栈是：baz 
    // 因此，当前调用位置是全局作用域
    console.log("baz");
    bar(); // <-- bar 的调用位置 
}
function bar() {
    // 当前调用栈是 baz -> bar 
    // 因此，当前调用位置在 baz 中
    console.log("bar");
    foo(); // <-- foo 的调用位置 
}
function foo() {
    // 当前调用栈是 baz -> bar -> foo 
    // 因此，当前调用位置在 bar 中 
    console.log("foo");
}
baz(); // <-- baz 的调用位置