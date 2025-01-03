# JS 手写代码

程序员最重要的就是动手能力。

::: tip
面试时可以带着笔记本电脑，大部分情况可以使用电脑写代码。
:::

## 手写深拷贝

考虑循环引用

## 手写 getType 函数

获取详细的变量类型

## 手写 class 继承

### 题目描述

在某网页中，有三种菜单：button menu，select menu，modal menu。

他们的共同特点：

- 都有 `title` `icon` 属性
- 都有 `isDisabled` 方法（可直接返回 `false`）
- 都有 `exec` 方法，执行菜单的逻辑

他们的不同点：

- button menu，执行 `exec` 时打印 `'hello'`
- select menu，执行 `exec` 时返回一个数组 `['item1', 'item2', 'item3']`
- modal menu，执行 `exec` 时返回一个 DOM Element `<div>modal</div>`

请用 ES6 语法写出这三种菜单的 class

### 参考答案

::: details 代码显示/隐藏

```js
class BaseMenu {
  constructor(title, icon) {
    this.title = title
    this.icon = icon
  }
  isDisabled() {
    return false
  }
}

class ButtonMenu extends BaseMenu {
  constructor(title, icon) {
    super(title, icon)
  }
  exec() {
    console.log('hello')
  }
}

class SelectMenu extends BaseMenu {
  constructor(title, icon) {
    super(title, icon)
  }
  exec() {
    return ['item1', 'item2', 'item3']
  }
}

class ModalMenu extends BaseMenu {
  constructor(title, icon) {
    super(title, icon)
  }
  exec() {
    const div = document.createElement('div')
    div.innerText = 'modal'
    return div
  }
}
```

:::

## 手写防抖 Debounce

## 手写截流 Throttle

## 手写 bind

## 手写 call 和 apply

## 手写 EventBus 自定义事件

## 手写数组拍平 Array Flatten

## 手写解析 URL 参数为 JS 对象

## 手写数组去重

## 手写 Promise

## 手写 Promise.all

## 手写 Promise.race

## 手写 Promise.allSettled

## 手写一个 LazyMan 实现 sleep 机制

## 手写 curry 函数，实现函数柯里化

## 手写 compose 函数

## 手写一个 LRU 缓存

## 使用 Vue3 Composable 组合式函数，实现 useCount

```js
const { count } = useCount() // count 初始值是 0 ，每一秒 count 加 1
```

## 使用 Vue3 Composable 组合式函数，实现 useRequest

```js
const { loading, data, error } = useRequest(url) // 可只考虑 get 请求
```

## 使用 React Hook 实现 useCount

```js
// count 从 0 计数，每一秒 +1 （可使用 setInterval）
const { count } = useTimer()
```

## 使用 React Hook 实现 useRequest

```js
const { loading, data, error } = useRequest(url) // 可只考虑 get 请求
```

## 手写 VNode 对象，表示如下 DOM 节点

```html
<div class="container">
  <img src="x1.png" />
  <p>hello</p>
</div>
```
