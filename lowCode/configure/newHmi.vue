<!--新增流程图-->
<template>
  <el-dialog width="400" title="新建流程图" :close-on-click-modal="false" @open="openHandler">
    <el-tabs v-model="newHmiModel">
      <el-tab-pane label="新建流程图" name="new"></el-tab-pane>
      <el-tab-pane label="复制流程图" name="copy"></el-tab-pane>
    </el-tabs>
    <div style="margin: 10px 0;">流程图名称：</div>
    <el-input placeholder="请填写流程图名称" v-model="newHmiName" maxlength="50"></el-input>
    <div v-show="newHmiModel === 'copy'">
      <div style="margin: 10px 0;">选择要使用的配置数据：</div>
      <!-- 项目： -->
      <el-select v-model="copyProject" placeholder="请选择项目" @change="getChartList">
        <el-option v-for="item in projectList" :key="item.name" :value="item.name" :label="item.name"></el-option>
      </el-select>
      <!-- 流程图列表 -->
      <el-select v-model="copyChart" placeholder="请选择流程图" style="margin-top: 10px;" @change="getPageConfig">
        <el-option v-for="item in chartList" :key="item" :value="item" :label="item"></el-option>
      </el-select>
    </div>
    <div class="footer">
      <el-button @click="addPage" type="primary">确定</el-button>
      <el-button type="text" @click="emits('cancel')">取消</el-button>
    </div>
    <newHmiCopy v-model="newHmiCopyShow" :copyConfig="copyConfig"></newHmiCopy>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { getPagesConfigList, queryPagesConfig, addPagesConfig } from '@/api/zhaoguohong';
import { store } from '@/store/configure'
import { ElMessage } from 'element-plus'
import { v4 as uuidv4 } from 'uuid';
import newHmiCopy from './newHmiCopy.vue'
const emits = defineEmits(['cancel'])
const configureStore = store()
const props = withDefaults(defineProps<{
  projectList: any,
}>(), {
  projectList: [],
})
const openHandler = () => {
  newHmiName.value = ''
  copyProject.value = ''
  copyChart.value = ''
  copyConfig.value = ''
}
const newHmiModel = ref<'new' | 'copy'>('new')
const newHmiName = ref('')
// 要复制的流程图所属的项目
const copyProject = ref('')
// 要复制的流程图
const copyChart = ref('')
// 流程图列表
const chartList = ref([])

// 获取流程图列表
const getChartList = () => {
  getPagesConfigListApi()
}
// 获取页面配置数据
const getPagesConfigListApi = () => {
  const params = {
    project: copyProject.value,
    chartIndex: ''
  }
  return getPagesConfigList(params).then((res: any) => {
    chartList.value = res.data.data.pagesconfig
    copyChart.value = ''
  })
}

// 获取页面配置进行复制
const copyConfig = ref()
const getPageConfig = () => {
  const params = {
    project: copyProject.value,
    chartIndex: copyChart.value
  }
  return queryPagesConfig(params).then((res: any) => {
    copyConfig.value = res.data.data.PageConfig
  })
}

// 新增流程图
const newHmiCopyShow = ref(false)
const addPage = () => {
  if (newHmiName.value.trim() === '') {
    ElMessage.error('请填写新流程图名称！')
    return false
  }
  if (newHmiModel.value === 'new') {
    const params = {
      PageConfig: {
        svgUse: [],
        plugin: [],
        symbol: [],
        type: 'online',
        config: {
          chartIndex: newHmiName.value,
          id: uuidv4(),
          station: '',
          subsystem: '',
          layerConfig: {
            layer1Config: {
              bg: ''
            },
            layer2Config: {
              backgroundColor: '',
            },
            layer3Config: {
              title: '',
              fontSize: '',
              fontColor: '',
              transform: {
                posX: '0',
                posY: '0',
              },
            },
          }
        }
      },
      project: configureStore.config.project,
    }
    return addPagesConfig(params).then(() => {
      ElMessage.success('新建流程图成功！')
      emits('cancel')
      return configureStore.getPagesConfigListApi()
    })
  } else {
    if (copyProject.value === configureStore.config.project) {
      const params = {
        PageConfig: copyConfig.value,
        project: copyProject.value,
      }
      params.PageConfig.config.chartIndex = newHmiName.value
      return addPagesConfig(params).then(() => {
        ElMessage.success('新建流程图成功！')
        emits('cancel')
        return configureStore.getPagesConfigListApi()
      })
    } else {
      // newHmiCopyShow.value = true
      // const config = copyConfig.value.config
      // config.station = ''
      // config.subsystem = ''
      // config.chartIndex = newHmiName.value
      // config.layerConfig.layer1Config.bg = ''

      // const plugin = copyConfig.value.plugin
      // const svgUse = copyConfig.value.svgUse
      // const symbol = copyConfig.value.symbol
      // const type = copyConfig.value.type

      // const params = {
      //   config,
      //   plugin,
      //   svgUse,
      //   symbol,
      //   type,
      //   from: copyProject.value
      // }
    }
  }
}
// const addPage = () => {
//   const params = {
//     PageConfig: {
//       svgUse: [],
//       plugin: [],
//       symbol: [],
//       type: 'online',
//       config: {
//         chartIndex: newHmiName.value,
//         station: '',
//         subsystem: '',
//         layerConfig: {
//           layer1Config: {
//             bg: ''
//           },
//           layer2Config: {
//             backgroundColor: '',
//           },
//           layer3Config: {
//             title: '',
//             fontSize: '',
//             fontColor: '',
//             transform: {
//               posX: '0',
//               posY: '0',
//             },
//           },
//         }
//       }
//     },
//     project: configureStore.config.project,
//   }
//   return addPagesConfig(params).then((res: any) => {
//     addNewHmiShow.value = false
//     return getPagesConfigListApi()
//   })
// }
</script>

<style lang="less" scoped>
.footer {
  text-align: right;
  margin-top: 20px;
}
</style>