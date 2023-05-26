<template>
    <div class="editor-material">
        <editorMaterialItem v-for="item in componentMenu" :key="item.key" :componentItem="item"></editorMaterialItem>
    </div>
</template>

<script>
import { ref } from 'vue'
import materialData from '../../material/index'
import editorMaterialItem from './editorMaterialItem.vue'
export default {
    components: {
        editorMaterialItem
    },
    setup () {
        const componentMenu = ref(materialData)
        return {
            componentMenu
        }
    }
}
</script>

<style lang="scss" scoped>
.editor-material{
    width: 200px;
    background: #232324;
    border-right: 1px solid rgba(255, 255, 255, 0.09);
    box-sizing: border-box;
    padding: 5px;
}
</style>