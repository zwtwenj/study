<template>
    <div class="editor-canvas-wrap">
        <div class="editor-canvas"
        @dragover.prevent
        @drop="dragHandle"
        @dragover="dragoverHandle"
        @dragenter="dragoverHandle"
        @mouseup="mouseUpHandle">
            <editorComponentList></editorComponentList>
        </div>
    </div>
</template>

<script setup>
import { useStore } from 'vuex'
import editorComponentList from './editorComponentList.vue';
const store = useStore()
const dragoverHandle = (() => {
    
})

const dragHandle = ((e) => {
    console.log(e)
    e.preventDefault()
    if (store.state.componentData) {
        const data = store.state.componentData
        data.style.top = e.offsetY + 'px'
        data.style.left = e.offsetX + 'px'
        data.id = store.state.idCount
        store.commit('setIdcount')
        store.commit('setComponentData', data)
        store.commit('pushComponentList')
        store.commit('setFouse', data)
    }
})

const mouseUpHandle = (e) => {

}
</script>

<style lang="scss" scoped>
.editor-canvas-wrap{
    flex: 1;
    margin: 0 2px;
    .editor-canvas{
        background-color: #232324;
        height: 500px;
        width: 600px;
        position: relative;
    }
}
</style>