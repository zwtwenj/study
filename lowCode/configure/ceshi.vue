<template>
  <div class="ceshi">
    <!-- <iframe src="/ceshi/pages/L03_Z13_BJT_1.html?auth=pass&hash=1710828034989&appType=0"
      style="height: 500px;"></iframe> -->
    <div id="wrap"></div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { queryPagesConfig } from '@/api/zhaoguohong'
import { configDeviceinfo } from '@/api/business'
// import DevicePanel from '@/views/devicePanel/devicePanel.vue'
// import { OsWindowHelper, currentTheme } from 'metro-os-tools';
const data = {
  "svgUse": [
    "DZJ2_1",
    "TCQ1_1"
  ],
  "device": [
    [
      "Z31_EFMS_DZJ2_1",
      {
        "deviceId": "Z31_EFMS_DZJ2_1",
        "config": {
          "ZJZD": null,
          "ZJBD": null,
          "TLSMZT": null,
          "HQZT": null
        },
        "symbols": [
          "e81928fa-5bba-4f5c-bd07-255b888220eb"
        ]
      }
    ],
    [
      "Z31_EFMS_TCQ1_14",
      {
        "deviceId": "Z31_EFMS_TCQ1_14",
        "config": {
          "DLBJ": null,
          "WDBJ": null,
          "DLGZ": null,
          "WDGZ": null,
          "TXGZ": null,
          "TLSMZT": null,
          "HQZT": null
        },
        "symbols": [
          "4325136d-e006-410a-8e29-e8085255aa15"
        ]
      }
    ]
  ],
  "symbol": [
    [
      "e81928fa-5bba-4f5c-bd07-255b888220eb",
      {
        "layers": [
          {
            "condition": "",
            "desc": "正常",
            "group": 1,
            "id": "__DZJ2_1__g16713",
            "params": []
          },
          {
            "condition": "@{ZJZD}==1",
            "desc": "主电故障",
            "group": 1,
            "id": "__DZJ2_1__g8849",
            "params": [
              "ZJZD"
            ]
          },
          {
            "condition": "@{ZJBD}==1",
            "desc": "备电故障",
            "group": 1,
            "id": "__DZJ2_1__g8844",
            "params": [
              "ZJBD"
            ]
          },
          {
            "condition": "@{HQZT}==1",
            "desc": "获取状态",
            "group": 2,
            "id": "__DZJ2_1__g16729",
            "params": [
              "HQZT"
            ]
          },
          {
            "condition": "@{TLSMZT}==1",
            "desc": "脱离扫描",
            "group": 3,
            "id": "__DZJ2_1__g16735",
            "params": [
              "TLSMZT"
            ]
          }
        ],
        "name": "DZJ2_1",
        "ponits": [
          "ZJZD",
          "ZJBD",
          "HQZT",
          "TLSMZT"
        ],
        "style": {
          "width": 70.00006103515625,
          "height": 20.00006103515625
        },
        "deviceType": "DZJ2",
        "transform": {
          "sizeW": 1,
          "sizeH": 1,
          "posX": 340,
          "posY": 82.99996948242188,
          "rotateX": 0,
          "rotateY": 0,
          "rotateZ": 0
        },
        "symbolId": "e81928fa-5bba-4f5c-bd07-255b888220eb",
        "event": []
      }
    ],
    [
      "4325136d-e006-410a-8e29-e8085255aa15",
      {
        "layers": [
          {
            "condition": "",
            "desc": "温度正常",
            "group": 2,
            "id": "__TCQ1_1__g15952",
            "params": []
          },
          {
            "condition": "@{WDBJ}==0 && @{WDGZ}==1",
            "desc": "温度故障",
            "group": 2,
            "id": "__TCQ1_1__g15962",
            "params": [
              "WDBJ",
              "WDGZ"
            ]
          },
          {
            "condition": "@{WDBJ}==1",
            "desc": "温度报警",
            "group": 2,
            "id": "__TCQ1_1__g15972",
            "params": [
              "WDBJ"
            ]
          },
          {
            "condition": "",
            "desc": "剩余电流正常",
            "group": 3,
            "id": "__TCQ1_1__g15982",
            "params": []
          },
          {
            "condition": "@{DLBJ}==0 && @{DLGZ}==1",
            "desc": "剩余电流故障",
            "group": 3,
            "id": "__TCQ1_1__g15992",
            "params": [
              "DLBJ",
              "DLGZ"
            ]
          },
          {
            "condition": "@{DLBJ}==1",
            "desc": "剩余电流报警",
            "group": 3,
            "id": "__TCQ1_1__g16002",
            "params": [
              "DLBJ"
            ]
          },
          {
            "condition": "",
            "desc": "正常",
            "group": 1,
            "id": "__TCQ1_1__g16012",
            "params": []
          },
          {
            "condition": "@{TXGZ}==1",
            "desc": "探测器故障报警",
            "group": 1,
            "id": "__TCQ1_1__g16026",
            "params": [
              "TXGZ"
            ]
          },
          {
            "condition": "@{HQZT}==4",
            "desc": "获取状态",
            "group": 1,
            "id": "__TCQ1_1__g16056",
            "params": [
              "HQZT"
            ]
          },
          {
            "condition": "@{TLSMZT}==1",
            "desc": "脱离扫描",
            "group": 5,
            "id": "__TCQ1_1__g16082",
            "params": [
              "TLSMZT"
            ]
          }
        ],
        "name": "TCQ1_1",
        "ponits": [
          "DLGZ",
          "TXGZ",
          "HQZT",
          "TLSMZT",
          "WDBJ",
          "WDGZ",
          "DLBJ"
        ],
        "style": {
          "width": 228.7715301513672,
          "height": 20.239227294921875
        },
        "deviceType": "TCQ1",
        "transform": {
          "sizeW": 1,
          "sizeH": 1,
          "posX": 570.6142272949219,
          "posY": 110.88040161132812,
          "rotateX": 0,
          "rotateY": 0,
          "rotateZ": 0
        },
        "symbolId": "4325136d-e006-410a-8e29-e8085255aa15",
        "event": [
          {
            "use": "message",
            "message": "aaa",
            "trigger": "onclick",
            "cb": "aaa"
          }
        ]
      }
    ]
  ],
  "plugin": [],
  "config": {
    "id": "290e690f-7485-48a0-879b-2055fddca904",
    "project": "L3",
    "station": "Z31",
    "subsystem": "EFMS",
    "chartIndex": "全新流程图",
    "layerConfig": {
      "layer1Config": {
        "bg": "L03_Z10_ACS_1_1.svg"
      },
      "layer2Config": {
        "backgroundColor": "rgb(41, 57, 74)"
      },
      "layer3Config": {
        "fontColor": "rgb(255, 255, 255)",
        "fontSize": "29.3333px",
        "title": "布政站空调水系统",
        "transform": {
          "posX": "0",
          "posY": "0"
        }
      }
    }
  }
}
const global: any = window
global.hmi_init({
  svgIp: `/static/L3/symbols/devicesymbols/`,
  bgIp: `/static/L3/symbols/pages/`,
});

