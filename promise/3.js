class MPromise {
    static PENDINGSTATUS = 'pending'
    static FULFILLESSTATUS = 'fulfilled'
    static REJECTEDSTATUS = 'rejected'
    constructor(executor) {
        this.PromiseState = MPromise.PENDINGSTATUS;
        this.PromiseResult = null;
        // 存放then 函数中需要执行的 onFulfilled, onRejected 回调函数
        this.resolvedQueue = [];
        this.rejectedQueue = [];
        // resolve 和 reject 执行时 this 的值为 window，需要绑定 this
        executor(this.resolve.bind(this), this.reject.bind(this));
    }
    resolve(res) {
        // console.log('resolve')
        if (this.PromiseState === MPromise.PENDINGSTATUS) {
            // 通过if 判断状态，实现无法再次修改 promise 的状态
            // 异步执行 resolvedQueue 队列中保存的 onFulfilled 函数
            // 开启微队列
            resultHandlerAsync(() => {
                this.PromiseResult = res;
                this.PromiseState = MPromise.FULFILLESSTATUS;
                if (this.resolvedQueue.length) {
                    const cb = this.resolvedQueue.shift();
                    cb(res)
                }
            })
        }
    }
    reject(err) {
        if (this.PromiseState === MPromise.PENDINGSTATUS) {
            // 异步执行 rejectedQueue 队列中保存的 onRejected 函数
            // 开启微队列
            resultHandlerAsync(() => {
                this.PromiseResult = err;
                this.PromiseState = MPromise.REJECTEDSTATUS;
                if (this.rejectedQueue.length) {
                    const cb = this.rejectedQueue.shift();
                    cb(err)
                }
            })
        }
    }
    then(onFulfilled, onRejected) {
        // then 函数用来注册回调函数，将要执行的 onFulfilled, onRejected 回调函数加入到队列中
        onFulfilled = (typeof onFulfilled === 'function') ? onFulfilled : res => res;
        onRejected = (typeof onRejected === 'function') ? onRejected : err => { throw err };
        return new MPromise((resolve, reject) => {
            if (this.PromiseState === MPromise.PENDINGSTATUS) {
                // 改写目的：实现 onFulfilled 返回值，均会传递给下一次的 then 中 onFulfilled的参数
                this.resolvedQueue.push((res) => {
                    try {
                        const result = onFulfilled(res);
                        resolve(result);
                    } catch (err) {
                        reject(err)
                    }

                });
                this.rejectedQueue.push((err) => {
                    try {
                        const result = onRejected(err);
                        resolve(result);
                    } catch (err) {
                        reject(err)
                    }
                });
            }
        })
    }
    catch(onRejected) {
        return this.then(undefined, onRejected)
    }
    finally(cb) {
        return new MPromise((resolve, reject) => {
            if (this.PromiseState === MPromise.PENDINGSTATUS) {
                // 改写目的：实现 onFulfilled 返回值，均会传递给下一次的 then 中 onFulfilled的参数
                this.resolvedQueue.push((res) => {
                    try {
                        cb()
                        resolve(res);
                    } catch (err) {
                        reject(err)
                    }
                });
                this.rejectedQueue.push((err) => {
                    try {
                        cb();
                        resolve(err);
                    } catch (err) {
                        reject(err)
                    }
                });
            }
        })
    }
    static resolve(res) {
        return new MPromise(resolve => resolve(res))
    }
    static reject(res) {
        return new MPromise((resolve, reject) => reject(res))
    }
    static race(promiseList) {
        return new MPromise((resolve, reject) => {
            promiseList.forEach(p => p.then(res => resolve(res), err => reject(err)))
        })
    }
    static all(promiseList) {
        return new MPromise((resolve, reject) => {
            let promiseArr = [];
            promiseList.forEach(p => {
                p.then(res => {
                    promiseArr.push(res)
                }, err => {
                    throw new Error(err);
                    reject(err);
                })
            })
            resolve(promiseArr);
        })
    }
}

function resultHandlerAsync(cb) {
    // 此函数会开启一个微任务，cb 放入到微任务中执行
    const observer = new MutationObserver(cb);
    observer.observe(document.body, { attributes: true });
    document.body.className = `${Math.random()}`;
}

const a = new MPromise((res, rej) => {
    setTimeout(() => {
        console.log('1')
        res('2')
    }, 1000);
}).then(res => {
    console.log(res)
})