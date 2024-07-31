<template>
  <div class="symbol-config">
    <div class="symbol-opera" v-if="type === 'symbol'">
      <div class="config-title">
        操作
      </div>
      <el-button type="primary" @click="appendChild" v-if="type === 'symbol'">新增子图元</el-button>
    </div>
    <div class="symbol-transform" v-if="type === 'plugin' || type === 'symbol'">
      <div class="config-title">
        3维
        <el-button @click="show.transform = !show.transform">{{ show.transform ? '收起' : '展开' }}</el-button>
      </div>
      <el-form label-width="70" v-show="show.transform">
        <el-form-item label="尺寸">
          <div>
            w:<el-input style="width:80px;margin-right:5px;" @change="transformChange"
              v-model.float="transform.sizeW"></el-input>
          </div>
          <div>h:<el-input style="width:80px;" @change="transformChange" v-model.float="transform.sizeH"></el-input>
          </div>
        </el-form-item>
        <el-form-item label="坐标">
          <div>x:<el-input style="width:80px;margin-right:5px;" @change="transformChange('posX')"
              v-model.float="transform.posX"></el-input></div>
          <div>y:<el-input style="width:80px;" @change="transformChange('posY')"
              v-model.float="transform.posY"></el-input>
          </div>
        </el-form-item>
        <el-form-item label="旋转">
          <div>x:<el-input style="width:80px;margin-right:5px;" @change="transformChange('rotateX')"
              v-model.float="transform.rotateX"></el-input></div>
          <div>y:<el-input style="width:80px;" @change="transformChange('rotateY')"
              v-model.float="transform.rotateY"></el-input>
          </div>
          <div>z:<el-input style="width:80px;" @change="transformChange('rotateZ')"
              v-model.float="transform.rotateZ"></el-input>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div class="symbol-list" v-if="type === 'symbol'" ref="symbolLayer">
      <div class="config-title">
        设备图层
        <el-button @click="show.layer = !show.layer">{{ show.layer ? '收起' : '展开' }}</el-button>
      </div>
      <el-form v-show="show.layer">
        <el-form-item v-for="item in symbols" :key="item[0]" :label="item[0]" label-width="100">
          <div style="width:100%; display:flex; justify-content: space-between;">
            <div v-html="renderSymbol(item[1])" style="margin-top:5px;width:120px;overflow: hidden;" :id="item[1].name">
            </div>
            <el-checkbox v-model="check[item[0]]" @change="changeSymbol(item[0])"></el-checkbox>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-list">
      <div class="config-title">
        绑定
        <el-button @click="show.binding = !show.binding">{{ show.binding ? '收起' : '展开' }}</el-button>
      </div>
      <el-form v-if="show.binding">
        <el-form-item v-for="(value, key) in binding" :key="key" :label="bindingConfig[key].text" label-width="80">
          <el-checkbox v-if="bindingConfig[key].type === 'boolean'" v-model="binding[key].value"
            @change="changeVariable(binding, key)"></el-checkbox>
          <el-select v-model="binding[key].variable" @change="bindVariable(ele, symbol, binding, key)" clearable
            placeholder="绑定变量">
            <el-option v-for="(value, key) in configureStore.globalVariable" :key="key" :label="key"
              :value="key"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-list" v-if="type === 'plugin' || type === 'symbol'">
      <div class="config-title">
        点位/数据
        <el-button @click="show.point = !show.point">{{ show.point ? '收起' : '展开' }}</el-button>
      </div>
      <el-form v-if="show.point">
        <el-form-item v-for="(value, key) in config" :key="key" :label="key" label-width="80">
          <el-input v-model="config[key]"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-list" v-if="type === 'plugin' || type === 'symbol'">
      <div class="config-title">
        事件
      </div>
      <el-form>
        <el-button type="primary" @click="addEvent">添加事件（目前只支持点击事件）</el-button>
        <el-form-item v-for="item in symbol.event" :key="item.trigger" :label="item.trigger" label-width="80">
          <el-radio-group v-model="item.use">
            <el-radio value="message">事件消息</el-radio>
            <el-radio value="cb">事件代码</el-radio>
          </el-radio-group>
          <el-input v-if="item.use === 'message'" v-model="item.message" @change="eventChange"></el-input>
          <el-input v-if="item.use === 'cb'" type="textarea" v-model="item.cb" @change="eventChange"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-list" v-if="type === 'layer'">
      <div class="config-title">配置</div>
      <template v-if="configureStore.focusSymbol[1] === 'layer1'">
        <el-form label-width="80">
          <el-form-item label="背景">
            <span style="color:red;">接口设计问题，目前只能展示一百条背景数据，请进行筛选后选取</span>
            <el-select v-model="config.bg" filterable :filter-method="bgFileListApi" @change="changeBg">
              <el-option v-for="item in bgList" :key="item" :value="item" :label="item"></el-option>
            </el-select>
            <el-button type="primary" style="margin-top:18px;" @click="bgUploadShow = true">上传背景图</el-button>
          </el-form-item>
        </el-form>
      </template>
      <template v-if="configureStore.focusSymbol[1] === 'layer2'">
        <el-form label-width="80">
          <el-form-item label="背景颜色">
            <el-input v-model="config.backgroundColor" @change="changeLayer2BackgroundColor"></el-input>
          </el-form-item>
        </el-form>
      </template>
      <template v-if="configureStore.focusSymbol[1] === 'layer3'">
        <el-form label-width="80">
          <el-form-item label="标题">
            <el-input v-model="config.title" @change="changeLayer3Title"></el-input>
          </el-form-item>
          <el-form-item label="字号">
            <el-input v-model="config.fontSize" @change="changeLayer3FontSize"></el-input>
          </el-form-item>
          <el-form-item label="字体颜色">
            <el-input v-model="config.fontColor" @change="changeLayer3FontColor"></el-input>
          </el-form-item>
          <el-form-item label="偏移">
            <div>x:<el-input style="width:80px;margin-right:5px;" @change="changeLayer3Transform()"
                v-model.float="config.transform.posX"></el-input></div>
            <div>y:<el-input style="width:80px;" @change="changeLayer3Transform()"
                v-model.float="config.transform.posY"></el-input>
            </div>
          </el-form-item>
        </el-form>
      </template>
    </div>
    <bgUpload v-model="bgUploadShow" @cacel="bgUploadShow = false"></bgUpload>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, inject, nextTick } from 'vue'