// const win = OsWindowHelper.find('1809056013544071169');
// console.log(win)

// window.hmi_init({
//   svgIp:
//     "http://172.20.31.12:10000/jianmo/symbols/getdevicesymbol?filename=",
//   bgIp: "http://172.20.31.12:10000/mock/getBgSvg",
// });
// const ele = document.querySelector("#wrap");
// var urlParams = new URLSearchParams(window.location.search);
// var chartIndex = urlParams.get("chartIndex");
// var project = urlParams.get("project");
// fetch("/query/PagesConfig", {
//   method: "POST",
//   body: JSON.stringify({
//     chartIndex,
//     project,
//   }),
//   headers: {
//     "Content-Type": "application/json",
//   },
// })
//   .then((res) => {
//     return res.text();
//   })
//   .then((res) => {
//     return hmi_render(ele, res.data.data.PageConfig);
//   });

// const queryPagesConfigApi = () => {
//   const params = {
//     chartIndex: '赵国宏一号',
//     project: 'L3'
//   }
//   return queryPagesConfig(params)
// }
// action: "popup_devicepanel",
// deviceid: deviceid,
// screen_id: screenid,
// click: {
//   x: ev.x,
//   y: ev.y,
//   rect: ev.currentTarget.getBoundingClientRect()
// }
onMounted(() => {
  const ele = document.querySelector("#wrap");
  global.hmi_render(ele, data);
  global.hmi_event('popup_devicepanel', function (data: any) {
    const { index, symbol } = data
    const deviceid = index[0]
    let screenid = 0;
    console.log(window.frameElement)
    // if (!isNaN(parseInt(window.frameElement.getAttribute("screen")))) {
    //   screenid = parseInt(window.frameElement.getAttribute("screen"))
    // }
    const option = {
      action: "popup_devicepanel",
      deviceid: deviceid,
      screen_id: 1,
      click: {
        x: 552,
        y: 129,
        rect: {
          "x": 529.0326538085938,
          "y": 109.35234832763672,
          "width": 48.69073486328125,
          "height": 33.10511016845703,
          "top": 109.35234832763672,
          "right": 577.723388671875,
          "bottom": 142.45745849609375,
          "left": 529.0326538085938
        }
      }
    }
    window.parent.postMessage(option, '*');
  })
  global.hmi_event("control", function (data: any) {
    const { index, symbol } = data
    const deviceid = index[0]
    const option = {
      action: "control",
      data: {
        "action": "control",
        "showtext": "是否下发模式？",
        "ctrls": [
          {
            "devname": deviceid,
            "value": "4020",
            "timeout": "10"
          }
        ]
      },
      screen_id: 1
    }
    window.parent.postMessage(option, '*');
  })
  global.hmi_event("popup_schemainfopanel", function (data: any) {
    const { index, symbol } = data
    const deviceid = index[0]
    const option = {
      action: 'popup_schemainfopanel',
      deviceid: deviceid,
      modeno: 3002,
      screen_id: 1
    }
    window.parent.postMessage(option, '*');
  })
})
</script>
<style lang="less" scoped>
.ceshi {
  height: 100%;
  width: 100%;

  iframe {
    height: 100%;
    width: 100%;
  }
}
</style>