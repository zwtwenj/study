<!--按钮操作-->
<template>
  <el-dialog width="500" title="上传背景图" :close-on-click-modal="false" @closed="closedHander">
    <div class="bg-upload">
      <el-tabs v-model="uploadTab" class="demo-tabs">
        <el-tab-pane label="上传svg" name="svg"></el-tab-pane>
        <el-tab-pane label="上传dwg" name="dwg"></el-tab-pane>
      </el-tabs>
      <div v-if="uploadTab === 'dwg'" class="upload-box">
        <el-upload :http-request="uploadDwg" :limit="1" :show-file-list="true" :before-upload="dwgBefore"
          ref="dwgUpload" :before-remove="dwgRemove">
          <el-button>上传</el-button>
          <template #tip>
            <div class="el-upload__tip">
              请选择dwg文件进行上传！
            </div>
          </template>
        </el-upload>
        <div class="dwg-layers" style="margin-top: 20px;">
          <div style="margin-left: 10px;">请选择图层</div>
          <el-table :data="layerTable" v-if="layerShow" @selection-change="selectionChange">
            <el-table-column type="selection"></el-table-column>
            <el-table-column prop="name" label="图层名"></el-table-column>
            <el-table-column width="60">
              <template #default="scope">
                <el-button type="text" @click="downloadLayer(scope.row.name)">下载</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div style="display:flex;align-items: center;margin-top:10px;" v-if="filename !== ''">
          文件名：<el-input style="flex:1;" v-model="bgname"></el-input>
        </div>
      </div>
      <div v-if="uploadTab === 'svg'" class="upload-box">
        <el-upload :http-request="saveBgfileApi" :show-file-list="true" :limit="1" :before-upload="svgBefore">
          <el-button>上传</el-button>
          <template #tip>
            <div class="el-upload__tip">
              请选择svg文件进行上传！
            </div>
          </template>
        </el-upload>
      </div>
      <div class="footer" v-if="uploadTab === 'svg'">
        <el-button @click="emits('cacel')">关闭</el-button>
      </div>
      <div class="footer" v-if="uploadTab === 'dwg'">
        <el-button @click="preview">预览</el-button>
        <el-button @click="saveLayerApi" :disabled="filename === ''">保存</el-button>
        <el-button type="text" @click="emits('cacel')">取消</el-button>
      </div>
    </div>
    <el-dialog v-model="previewShow" width="1200">
      <div style="width:1160px;overflow: hidden;margin:auto;text-align: center;">
        <div id="preview" ref="previewEle" v-html="preData"></div>
      </div>
    </el-dialog>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { getLayer, genLayer, saveBgfile, saveLayer } from '@/api/zhaoguohong'
import { ElMessage } from 'element-plus';
import { store } from '@/store/configure'
import panzoom from 'panzoom'

const configureStore = store()
const uploadTab = ref('svg')
const emits = defineEmits(['cacel'])
const bgname = ref('')

const closedHander = () => {
  bgname.value = ''
}

// 上传dwg
const dwgUpload = ref()
const layers = ref([])
const dwgBefore = (file: any) => {
  const fileName = file.name
  if (fileName.slice(fileName.length - 4) === '.dwg') {

  } else {
    ElMessage.error('请选择dwg文件进行上传！')
    return false
  }
}
const uploadDwg = (data: any) => {
  if (data.file) {
    return getLayerApi(data.file).then(() => {
      layerShow.value = true
    })
  }
}
const dwgRemove = (data: any) => {
  layerTable.value = []
}

// 上传dwg文件获取图层
const layerTable = ref<any>([])
const filename = ref('')
const getLayerApi = (data: any) => {
  const params = new FormData()
  params.append('upload-file', data)
  return getLayer(params).then((res: any) => {
    layers.value = res.data.data.layers
    filename.value = res.data.data.filename
    for (let key in layers.value) {
      layerTable.value.push({
        name: key,
        value: layers.value[key]
      })
    }
    return Promise.resolve()
  })
}

// 根据图层索引获取图层详细信息
const layerShow = ref(false)
const preData = ref('')
const previewEle = ref()
const genLayerApi = () => {
  const params: any = {
    filename: filename.value,
    layer: []
  }
  selectedLayer.value.forEach((item: any) => {
    params.layer.push(item.name)
  })
  return genLayer(params).then((res: any) => {
    preData.value = res.data.data
    previewShow.value = true
    return Promise.resolve()
  })
}
// 预览图层
const previewShow = ref(false)
const preview = () => {
  genLayerApi().then(() => {
    bgPanZoom()
  })
}
const bgPanZoom = () => {
  const pan = panzoom(previewEle.value, {
    smoothScroll: false,
    bounds: true,
    zoomDoubleClickSpeed: 1,
    minZoom: 0.4,
    maxZoom: 2,
  })
}
// 下载图层
const downloadLayer = (name: string) => {
  const params: any = {
    filename: filename.value,
    layer: [name]
  }
  return genLayer(params).then((res: any) => {
    const htmlContent = res.data.data;
    const a = document.createElement("a");
    const file = new Blob([htmlContent], { type: "text/html" });
    a.href = URL.createObjectURL(file);
    a.download = `${name}.svg`;
    a.click();
  })
}

const selectedLayer = ref([])
const selectionChange = (data: any) => {
  selectedLayer.value = data
}

// 上传svg为底图
const svgBefore = (file: any) => {
  const fileName = file.name
  if (fileName.slice(fileName.length - 4) === '.svg') {

  } else {
    ElMessage.error('请选择svg文件进行上传！')
    return false
  }
}

// 上传svg为底图
const saveBgfileApi = (data: any) => {
  if (data.file) {
    const params = new FormData()
    params.append('upload-file', data.file)
    params.append('project', 'L3')
    saveBgfile(params).then((res: any) => {
      ElMessage.success('上传成功！')
    })
  }
}

// 保存CAD图层
const saveLayerApi = () => {
  if (bgname.value.trim() === '') {
    bgname.value = filename.value
  }
  const params: any = {
    bgname: bgname.value,
    filename: filename.value,
    layers: [],
    project: configureStore.config.project
  }
  selectedLayer.value.forEach((item: any) => {
    params.layers.push(item.name)
  })
  return saveLayer(params).then((res: any) => {
    ElMessage.success('上传成功')
    emits('cacel')
  })
}
</script>

<style lang="less" scoped>
.bg-upload {
  padding: 0px 20px 20px 20px;
  // text-align: center;
}

.upload-box {
  // display: flex;
}

.footer {
  text-align: right;
  margin-top: 20px;
}
</style>

<style lang="less">
.bg-upload {
  .el-tabs__nav-wrap:after {
    background-color: #e4e7ed;
  }
}
</style>