import { v4 as uuidv4 } from 'uuid';
import { bgFileList } from '@/api/zhaoguohong'
import bgUpload from './bgUpload.vue'
import { store } from '@/store/configure'
import { bindVariable, bindingConfig, changeVariable } from '@/utils/binding'

const configureStore = store()
const props = withDefaults(defineProps<{
  svg: HTMLElement
}>(), {
})

const show = ref({
  transform: false,
  layer: false,
  binding: false,
  point: false
})
const emits = defineEmits(['updateSymbol', 'updateEvent', 'appendChild', 'transformChange', 'changeBg'])
const getSymbols: any = inject('getSymbols', (name: string) => { })
const exportConfig: any = inject('exportConfig', () => { })
const type = ref<'symbol' | 'plugin' | 'layer'>('symbol')

const symbols = ref<any>()
const check = ref<any>({})

const transform = ref<any>({
  sizeW: 1,  // 缩放
  sizeH: 1,
  posX: 0,   // 坐标，原点为底图的左上角
  posY: 0,
  rotateX: 0,  // 旋转
  rotateY: 0,
  rotateZ: 0,
})

// 上传背景（dwg/svg）
const bgUploadShow = ref(false)
// 获取背景图列表
const bgList = ref([])
const bgFileListApi = (input?: string) => {
  const params = {
    project: configureStore.config.project,
    fileName: input || ''
  }
  return bgFileList(params).then((res: any) => {
    if (res.data.data.bg && res.data.data.bg.length > 100) {
      if (res.data.data.bg) {
        bgList.value = res.data.data.bg.slice(0, 100)
      } else {
        bgList.value = []
      }
    } else {
      bgList.value = res.data.data.bg
    }
  })
}

// 当前的图元数据
const symbol = ref<any>()
// 当前图元属于设备的点位数据
const config = ref<any>({})
// 当前图元绑定数据
const binding = ref<any>({})
// 当前焦点的页面元素
const ele = ref<any>()
watch(() => configureStore.focusSymbol, (newValue, oldValue) => {
  if (newValue[0]) {
    if (newValue[0] === 'plugin') {
      symbol.value = configureStore.plugin.get(configureStore.focusSymbol[1])
      transform.value = symbol.value.transform
      type.value = 'plugin'
      config.value = configureStore.plugin.get(newValue[1]).data
    } else if (newValue[0] === 'layer') {
      type.value = 'layer'
      if (newValue[1] === 'layer1') {
        // bgFileListApi()
      }
      config.value = configureStore.config.layerConfig[`${newValue[1]}Config`]
    } else {
      const deviceId = newValue[0]
      type.value = 'symbol'
      symbol.value = configureStore.symbol.get(configureStore.focusSymbol[1])
      transform.value = symbol.value.transform
      symbols.value = getSymbols(symbol.value.deviceType).symbolsMap
      symbols.value.forEach((item: any) => {
        check.value[item.name] = false
      })
      check.value[symbol.value.name] = true
      const device = configureStore.device.get(deviceId)
      config.value = device.config
      binding.value = symbol.value.binding
      console.log(configureStore.layer1Ele)
      ele.value = configureStore.layer1Ele.querySelector(`#_${symbol.value.symbolId}`)
      if (true || !binding.value) {
        binding.value = {
          display: {
            value: true,
            variable: ''
          }
        }
        symbol.value.binding = binding.value
      }
    }
  } else {
    // 删除要清空数据
    check.value = {}
    symbols.value = new Map()
    symbols.value = {}
  }
}, { immediate: true })


