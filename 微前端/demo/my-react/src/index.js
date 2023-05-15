import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

function render(props = {}) {
  let { container } = props;
  ReactDOM.render(<App />,
    container ? container.querySelector('#root') : document.getElementById('root')
  );
}
if (!window.__POWERED_BY_QIANKUN__) {
  render();
}

export async function bootstrap() {

}

export async function mount(props) {
  render(props)
}

export async function unmount(props) {
  const { container } = props;
  ReactDOM.unmountComponentAtNode(container ? container.querySelector('#root') : document.getElementById('root'))
}

// qiankun 中处理样式 如何处理的 
//  默认情况下切换应用 他会采用动态样式表 加载的时候添加样式 删除的时候卸载样式 （子应用之间的样式隔离）

// 主应用和子应用 如何隔离  (我们可以通过BEM规范) -> (css-modules) 动态生成一个前缀 (并不是完全隔离)
// shadowDOM  video 标签中的 快进 放大功能 增加全局样式就会有问题