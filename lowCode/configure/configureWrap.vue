<template>
  <div class="configure_wrap" ref="wrap" @dragover.prevent>
    <symbolTree class="tree-wrap" ref="tree_wrap" :pointList="pointList" @selected="treeSelected"
      @getDeviceSymbols="getDeviceSymbols" @selectLayer="selectLayer">
    </symbolTree>
    <!-- <integratedPanel :pointList="pointList" @selected="treeSelected" @getDeviceSymbols="getDeviceSymbols"
      @selectLayer="selectLayer"></integratedPanel> -->
    <div id="hmi_symbols" ref="hmi_symbols" style="visibility: hidden; width: 0px; height: 0px; display: flex"></div>
    <div class="configure_view" ref="configure">
      <!-- <operation></operation> -->
      <plugin></plugin>
      <div class="bg-wrap" ref="bg_wrap">
        <div id="hmi_page_background" ref="hmi_page_background" @drop="drop"></div>
      </div>
    </div>
    <symbolConfig class="config-wrap" v-if="focusSymbol[1]" :config="focusSymbolConfig" @updateSymbol="updateSymbol"
      @appendChild="appendChild" @transformChange="transformChange" :svg="hmi_page_background" @changeBg="changeBg">
    </symbolConfig>
  </div>
</template>

<script lang="ts" setup>
import { inject, ref, watch, provide, onMounted, onUnmounted } from 'vue';
import { staticPage } from '@/api/zhaoguohong';
import symbolConfig from './symbolConfig.vue'
import symbolTree from './symbolTree.vue';
import integratedPanel from './integratedPanel.vue'
import plugin from './plugin.vue'
import { v4 as uuidv4 } from 'uuid';
import plugins from '@/configurePlugin/plugins.ts'
import { store } from '@/store/configure.ts'
import panzoom from 'panzoom'

const configureStore = store()
const props = withDefaults(defineProps<{
  pointList: any
}>(), {
  pointList: []
})
const emits = defineEmits(['getDeviceSymbols'])
const getDeviceSymbols = (data: string[]) => {
  emits('getDeviceSymbols', data)
}
const cleanUpSymbolAndPlugin = () => {
  configureStore.device = new Map()
  configureStore.deleteStoreDataByDB('device')
  configureStore.symbol = new Map()
  configureStore.deleteStoreDataByDB('symbol')
  // symbolPointMap.value = new Map()
  symbolElementMap.value.forEach((dom: any) => {
    dom.remove()
  })
  symbolElementMap.value = new Map()
  layerElementMap.value = new Map()
  pointCb.value = new Map()

  configureStore.plugin = new Map()
  configureStore.deleteStoreDataByDB('plugin')
  pluginElementMap.value.forEach((dom: any) => {
    dom.remove()
  })
  pluginElementMap.value = new Map()
  pluginCb.value = new Map()

  focusSymbol.value = []
  focusSymbolConfig.value = {}
  focusSymbolEle.value = null
  focusSymbolData.value = {}
  // exportConfig()
}
configureStore.cleanUpSymbolAndPlugin = cleanUpSymbolAndPlugin

// 页面配置
const hmiConfig = ref({
  deviationX: 0,
  deviationY: 0,
})

// 内部点位
const insidePoint = ['TLSMZT', 'HQZT']
const wrap = ref()
const wrapRect = ref()
const configure = ref()
const hmi_page_background = ref()
const bgRect = ref()
const hmi_symbols = ref()
// 焦点图元
const focusSymbol = ref<string[]>([])
// 焦点图元的配置
const focusSymbolConfig = ref()
// 焦点图元的元素
const focusSymbolEle = ref()
// 焦点图元的数据
const focusSymbolData = ref()
// ctrl多选情况下的焦点图元
const ctrlFocusSymbol = ref<string[][]>([])

