// 入口文件
import { initMixin } from "./init"
import { lifecycleMixin } from "./lifecycle"
import { renderMixin } from "./vnode/index.js"
import { initGlobApi } from "./global-api/index.js"
import { stateMixin } from './initState.js'
function Vue (options) {
    // 初始化
    this._init(options)
}

initMixin(Vue)
lifecycleMixin(Vue) // 添加生命周期
renderMixin(Vue) // 添加render
stateMixin(Vue) // 给vm添加一个$nextTick
initGlobApi(Vue) // 全局方法，Vue.mixin Vue.component Vue.extend等+

export default Vue