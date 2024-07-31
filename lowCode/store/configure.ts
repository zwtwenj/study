import { defineStore } from "pinia";
import layerConfig from "@/configurePlugin/layerConfig";
import { openProject } from "@/api/transmit";
import { ElMessage } from "element-plus";
import {
  openDeviceDB,
  addData,
  getDataByKey,
  deleteDB,
  deleteStoreData,
} from "@/utils/indexedDB";
export const store = defineStore({
  id: "configureStore",
  state: (): any => {
    return {
      type: "online",
      svgUse: [],
      device: new Map(),
      symbol: new Map(),
      plugin: new Map(),
      config: {
        id: "",
        project: "",
        station: "",
        subsystem: "",
        chartIndex: "",
        layerConfig: JSON.parse(JSON.stringify(layerConfig)),
      },

      loading: false,
      layerEle: null,
      layer1Ele: null,
      layer2Ele: null,
      layer3Ele: null,

      // 图元的原始数据
      symbolOriginalData: {
        layerConfig: {
          layer1Config: {},
          layer2Config: {
            backgroundColor: "",
          },
          layer3Config: {
            title: "",
            fontColor: "",
            fontSize: "",
          },
        },
      },
      // 当前焦点的设备
      focusSymbol: [],
      ctrlFocusSymbol: [],
      // 操作历史，栈
      history: [],

      // 获取项目列表
      getProjectListApi: null,
      // 获取项目内流程图列表
      getPagesConfigListApi: null,
      // 获取制定流程图的配置信息
      queryPagesConfigApi: null,
      // 获取车站
      stationQueryApi: null,
      // 获取子系统
      subsystemQueryApi: null,
      // 获取背景图片
      getBgSvgApi: null,
      // 下载数据，包括用到的图元信息，设备类信息
      loadData: null,
      // 初始化左侧的设备树组件
      initTree: null,
      // 根据缓存渲染页面
      deviceRender: null,
      pluginRender: null,
      // 清空流程图内设备和插件
      cleanUpSymbolAndPlugin: null,
      // 清空底图
      cleanUpBg: null,
      // 清空图元设备类数据
      cleanUpData: null,

      indexedDB: false,
      // 全局变量
      globalVariable: {
        show: false,
      },
      // 全局函数（待开发）
      globalFunc: {},
    };
  },
  actions: {
    // 设置项目
    setProject(project: string) {
      this.config.project = project;
      this.openProjectApi()
        .then(() => {
          this.config.chartIndex = "";
          this.config.station = "";
          this.config.subsystem = "";
          this.cleanUpSymbolAndPlugin();
          this.cleanUpData();
          this.config.id = "290e690f-7485-48a0-879b-2055fddca904";
          this.exportData("config", this.config);
          this.cleanUpBg();
          // this.initTree();
          return this.getPagesConfigListApi();
        })
        .then(() => {
          return Promise.all([
            this.stationQueryApi(),
            this.subsystemQueryApi(),
          ]);
        });
    },
    // 设置车站和子系统
    setStationAndSubsystem(station: string, subsystem: string, cb?: any) {
      if (station !== "") {
        this.config.station = station;
      }
      if (subsystem !== "") {
        this.config.subsystem = subsystem;
      }
      if (this.config.subsystem !== "" && this.config.station !== "") {
        return this.loadData()
          .then(() => {
            this.initTree();
            this.config.id = "290e690f-7485-48a0-879b-2055fddca904";
            this.loading = false;
            this.exportData("config", this.config);
            return Promise.resolve();
          })
          .catch((err: any) => {
            console.log(err);
            this.loading = false;
          });
      } else {
        this.loading = false;
        return Promise.resolve();
      }
    },
    // 仅在初始化时设置流程图，即从缓存中读取
    setChartIndex(chartIndex: string) {
      if (chartIndex !== "") {
        this.config.chartIndex = chartIndex;
      } else {
        return Promise.reject();
      }
    },
    // 删除流程图
    deleteChartIndex() {
      this.config.chartIndex = "";
      this.cleanUpSymbolAndPlugin();
      this.cleanUpData();
      this.cleanUpBg();
      return this.getPagesConfigListApi();
    },
    // 更换流程图
    changeChartIndex(chartIndex: string) {
      this.loading = true;
      this.queryPagesConfigApi().then((res: any) => {
        Object.assign(this.config, res.data.data.PageConfig.config);
        this.config.id = "290e690f-7485-48a0-879b-2055fddca904";
        this.exportData("config", this.config);
        this.loading = false;
        this.cleanUpSymbolAndPlugin();
        this.cleanUpData();
        // this.setSymbol(data.symbol);
        // this.setPlugin(data.plugin);
        this.setConfig(this.config);
      });
    },
    // 设置背景底图
    setBg(bg: string) {
      if (bg !== "") {
        this.config.layerConfig.layer1Config.bg = bg;
        return this.getBgSvgApi().then(() => {
          this.deviceRender();
          this.pluginRender();
          return Promise.resolve();
        });
      } else {
        console.log("背景未找到");
        return Promise.reject();
      }
    },
    // 设置属性attribute为config中的属性，调用会自动匹配进行赋值
    setConfigAttribute(attribute: string[], data: any) {
      let temp = "";
      attribute.forEach((item: string) => {
        temp += `['${item}']`;
      });
      try {
        eval(`this.config${temp} = ${data}`);
      } catch (err) {
        console.log(err);
      }
    },
    // 设置配置，主要是项目，流程图名称车站，子系统配置
    setConfig() {
      const config = this.config;
      if (config.project !== "" && config.chartIndex !== "") {
        return this.setStationAndSubsystem(config.station, config.subsystem)
          .then(() => {
            return this.setBg(config.layerConfig.layer1Config.bg);
          })
          .then(() => {
            this.initLayer();
          });
      } else {
        return Promise.reject();
      }
    },
    setSymbol(symbols: any) {
      const data = new Map();
      symbols.forEach((item: any) => {
        const temp: any = {
          symbol: new Map(),
          config: item[1].config,
        };
        this.symbol.set(item[0], temp);
        item[1].symbol.forEach((symbol: any) => {
          temp.symbol.set(symbol[0], symbol[1]);
        });
        data.set(item[0], {
          symbol: [...temp.symbol],
          config: temp.config,
        });
      });
      localStorage.setItem("symbol", JSON.stringify([...data]));
    },
    setPlugin(plugins: any) {
      // this.plugin = plugins;
      plugins.forEach((item: any) => {
        this.plugin.set(item[0], item[1]);
      });
      localStorage.setItem("plugin", JSON.stringify([...this.plugin]));
    },
    // 设置全局变量
    setGlobalVariable(key: string, value: any) {
      this.globalVariable[key] = value;
      this.exportData("globalVariable", { key, value });
    },
    // 设置焦点对象
    setFocusSymbol(focusSymbol: string[]) {},

    // 初始化
    init() {
      return this.initDB()
        .then(() => {
          return this.initDataByDB();
        })
        .then(() => {
          this.initTree();
          return this.getProjectListApi();
        })
        .then(() => {
          if (this.config.project) {
            return this.getPagesConfigListApi();
          } else {
            return Promise.resolve();
          }
        })
        .then(() => {
          this.exportData("globalVariable", { key: "show", value: true });
          return Promise.all([
            this.stationQueryApi(),
            this.subsystemQueryApi(),
          ]);
        })
        .then(() => {
          return this.setConfig();
        })
        .catch((error: any) => {
          console.log(error);
          this.loading = false;
        });
    },
    // 初始化indexedDB
    initDB() {
      return openDeviceDB("hmi", 1);
    },
    // 初始化背景层，组态层，标题层
    initLayer() {
      this.initLayer1();
      this.initLayer2();
      this.initLayer3();
      this.config.id = "290e690f-7485-48a0-879b-2055fddca904";
      this.exportData("config", this.config);
    },
    // 组态层
    initLayer1() {
      this.layer1Ele = (this.layerEle as any).querySelector("#layer1");
      // 主逻辑在configureWrap文件中，待优化
    },
    // 背景层
    initLayer2() {
      const layer2Ele = (this.layerEle as any).querySelector("#layer2");
      this.layer2Ele = layer2Ele;
      const config = this.config.layerConfig.layer2Config;
      if (layer2Ele) {
        this.symbolOriginalData.layerConfig.layer2Config.backgroundColor =
          layer2Ele.children[0].style.fill;
        if (config.backgroundColor && config.backgroundColor !== "") {
          try {
            layer2Ele.children[0].style.fill = config.backgroundColor;
          } catch (err) {
            console.log(err);
          }
        } else {
          config.backgroundColor =
            this.symbolOriginalData.layerConfig.layer2Config.backgroundColor;
        }
      }
    },
    // 标题层
    initLayer3() {
      const layer3Ele = (this.layerEle as any).querySelector("#layer3");
      this.layer3Ele = layer3Ele;
      const config = this.config.layerConfig.layer3Config;
      if (layer3Ele) {
        this.symbolOriginalData.layerConfig.layer3Config.fontSize =
          layer3Ele.children[0].style.fontSize;
        this.symbolOriginalData.layerConfig.layer3Config.title = layer3Ele
          .children[0].children[0]
          ? layer3Ele.children[0].children[0].innerHTML
          : layer3Ele.children[0].innerHTML;
        this.symbolOriginalData.layerConfig.layer3Config.fontColor =
          layer3Ele.children[0].style.fill;
        if (config.fontSize && config.fontSize !== "") {
          try {
            layer3Ele.children[0].style.fontSize = config.fontSize + "px";
          } catch (err) {
            console.log(err);
          }
        } else {
          config.fontSize =
            this.symbolOriginalData.layerConfig.layer3Config.fontSize;
        }
        if (config.title && config.title !== "") {
          layer3Ele.children[0].children[0]
            ? (layer3Ele.children[0].children[0].innerHTML = config.title)
            : (layer3Ele.children[0].innerHTML = config.title);
        } else {
          config.title = this.symbolOriginalData.layerConfig.layer3Config.title;
        }
        if (
          isNaN(parseFloat(config.transform.posX)) ||
          isNaN(parseFloat(config.transform.posY))
        ) {
        } else {
          const transform = getComputedStyle(layer3Ele).transform;
          let str = "";
          if (transform === "none") {
            str = `1, 0, 0, 1, ${config.transform.posX}, ${config.transform.posY}`;
          } else {
            const temp = transform.split("(")[1].split(")")[0].split(",");
            temp[4] = config.transform.posX;
            temp[5] = config.transform.posY;
            str = temp.join(",");
          }
          try {
            layer3Ele.setAttribute("transform", `matrix(${str})`);
          } catch (err) {
            console.log(err);
          }
        }
        if (config.fontColor && config.fontColor !== "") {
          try {
            layer3Ele.children[0].style.fill = config.fontColor;
          } catch (err) {
            console.log(err);
          }
        } else {
          config.fontColor =
            this.symbolOriginalData.layerConfig.layer3Config.fontColor;
        }
      }
    },

    // 打开项目
    openProjectApi() {
      const params = {
        name: this.config.project,
      };
      return openProject(params)
        .then((res: any) => {
          if (res.data.resultcode === 0) {
            ElMessage.success("打开项目成功！");
            this.config.id = "290e690f-7485-48a0-879b-2055fddca904";
            this.exportData("config", this.config);
            return this.getPagesConfigListApi();
          } else {
            return Promise.reject();
          }
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    },

    // 保存数据
    exportData(storeName: string, data: any) {
      if (!this.loading) {
        addData(storeName, data);
      }
    },
    // 获取表中所有数据
    getDataFromDB(storeName: string, key?: string) {
      return getDataByKey(storeName, key);
    },
    // 从表中获取数据
    initDataByDB() {
      const p1 = this.getDataFromDB("config").then((data: any) => {
        if (data[0]) {
          this.config = data[0];
        }
        return Promise.resolve(data[0]);
      });
      const p2 = this.getDataFromDB("device").then((data: any) => {
        if (data) {
          data.forEach((device: any) => {
            this.device.set(device.deviceId, device);
          });
          console.log(data);
        }
        return Promise.resolve(data);
      });
      const p3 = this.getDataFromDB("symbol").then((data: any) => {
        if (data) {
          data.forEach((symbol: any) => {
            this.symbol.set(symbol.symbolId, symbol);
          });
          console.log(data);
        }
        return Promise.resolve();
      });
      const p4 = this.getDataFromDB("plugin").then((data: any) => {
        if (data) {
          data.forEach((plugin: any) => {
            this.plugin.set(plugin.pluginId, plugin);
          });
        }
        return Promise.resolve();
      });
      return Promise.all([p1, p2, p3, p4]);
    },
    // 从表中删除数据
    deleteDataByDB(storeName: string, id: string) {
      deleteDB(storeName, id);
    },
    // 删除表中所有数据，跟上面分开来是怕误操作
    deleteStoreDataByDB(storeName: string) {
      deleteStoreData(storeName);
    },
  },
});