// 获取背景（底图）
const bg = ref('')
const bg_wrap = ref()
const bg_wrapRect = ref()
const getBgSvgApi = () => {
  bg.value = configureStore.config.layerConfig.layer1Config.bg
  if (bg.value && bg.value !== '') {
    return staticPage(configureStore.config.project, bg.value).then((res: any) => {
      hmi_page_background.value.innerHTML = res.data
      layerEle = wrap.value.querySelector('#layer1')
      const transform: any = getComputedStyle(layerEle).transform
      const temp = transform.split('(')[1].split(')')[0].split(',')
      const translate = [parseFloat(temp[4]), parseFloat(temp[5])]
      wrapRect.value = wrap.value.getBoundingClientRect()
      hmiConfig.value.deviationX = wrap.value.scrollLeft - translate[0]
      hmiConfig.value.deviationY = wrap.value.scrollTop - translate[1]
      bg_wrapRect.value = bg_wrap.value.getBoundingClientRect()
      exportConfig('config')
      configureStore.layerEle = wrap.value
      return bgPanZoom()
    })
  } else {
    // 请选择背景图
    focusSymbol.value = ['layer', 'layer1']
  }
}
configureStore.getBgSvgApi = getBgSvgApi
const cleanUpBg = () => {
  hmi_page_background.value.innerHTML = ''
}
configureStore.cleanUpBg = cleanUpBg

const bgPanZoom = () => {
  const pan = panzoom(hmi_page_background.value, {
    smoothScroll: false,
    bounds: true,
    zoomDoubleClickSpeed: 1,
    minZoom: 0.4,
    maxZoom: 4,
  })
}

const xline = ref<any>([])
const getVertex = () => {
  const ele = document.querySelector('#hmi_page_background')
  if (ele) {
    const rect = ele.getBoundingClientRect()
    // 精度
    const accuracy = 20
    const count = Math.ceil(rect.width / accuracy)
    for (let i = 0; i < count; i++) {
      xline.value.push([])
    }
    const layerEle = Array.from(wrap.value.querySelector('#layer1').children)
    layerEle.forEach((item: any) => {
      const pos = item.getBoundingClientRect()
      // X水平 Y垂直  L left R right T top B bottom  共四个坐标
      const tempXL = Math.round(pos.left - rect.left)
      const tempYT = Math.round(pos.top - rect.top)
      const tempYB = tempYT + Math.round(pos.height)
      const indexL = Math.floor(tempXL / accuracy)
      if (indexL < count && indexL >= 0) {
        xline.value[indexL].push([tempXL, tempYT])
        xline.value[indexL].push([tempXL, tempYB])
      }
      const tempXR = tempXL + Math.round(pos.width)
      const indexR = Math.floor(tempXR / accuracy)
      if (indexR < count && indexR >= 0) {
        xline.value[indexR].push([tempXR, tempYT])
        xline.value[indexR].push([tempXR, tempYB])
      }
    })
    console.log(xline.value)
  }
}

const getSymbolItem: any = inject('getSymbolItem', (name: string) => { })
// 设备点位的map集合
// const symbolPointMap = ref<any>(new Map())
// 设备在svg中的元素（就是g标签）
const symbolElementMap = ref<any>(new Map())
// layer的元素(就是text和use标签)
const layerElementMap = ref<any>(new Map())
// point属性劫持的回调
const pointCb = ref<any>(new Map())

const drop = (e: DragEvent) => {
  const data: any = drapConfig(e)
  if (data.type === 'symbol') {
    renderSymbol(data, e)
  } else if (data.type === 'plugin') {
    renderPlugin(data, e)
  }
}

