<template>
  <div class="symbol-tree">
    <div class="filter-list">
      <div class="filter-option">
        <div class="filter-title">车站：</div>
        <el-select v-model="selectedStationCache" style="width:200px;" @change="filterChange">
          <el-option v-for="(item, index) in stationList" :key="index" :value="item.name"
            :label="`(${item.name})${item.desc}`"></el-option>
        </el-select>
      </div>
      <div class="filter-option">
        <div class="filter-title">子系统：</div>
        <el-select v-model="selectedSubsystemCache" style="width:200px;" @change="filterChange">
          <el-option v-for="(item, index) in subsystemList" :key="index" :value="item.name"
            :label="`(${item.name})${item.desc}`"></el-option>
        </el-select>
      </div>
    </div>
    <div class="hmi-tree">
      <div class="hmi-layer">
        <div :class="['hmi-layer-title', configureStore.focusSymbol[1] === 'layer3' ? 'selected-layer' : '']"
          @click="selectLayer('layer3')">
          标题层
        </div>
      </div>
      <div class="hmi-layer">
        <div :class="['hmi-layer-title', configureStore.focusSymbol[1] === 'layer2' ? 'selected-layer' : '']"
          @click="selectLayer('layer2')">
          背景层
        </div>
      </div>
      <div class="hmi-layer symbol-layer">
        <div :class="['hmi-layer-title', configureStore.focusSymbol[1] === 'layer1' ? 'selected-layer' : '']"
          @click="selectLayer('layer1')">
          组态层
        </div>
        <div class="symbol-example">
          <div class="symbol-item-default">
            <div class="left">图元名称</div>
            <div class="right">设备</div>
          </div>
          <div v-for="(item, index) in pointList" :key="index"
            :class="['symbol-item', (symbolList.indexOf(item.name) !== -1) ? 'have-symbol' : '', configureStore.focusSymbol[0] === item.name ? 'selected-symbol' : '']"
            :draggable="!configureStore.device.get(item.name)" @dragstart="dragstart($event, item)">
            <div class="symbol-item-default" @click="selectSymbol(item.name, undefined, $event)">
              <div class="left">{{ item.deviceType }}</div>
              <div class="right">{{ item.name }}</div>
              <!-- <i class="el-icon el-collapse-item__arrow symbol-btn" v-if="configureStore.device.get(item.name)">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
                  <path fill="currentColor"
                    d="M340.864 149.312a30.592 30.592 0 0 0 0 42.752L652.736 512 340.864 831.872a30.592 30.592 0 0 0 0 42.752 29.12 29.12 0 0 0 41.728 0L714.24 534.336a32 32 0 0 0 0-44.672L382.592 149.376a29.12 29.12 0 0 0-41.728 0z">
                  </path>
                </svg>
              </i> -->
            </div>
            <div class="symbol-children" v-if="configureStore.device.get(item.name)">
              <template v-for="symbolId in configureStore.device.get(item.name).symbols" :key="symbolId">
                <div :class="configureStore.focusSymbol[1] === symbolId ? 'selected-symbol-child' : ''"
                  @click="selectSymbol(item.name, symbolId, $event)">
                  {{ configureStore.symbol.get(symbolId).name }}
                </div>
              </template>
            </div>
          </div>
        </div>
        <div class="plugin-list" v-if="configureStore.plugin.size">
          <div v-for="item in configureStore.plugin" :key="item[0]"
            :class="['symbol-item', 'have-symbol', configureStore.focusSymbol[1] === item[0] ? 'selected-symbol' : '']">
            <div class="symbol-item-default" @click="selectSymbol('plugin', item[0], $event)">
              <div class="left"></div>
              <div class="right">{{ item[1].name }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, inject, computed, watch } from 'vue'
import { stationQuery, subsystemQuery, devicetypeQuery } from '@/api/transmit'
import { ElMessage, ElMessageBox } from 'element-plus';
import { store } from '@/store/configure'
const configureStore = store()
const props = withDefaults(defineProps<{
  pointList: any
}>(), {
  pointList: [],
})
const emits = defineEmits(['selectLayer', 'selected', 'getDeviceSymbols'])

const symbolList = computed(() => {
  return Array.from(configureStore.device.keys())
})

// 选中某一层级
const selectLayer = (name: string) => {
  emits('selectLayer', name)
}

// 选中某一设备
const selectSymbol = (deviceId: string, uuid?: string, e?: any) => {
  if (deviceId === 'plugin') {
    emits('selected', ['plugin', uuid], e.ctrlKey)
  } else {
    const device = configureStore.device.get(deviceId)
    if (device) {
      emits('selected', [deviceId, uuid || device.symbols[0]], e.ctrlKey)
    } else {
      ElMessage.error('请先将设备移入到流程图中再进行操作！')
    }
  }
}

const getSymbols: any = inject('getSymbols', (name: string) => { })

