# 组合式API

    响应式 API：例如 ref() 和 reactive()，使我们可以直接创建响应式状态、计算属性和侦听器。
    生命周期钩子：例如 onMounted() 和 onUnmounted()，使我们可以在组件各个生命周期阶段添加逻辑。
    依赖注入：例如 provide() 和 inject()，使我们可以在使用响应式 API 时，利用 Vue 的依赖注入系统。

    mixin的缺陷
    1.不清晰的数据来源
    2.命名空间冲突
    3.隐式的跨mixin交流

# setup

    如果使用setup那么会将script中的内容直接作为render函数

# Teleport

    是一个内置组件，它可以将一个组件内部的一部分模板“传送”到该组件的 DOM 结构外层的位置去。
    官方示例
    <button @click="open = true">Open Modal</button>

    <Teleport to="body">
    <div v-if="open" class="modal">
        <p>Hello from the modal!</p>
        <button @click="open = false">Close</button>
    </div>
    </Teleport>

    <Teleport> 接收一个 to prop 来指定传送的目标。to 的值可以是一个 CSS 选择器字符串，也可以是一个 DOM 元素对象。这段代码的作用就是告诉 Vue“把以下模板片段传送到 body 标签下”。

# Fragments 片段

    在 3.x 中，组件可以包含多个根节点！但是，这要求开发者显式定义 attribute 应该分布在哪里。
    <template>
        <header>...</header>
        <main v-bind="$attrs">...</main>
        <footer>...</footer>
    </template>

# Emits 组件选项

# 来自 @vue/runtime-core 的 createRenderer API 用来创建自定义渲染函数

# 新增全局规则和针对插槽内容的规则

# Suspense

# 编译优化

    更高效的编译算法和数据结构
    静态提升：识别提取模板中的静态内容，在编译阶段提高到更高层级，组件初始化时，静态内容只需要被创建一次
    patch旗标：根据模板中的动态内容生成相应的patch旗标，告诉运行时哪部分需要更新，哪部分保持不变
    树形结构优化
    block tree：将模板中动态和静态部分分离开，更新时能更精确定位到需要更新的部分
    更高效的响应式系统：proxy
    按需编译
    更好的类型支持：ts