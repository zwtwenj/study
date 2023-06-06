window.addEventListener('error', function (e) {
    console.log(e)
})

window.addEventListener('unhandledrejection', function (e) {
    console.log(e)
})

const xhrPropotype = XMLHttpRequest.prototype
const oldOpen = xhrPropotype.open
xhrPropotype.open = function () {
    console.log(arguments)
    oldOpen.apply(this, arguments)
}
// xhrPropotype.onreadystatechange = function () {
//     console.log(arguments)
//     oldOnreadystatechange.apply(this, arguments)
// }

// Vue.config.errorHandler = function (e, vm, imfo) {
//     console.log(e)
// }

// console.log(a)

// const a = new Promise((res, rej) => {
//     console.log('mypromise')
//     rej()
// })

// a(() => {}, () => {console.log('rej')})

