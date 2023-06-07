<template>
    <div class="editor-canvas-wrap">
        这里是编辑器主窗口
        <div class="editor-canvas"
        @dragover.prevent
        @drop="dragHandle"
        @dragover="dragoverHandle"
        @dragenter="dragoverHandle">
        {{ $store.state.componentData }}
        </div>
    </div>
</template>

<script setup>
import { useStore } from 'vuex'
const store = useStore()
const dragoverHandle = (() => {
    
})
const dragHandle = ((e) => {
    e.preventDefault()
    console.log(createComponent(store.state.componentData))
    try {

    } catch {

    }
})

const createComponent = async (targetData) => {

}
</script>

<style lang="scss" scoped>
.editor-canvas-wrap{
    flex: 1;
    margin: 0 2px;
    .editor-canvas{
        background-color: #232324;
        height: 500px;
        width: 100%;
    }
}
</style>