// 设备数据
const drapConfig = (e: DragEvent) => {
  const deviceIndex = e.dataTransfer?.getData('deviceIndex')
  if (deviceIndex !== '') {
    let { deviceType, symbol } = getSymbolItem(deviceIndex)
    let deviceId = deviceIndex?.split(',')[1] as string
    const uuid = uuidv4()
    symbol = JSON.parse(JSON.stringify(symbol))
    // 这个设备图元对应的索引
    const index = [deviceId, uuid]
    pointCb.value.set(deviceId, new Map())
    return { type: 'symbol', index, deviceType, symbol }
  } else {
    const plugin = e.dataTransfer?.getData('plugin')
    return { type: 'plugin', plugin }
  }
}

// 渲染设备
const renderSymbol = (data: any, e: DragEvent) => {
  const { index, deviceType, symbol } = data
  const deviceId = index[0]
  // 配置点位
  const point: any = {}
  deviceType.points.forEach((item: any) => {
    point[item.name] = null
  })
  insidePoint.forEach((item: string) => {
    point[item] = null
  })
  observer(symbol, index)
  const uuid = index[1]
  const device = {
    deviceId: deviceId,
    config: point,
    symbols: [uuid]
  }
  configureStore.device.set(deviceId, device)
  if (!configureStore.loading) {
    configureStore.exportData('device', device)
  }
  if (layerEle) {
    const g: any = createSymbolEle(index, symbol, e)
    watchSymbolConfig(point, deviceId)
    layerEle.appendChild(g)
  }
  focusSymbol.value = [deviceId, uuid]
}

// 渲染插件
const pluginElementMap = ref(new Map())

const pluginCb = ref(new Map())
const renderPlugin = (type: any, e: DragEvent) => {
  const plugin = JSON.parse(JSON.stringify((plugins as any)[type.plugin]))
  plugin.name = type.plugin
  const uuid = uuidv4()
  plugin.pluginId = uuid
  const rect = e.dataTransfer?.getData('rect')
  observerPlugin(plugin, uuid)
  configureStore.plugin.set(uuid, plugin)
  configureStore.exportData('plugin', plugin)
  if (layerEle) {
    const g = createPluginEle(uuid, plugin, rect || '', e)
    watchPluginConfig(plugin, uuid)
    layerEle.appendChild(g)
  }
  focusSymbol.value = ['plugin', uuid]
}

