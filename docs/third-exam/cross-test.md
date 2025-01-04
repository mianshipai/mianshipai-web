# 交叉面试

二面结束以后，有可能会再找隔壁部门的高级/资深工程师交叉面试。交叉面试会综合考察候选人的技术能力。

::: tip
不一定所有面试都会有交叉面试，但这些面试题要刷一遍。
:::

## 求两个数组的交集和并集

给两个数组，求数组的交集和并集

```js
const arr1 = [1, 3, 4, 6, 7]
const arr2 = [2, 5, 3, 6, 1]

function getIntersection(arr1, arr2) {
  // 交集...
}

function getUnion(arr1, arr2) {
  // 并集...
}
```

参考答案

::: details

要点

- 交集，转换为 Set ，因为 Set has 比数组 includes 快很多（前者 O(1) 后者 O(n)）
- 并集，直接 add 即可，利用 Set 去重特性

代码

```js
const arr1 = [1, 3, 4, 6, 7]
const arr2 = [2, 5, 3, 6, 1]

// 交集
function getIntersection(arr1, arr2) {
  const res = new Set()
  const set2 = new Set(arr2)
  for (let item of arr1) {
    if (set2.has(item)) {
      // 注意，这里要用 Set has 方法，比数组的 includes 快很多
      res.add(item)
    }
  }
  return Array.from(res)
}

// 并集
function getUnion(arr1, arr2) {
  const res = new Set(arr1)
  for (let item of arr2) {
    res.add(item) // 利用 Set 自动去重的特性
  }
  return Array.from(res)
}

// 测试
console.log('交集', getIntersection(arr1, arr2))
console.log('并集', getUnion(arr1, arr2))
```

:::

## 数组转树，树转数组

## cookie localStorage sessionStorage 三者有什么区别，有什么应用场景？

## 前端会有哪些安全问题？该如何预防？

## 常见的 git 命令有哪些？如何使用 git 多人协作开发？

面向基础候选人

## 是否熟悉 Linux 系统，常见的 Linux 命令有哪些？

## 如何调试前端代码？

## 移动端 H5 如何抓包网络请求？

## 网页重绘 repaint 和重排 reflow 有什么区别

## 网页多标签页之间如何通讯？和 iframe 如何通讯？

## 什么是 axios 拦截器，能用来做什么？

## 是否熟悉 Performance API ，是否了解常见的性能指标？

FP FCP LCP 等

## sourcemap 有何作用，如何配置？

## 什么是 HTTPS 中间人攻击，如何预防

## 什么是 OOP ，面向对象三要素是什么？

## 前端常见的设计模式有哪些？以及应用场景

## 观察者模式和发布订阅模式的区别

## 后端返回 10w 条数据，前端该如何处理？

## 一个网页，一开始很流畅，越用越卡顿，你怎么办？

检查 JS 内存泄漏

## 一个 web 系统，加载很慢，交给你来优化，你会怎么办？

## 你知道哪些前端或 JS 工具链？它们分别什么作用？

webpack vite rollup babel SWC esbuild...
