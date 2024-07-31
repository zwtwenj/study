var defineConfig = {
  svgIp: "",
  bgIp: "",
};

var wrap = null;

window.hmi_init = function (config) {
  Object.assign(defineConfig, config);
};

var bg = null;
var config = null;
var device = null;
var symbol = null;
var svgUse = null;
var plugin = null;
let layer1Ele = null;
var inIframe = false;
var deviation = {
  deviationX: 0,
  deviationY: 0,
};
window.hmi_render = function (element, data) {
  console.log(data);
  wrap = element;
  config = data.config;
  device = data.device;
  symbol = data.symbol;
  svgUse = data.svgUse;
  plugin = data.plugin;
  bg = config.layerConfig.layer1Config.bg;
  inIframe = isInIframe();
  if (!bg || bg === "") {
    throw "bg is not found!";
  }
  if (!config) {
    throw "config is not found!";
  }
  var bgHtml = "";
  var svgHtmlList = [];
  Promise.all([getSymbol(svgUse), getBgSvg(bg)]).then((res) => {
    svgHtmlList = res[0];
    bgHtml = res[1];
    element.innerHTML = `<div class="symbolWrap" style="display: none">
                             ${svgHtmlList.join("")}
                          </div>
                          <div id="hmi_page_background">
                              ${bgHtml}
                          </div>`;
    layer1Ele = wrap.querySelector("#layer1");
    initLayer();
    var transform = getComputedStyle(layer1Ele).transform;
    var temp = transform.split("(")[1].split(")")[0].split(",");
    var translate = [parseFloat(temp[4]), parseFloat(temp[5])];
    deviation.deviationX = wrap.scrollLeft - translate[0];
    deviation.deviationY = wrap.scrollTop - translate[1];
    loading = true;
    renderDevice(device, symbol);
    renderPlugin(plugin);
    loading = false;
  });
};

// 获取背景
function getBgSvg(path) {
  var path = `${defineConfig.bgIp}/${path}`;
  return fetch(path)
    .then((res) => {
      if (res.ok) {
        return res.text();
      } else {
        Promise.reject("bg is not found");
      }
    })
    .catch((err) => {
      Promise.reject(err);
    });
}

// 获取设备图元
function getSymbol(svgUse) {
  var requests = [];
  svgUse.forEach((item) => {
    // var path = `${defineConfig.svgIp}/${item}`;
    var path = `${defineConfig.svgIp}${item}.svg`;
    requests.push(
      fetch(path)
        .then((res) => {
          if (res.ok) {
            return res.text();
          } else {
            console.log(`${item} is not found`);
            Promise.resolve();
          }
        })
        .catch((err) => {
          console.log(err);
          Promise.resolve();
        })
    );
  });
  return Promise.all(requests);
}

var loading = false;
// 设备实例
var deviceMap = new Map();
var symbolMap = new Map();
var symbolPointMap = new Map();
// 设备在svg中的元素（就是g标签）
var symboiElementMap = new Map();
// layer的元素(就是text和use标签)
var layerElementMap = new Map();
// 设备配置
var symbolsConfig = new Map();
// point属性劫持的回调
var pointCb = new Map();
// 渲染设备
function renderDevice(device, symbol) {
  console.log(device);
  symbol.forEach((item) => {
    symbolMap.set(item[0], item[1]);
  });
  device.forEach((item) => {
    deviceMap.set(item[0], item[1]);
    const { deviceId, symbols, config } = item[1];
    watchSymbolConfig(config, deviceId);
    pointCb.set(deviceId, new Map());
    symbols.forEach((symbolId) => {
      const symbol = symbolMap.get(symbolId);
      observer(symbol, [deviceId, symbolId]);
      if (layer1Ele) {
        const g = createSymbolEle([deviceId, symbolId], symbol);
        layer1Ele.appendChild(g);
      }
    });
  });
}

var pluginMap = new Map();
var pluginCb = new Map();
var pluginConfig = new Map();
var pluginElementMap = new Map();
function renderPlugin(data) {
  data.forEach((item) => {
    var pluginId = item[0];
    var pluginData = item[1];
    var pluginType = pluginData.name;
    pluginMap.set(pluginId, pluginData);
    if (layer1Ele) {
      observerPlugin(pluginData, pluginId);
      const g = createPluginEle(pluginId, pluginData, "");
      watchPluginConfig(pluginData, pluginId);
      layer1Ele.appendChild(g);
    }
  });
}