// 生成g元素（即拖拽之后在面板中根据图元生成的新的元素）
// parentNode: 父元素
// deviceId设备ID
// symbol设备的数据，会根据symbol的layer数据生成图元
// e鼠标位置，用于计算偏移量
const createSymbolEle = (index: string[], symbol: any, e?: MouseEvent) => {
  const deviceId = index[0]
  const uuid = index[1]
  const g: any = document.createElementNS('http://www.w3.org/2000/svg', 'g')
  g.setAttribute('id', '_' + uuid)
  g.style.cursor = 'pointer'
  const layerTextArr: string[] = []
  symbol.layers.forEach((layer: any) => {
    const tip = layer.id.split('_').pop()
    // 说明这个layer是文本节点
    if (tip.indexOf('text') === 0) {
      layer.nodeType = 'text'
    }
    if (layer.nodeType === 'text') {
      const text = document.querySelector(`#${layer.id}`)?.outerHTML as string
      layerTextArr.push(text)
    } else {
      layerTextArr.push(`<use xlink:href=#${layer.id} id="${layer.id}"></use>`)
    }
  })
  // 字符串拼接统一渲染的话对比逐个createElement性能大概节省40%，而且createElement还要区分节点类型来创建
  // 索性统一创建完了再根据id来一一对应，所以两个很怪的foreach循环，但这样的话又多了一步取元素的操作
  // 如果能在innerHTML创建的同时取元素就好了，感觉还能优化
  g.innerHTML = layerTextArr.join('')
  const deviceLayerEleMap = new Map()
  symbol.layers.forEach((layer: any) => {
    deviceLayerEleMap.set(layer.id, g.querySelector(`#${layer.id}`))
  })
  const layerTempMap = layerElementMap.value.get(deviceId) || new Map()
  layerTempMap.set(uuid, deviceLayerEleMap)
  layerElementMap.value.set(deviceId, layerTempMap)
  if (e) {
    const bgTransform = hmi_page_background.value.style.transform
    const temp = bgTransform.split('(')[1].split(')')[0].split(',')
    const size = temp[0]
    bgRect.value = [temp[4], temp[5]]
    const transform = {
      sizeW: 1,
      sizeH: 1,
      posX: (e.pageX - bg_wrapRect.value.left - bgRect.value[0]) / size - symbol.style.width / 2,
      posY: (e.pageY - bg_wrapRect.value.top - bgRect.value[1]) / size - symbol.style.height / 2,
      rotateX: 0,
      rotateY: 0,
      rotateZ: 0,
    }
    symbol.transform = transform
  }
  symbol.symbolId = uuid
  if (!symbol.event) {
    symbol.event = []
  }
  if (!loading.value) {
    configureStore.exportData('symbol', symbol)
    // 图元
    configureStore.symbol.set(uuid, symbol)
  }
  const str = `translate(${symbol.transform.posX + hmiConfig.value.deviationX}px, ${symbol.transform.posY + hmiConfig.value.deviationY}px)rotateX(${symbol.transform.rotateX}deg)rotateY(${symbol.transform.rotateY}deg)rotateZ(${symbol.transform.rotateZ}deg)scale(${symbol.transform.sizeW}, ${symbol.transform.sizeH})`
  g.style.transform = str
  g.onclick = () => {
    useOnclick(index)
  }
  g.onmousedown = (e: MouseEvent) => {
    onmousedown(index, e)
  }

  symbolElementMap.value.set(uuid, g)
  return g
}
// 生成插件元素
const createPluginEle = (uuid: string, plugin: any, rect: string, e?: MouseEvent) => {
  const g: any = document.createElementNS('http://www.w3.org/2000/svg', 'g')
  g.setAttribute('id', '_' + uuid)
  g.style.cursor = 'pointer'
  const pattern = new RegExp('{{([^]*?)}}', 'g')
  let render: string = plugin.render
  render = render.replace(pattern, (match: any) => {
    const attribute = match.slice(2, match.length - 2)
    return plugin.data[attribute] || match
  })
  g.innerHTML = render
  let gRect = [0, 0]
  if (rect !== '') {
    gRect = JSON.parse(rect)
  }
  if (e) {
    const bgTransform = hmi_page_background.value.style.transform
    const temp = bgTransform.split('(')[1].split(')')[0].split(',')
    const size = temp[0]
    bgRect.value = [temp[4], temp[5]]
    const transform = {
      sizeW: 1,
      sizeH: 1,
      posX: (e.pageX - bg_wrapRect.value.left - bgRect.value[0]) / size - gRect[0],
      posY: (e.pageY - bg_wrapRect.value.top - bgRect.value[1]) / size - gRect[1],
      rotateX: 0,
      rotateY: 0,
      rotateZ: 0,
    }
    plugin.transform = transform
  }
  const str = `translate(${plugin.transform.posX + hmiConfig.value.deviationX}px, ${plugin.transform.posY + hmiConfig.value.deviationY}px)rotateX(${plugin.transform.rotateX}deg)rotateY(${plugin.transform.rotateY}deg)rotateZ(${plugin.transform.rotateZ}deg)scale(${plugin.transform.sizeW}, ${plugin.transform.sizeH})`
  g.style.transform = str
  g.onclick = () => {
    useOnclick(['plugin', uuid])
  }
  g.onmousedown = (e: MouseEvent) => {
    onmousedown(['plugin', uuid], e)
  }
  pluginElementMap.value.set(uuid, g)
  if (!loading.value) {
    // exportConfig(['plugin'])
  }
  return g
}

