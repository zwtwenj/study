<template>
  <div class="hmi-config">
    <el-form :inline="true">
      <el-form-item label="项目：">
        <el-select style="width: 200px;" v-model="configureStore.config.project" @change="changeProject"
          placeholder="请选择项目">
          <el-option v-for="item in projectList" :key="item.name" :value="item.name" :label="item.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="流程图：">
        <el-select style="width: 200px;" v-model="configureStore.config.chartIndex" @change="changeChart">
          <el-option v-for="item in chartList" :key="item" :value="item" :label="item"></el-option>
        </el-select>
        <el-button type="primary" style="margin-left:10px;" @click="addnewHmi"
          :disabled="configureStore.config.project === ''">新建流程图</el-button>
        <el-button type="primary" @click="saveHmi">保存流程图</el-button>
        <el-button type="danger" @click="deleteHmi">删除流程图</el-button>
        <el-button type="primary" @click="previewHmi">预览流程图</el-button>
        <el-button type="primary" @click="openBlueprint">全局变量</el-button>
      </el-form-item>
    </el-form>
    <newHmi v-model="addNewHmiShow" :projectList="projectList" @cancel="addNewHmiShow = false"></newHmi>
    <blueprint></blueprint>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { getProjectList } from '@/api/transmit'
import { addPagesConfig, getPagesConfigList, updateSymbols, queryPagesConfig, deletePageConfig } from '@/api/zhaoguohong'
import { store } from '@/store/configure'
import { ElMessage, ElMessageBox } from 'element-plus'
import newHmi from './newHmi.vue'
import blueprint from '../blueprint/blueprint.vue'
const configureStore = store()
const exportHtml = () => { }

// 获取项目
const projectList = ref<any[]>([])
const getProjectListApi = () => {
  return getProjectList().then((res: any) => {
    projectList.value = res.data.lists
    return Promise.resolve()
  })
}
const changeProject = () => {
  configureStore.setProject(configureStore.config.project)
}

// 获取流程图列表
const chartList = ref<any>([])
const getPagesConfigListApi = () => {
  const params = {
    project: configureStore.config.project as string,
    chartIndex: '',
  }
  return getPagesConfigList(params).then((res: any) => {
    chartList.value = res.data.data.pagesconfig
    return Promise.resolve()
  })
}
configureStore.getProjectListApi = getProjectListApi
configureStore.getPagesConfigListApi = getPagesConfigListApi

// 选中流程图
const changeChart = () => {
  configureStore.changeChartIndex(configureStore.config.chartIndex)
}
const queryPagesConfigApi = () => {
  const params = {
    project: configureStore.config.project,
    chartIndex: configureStore.config.chartIndex
  }
  return queryPagesConfig(params).then((res: any) => {
    return Promise.resolve(res)
  }).catch(() => {
    configureStore.loading = false
  })
}
configureStore.queryPagesConfigApi = queryPagesConfigApi

// 新增流程图
const addNewHmiShow = ref(false)
const newHmiName = ref('')
const addnewHmi = () => {
  newHmiName.value = ''
  addNewHmiShow.value = true
}
const addPage = () => {
  const params = {
    PageConfig: {
      svgUse: [],
      plugin: [],
      symbol: [],
      type: 'online',
      config: {
        chartIndex: newHmiName.value,
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
  return addPagesConfig(params).then((res: any) => {
    addNewHmiShow.value = false
    return getPagesConfigListApi()
  })
}

// 保存流程图
const saveHmi = () => {
  // const params = {
  //   PageConfig: configureStore.exportConfig(),
  //   project: configureStore.config.project
  // }
  // return updateSymbols(params).then((res: any) => {
  //   console.log(res)
  // })
  const params = {
    svgUse: getSvgUse(),
    device: [...configureStore.device],
    symbol: [...configureStore.symbol],
    plugin: [...configureStore.plugin],
    config: configureStore.config
  }
  console.log(params)
  return updateSymbols(params).then((res: any) => {
    console.log(res)
  })
}

// 获取当前流程图使用的svg
const getSvgUse = () => {
  const svgUse: string[] = []
  configureStore.symbol.forEach((symbol: any) => {
    svgUse.push(symbol.name)
  })
  const res = new Set(svgUse)
  return Array.from(res)
}

// 删除流程图
const deleteHmi = () => {
  const params = {
    chartIndex: configureStore.config.chartIndex,
    Project: configureStore.config.project
  }
  // return deletePageConfig(params).then((res: any) => {
  //   console.log(res)
  // })
  return ElMessageBox.confirm(
    `确定删除流程图【${configureStore.config.chartIndex}】？`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      customClass: 'custom-message-box'
    }
  ).then(() => {
    return deletePageConfig(params).then((res: any) => {
      ElMessage.success('删除流程图成功！')
      configureStore.deleteChartIndex()
    })
  }).catch(() => {

  })
}

// 预览流程图
const previewHmi = () => {
  window.open(`/demo/preview.html?project=${configureStore.config.project}&chartIndex=${configureStore.config.chartIndex}`)
}

// 蓝图功能（开发）
const openBlueprint = () => {

}
</script>

<style lang="less" scoped>
.hmi-config {
  display: flex;
  background: black;
  border-bottom: 1px solid #555;
  height: 50px;
  align-items: center;
  padding: 0 10px;
}

.footer {
  text-align: right;
  margin-top: 20px;
}
</style>

<style lang="less">
.hmi-config {
  .el-form-item {
    margin-bottom: 0;
  }
}
</style>