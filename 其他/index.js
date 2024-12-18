const a = new Promise((res, rej) => {
    setTimeout(() => {
        console.log(1)
        rej('err')
    }, 1000);
})

a.then(() => {
    setTimeout(() => {
        console.log(2)
        rej('err')
    }, 1000);
}, (err) => {
    console.log(err, '123123')
}).then(() => {
    setTimeout(() => {
        console.log(3)
        return Promise.resolve()
    }, 1000);
})