// 依赖收集
// 订阅表达式中存在的对象属性，监听其变化，例如当表达式为@{TXGZ}==0则会监听该设备对象中关于TXGZ属性的变化，如果满足表达式则执行回调
const observer = (symbol: any, index: string[]) => {
  const deviceId = index[0]
  symbol.layers.forEach((layer: any) => {
    const regex = /@\{([^}]+)\}/g;
    layer.params = [];
    let match: any = []
    while ((match = regex.exec(layer.condition))) {
      const key = match[1]
      layer.params.push(key)
      let cb: any = []
      const devicePointCb = pointCb.value.get(deviceId)
      if (!devicePointCb.get(key)) {
        devicePointCb.set(key, cb)
      }
      cb = devicePointCb.get(key)
      // 这里是params形参，实参是point
      cb.push(
        function (params: any) {
          const code = layer.condition.replace(/@\{([^}]*)\}/g, function (str: string) {
            const paramsKey: string = str.replace(/@\{([^}]*)\}/g, '$1')
            return params[paramsKey] === '' ? 'null' : params[paramsKey]
          })
          updateView(index, layer.id, code)
        }
      )
    }
  })
}
const observerPlugin = (plugin: any, uuid: string) => {
  // data是形参，实参是plugin
  const cb = function (key: string) {
    let render = plugin.render
    const pattern = new RegExp('{{([^]*?)}}', 'g')
    render = render.replace(pattern, (match: any) => {
      const attribute = match.slice(2, match.length - 2)
      return plugin.data[attribute] || match
    })
    const g = pluginElementMap.value.get(uuid)
    g.innerHTML = render
    // exportConfig(['plugin'])
  }
  pluginCb.value.set(uuid, cb)
}

// 劫持设备的数据，数据变化就执行对应的回调函数
// index 当前修改设备的索引[deviceid, uuid]这种格式
// deviceType：图元的数据 多个设备数据的集合
// symbol: 当前设备的数据
// point：点位数据
// deviceId：设备ID
const watchSymbolConfig = (point: any, deviceId: string) => {
  for (let key in point) {
    let value = point[key]
    Object.defineProperty(point, key, {
      get() {
        return value
      },
      set(newValue) {
        value = newValue
        configureStore.exportData('device', JSON.parse(JSON.stringify(configureStore.device.get(deviceId))))
        const cbs = pointCb.value.get(deviceId)?.get(key) || []
        if (value === null) {
          return false
        }
        cbs.forEach((cb: any) => {
          cb(point)
        })
      }
    })
  }
  // symbolPointMap.value.set(deviceId, point)
}
const watchPluginConfig = (plugin: any, uuid: string) => {
  for (let key in plugin.data) {
    let value = plugin.data[key]
    Object.defineProperty(plugin.data, key, {
      get() {
        return value
      },
      set(newValue) {
        value = newValue
        configureStore.exportData('plugin', JSON.parse(JSON.stringify(configureStore.plugin.get(uuid))))
        const cb = pluginCb.value.get(uuid)
        if (cb) {
          cb(key)
        }
        if (!loading.value) {
          // exportConfig(['plugin'])
        }
      }
    })
  }
}

// 配置页面的数据改变之后更新dom
const updateView = (index: string[], id: string, code: string) => {
  const deviceId = index[0]
  const uuid = index[1]
  const ele = layerElementMap.value.get(deviceId)?.get(uuid).get(id)
  if (!ele) {
    return false
  }
  if (ele.tagName === 'text') {
    const temp = ele.querySelector('tspan')
    temp.innerHTML = code
  } else {
    try {
      ele.style.visibility = eval(code) ? 'visible' : 'hidden'
    } catch (err) {
      console.log(err)
    }
  }
}

