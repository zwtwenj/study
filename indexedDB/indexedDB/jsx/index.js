import { defineComponent } from 'vue'
let db = null
let db_table = null
let globalOption = {
    warehouseName: '',
    key: ''
}

export function start (options) {
    for (let key in globalOption) {
        globalOption[key] = options[key]
    }

    const t1 = new Promise((reslove, reject) => {
        let request = window.indexedDB.open(globalOption.warehouseName, Date.now());
        // 数据仓库打开失败
        request.onerror = function(error) {
            console.log('IndexedDB 打开失败', error);
            reject(err)
        };

        // 数据仓库打开成功
        request.onsuccess = function(res) {
            console.log('IndexedDB 打开成功', res);
            db = res.target.result;
            reslove()
        };

        // 数据仓库升级事件(第一次新建库是也会触发，因为数据仓库从无到有算是升级了一次)
        request.onupgradeneeded = function(res) {
            console.log('IndexedDB 升级成功', res);
            db = res.target.result;
            try {
                db_table = db.createObjectStore(globalOption.warehouseName, { keyPath: globalOption.key });
                db_table.createIndex('indexName', 'id', { unique: false })
            } catch {
                
            }
        };
    })

    return t1
}

export function getData (options) {
    let { url } = options
    const pro = new Promise((resolve, reject) => {
        fetch(url).then(res => {
            return res.json()
        }).then(res => {
            resolve(res)
        }).catch(err => {
            console.log(err)
            reject(err)
        })
    })
    return pro
}

// 添加数据
export function addData (data) {
    const pro = new Promise((resolve, reject) => {
        let { id, name, setup, updataTime } = data
        /*
            *add方法添加数据
            *@params 需要添加的数据信息
        */
        let store = db.transaction([globalOption.warehouseName], 'readwrite').objectStore(globalOption.warehouseName);
        let request = store.put({
            time: new Date().getTime(),
            id: id,
            name: name,
            setup: setup,
            updataTime: updataTime
        })

        /*
            *添加成功
        */
        request.onsuccess = function(event) {
            console.log('数据添加成功', event);
            resolve()
        };
        
        /*
            *添加失败
        */
        request.onerror = function(event) {
            console.log('数据添加失败', event);
            reject()
        };
    })
    return pro
}

export function getComponent (id) {
    const pro = new Promise((resolve, reject) => {
        let store = db.transaction([globalOption.warehouseName], 'readwrite').objectStore(globalOption.warehouseName);
        let request = store.index('indexName').get('ceshi');
        /*
            *获取成功
        */
        request.onsuccess = function (event) {
            console.log('通过索引获取数据成功', event.target.result);
            resolve(event.target.result)
        };
        /*
            *获取失败
        */
        request.onerror = function (event) {
            console.log('通过索引获取数据失败',event);
            reject()
        };
    })
    return pro
}

export function createComponent (vm, data) {
    let setup = (props) => {
        return () => <div>
            111
        </div>
    }
    
    setup = eval(`${data.setup}`)
    
    const component = defineComponent({
        setup
    })    
    vm.component('ceshi', component)
}

/**
 * 这个东西想做个测试
 * 把组件丢到后端（以jsx形式），然后后端返回组件数据
 * 前端通过接口获取组件数据，把组件数据存到indexedDB中
 * 想做一个组件动态配置的低代码平台，用户想下载哪个就下载哪个，感觉组件多的话可能会超出localStorage最大存储大小（一般是5M），所以想要通过indexedDB存储
 * 用defineComponent创建新组件
 * 后端返回的组件数据插入defineComponent组件的setup部分，然后通过vm.component注册全局组件
 * 想法很好，基本逻辑也能实现但还有一些问题
 */

/**
 * indexedDB碰到的一些问题
 * 打开的话速度比较慢，数据多的话可能会有0.1S吧
 * 插入新数据后，如果用户要看的话要在浏览器里面手动刷新，或者说关闭王网页卡重新打开页面
 * 用起来比localStorage麻烦
 */

/**
 * jsx碰到的一些问题
 * vue3中使用jsx必须文件后缀为jsx
 * 安装@vitejs/plugin-vue-jsx，然后再vite.config里面进行配置
 * 这个插件的话是调用vite编译时候的生命周期的时候对jsx进行解析，类似于
 * let setup = (props) => {
        return () => <div>
            111
        </div>
    }
    解析为
    props => {
        return () => _createVNode("div", null, [_createTextVNode("111")]);
    }
    但这样就有个问题，解析是插件在代码执行之前做的，而且是编译时的一次性动作
    但如果从接口返回通过eval去生成setup函数时，这个解析就不会执行了，这个时候就会报错
    在react中，有一个jsx-parser插件进行一个jsx解析，但是vue中没有对应的插件
    没想到啥解决办法，干脆后端直接返回解析之后的代码，然后进行eval，如下
    let setup = eval(`props => {
        return () => _createVNode("div", null, [_createTextVNode("111")]);
    }`)
    然后出现了另一个问题，直接新建一个变量接收eval之后报错_createTextVNode没有定义
    经过调试之后，发现先创建一个setup变量并复制一段jsx代码，再去修改setup这个时候能找到_createTextVNode
    这可能跟@vitejs/plugin-vue-jsx插件有关？
 * */ 
