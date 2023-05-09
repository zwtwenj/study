// 使用策略模式合并寿命周期

export const HOOKS = [
    "beforeCreate",
    "created",
    "beforeMound",
    "mounted",
    "beforeUpdate",
    "updated",
    "beforeDestory",
    "destroyed",
    "watch"
]

let starts = {}
starts.data = function (parentVal, childVal) {
    return childVal
}
starts.computed = function () {}
starts.watch = function () {}
starts.methods = function () {}

HOOKS.forEach(hooks => {
    starts[hooks] = mergeHook
})

function mergeHook (parentVal, childVal) {
    if (childVal) {
        if (parentVal) {
            return parentVal.concat()
        } else {
            // return childVal
            return [childVal]
        }
    } else {
        return parentVal
    }
}

export function mergeOptions (parent, child) {
    const options = {}
    // 遍历父组件
    for (let key in parent) {
        mergeField(key)
    }

    // 遍历子组件
    for (let key in child) {
        mergeField(key)
    }
    
    function mergeField(key) {
        // 根据key 策略模式来实现
        if (starts[key]) {
            options[key] = starts[key](parent[key], child[key])
        } else {
            options[key] = child[key]
        }
    }
    return options
}