// 依赖收集
function observer(symbol, index) {
  var deviceId = index[0];
  symbol.layers.forEach((layer) => {
    var tip = layer.id.split("_").pop();
    // 说明这个layer是文本节点
    if (tip.indexOf("text") === 0) {
      layer.nodeType = "text";
    }
    var regex = /@\{([^}]+)\}/g;
    layer.params = [];
    let match = [];
    while ((match = regex.exec(layer.condition))) {
      var key = match[1];
      layer.params.push(key);
      let cb = [];
      var devicePointCb = pointCb.get(deviceId);
      if (!devicePointCb.get(key)) {
        devicePointCb.set(key, cb);
      }
      cb = devicePointCb.get(key);
      // 这里是params形参，实参是point
      cb.push(function (params) {
        var code = layer.condition.replace(/@\{([^}]*)\}/g, function (str) {
          var paramsKey = str.replace(/@\{([^}]*)\}/g, "$1");
          return params[paramsKey];
        });
        updateView(index, layer.id, code);
      });
    }
  });
}
var observerPlugin = (plugin, uuid) => {
  // data是形参，实参是plugin
  var cb = function (key) {
    let render = plugin.render;
    var pattern = new RegExp("{{([^]*?)}}", "g");
    render = render.replace(pattern, (match) => {
      var attribute = match.slice(2, match.length - 2);
      return plugin.data[attribute] || match;
    });
    var g = pluginElementMap.get(uuid);
    g.innerHTML = render;
  };
  pluginCb.set(uuid, cb);
};

// 配置页面的数据改变之后更新dom
function updateView(index, id, code) {
  var deviceId = index[0];
  var uuid = index[1];
  var ele = layerElementMap.get(deviceId).get(uuid).get(id);
  if (!ele) {
    return false;
  }
  if (ele.tagName === "text") {
    var temp = ele.querySelector("tspan");
    temp.innerHTML = code;
  } else {
    try {
      ele.style.visibility = eval(code) ? "visible" : "hidden";
    } catch {}
  }
}

// 生成设备g元素
// index图元的索引
// symbol设备的数据，会根据symbol的layer数据生成图元
function createSymbolEle(index, symbol) {
  var deviceId = index[0];
  var uuid = index[1];
  var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
  g.setAttribute("id", deviceId + "_" + uuid);
  g.style.cursor = "pointer";
  var layerTextArr = [];
  symbol.layers.forEach((layer) => {
    if (layer.nodeType === "text") {
      var text = document.querySelector(`#${layer.id}`).outerHTML;
      layerTextArr.push(text);
    } else {
      layerTextArr.push(`<use xlink:href=#${layer.id} id="${layer.id}"></use>`);
    }
  });
  // 字符串拼接统一渲染的话对比逐个createElement性能在元素很多的情况下要节省很多，而且createElement还要区分节点类型来创建
  // 索性统一创建完了再根据id来一一对应，所以两个很怪的foreach循环，但这样的话又多了一步取元素的操作
  // 如果能在innerHTML创建的同时取元素就好了，感觉还能优化
  g.innerHTML = layerTextArr.join("");
  var deviceLayerEleMap = new Map();
  symbol.layers.forEach((layer) => {
    deviceLayerEleMap.set(layer.id, g.querySelector(`#${layer.id}`));
  });
  var layerTempMap = layerElementMap.get(deviceId) || new Map();
  layerTempMap.set(uuid, deviceLayerEleMap);
  layerElementMap.set(deviceId, layerTempMap);
  var str = `translate(${symbol.transform.posX + deviation.deviationX}px, ${
    symbol.transform.posY + deviation.deviationY
  }px)rotateX(${symbol.transform.rotateX}deg)rotateY(${
    symbol.transform.rotateY
  }deg)rotateZ(${symbol.transform.rotateZ}deg)scale(${
    symbol.transform.sizeW
  }, ${symbol.transform.sizeH})`;
  g.style.transform = str;
  g.onclick = () => {
    useOnclick(index, symbol);
  };
  g.onmousedown = (e) => {
    onmousedown(index, e);
  };

  var symbolElementTempMap = symboiElementMap.get(deviceId) || new Map();
  symbolElementTempMap.set(uuid, g);
  symboiElementMap.set(deviceId, symbolElementTempMap);
  return g;
}
// 事件
var eventList = new Map();
window.hmi_event = function (message, cb) {
  var cbList = eventList.get(message);
  if (cbList) {
    cbList.push(cb);
  } else {
    var cbList = [cb];
    eventList.set(message, cbList);
  }
};
// 生成插件元素
function createPluginEle(uuid, plugin, rect) {
  var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
  g.setAttribute("id", uuid);
  g.style.cursor = "pointer";
  var pattern = new RegExp("{{([^]*?)}}", "g");
  let render = plugin.render;
  render = render.replace(pattern, (match) => {
    var attribute = match.slice(2, match.length - 2);
    return plugin.data[attribute] || match;
  });
  g.innerHTML = render;
  var str = `translate(${plugin.transform.posX + deviation.deviationX}px, ${
    plugin.transform.posY + deviation.deviationY
  }px)rotateX(${plugin.transform.rotateX}deg)rotateY(${
    plugin.transform.rotateY
  }deg)rotateZ(${plugin.transform.rotateZ}deg)scale(${
    plugin.transform.sizeW
  }, ${plugin.transform.sizeH})`;
  g.style.transform = str;
  plugin.event.forEach((item) => {
    g[item.trigger] = function () {
      try {
        if (item.use === "cb") {
          eval(item.cb);
        } else {
          var cbs = eventList.get(item.message) || [];
          cbs.forEach((cb) => {
            cb(plugin);
          });
        }
      } catch {}
    };
  });
  pluginElementMap.set(uuid, g);
  return g;
}

