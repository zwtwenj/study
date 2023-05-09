// 如果你把 null 或者 undefined 作为 this 的绑定对象传入 call、apply 或者 bind，这些值 在调用时会被忽略，实际应用的是默认绑定规则：
function foo() { 
    console.log( this.a ); 
}
var a = 2; 
foo.call( null ); // 2