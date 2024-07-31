<template>
  <el-dialog title="新增插件" @open="openHandle">
    <div style="display: flex;">
      <div class="plugin-config">
        <el-tabs v-model="useModel" @tabChange="changeUseModel">
          <el-tab-pane label="自定义" :name="0"></el-tab-pane>
          <el-tab-pane label="使用预设" :name="1"></el-tab-pane>
        </el-tabs>
        <div v-if="useModel === 0" style="text-align: right">
          <el-button type="primary" @click="newPresetShow = true">设置为预设</el-button>
        </div>
        <div v-if="useModel === 1" style="display: flex;align-items: center;justify-content: space-between;">
          <div>
            预设：
            <el-radio-group v-model="selectedPreset" @change="changePreset">
              <el-radio v-for="item in presetList" :key="item.desc" :value="item.desc" :label="item.desc"></el-radio>
            </el-radio-group>
          </div>
          <div>
            <el-button type="primary">删除预设</el-button>
            <el-button type="primary">保存预设</el-button>
          </div>
        </div>
        <div class="plugin-data" style="margin-top: 5px;">
          <div v-for="(item, index) in pluginData" :key="index" class="plugin-data-item">
            <el-input v-model="item.key" style="width:200px;" @change="renderPlugin"></el-input>：
            <el-input v-model="item.value" @change="renderPlugin"></el-input>
            <el-button style="margin-left:5px;" type="danger" @click="deleteAttribute(index)">-</el-button>
          </div>
          <el-button @click="addAttribute" style="width:100%;" type="primary">+</el-button>
        </div>
        <div class="plugin-html">
          <el-input type="textarea" rows="10" v-model="pluginHtml" @change="renderPlugin"></el-input>
        </div>
      </div>
      <div class="plugin-preview" ref="pluginPreview">

      </div>
    </div>
    <el-dialog v-model="newPresetShow" width="300" align-center>
      预设方案名称：<el-input v-model="newPresetName" maxlength="10"></el-input>
      <div class="footer" style="margin-top:5px;text-align: right;">
        <el-button type="primary" @click="setPreset">确定</el-button>
        <el-button @click="newPresetShow = false; newPresetName = ''">取消</el-button>
      </div>
    </el-dialog>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
// 模式：自定义/预设
const useModel = ref(0)
const changeUseModel = () => {
  formateData()
  if (useModel.value === 1) {
    selectedPreset.value = presetList[0].desc
    changePreset()
  }
  if (pluginPreview.value) {
    renderPlugin()
  }
}
const formateData = () => {
  pluginData.value = []
  for (let key in originPluginData.value) {
    pluginData.value.push({
      key: key,
      value: originPluginData.value[key]
    })
  }
}

// 插件数据
const originPluginData = ref<any>({
  text: '按钮',
  fontColor: 'blue',
  fontSize: '14px'
})
const pluginData = ref<any[]>([])
const pluginHtml = ref('<button style="color:{{fontColor}}">{{text}}</button>')

// 预设
const selectedPreset = ref('')
const newPresetShow = ref(false)
const presetList = [{
  desc: '普通按钮',
  data: {
    text: '按钮',
    fontColor: 'blue',
    fontSize: '14px'
  }
}, {
  desc: '危险按钮',
  data: {
    text: '按钮',
    fontColor: 'red',
    fontSize: '14px'
  }
}]
// 设置为预设
const newPresetName = ref('')
const setPreset = () => {
  const data: any = {}
  pluginData.value.forEach((item: { key: string, value: string }) => {
    data[item.key] = item.value
  })
  presetList.push({
    desc: newPresetName.value,
    data: data
  })
  newPresetShow.value = false
}
// 选中预设
const changePreset = () => {
  const data: any = presetList.find((item: any) => { return item.desc === selectedPreset.value })
  Object.assign(originPluginData.value, data.data)
  formateData()
  renderPlugin()
}

// 增加属性
const addAttribute = () => {
  pluginData.value.push({
    key: '',
    value: ''
  })
}

// 删除属性
const deleteAttribute = (index: number) => {
  pluginData.value.splice(index, 1)
  renderPlugin()
}

const pluginConfig = computed(() => {
  const result: any = {}
  pluginData.value.forEach((item: any) => {
    if (item.key.trim() !== '') {
      result[item.key] = item.value
    }
  })
  return result
})

// 预览
const pluginPreview = ref()
const renderPlugin = () => {
  let htmlStr = pluginHtml.value
  const pattern = new RegExp('{{([^]*?)}}', 'g')
  htmlStr = htmlStr.replace(pattern, (match: any) => {
    const attribute = match.slice(2, match.length - 2)
    return pluginConfig.value[attribute] || match
  })
  pluginPreview.value.innerHTML = htmlStr
}
const openHandle = () => {
  renderPlugin()
}

const main = () => {
  changeUseModel()
}
main()
</script>

<style scoped lang="less">
.plugin-config {
  flex: 1;
  margin-right: 10px;

  .plugin-data {
    margin-bottom: 10px;

    .plugin-data-item {
      display: flex;
      align-items: center;
      margin-bottom: 5px;
    }
  }
}

.plugin-preview {
  width: 300px;
  border: 1px solid #ddd;
}
</style>