// 渲染所有图层
const symbolLayer = ref()
const renderSymbol = (symbol: any) => {
  nextTick(() => {
    const ele = symbolLayer.value.querySelector(`#${symbol.name}`).children[0]
    const rect = ele.children[0].getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    symbol.style = {
      width, height
    }
    ele.setAttribute('width', width)
    ele.setAttribute('height', height)
  })
  // symbol.deviceType = props.symbol.symbol.get('default').deviceType
  return `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" style="overflow:visible">
                        <use xlink:href=#${symbol.name}></use>
                     </svg>`
}

const changeSymbol = (symbolId: string) => {
  for (let key in check.value) {
    check.value[key] = false
  }
  check.value[symbolId] = true
  Object.assign(symbol.value, symbols.value.get(symbolId))
  emits('updateSymbol')
}

// 新增子图元
const appendChild = () => {
  const device = configureStore.device.get(configureStore.focusSymbol[0])
  const defaultSymbolId = device.symbols[0]
  const defaultSymbol = configureStore.symbol.get(defaultSymbolId)

  const newSymbol = JSON.parse(JSON.stringify(defaultSymbol))
  const transform = newSymbol.transform
  transform.posX = parseInt(transform.posX) + parseInt(defaultSymbol.style.width)
  const uuid = uuidv4()
  newSymbol.symbolId = uuid

  device.symbols.push(uuid)
  configureStore.symbol.set(uuid, newSymbol)
  emits('appendChild', uuid)
}

// 三维变换变化
const transformChange = (attribute?: 'posX' | 'posY' | 'rotateX' | 'rotateY' | 'rotateZ') => {
  if (attribute) {
    transform.value[attribute] = parseFloat(transform.value[attribute] as string)
  }
  emits('transformChange', transform.value)
}

const eventChange = () => {
  if (type.value === 'symbol') {
    configureStore.exportData('symbol', symbol.value)
  } else {
    configureStore.exportData('plugin', symbol.value)
  }
}

// 更改背景
const changeBg = () => {
  configureStore.setBg(config.value.bg)
  if (config.value.bg && config.value.bg !== '') {
    exportConfig('config')
  }
}

// 更改背景颜色
const changeLayer2BackgroundColor = () => {
  configureStore.layer2Ele.children[0].style.fill = config.value.backgroundColor;
  exportConfig('config')
}

// 更改标题
const changeLayer3Title = () => {
  configureStore.layer3Ele.children[0].innerHTML = config.value.title
  exportConfig('config')
}
// 更改字号
const changeLayer3FontSize = () => {
  configureStore.layer3Ele.children[0].style.fontSize = config.value.fontSize + 'px'
  exportConfig('config')
}
// 更改标题偏移
const changeLayer3Transform = () => {
  if (isNaN(parseFloat(config.value.transform.posX)) || isNaN(parseFloat(config.value.transform.posY))) {

  } else {
    const transform = getComputedStyle(configureStore.layer3Ele).transform
    const temp = transform.split('(')[1].split(')')[0].split(',')
    temp[4] = config.value.transform.posX
    temp[5] = config.value.transform.posY
    let str = temp.join(',')
    configureStore.layer3Ele.setAttribute('transform', `matrix(${str})`)
    exportConfig('config')
  }
}
// 更改标题颜色
const changeLayer3FontColor = () => {
  try {
    configureStore.layer3Ele.children[0].style.fill = config.value.fontColor
    exportConfig('config')
  } catch {

  }
}

configureStore.bgFileListApi = bgFileListApi

// 添加事件
const addEvent = () => {
  if (type.value === 'symbol') {
    symbol.value.event.push({
      use: 'message',
      message: '',
      trigger: 'onclick',
      cb: ''
    })
    configureStore.exportData('symbol', symbol.value)
  } else {

  }
}
</script>

<style lang="less" scoped>
.symbol-config {
  width: 300px;
  height: 100%;
  overflow: auto;
  background: #333;
  color: #fff;
  padding: 0 12px;

  .config-title {
    font-size: 14px;
    line-height: 23px;
    padding: 8px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>