# JS 基础知识

JS 是前端开发的核心能力，面试重点考察，无论工作经验长短。

## 了解哪些最新的 ES 新特性？

## `typeof` 能判断哪些类型

symbol bigInt

## `==` 和 `===` 有什么区别？

## 你熟悉哪些数组 API ？

## 值类型和引用类型的区别

```js
// 值类型
let a = 100
let b = a
a = 200
console.log(b) // 100
```

```js
// 引用类型
let a = { age: 20 }
let b = a
b.age = 21
console.log(a.age) // 21
```

## 箭头函数和普通函数的区别

## 什么时候不能使用箭头函数

## for...in 和 for...of 的区别

## JS 原型和原型链

## JS 继承有集中方式？

老旧的题目了，了解即可，现在都用 class extends 实现继承

## JS 作用域和作用域链

执行上下文

## JS 自由变量，如何理解

## JS 闭包，如何理解

## 同步和异步有什么区别？异步的意义是什么？

## JS Promise 有几种状态？如何变化

## JS Promise 使用

## async/await 使用

## JS 异步执行顺序

执行以下代码，会输出什么？

```js
async function async1() {
  console.log('async1')
  await async2()
  console.log('async1 end')
}
async function async2() {
  console.log('async2')
}
console.log('script start')
setTimeout(() => {
  console.log('setTimeOut')
}, 0)
async1()
new Promise((resolve) => {
  console.log('promise')
  resolve()
}).then(() => {
  console.log('promise2')
})
console.log('script end')
```

答案

::: details

```
script start
async1
async2
promise
script end
async1 end
promise2
setTimeOut
```

:::

## 宏任务和微任务的区别

## 描述 Event Loop 运行机制

## Set 和 Array 有什么区别

## Map 和 Object 有什么区别

## setTimeout requestAnimationFrame 和 requestIdleCallback 有什么区别

## 写一个验证 email 的正则表达式

参考答案

::: details

```js
const reg = /\w+((-\w+)|(\.\w+))*@[a-zA-Z0-9]+((\.|-)[a-zA-Z0-9]+)*\.[a-zA-Z0-9]+$/
reg.test(email)
```

:::

## JS 模块化规范有哪些？

## JS 如何捕获异常？有几种方式？

第三方 js ？？

## `0.1 + 0.2 === 0.3` 表达式返回什么？

## 如何理解 JS 单线程？

## 什么是 WebWorker 如何理解它

## JS 如何进行内存管理和垃圾回收？

## 如何检测 JS 内存泄漏？内存泄漏的场景有哪些？

## 如何理解 WebAssembly

## JS V8 Nodejs Deno Bun 这几个，他们是什么关系？
