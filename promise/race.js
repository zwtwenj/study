const a = new Promise((res, rej) => {
  setTimeout(() => {
    console.log(1);
    res(1);
  }, 5000);
});

const b = new Promise((res, rej) => {
  setTimeout(() => {
    console.log(2);
    res(2);
  }, 3000);
});

Promise.race([a, b])
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  });

// 2
// 2
// 1

const c = new Promise((res, rej) => {
  setTimeout(() => {
    console.log(3);
    rej(3);
  }, 2000);
});

const d = new Promise((res, rej) => {
  setTimeout(() => {
    console.log(4);
    res(4);
  }, 3000);
});

Promise.race([c, d])
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  });

// 3
// 3
// 4

// Promise.race接收promise数组，在其中一个得到返回之后立即执行.then或者.catch
// 但是并不会阻止其他promise执行，但其他promise执行结果不会走then或者catch
// promise.all只会以最先返回的为的执行结果
