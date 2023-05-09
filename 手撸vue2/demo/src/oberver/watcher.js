// 通过watcher这个类实现更新
// （1）通过这个类watcher实现更新
// （2）

import { pushWatcher, popTarget } from "./dep"
import { nextTick } from "../utils/nextTick.js"

let id = 0
class watcher {
    constructor (vm, updataComponent, cb, options) {
        this.vm = vm
        this.exprOrfn = updataComponent
        this.cb = cb
        this.options = options
        this.id = id++
        this.deps = []
        this.depsId = new Set()
        
        if (typeof updataComponent === 'function') {
            // let updataComponent = () => {
            //     vm._updata(vm._render())
            // }
            // 用来更新视图
            this.getter = updataComponent
        }
        this.get()
    }

    addDep (dep) {
        // 1.去除
        let id = dep.id
        if (!this.depsId.has(id)) {
            this.deps.push(dep)
            this.depsId.add(id)
            dep.addSub(this)
        }
    }

    run () {
        let value = this.get()
        let oldValue = this.value
        this.value = value
        if (this.user) {
            this.cb.call(this.vm, value, oldValue)
        }
    }
    
    // 初次渲染
    get () {
        // 给dep添加watcher
        pushWatcher(this)
        // 渲染页面
        this.getter()
        // 给dep取消watcher
        popTarget()
    }

    // 更新
    updata () {
        // 注意：不要数据更新后每次都调用get方法，get方法会重新渲染
        // this.getter()

        // 实现缓存
        queueWatcher(this)
    }
}

let queue = [] // 讲需要批量更新的watcher存放到一个列队中
let has = {}
let pending = false

function flushWatcher () {
    queue.forEach(item => {
        // item.run()
        item.getter()
        item.cb()
    })
    queue = []
    has = {}
    pending = false
}

function queueWatcher (watcher) {
    // 每个组件都是同一个watcher
    let id = watcher.id
    if (has[id] == null) {
        queue.push(watcher)
        has[id] === true
        // 防抖：用户触发多次，只触发一次
        if (!pending) {
            // setTimeout(() => {
            //     queue.forEach(item => {
            //         item.run()
            //         queue = []
            //         has = {}
            //         pending = false
            //     })
            // }, 0)
            // 相当于上方的定时器
            nextTick(flushWatcher)
        }
        pending = true
    }
}

export default watcher

// 收集依赖
// dep和data中的属性是一一对应的
// watcher在视图上用几个就有几个watcher
// dep与watcher的关系：一对多
