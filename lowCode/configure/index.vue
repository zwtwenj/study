<template>
  <div class="configure" v-loading="configureStore.loading">
    <hmiConfig></hmiConfig>
    <el-dialog v-model="chartIndexShow" width="400" @closed="chartIndex = ''" :close-on-click-modal="false">
      <div style="display: flex;align-items: center">
        文件名：<el-input style="width: 300px;" maxlength="40" v-model="chartIndex"></el-input>
      </div>
      <div class="footer">
        <el-button @click="addPagesConfigApi">确定</el-button>
        <el-button type="text" @click="chartIndexShow = false">取消</el-button>
      </div>
    </el-dialog>
    <!-- 图元文件存储节点 -->
    <div ref="symbolWrap" style="display: none;" class="symbolWrap"></div>
    <!-- 编辑器节点 -->
    <div style="height:calc(100% - 50px);">
      <configureWrap ref="configure" :pointList="symbols" @getDeviceSymbols="loadData"></configureWrap>
    </div>
    <div id="ctx" ref="ctx"></div>
  </div>
</template>

<script lang="ts" setup>
import { ref, provide, onMounted } from 'vue';
import configureWrap from './configureWrap.vue'
import hmiConfig from './hmiConfig.vue'
import { devicetypeQuery } from '@/api/transmit'
import { queryDeviceSymbols, querySymbols, addPagesConfig, staticDevicesymbols } from '@/api/zhaoguohong'
import { ElMessage } from 'element-plus'
import { store } from '@/store/configure'

const configureStore = store()
const symbols = ref<any>([])
const ctx = ref()

// 传参大概是AFCSC, L03_Z10_PSC_1_AFCSC_1, AFCSC_1 ->设备类，设备编号， 设备图元
const getSymbolItem = (deviceIndex: string) => {
  const id = deviceIndex.split(',')
  const deviceType = deviceTypeMap.value.get(id[0])
  const symbol = deviceType.symbolsMap.get(id[2])
  return {
    deviceType,
    symbol
  }
}
provide('getSymbolItem', getSymbolItem)

const getSymbols = (deviceType: string) => {
  return deviceTypeMap.value.get(deviceType)
}
provide('getSymbols', getSymbols)

// 导出流程图的配置
const configure = ref()

// 导入流程图配置
const requireConfig = (config: string) => {

}

// 加载数据
const svgUse = ref<any>([])
const loadData = () => {
  const params = [
    configureStore.config.station,
    configureStore.config.subsystem
  ]
  return queryDeviceSymbolsApi(params).then(() => {
    return devicetypeQueryApi()
  }).then(() => {
    configure.value.exportConfig(['config'])
    return getImageList()
  }).then(() => {
    const svgHtmlArr = []
    for (let deviceType of symbolSvgMap.value) {
      for (let symbol of deviceType[1]) {
        svgHtmlArr.push(symbol[1])
      }
    }
    symbolWrap.value.innerHTML = svgHtmlArr.join('')
    return Promise.resolve()
  })
}
configureStore.loadData = loadData
const queryDeviceSymbolsApi = (data: string[]) => {
  const params = {
    Station: [data[0]],
    Subsystem: [data[1]],
    Project: configureStore.config.project
  }
  return queryDeviceSymbols(params).then((res: any) => {
    symbols.value = []
    const symbolsRes = res.data.data || {}
    for (let key in symbolsRes) {
      symbols.value.push({ name: key, deviceType: symbolsRes[key].devicetype })
    }
    const temp: any = {}
    symbols.value.forEach((item: any) => {
      temp[item.deviceType] = 1
    })
    svgUse.value = Object.keys(temp)
    localStorage.setItem('svgUse', JSON.stringify(svgUse.value))
    Promise.resolve()
  })
}
// 清空数据
const cleanUpData = () => {
  symbolWrap.value.innerHTML = ''
  deviceTypeMap.value = new Map()
  symbolSvgMap.value = new Map()
  localStorage.removeItem('svgUse')
}
configureStore.cleanUpData = cleanUpData

// 获取设备类
const deviceTypeMap = ref(new Map())
const symbolSvgMap = ref(new Map())
const devicetypeQueryApi = () => {
  const params = {
    devicetype: svgUse.value,
    project: configureStore.config.project
  }
  return querySymbols(params).then((res: any) => {
    const data = res.data.data
    if (data) {
      data.forEach((symbols: any) => {
        let temp: any = symbols
        temp.symbolsMap = new Map()
        temp.symbols.forEach((symbol: any) => {
          temp.symbolsMap.set(symbol.name, symbol)
        })
        delete temp.symbols
        deviceTypeMap.value.set(temp.name, temp)
        symbolSvgMap.value.set(temp.name, new Map())
        Promise.resolve()
      })
    }
  })
}

// 获取图元数据
const symbolWrap = ref()
const getImageList = () => {
  const arr: any = []
  for (let deviceType of deviceTypeMap.value) {
    const symbolsMap = symbolSvgMap.value.get(deviceType[0])
    for (let symbol of deviceType[1].symbolsMap) {
      arr.push(
        staticDevicesymbols(configureStore.config.project, symbol[0] + '.svg').then((res: any) => {
          symbolsMap.set(symbol[0], res.data)
          Promise.resolve()
        }).catch(err => {
          console.log(err)
          Promise.resolve()
        })
      )
    }
  }
  return Promise.all(arr)
}

// 上传配置
const chartIndexShow = ref(false)
const chartIndex = ref('')
const addPagesConfigApi = () => {
  chartIndexShow.value = true
  const params = Object.assign({ chartIndex: chartIndex.value, project: 'L3' }, configure.value.exportConfig())
  return addPagesConfig(params).then((res: any) => {
    console.log(res)
    if (res.data.code === 0) {
      ElMessage.success('上传成功')
      return Promise.resolve()
    } else {
      return Promise.reject()
    }
  }).catch(() => {
    return Promise.reject()
  })
}

onMounted(() => {
  // configure.value.getBgSvgApi()
})
</script>

<style lang="less" scoped>
.configure {
  position: relative;
  height: 100%;
}

.footer {
  text-align: right;
  margin-top: 10px;
}

#ctx {
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
}
</style>