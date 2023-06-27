import { createApp } from 'vue'
import App from './App.vue'
import { start, getData, addData, getComponent, createComponent } from './index.jsx'


const app = createApp(App)

let options = {
    warehouseName: 'component',
    key: 'id'
}

start(options).then(() => {
    return getData({url: 'http://localhost:30000/getData'})
}).then(res => {
    return addData(res)
}).then(() => {
    return getComponent('ceshi')
}).then(res => {
    createComponent(app, res)
})