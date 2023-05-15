import { registerMicroApps, start } from 'qiankun'

const loader = (loading) => {
    console.log(loading)
}

registerMicroApps([{
    name: 'my-vue',
    entry: '//localhost:20000',
    container: '#container',
    activeRule: '/vue',
    loader
}], {
    beforeLoad: () => {
        console.log('加载前')
    },
    beforeMount: () => {
        console.log('挂载前')
    },
    afterMount: () => {
        console.log('挂载后')
    },
    beforeUnmount: () => {
        console.log('销毁前')
    },
    afterUnmount: () => {
        console.log('销毁后')
    }
})

start()