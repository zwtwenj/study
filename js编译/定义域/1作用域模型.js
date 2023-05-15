// https://www.jianshu.com/p/70b38c7ab69c

var a = 2;

function foo() {
  console.log(a); // 会输出2还是3？
}

function bar() {
  var a = 3;
  foo();
}

bar();