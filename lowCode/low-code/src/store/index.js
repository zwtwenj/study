import { createStore } from 'vuex'

export default createStore({
    state: {
        componentData: null,
        componentList: [],
        num: 10,
        fouseComponent: {},
        idCount: 0
    },
    mutations: {
        setNum (state, data) {
            state.num = data
        },
        setComponentData (state, data) {
            state.componentData = data
        },
        pushComponentList (state, data) {
            if (!data) {
                state.componentList.push(state.componentData)
            }
        },
        setFouse (state, data) {
            state.fouseComponent = data
        },
        setIdcount (state) {
            state.idCount += 1
        }
    },
    actions: {
    },
    modules: {
    }
})