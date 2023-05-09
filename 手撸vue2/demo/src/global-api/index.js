import { mergeOptions } from "../utils/index.js"

export function initGlobApi (Vue) {
    Vue.options = {}
    Vue.Mixin = function (mixin) {
        this.options = mergeOptions(this.options, mixin)
        // console.log(Vue.$options)
    }
}