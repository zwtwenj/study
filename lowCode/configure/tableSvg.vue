<template>
  <el-upload :http-request="uploadDWG">
    <el-button type="primary">上传表格dwg文件转化为excel</el-button>
  </el-upload>
  <!-- <input type="file" @change="getFile"> -->
  <div class="table-svg" ref="tableSvgWrap">

  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { tableData } from './tableData'
import { genTable } from '@/api/zhaoguohong'
import { saveAs } from 'file-saver'
import * as XLSX from 'xlsx'

const uploadDWG = (data: any) => {
  const params = new FormData()
  params.append('upload-file', data.file)
  return genTable(params).then((res: any) => {
    // renderTable(res.data.data)
    exportToExcel(res.data.data)
  })
}
const tableSvgWrap = ref()

const htmlStr: string[] = []

const domWidth = [350, 450, 500, 700, 1100, 1300]
const renderTable = (data: any) => {
  const len = data.length
  const width = data[0].length
  for (let i = 0; i <= width; i++) {
    console.log(i ? domWidth[i - 1] : 0)
    const str = `<path
                    style="fill:#ccffcc;fill-opacity:1;fill-rule:evenodd;stroke:#ffffff;stroke-width:1;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1"
                    d="m ${i ? domWidth[i - 1] : 0}, 0 l 0, ${(len + 1) * 30}" inkscape:connector-curvature="0">
                 </path>`
    htmlStr.push(str)
  }
  for (let i = 0; i < len + 1; i++) {
    const str = `<path
                    style="fill:#ccffcc;fill-opacity:1;fill-rule:evenodd;stroke:#ffffff;stroke-width:1;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1"
                    d="m 0, ${30 * i} l 1800, 0" inkscape:connector-curvature="0">
                </path>`
    htmlStr.push(str)
  }
  for (let i = 0; i < len; i++) {
    const str = []
    for (let j = 0; j < width; j++) {
      str.push(`<text style="fill:#ffffff;fill-opacity:1;" x="${j ? domWidth[j - 1] + 10 : 10}" y="${30 * i + 20}">
                      <tspan sodipodi:role="line">
                         ${data[i][j]}</tspan>
                  </text>`)
    }
    htmlStr.push(str.join(''))
  }
  const html = `<svg xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#"
          xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg"
          xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
          xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
          xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" width="100%" height="100%" version="1.1"
          inkscape:version="0.92.3 (2405546, 2018-03-11)"
          style="background:#29394a;" xmlns:ev="http://www.w3.org/2001/xml-events"
          viewBox="0 0 ${domWidth[domWidth.length - 1]} ${30 * len}">
              <g>` + htmlStr.join('') + `</g>
          </svg>`
  tableSvgWrap.value.innerHTML = html
}

// 导出excel文件
const exportToExcel = (data: string[]) => {
  const ws = XLSX.utils.json_to_sheet(data, {
    skipHeader: true
  })
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
  function s2ab(s: any) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
  }
  saveAs(new Blob([s2ab(wbout)], { type: 'application/octet-stream' }), 'data.xlsx');
}

// 读取excel文件
const getFile = (e: any) => {
  // console.log(e.target.files)
  readExcelFile(e.target.files[0])
}
const readExcelFile = (file: any) => {
  const reader = new FileReader()
  reader.onload = (e: any) => {
    const data = new Uint8Array(e.target.result)
    const workbook = XLSX.read(data, { type: 'array' })
    const worksheet = workbook.Sheets[workbook.SheetNames[0]]
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
    console.log(jsonData)
  }
  reader.readAsArrayBuffer(file)
}


onMounted(() => {
  // const html = `<svg xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#"
  //         xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg"
  //         xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
  //         xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
  //         xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" width="100%" height="100%" version="1.1"
  //         inkscape:version="0.92.3 (2405546, 2018-03-11)"
  //         style="background:#29394a;" xmlns:ev="http://www.w3.org/2001/xml-events"
  //         viewBox="0 0 ${domWidth[domWidth.length - 1]} ${30 * len}">
  //             <g>` + htmlStr.join('') + `</g>
  //         </svg>`
  // tableSvgWrap.value.innerHTML = html
})
</script>