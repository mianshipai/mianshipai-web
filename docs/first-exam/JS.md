# JS 基础知识

JS 是前端开发的核心能力，面试重点考察，无论工作经验长短。

## 了解哪些最新的 ES 新特性？

参考答案

::: details

我对 ECMAScript 的更新一直有关注（ES2015/ES6～ES2024/ES15，每年 6 月更新），并在项目中应用了许多新特性。简单说几个我熟悉且常用的新特性：

**特性 1: ES2024 的 JSON 模块**

支持直接通过 `import` 语法加载 JSON 文件，避免额外的文件读取逻辑。

```js
import config from './config.json' assert { type: 'json' }

console.log(config.setting) // 输出 JSON 文件中的指定属性
```

**特性 2: ES2023 的 Array.prototype.findLast & Array.prototype.findLastIndex**

两个数组新方法，用于从最后一个元素搜索数组元素。它们的功能与 `find() 和 findIndex()` 类似，但搜索从数组末尾开始。

这些方法可在 `Array 和 TypedArray` 原型上使用。此功能通过消除手动数组反转的过程，为逆序搜索提供了一种有效的方法。

```js
const isOdd = (number) => number % 2 === 1
const numbers = [1, 2, 3, 4, 5]

console.log(numbers.findLast(isOdd)) // 5
console.log(numbers.findLastIndex(isOdd)) // 4
```

**特性 3: ES2022 的类字段与私有方法**

支持类中的私有字段 `（#field）` 和私有方法，增强了封装性。

```js
class Counter {
  #count = 0

  increment() {
    this.#count++
  }

  #logCount() {
    console.log(this.#count)
  }
}

const counter = new Counter()
counter.increment()
// counter.#logCount(); // 报错，私有方法不可访问
```

**特性 4: ES2021 的逻辑赋值运算符**

新增 `&&=, ||=, ??=`，简化条件赋值逻辑。

```js
let user = { name: 'Alice', age: null }

user.name ||= 'Default Name' // 如果 name 为 falsy，则赋值
user.age ??= 18 // 如果 age 为 null 或 undefined，则赋值

console.log(user) // { name: 'Alice', age: 18 }
```

**特性 5: ES2020 的可选链和空值合并操作符**

简化深层嵌套对象属性的访问，并安全处理空值。

```js
const user = {
  profile: {
    details: { name: 'Alice' },
  },
}

const name = user.profile?.details?.name ?? 'Anonymous'
console.log(name) // 输出 'Alice'

const age = user.profile?.age ?? 18
console.log(age) // 输出 18
```

**特性 6: ES2019 的数组 flat 和 flatMap 方法**

flat 展开多层嵌套数组，flatMap 结合映射与扁平化操作。

```js
const nestedArray = [1, [2, [3, 4]], 5]
console.log(nestedArray.flat(2)) // [1, 2, 3, 4, 5]

const strings = ['hello', 'world']
console.log(strings.flatMap((str) => str.split('')))
// ['h', 'e', 'l', 'l', 'o', 'w', 'o', 'r', 'l', 'd']
```

其它......

:::

参考文档

::: details

- https://juejin.cn/spost/7459351912133132351

:::

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