// 图元列表中选择设备，在编辑器页面要进行反显
const treeSelected = (index: string[], ctrlKey: boolean) => {
  console.log(ctrlKey)
  if (ctrlKey) {
    configureStore.ctrlFocusSymbol.push(index)
  } else {
    focusSymbol.value = index
    configureStore.ctrlFocusSymbol = [index]
  }
}
// 图元列表选择层级
const selectLayer = (name: string) => {
  focusSymbol.value = ['layer', name]
}
watch(() => focusSymbol.value, (newValue, oldValue) => {
  configureStore.focusSymbol = focusSymbol.value
  if (newValue[0] === oldValue[0] && newValue[1] === oldValue[1]) {
    return false
  }
  if (oldValue[0]) {
    // delete删除也会影响focusSymbol的值而且是找不到上一个焦点元素的
    try {
      focusSymbolEle.value.style.outline = 'initial'
    } catch {

    }
  }
  if (newValue[0]) {
    if (newValue[0] === 'plugin') {
      const uuid = newValue[1]
      focusSymbolEle.value = pluginElementMap.value.get(uuid)
      focusSymbolEle.value.style.outline = 'rgba(255, 0, 0, 0.4) solid 20px'
    } else if (newValue[0] === 'layer') {
      focusSymbolEle.value = wrap.value.querySelector(`#${newValue[1]}`)
      if (focusSymbolEle.value) {
        focusSymbolEle.value.style.outline = 'rgba(255, 0, 0, 0.4) solid 20px'
      }
    } else {
      const deviceId = newValue[0]
      const uuid = newValue[1]
      if (configureStore.device.get(deviceId)) {
        focusSymbolEle.value = symbolElementMap.value.get(uuid)
        focusSymbolEle.value.style.outline = 'rgba(255, 0, 0, 0.4) solid 20px'
        // focusSymbolConfig.value = symbolPointMap.value.get(deviceId)
      }
    }
  }
})

// 根据设备ID拿到设备的配置信息
const getDeviceLayersByDeviceId = (deviceId: string) => {
  return configureStore.symbol.get(deviceId)
}
provide('getDeviceLayersByDeviceId', getDeviceLayersByDeviceId)

const useOnclick = (index: string[]) => {
  // getVertex()
  // console.log(symbolElementMap.value)
}

// 选中元素
const dragNow = ref(false)
const dragEle = ref()
const dragData = ref()
let dragEleRect: number[] = []
const onmousedown = (index: string[], e: MouseEvent) => {
  if (index[0] === 'plugin') {
    focusSymbol.value = index
    const uuid = index[1]
    dragNow.value = true
    dragEle.value = pluginElementMap.value.get(uuid)
    dragData.value = configureStore.plugin.get(uuid)
  } else {
    focusSymbol.value = index
    // const deviceId = index[0]
    const uuid = index[1]
    dragNow.value = true
    dragEle.value = symbolElementMap.value.get(uuid)
    dragData.value = configureStore.symbol.get(uuid)
  }
  const rect = dragEle.value.getBoundingClientRect()
  dragEleRect = [rect.width / 2, rect.height / 2]
  // 阻止事件冒泡，就是在移动图元的时候不让背景图移动
  e.stopPropagation()
}
const onmousemove = (e: MouseEvent) => {
  if (dragNow.value) {
    const bgTransform = hmi_page_background.value.style.transform
    const temp = bgTransform.split('(')[1].split(')')[0].split(',')
    const size = temp[0]
    bgRect.value = [temp[4], temp[5]]
    const transform = dragData.value.transform
    transform.posX = (e.pageX - bg_wrapRect.value.left - bgRect.value[0] - dragEleRect[0]) / size
    transform.posY = (e.pageY - bg_wrapRect.value.top - bgRect.value[1] - dragEleRect[1]) / size
    dragEle.value.style.transform = `translate(${transform.posX + hmiConfig.value.deviationX}px, ${transform.posY + hmiConfig.value.deviationY}px)rotateX(${transform.rotateX}deg)rotateY(${transform.rotateY}deg)rotateZ(${transform.rotateZ}deg)scale(${transform.sizeW}, ${transform.sizeH})`
  }
}
const onmouseup = (e: MouseEvent) => {
  if (dragNow.value) {
    if (focusSymbol.value[0] === 'plugin') {
      // exportConfig(['plugin'], focusSymbol.value)
    } else {
      // exportConfig('symbol', focusSymbol.value[1])
      configureStore.exportData('symbol', configureStore.symbol.get(focusSymbol.value[1]))
    }
    dragNow.value = false
  }
}

