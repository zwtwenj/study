import { createStore } from 'vuex'

export default createStore({
    state: {
        componentData: null,
        num: 10
    },
    mutations: {
        setNum (state, data) {
            state.num = data
        },
        setComponentData (state, data) {
            state.componentData = data
        }
    },
    actions: {
    },
    modules: {
    }
})