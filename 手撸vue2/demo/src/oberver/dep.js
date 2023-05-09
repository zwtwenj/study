class Dep {
    constructor () {
        this.subs = []
    }

    // 收集
    depend () {
        // 我希望wathcer可以存放dep
        // 双向记忆
        // this.subs.push(Dep.target)
        Dep.target.addDep(this)
    }

    addSub (watcher) {
        this.subs.push(watcher)
    }
    
    // 更新watcher
    notify () {
        this.subs.forEach(watcher => {
            watcher.updata()
        })
    }
}

// 添加watcher
Dep.target = null
export function pushWatcher (watcher) {
    Dep.target = watcher
}

// 移除watcher
export function popTarget () {
    Dep.target = null
}

export default Dep