// 监听键盘事件
const onKeyDown = (e: any) => {
  if (e.key === 'Delete') {
    onDelete()
  } else if (e.ctrlKey) {

  }
}

// 删除元素
const onDelete = () => {
  if (focusSymbol.value[0] === '') {
    return
  }
  const deviceId = focusSymbol.value[0]
  const uuid = focusSymbol.value[1]
  if (deviceId === 'plugin') {
    deleteSymbol(deviceId, uuid)
    const ele = pluginElementMap.value.get(uuid)
    ele.remove()
  } else if (deviceId === 'layer') {

  } else {
    deleteSymbol(deviceId, uuid)
    const ele = symbolElementMap.value.get(uuid)
    ele.remove()
  }
}
const deleteSymbol = (deviceId: string, uuid: string) => {
  if (deviceId === 'plugin') {
    configureStore.plugin.delete(uuid)
    pluginCb.value.delete(uuid)
    configureStore.deleteDataByDB('plugin', uuid)
  } else {
    configureStore.symbol.delete(uuid)
    const device = configureStore.device.get(deviceId)
    device.symbols = device.symbols.filter((item: any) => { return item !== uuid })
    configureStore.deleteDataByDB('symbol', uuid)
    // 如果还有子图元，那么给一个新的焦点
    if (device.symbols.length) {
      focusSymbol.value = [device.symbols[0]]
      configureStore.exportData('device', device)
    } else {
      // 如果没有子图元，那么就全部删除
      focusSymbol.value = []
      configureStore.device.delete(deviceId)
      configureStore.deleteDataByDB('device', deviceId)
    }
  }
}

const onKeyUp = (e: any) => {
  // console.log(e.ctrlKey)
}

window.addEventListener('mousemove', onmousemove);
window.addEventListener('mouseup', onmouseup);
window.addEventListener('keydown', onKeyDown)
// window.addEventListener('keyup', onKeyUp)

// 导出流程图配置
const exportConfig = (key: string, id?: string) => {
  if (key === 'config') {
    configureStore.config.id = '290e690f-7485-48a0-879b-2055fddca904'
    configureStore.exportData('config', configureStore.config)
  }
}
provide('exportConfig', exportConfig)

// 从缓存获取流程图配置
const loading = ref(true)
let layerEle: any = null

// 缓存要改成从indexedDB中获取
const deviceRender = () => {
  configureStore.device.forEach((device: any) => {
    const { deviceId, config } = device
    const symbols = device.symbols
    watchSymbolConfig(config, deviceId)
    pointCb.value.set(deviceId, new Map())
    symbols.forEach((symbolId: string) => {
      const symbol = configureStore.symbol.get(symbolId)
      observer(symbol, [deviceId, symbolId])
      if (layerEle) {
        const g: any = createSymbolEle([deviceId, symbolId], symbol)
        layerEle.appendChild(g)
      }
    })
    // 强制更新一次
    const point = configureStore.device.get(deviceId).config
    for (let key in point) {
      const cbs = pointCb.value.get(deviceId).get(key)
      if (cbs) {
        if (point[key] !== null) {
          cbs.forEach((cb: any) => {
            cb(point)
          })
        }
      }
    }
  })
}
configureStore.deviceRender = deviceRender
const pluginRender = () => {
  configureStore.plugin.forEach((plugin: any) => {
    if (layerEle) {
      observerPlugin(plugin, plugin.pluginId)
      const g: any = createPluginEle(plugin.pluginId, plugin, '')
      watchPluginConfig(plugin, plugin.pluginId)
      layerEle.appendChild(g)
    }
  })
}
configureStore.pluginRender = pluginRender

