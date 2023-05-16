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
}, {
    name: 'my-react',
    entry: '//localhost:30000',
    container: '#container',
    activeRule: '/react',
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
console.log(registerMicroApps)
start({
    prefetch: true, // 开启预加载
    sandbox: {
        strictStyleIsolation: true, // 启用shadowDOM
        experimentalStyleIsolation:true // 增加一个特殊的选择器规则来限定其影响范围
    }
})