'use strict';
import axios, { CanceledError } from 'axios';
import { getLocalStorage } from './storage';
import { ElMessage } from 'element-plus';

export const createAxios = function (baseURL: string, abort: boolean = false, obj?: any) {
  const signals: Record<string, AbortController | null> = {}; // 请求映射表，用于中断请求，处理竞态问题
  let config: any = {
    baseURL: baseURL,
    timeout: 10 * 1000 /* 能耗请求时间20多秒 */, // Timeout
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    ...obj,
  };

  const _axios = axios.create(config);

  _axios.interceptors.request.use(
    function (config) {
      const token = getLocalStorage('token');
      if (token) {
        config.headers['auth_token'] = token;
      }
      const controller = abort ? addAbortSignals(config, signals) : null;
      return {
        ...config,
        signal: controller?.signal,
      };
    },
    function (error) {
      return Promise.reject(error);
    },
  );

  _axios.interceptors.response.use(
    function (response) {
      if (response && response.config) {
        abort && removeAbortSignals(response.config, signals);
      }
      if (response.data?.result?.resultCode === '0') {
        return Promise.resolve(response.data.data);
      } else if (response.data?.result?.resultCode === '3') {
        ElMessage.error(response.data.result.resultError || 'Token失效，请重新登录！');
        // localStorage.removeItem('token');
        // router.push('/login');
        // 这里是否通过iframe传递出去重新登陆的消息
        return Promise.reject(response);
      } else if (response.data?.result?.resultCode === '1') {
        ElMessage.error(response.data.result.resultError || 'Token失效，请重新登录！');
        return Promise.reject(response);
      } else {
        if (response.status === 200) {
          return Promise.resolve(response.data);
        }
        return Promise.reject(response);
      }
    },
    function (error) {
      if (error instanceof CanceledError) {
        return Promise.reject('request canceled!');
      }
      const status = error.response.status;
      const statusText = error.response.statusText;
      if (status) {
        return Promise.reject(error);
      }
    },
  );
  return { signals, _axios };
};

const addAbortSignals = (config: any, signals: Record<string, AbortController | null>) => {
  const { method, url } = config;
  //  如果请求类型和请求地址都一样, 中断上次请求
  const oldSignal = signals[`${method}_${url}`];
  if (oldSignal) {
    oldSignal.abort();
  }
  // 添加新中止信号
  const controller = new AbortController();
  signals[`${method}_${url}`] = controller;
  return controller;
};

const removeAbortSignals = (config: any = {}, signals: Record<string, AbortController | null>) => {
  const { method = '', url = '' } = config || {};
  const key = `${method}_${url}`;
  signals[key] = null;
  delete signals[key];
};

export function formQuery(data: any) {
  let path = '';
  for (let key in data) {
    path = path + `&${key}=${data[key]}`;
  }
  path = '?' + path.slice(1);
  return path;
}
