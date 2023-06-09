import { createApp } from 'vue'
import routes from './router'
import { createRouter, createWebHashHistory } from 'vue-router'
import App from './App.vue'
import './index'

// function vuePlugin (Raven, Vue) {
//     var _oldOnError = Vue.config.errorHandler
//     Vue.config.errorHandler = function VueErrorHandler(error, vm, info) {
//         // 上报
//         Raven.captureException(error, {
//             extra: metaData
//         });
    
//         if (typeof _oldOnError === 'function') {
//             // 为什么这么做？
//             _oldOnError.call(this, error, vm, info);
//         }
//     }
// }

// createApp(App).use(routes).mount('#app')
let history
let router
let app
function render (props = {}) {
    console.log('跳转了')
    history = createWebHashHistory('/vue')
    router = createRouter({
        routes,
        history
    })
    app = createApp(App)
    app.config.errorHandler = function (err, vm, info) {
        console.log(err)
        console.log(vm)
        console.log(info)
    }
    let { container } = props
    app.use(router).mount(props.container ? container.querySelector('#app') : '#app')
}

// 乾坤渲染前提供一个变量window.__POWERD_BY_QIANKUN__
if (!window.__POWERD_BY_QIANKUN__) {
    render()
}

// 暴露接入协议
export async function bootstrap () {
    console.log('my-vue bootsTrap')
}

export async function mount (props) {
    console.log('my-vue mount')
    render(props)
}

export async function unmount () {
    console.log('my-vue unmount')
    history = null
    app = null
    router = null
}