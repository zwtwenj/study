class MyPromise {
    constructor (handler) {
        this._status = 'pending'
        this._value = undefined
        this.onResolveCB = []
        this.onRejectedCB = []
        handler(this._resolve.bind(this), this._reject.bind(this))
    }
    _resolve (val) {
        // if (this._status === 'pending') {
        //     console.log('resolve')
        //     this._status = 'resolved'
        //     this._value = val
        //     console.log(val)
        // }
        console.log(val)
        console.log(this.onRejectedCB)
        function run (tasks) {
            let cb
            while(cb = tasks.shift()){
                cb(val)
            }
        }
        setTimeout(() => {
            run(this.onResolveCB)
        }, 0);
    }
    _reject (val) {
        if (this._status === 'pending') {
            console.log('reject')
            this._status = 'rejected'
            this._value = val
        }
    }
    then (onFulfilled, onRejected) {
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : () => {}
        onRejected = typeof onRejected === 'function' ? onRejected : () => {}
        return new MyPromise((res, rej) => {
            switch (this._status) {
                case 'pending':
                    this.onResolveCB.push(onFulfilled)
                    this.onRejectedCB.push(onRejected)
                    break;
            }
        })
    }
}

const p = new MyPromise((res, rej) => {
    setTimeout(() => {
        console.log('1')
        res('2')
    }, 1000);
}).then(result => {
    // return new MyPromise((res, rej) => {
    //     setTimeout(() => {
    //         console.log('3')
    //         res('4')
    //     }, 1000);
    // }).then(res => {
    //     console.log(res)
    // })
    return new Promise((res, rej) => {
        setTimeout(() => {
            console.log(result)
            res('3')
        }, 1000);
    })
})


.then(result => {
    console.log(result)
})

// const a = new MyPromise((res, rej) => {
//     console.log('a')
//     res('b')
// }).then(res => {
//     console.log(res)
//     console.log('c')
// }).then(res => {
//     console.log(res)
// })