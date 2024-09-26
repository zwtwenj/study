Promise.resolve().then(() => {
    console.log(0);
    return Promise.resolve(4);
}).then((res) => {
    console.log(res)
})

Promise.resolve().then(() => {
    console.log(1);
}).then(() => {
    console.log(2);
}).then(() => {
    console.log(3);
}).then(() => {
    console.log(5);
}).then(() =>{
    console.log(6);
})

// 输出0，1，2，3，4，5，6
// 1.同步代码1行Promise.resolve()和8行Promise.resolve()
//   创建两个.then微任务队列
// 2.执行完同步代码执行微任务队列
//   执行2行，3行的Promise.resolve(4)和9行
//   创建两个微任务队列3行的Promise.resolve和10行.then
// 3.执行微任务队列的代码
//   执行第三行的Promise.resolve和第11行
//   生成两个微任务3行的return和12行的.then
//   并不是说return是微任务，是then的实现中，return出来的东西会被创建Promise的微任务包裹
//   所以return Promise.resolve()等于创建了两次微任务
// 4.执行微任务队列的代码
//   执行4行的.then和13行代码生成1个微任务14行的.then
//   执行同步代码5行的console.log(res)
//   执行微任务代码15行的console.log(5);