// 劫持设备的数据，数据变化就执行对应的回调函数
// point：点位数据
// deviceId：设备ID
function watchSymbolConfig(point, deviceId) {
  for (let key in point) {
    let value = point[key];
    Object.defineProperty(point, key, {
      get() {
        return value;
      },
      set(newValue) {
        value = newValue;
        var cbs = pointCb.get(deviceId).get(key) || [];
        cbs.forEach((cb) => {
          cb(point);
        });
      },
    });
  }
  symbolPointMap.set(deviceId, point);
}
function watchPluginConfig(plugin, uuid) {
  for (let key in plugin.data) {
    let value = plugin.data[key];
    Object.defineProperty(plugin.data, key, {
      get() {
        return value;
      },
      set(newValue) {
        value = newValue;
        var cb = pluginCb.get(uuid);
        if (cb) {
          cb(key);
        }
      },
    });
  }
}

// 修改配置
// deviceId设备ID
// key设备点位编码
// value设备点位的值
window.hmi_setDeviceConfig = function (deviceId, key, value) {
  if (deviceId === "plugin") {
    // pluginConfig.get("b74e7939-3cc9-4837-bc0c-6bde33943d13").text = "aiudqwd";
  } else {
    var config = symbolPointMap.get(deviceId);
    if (config[key] === undefined) {
      throw `${key} is undefined in ${deviceId}`;
    } else {
      config[key] = value;
    }
  }
};

// 图元点击事件
function useOnclick(index, symbol) {
  var event = symbol.event;
  event.forEach((e) => {
    if (e.use === "cb") {
    } else {
      var cbs = eventList.get(e.message) || [];
      cbs.forEach((cb) => {
        cb({ index, symbol });
      });
    }
  });
  return false;
  if (inIframe) {
    // window.parent.postMessage("deviceClick", deviceId);
  } else {
    // if (event.use === "cb") {
    // } else {
    //   event.forEach((e) => {
    //     var cbs = eventList.get(e.message) || [];
    //     cbs.forEach((cb) => {
    //       cb(symbol);
    //     });
    //   });
    // }
  }
}

function onmousedown(deviceId, e) {}

function initLayer() {
  initLayer1();
  initLayer2();
  initLayer3();
}
function initLayer1() {
  // var layer1Ele = wrap.querySelector("#layer1");
}
function initLayer2() {
  var layer2Ele = wrap.querySelector("#layer2");
  var layer2Config = config.layerConfig.layer2Config;
  if (layer2Ele) {
    if (layer2Config.backgroundColor && layer2Config.backgroundColor !== "") {
      try {
        layer2Ele.children[0].style.fill = layer2Config.backgroundColor;
      } catch {}
    }
  }
}
function initLayer3() {
  var layer3Ele = wrap.querySelector("#layer3");
  const layer3Config = config.layerConfig.layer3Config;
  if (layer3Ele) {
    if (layer3Config.fontSize && layer3Config.fontSize !== "") {
      try {
        layer3Ele.children[0].style.fontSize = layer3Config.fontSize + "px";
      } catch {}
    }
    if (layer3Config.title && layer3Config.title !== "") {
      layer3Ele.children[0].children[0].innerHTML = layer3Config.title;
    }
    if (
      isNaN(parseFloat(layer3Config.transform.posX)) ||
      isNaN(parseFloat(layer3Config.transform.posY))
    ) {
    } else {
      const transform = getComputedStyle(layer3Ele).transform;
      let str = "";
      if (transform === "none") {
        str = `1, 0, 0, 1, ${layer3Config.transform.posX}, ${layer3Config.transform.posY}`;
      } else {
        const temp = transform.split("(")[1].split(")")[0].split(",");
        temp[4] = layer3Config.transform.posX;
        temp[5] = layer3Config.transform.posY;
        str = temp.join(",");
      }
      try {
        layer3Ele.setAttribute("transform", `matrix(${str})`);
      } catch {}
    }
    if (layer3Config.fontColor && layer3Config.fontColor !== "") {
      try {
        layer3Ele.children[0].style.fill = layer3Config.fontColor;
      } catch {}
    }
  }
}

function isInIframe() {
  try {
    return window !== window.top;
  } catch (e) {
    return true;
  }
}
