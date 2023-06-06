import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './index'

const app = createApp(App)
app.config.errorHandler = function (err, vm, info) {
    console.log(err)
    console.log(vm)
    console.log(info)
}
app.use(router).mount('#app')