const dragstart = (e: DragEvent, symbol: any) => {
  const ele = document.getElementById('ctx')
  const deviceType = getSymbols(symbol.deviceType) || new Map()
  let defaultSymbol: any = {}
  for (let item of deviceType.symbolsMap) {
    defaultSymbol = item
    break
  }
  if (ele) {
    if (!e.dataTransfer) return false
    ele.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" style="overflow:visible">
                         <use xlink:href=#${defaultSymbol[0]}></use>
                      </svg>`
    const rectTemp = ele.children[0].children[0].getBoundingClientRect()
    const width = rectTemp.width
    const height = rectTemp.height
    ele.setAttribute('width', `${width}`)
    ele.setAttribute('height', `${height}`)
    e.dataTransfer.setData("deviceIndex", `${symbol.deviceType},${symbol.name},${defaultSymbol[0]}`);
    defaultSymbol[1].style = {
      width: width,
      height: height
    }
    defaultSymbol[1].deviceType = symbol.deviceType
    var dt = e.dataTransfer
    dt.setDragImage(ele.childNodes[0] as Element, width / 2, height / 2);
  }
}

// 获取车站
const selectedStationCache = ref('')
const stationList = ref<any>([])
const stationQueryApi = () => {
  const params = {
    "query": {},
    "field": {
      "no": 1,
      "name": 1,
      "desc": 1
    },
    "skip": 0,
    "sort": {
      "no": 1
    }
  }
  return stationQuery(params).then((res: any) => {
    stationList.value = res.data.lists
  })
}

// 获取子系统
const selectedSubsystemCache = ref('')
const subsystemList = ref<any>([])
const subsystemQueryApi = () => {
  const params = {
    "query": {},
    "field": {
      "no": 1,
      "name": 1,
      "desc": 1
    },
    "skip": 0,
    "sort": {
      "no": 1
    }
  }
  return subsystemQuery(params).then((res: any) => {
    subsystemList.value = res.data.list
    Promise.resolve()
  })
}

// 获取车站/子系统下的设备类
const filterChange = () => {
  if (configureStore.symbol.size || configureStore.plugin.size) {
    ElMessageBox.confirm(
      '变更车站/子系统会重置目前流程图中使用的设备，是否确定？',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'custom-message-box'
      }
    ).then(() => {
      configureStore.loading = true
      configureStore.setStationAndSubsystem(selectedStationCache.value, selectedSubsystemCache.value)
      // configureStore.exportData('config')
      configureStore.cleanUpSymbolAndPlugin()
    }).catch(() => {
      selectedStationCache.value = configureStore.config.station
      selectedSubsystemCache.value = configureStore.config.subsystem
    })
  } else {
    configureStore.loading = true
    configureStore.setStationAndSubsystem(selectedStationCache.value, selectedSubsystemCache.value)
    // configureStore.exportData('config')
  }
}

// 处理缓存
const initTree = () => {
  selectedStationCache.value = configureStore.config.station
  selectedSubsystemCache.value = configureStore.config.subsystem
  // emits('getDeviceSymbols')
  // return Promise.resolve()
}

defineExpose({
  stationQueryApi,
  subsystemQueryApi,
})
configureStore.stationQueryApi = stationQueryApi
configureStore.subsystemQueryApi = subsystemQueryApi
configureStore.initTree = initTree
</script>

<style lang="less" scoped>
.symbol-tree {
  width: 300px;
  height: 100%;
  overflow: auto;
  background: #333;
  display: flex;
  flex-direction: column;

  .hmi-tree {
    flex: 1;
    display: flex;
    overflow: hidden;
    flex-direction: column
  }

  .symbol-item-default {
    display: flex;
    width: 100%;
    font-size: 14px;
    line-height: 23px;

    div {
      padding: 8px 12px;
      overflow: hidden;
    }

    .left {
      flex: 0.4;
    }

    .right {
      flex: 1;
    }
  }

  .symbol-children {
    line-height: 25px;
    font-size: 12px;

    div {
      padding-left: 120px;
    }
  }

  .symbol-item {
    cursor: pointer;
    width: 100%;

    .symbol-btn {
      height: 39px;
      position: absolute;
      right: 0;
    }
  }

  .have-symbol {
    background: #ccc;
    color: black;
  }

  .selected-symbol {

    .symbol-item-default,
    .selected-symbol-child {
      background: red;
      color: #fff;
    }
  }
}

.filter-list,
.plugin-list {
  .filter-option {
    display: flex;
    padding: 5px 12px;
    align-items: center;

    .filter-title {
      flex: 1
    }
  }
}

.hmi-layer {
  border-top: 1px solid #ccc;

  .hmi-layer-title {
    line-height: 32px;
    border-bottom: 1px solid #888;
    cursor: pointer;
    padding-left: 10px;

    .icon {
      float: right;
      margin-top: 10px;
      margin-right: 10px;
      cursor: pointer;
    }
  }
}

.symbol-layer {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .symbol-example {
    flex: 1;
    overflow: auto;
  }

  .plugin-list {
    flex: 1;
    overflow: auto;
  }
}

.selected-layer {
  background: red;
  color: #fff;
}
</style>

<style lang="less">
.symbol-tree {
  .el-collapse-item__content {
    padding-bottom: 0;
  }

  .el-collapse-item__header {
    border-bottom: 1px solid black;
  }
}
</style>