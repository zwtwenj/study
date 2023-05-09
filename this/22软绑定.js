// 硬绑定这种方式可以把 this 强制绑定到指定的对象（除了使用 new 时），防止函数调用应用默认绑定规则。
// 问题在于，硬绑定会大大降低函数的灵活性，使用硬绑定之后就无法使用隐式绑定或者显式绑定来修改 this。
// 如果可以给默认绑定指定一个全局对象和 undefined 以外的值，那就可以实现和硬绑定相同的效果，同时保留隐式绑定或者显式绑定修改 this 的能力
// 可以通过一种被称为软绑定的方法来实现我们想要的效果：

if (!Function.prototype.softBind) { 
    Function.prototype.softBind = function(obj) { 
        var fn = this; 
        // 捕获所有 curried 参数
        var curried = [].slice.call( arguments, 1 );
        var bound = function() {
            return fn.apply(
                (!this || this === (window || global)) ?
                    obj : this,
                curried.concat.apply( curried, arguments ) 
            );
        };
        bound.prototype = Object.create( fn.prototype );
        return bound; 
    }; 
}

// 除了软绑定之外，softBind(..) 的其他原理和 ES5 内置的 bind(..) 类似。
// 它会对指定的函 数进行封装，首先检查调用时的 this，如果 this 绑定到全局对象或者 undefined，那就把 指定的默认对象 obj 绑定到 this，否则不会修改 this。
function foo() { 
    console.log("name: " + this.name); 
}
var obj = { 
    name: "obj" 
}, 
obj2 = { 
    name: "obj2" 
}, 
obj3 = { 
    name: "obj3" 
};
var fooOBJ = foo.softBind( obj ); 
fooOBJ(); // name: obj 
obj2.foo = foo.softBind(obj); 
obj2.foo(); // name: obj2 <---- 看！！！ 
fooOBJ.call( obj3 ); // name: obj3 <---- 看！ 
setTimeout( obj2.foo, 10 ); // name: obj <---- 应用了软绑定