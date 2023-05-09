function identify() {
    return this.name.toUpperCase();
}
function speak() {
    var greeting = "Hello, I'm " + identify.call(this); console.log(greeting);
}
var me = { name: "Kyle" };
var you = { name: "Reader" };
identify.call(me); // KYLE
identify.call(you); // READER
speak.call(me); // Hello, 我是 KYLE
speak.call(you); // Hello, 我是 READER


// 如果不使用 this，那就需要给 identify() 和 speak() 显式传入一个上下文对象。
function identify(context) {
    return context.name.toUpperCase();
}
function speak(context) {
    var greeting = "Hello, I'm " + identify(context); console.log(greeting);
}
identify(you); // READER
speak(me); //hello, 我是 KYLE

// 然而，this 提供了一种更优雅的方式来隐式“传递”一个对象引用，因此可以将 API 设计得更加简洁并且易于复用。
// 随着你的使用模式越来越复杂，显式传递上下文对象会让代码变得越来越混乱，使用 this 则不会这样。当我们介绍对象和原型时，你就会明白函数可以自动引用合适的上下文对象有多重要。