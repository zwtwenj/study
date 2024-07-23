// const a = new Promise((res, rej) => {
//   setTimeout(() => {
//     console.log(1);
//     res(1);
//   }, 2000);
// });

// const b = new Promise((res, rej) => {
//   setTimeout(() => {
//     console.log(2);
//     res(2);
//   }, 3000);
// });

// Promise.all([a, b]).then((res) => {
//   console.log(res);
// });

// 1
// 1
// [1,2]

// Promise.all接收promise数组，数组内的promise各自执行，只有当所有promise执行完毕之后才会执行本身的结果，结果为一个resolve返回数据的数组

const a = new Promise((res, rej) => {
  setTimeout(() => {
    console.log(1);
    rej(1);
  }, 2000);
});

const b = new Promise((res, rej) => {
  setTimeout(() => {
    console.log(2);
    res(2);
  }, 3000);
});

const c = new Promise((res, rej) => {
  setTimeout(() => {
    console.log(3);
    res(3);
  }, 1000);
});

Promise.all([a, b, c])
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  });

// 3
// 1
// 1
// 2

// 如果其中有一个promise执行失败，那么会立即执行.catch，并且值只有失败的res的值
// 其他执行的promise结果不会走.then和.catch