// 设备图元变更之后更新对应的dom
const updateSymbol = () => {
  const deviceId = focusSymbol.value[0]
  const uuid = focusSymbol.value[1]
  const symbol = configureStore.symbol.get(uuid)
  const oldEle = symbolElementMap.value.get(uuid)
  const layerEle = wrap.value.querySelector('#layer1')
  observer(symbol, focusSymbol.value)
  const g: any = createSymbolEle(focusSymbol.value, symbol)
  layerEle.replaceChild(g, oldEle)
  const config = configureStore.device.get(deviceId).config
  const device = configureStore.device.get(deviceId)
  // 需要一次强制更新
  for (let key in config) {
    if (config[key]) {
      const fns = pointCb.value.get(deviceId).get(key)
      fns.forEach((fn: any) => {
        fn(device.config)
      })
    }
  }
  focusSymbolEle.value = symbolElementMap.value.get(uuid)
  focusSymbolEle.value.style.outline = 'rgba(255, 0, 0, 0.4) solid 20px'
}

// 导出html
const exportHtml = () => {

}

// 增加子图元
const appendChild = (uuid: string) => {
  const deviceId = focusSymbol.value[0]
  const symbol = configureStore.symbol.get(uuid)
  const index = [deviceId, uuid]
  observer(symbol, index)
  if (layerEle) {
    const g: any = createSymbolEle(index, symbol)
    layerEle.appendChild(g)
    const point = configureStore.device.get(deviceId).config
    for (let item of pointCb.value.get(deviceId)) {
      if (point[item[0]]) {
        item[1].forEach((cb: any) => {
          cb(point)
        })
      }
    }
    configureStore.exportData('device', configureStore.device.get(deviceId))
  }
}

// 三维变换
const transformChange = (transform: any) => {
  const str = `translate(${transform.posX + hmiConfig.value.deviationX}px, ${transform.posY + hmiConfig.value.deviationY}px)rotateX(${transform.rotateX}deg)rotateY(${transform.rotateY}deg)rotateZ(${transform.rotateZ}deg)scale(${transform.sizeW}, ${transform.sizeH})`
  focusSymbolEle.value.style.transform = str
  if (focusSymbol.value[0] === 'plugin') {
  } else {
    configureStore.exportData('symbol', configureStore.symbol.get(focusSymbol.value[1]))
  }
}

// 更换背景
const changeBg = () => {
  exportConfig('config')
  getBgSvgApi()?.then(() => {
    return deviceRender()
  })
}

defineExpose({
  exportConfig,
  getBgSvgApi,
  exportHtml,
  deviceRender
})

onMounted(() => {
  configureStore.init().then(() => {
    loading.value = false
  })
  // .then(() => {
  // configureStore.loading = true
  // configureStore.setConfig(JSON.parse(cacheConfig))
  // // getConfigByLocation()
  // loading.value = true
  // configureStore.setConfig()
  // })
})

onUnmounted(() => {
  window.removeEventListener('mousemove', onmousemove)
  window.removeEventListener('mouseup', onmouseup)
})
</script>

<style lang="less" scoped>
.dragging {
  cursor: pointer;
}

.ground:hover {
  cursor: pointer;
}

.configure_wrap {
  width: 100%;
  height: 100%;
  overflow: auto;
  display: flex;
  background: #f2f2f2;
  position: relative;
}

.configure_view {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: auto;
  background: black;

  .bg-wrap {
    overflow: hidden;
    background-color: #fff;
    flex: 1;
  }
}

.config-wrap {
  width: 300px;
}

.tree-wrap {
  left: 0;
  top: 0;
  width: 300px;
  height: 100%;
}

.configure_wrap {
  user-select: none;
}
</style>

<style lang="less">
#hmi_page_background {
  svg {
    overflow: visible;
  }
}
</style>