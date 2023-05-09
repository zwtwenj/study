# render

## 切割解析

    vue2中vue-compile会对虚拟dom进行解析，比如：

    <div id="app">
        hello world{{msg}}
    </div>

    使用正则进行匹配切割（paserAST.js）

![img](./render1.png)

    最终组装成一个object对象

![img](./render2.png)

## 生成render函数字符串