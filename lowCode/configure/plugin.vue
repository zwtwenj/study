<!--插件-->
<template>
  <div class="configure-plugin">
    <div v-for="item in plugins" :key="item.name" class="plugin-wrap">
      <span class="plugin-item" draggable="true" @dragstart="dragPlugig($event, item.name)" v-html="getHtml(item)">
      </span>
    </div>
    <el-button type="primary" @click="createPlugin">新增插件</el-button>
    <newPlugin v-model="newPluginShow"></newPlugin>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import newPlugin from './newPlugin.vue'
import plugins from '@/configurePlugin/plugins.ts'

const getHtml = (plugin: any) => {
  const pattern = new RegExp('{{([^]*?)}}', 'g')
  let render: string = plugin.render
  render = render.replace(pattern, (match: any) => {
    const attribute = match.slice(2, match.length - 2)
    return plugin.data[attribute] || match
  })
  return render
}

const dragPlugig = (e: any, type: string) => {
  e.dataTransfer.setData("plugin", type);
  e.dataTransfer.setData("rect", `[${e.target.offsetWidth / 2}, ${e.target.offsetHeight / 2}]`);
  e.dataTransfer.setDragImage(e.target, e.target.offsetWidth / 2, e.target.offsetHeight / 2)
}

const newPluginShow = ref(false)
const createPlugin = () => {
  newPluginShow.value = true
}
</script>

<style lang="less" scoped>
.configure-plugin {
  display: flex;
  left: 300px;
}

.plugin-button {
  background: #b3b3b3;
  color: #fff;
  font-size: 12px;
  line-height: 32px;
  height: 32px;
  padding: 0 15px;
  border-radius: 5px;
  cursor: pointer;
}

.plugin-wrap {
  padding: 5px;
  border: 1px solid #666;
}

.plugin-item {
  cursor: pointer;
}
</style>@/configurePlugin/plugins