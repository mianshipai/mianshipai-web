# Vue 原理

国内面试，大厂必考原理。

::: tip

1. 目标**不在**中大厂的同学，可以略过这一节。
2. 对 Vue 使用尚不熟练的同学，不要在此花费太多精力，先熟悉使用再说。

:::

## 什么是 MVVM

数据驱动视图

## 什么是 VDOM 它和 DOM 有什么关系

## 手写 VNode 对象，表示如下 DOM 节点

```html
<div class="container">
  <img src="x1.png" />
  <p>hello</p>
</div>
```

## Vue 组件初始化的各个阶段都做了什么？

## Vue 如何实现双向数据绑定？

## Vue 模板编译的过程

## Vue 响应式原理

`defineProperty` 和 `Proxy` ，两者比较

## 为何 v-for 需要使用 key

## Vue diff 算法的过程

使用最长递增子序列算法...

## Vue3 diff 算法做了哪些优化？

## Vue diff 算法和 React diff 算法的区别

## 简述 Vue 组件异步更新的过程

队列

## Vue 组件是如何渲染和更新的

## 如何实现 keep-alive 缓存机制

LRU

## 为何 ref 需要 value 属性
