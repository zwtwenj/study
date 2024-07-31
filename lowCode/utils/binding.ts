import { store } from "@/store/configure";
// import { defineStore } from "pinia";
const configureStore = store();

const cbMap = new Map();
const fns: any = [];
cbMap.set("show", fns);

export function addVariable(key: string) {
  let value = configureStore.globalVariable[key];
  Object.defineProperty(configureStore.globalVariable, key, {
    get() {
      return value;
    },
    set(newValue) {
      console.log(newValue);
      value = newValue;
      const cbs = cbMap.get(key) || [];
      cbs.forEach((cb: any) => {
        cb(newValue);
      });
    },
  });
}

export function changeVariable(binding: any, key: any) {
  const variableKey = binding[key].variable;
  if (variableKey in configureStore.globalVariable) {
    const variableValue = binding[key].value;
    configureStore.globalVariable[variableKey] = variableValue;
  }
}

export function bindVariable(ele: any, symbol: any, binding: any, key: any) {
  const variableKey = binding[key].variable;
  if (variableKey in configureStore.globalVariable) {
    binding[key].value = configureStore.globalVariable[variableKey];
    const cbs = cbMap.get(variableKey);
    if (cbs) {
      cbs.push(function (value: any) {
        bindingConfig[key].cb(ele, symbol, value);
      });
    } else {
      cbMap.set(binding[key].variable, new Map());
    }
    addVariable(variableKey);
  }
}

const displayChange = (ele: any, symbol: any, value: any) => {
  ele.style.visibility = value ? "initial" : "hidden";
};

export const bindingConfig: any = {
  display: {
    text: "显示/隐藏",
    type: "boolean",
    cb: displayChange,
  },
};
