<template>
  <div class="editor">
    <EditorTop></EditorTop>
    <div class="editor-contain">
      <EditorMaterial></EditorMaterial>
      <EditorTree></EditorTree>
      <EditorCanvas></EditorCanvas>
      <EditorConfig></EditorConfig>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import EditorTop from './editorTop.vue'
import EditorMaterial from './editorMaterial/editorMaterial.vue'
import EditorConfig from './editorConfig.vue'
import EditorCanvas from './editorCanvas.vue'
import EditorTree from './editorTree.vue'
export default {
  name: 'editor',
  components: {
    EditorMaterial,
    EditorTop,
    EditorConfig,
    EditorCanvas,
    EditorTree
  }
}
</script>

<style lang="scss" scoped>
.editor{
  width: 100%;
  height: 100%;
  background: rgba(24, 24, 18, 1);
  .editor-contain{
    display: flex;
    height: calc(100% - 60px);
  }
}
</style>
