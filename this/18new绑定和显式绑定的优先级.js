// new 和 call/apply 无法一起使用，因此无法通过 new foo.call(obj1) 来直接进行测试。但是我们可以使用硬绑定来测试它俩的优先级。
// Function.prototype.bind(..) 会创建一个新的包装函数，这个函数会忽略它当前的 this 绑定（无论绑定的对象是什么），并把我们提供的对象绑定到 this 上。

function foo(something) {
    this.a = something;
}

var obj1 = {};

var bar = foo.bind(obj1);
bar(2);
console.log(obj1.a); // 2

var baz = new bar(3);
console.log(obj1.a); // 2 
console.log(baz.a); // 3

// 出乎意料！ bar 被硬绑定到 obj1 上，但是 new bar(3) 并没有像我们预计的那样把 obj1.a 修改为 3。
// 相反，new 修改了硬绑定（到 obj1 的）调用 bar(..) 中的 this。
// 因为使用了 new 绑定，我们得到了一个名字为 baz 的新对象，并且 baz.a 的值是 3。

// 实际上，ES5 中内置的 Function.prototype.bind(..) 更加复杂。下面是 MDN 提供的一种 bind(..) 实现，
if (!Function.prototype.bind) {
    Function.prototype.bind = function (oThis) {
        if (typeof this !== "function") { // 与 ECMAScript 5 最接近的 // 内部 IsCallable 函数
            throw new TypeError("Function.prototype.bind - what is trying " + "to be bound is not callable");
        }
        var aArgs = Array.prototype.slice.call(arguments, 1),
            fToBind = this,
            fNOP = function () { },
            fBound = function () {
                return fToBind.apply(
                    (
                        this instanceof fNOP &&
                            oThis ? this : oThis
                    ),
                    aArgs.concat(Array.prototype.slice.call(arguments))
                );
            };
        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();
        return fBound;
    };
}

// 这种 bind(..) 是一种 polyfill 代码（polyfill 就是我们常说的刮墙用的腻子，
// polyfill 代码主要用于旧浏览器的兼容，比如说在旧的浏览器中并没有内置 bind 函数，
// 因此可以使用 polyfill 代码在旧浏览器中实现新的功能），对于 new 使用的硬绑定函数来说，
// 这段 polyfill 代码和 ES5 内置的 bind(..) 函数并不完全相同（后面会介绍为什么要在 new 中使用硬绑定函 数）。
// 由于 polyfill 并不是内置函数，所以无法创建一个不包含 .prototype 的函数，因此会具有一些副作用。
// 如果你要在 new 中使用硬绑定函数并且依赖 polyfill 代码的话，一定要非常小心。

// 下面是 new 修改 this 的相关代码：
this instanceof fNOP && oThis ? this : oThis 
// ... 以及： 
fNOP.prototype = this.prototype; 
fBound.prototype = new fNOP(); 
// 我们并不会详细解释这段代码做了什么（这非常复杂并且不在我们的讨论范围之内）
// 不过简单来说，这段代码会判断硬绑定函数是否是被 new 调用，如果是的话就会使用新创建 的 this 替换硬绑定的 this。