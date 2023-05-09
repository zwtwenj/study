// 装箱：把基本数据类型转化为对应的引用数据类型的操作
var s1 = "abc";
var s2 = s1.indexOf("a")
// string是基本数据类型，怎么能调用方法
/**
 * 每当读取一个基本类型的时候，后台就会创建一个对应的基本包装类型对象，从而让我们能够调用一些方法来操作这些数据。
 * 变量s1是一个基本类型值，它不是对象，它不应该有方法。但是js内部为我们完成了一系列处理（即装箱），使得它能够调用方法。
 * 实现的机制如下：
 * （1）创建String类型的一个实例；
 * （2）在实例上调用指定的方法；
 * （3）销毁这个实例；
 */

// 下面来看看代码实现：
var s1  = new String("some text");
var s2 = s1.substring(2);
s1 = null;

// 这样就完成装箱，我们也就能在s1上调用方法了

// 拆箱：将引用类型对象转换为对应的值类型对象
// 它是通过引用类型的valueOf()或者toString()方法来实现的。如果是自定义的对象，你也可以自定义它的valueOf()/tostring()方法，实现对这个对象的拆箱。
var objNum = new Number(123);  
var objStr =new String("123");   
console.log( typeof objNum ); //object
console.log( typeof objStr ); //object 
console.log( typeof objNum.valueOf() ); //number
console.log( typeof objStr.valueOf() ); //string

console.log( typeof objNum.toString() ); // string 
console.log( typeof objStr.toString() ); // string