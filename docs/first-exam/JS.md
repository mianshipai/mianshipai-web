# JS 基础知识

JS 是前端开发的核心能力，面试重点考察，无论工作经验长短。

## 了解哪些最新的 ES 新特性？

参考答案

::: details

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

:::

参考文档

::: details

- https://juejin.cn/post/7459351912133132351

:::

## `typeof` 能判断哪些类型

参考答案

::: details

| **类型**                | **返回值**    | **备注**                                               |
| ----------------------- | ------------- | ------------------------------------------------------ |
| **Undefined**           | `"undefined"` | 当变量未被定义或未赋值时，返回此值。                   |
| **Null**                | `"object"`    | 历史遗留问题，`null` 被错误地识别为对象。              |
| **Boolean**             | `"boolean"`   | 适用于 `true` 或 `false` 值。                          |
| **Number**              | `"number"`    | 适用于整数和浮点数（包括特殊值 `NaN` 和 `Infinity`）。 |
| **String**              | `"string"`    | 适用于字符串（例如 `"hello"`）。                       |
| **BigInt**              | `"bigint"`    | 适用于任意大的整数（例如 `10n`）。                     |
| **Symbol**              | `"symbol"`    | 适用于 `Symbol` 类型。                                 |
| **Function（classes）** | `"function"`  | 适用于可调用的对象（如函数和类定义）。                 |
| **其他对象**            | `"object"`    | 包括数组、普通对象、日期对象、正则表达式等非函数对象。 |

**注意：**

1. **`typeof null === "object"`**  
   在 JavaScript 最初的实现中，JavaScript 中的值是由一个表示类型的标签和实际数据值表示的。对象的类型标签是 0。由于 null 代表的是空指针（大多数平台下值为 0x00），因此，null 的类型标签是 0，typeof null 也因此返回 "object"

2. **实际使用**  
   对于更复杂的类型检测，可以使用工具函数，如 `Object.prototype.toString.call()` 或第三方库（如 `lodash`）。

```js
// 数值
typeof 37 === 'number'
typeof 3.14 === 'number'
typeof 42 === 'number'
typeof Math.LN2 === 'number'
typeof Infinity === 'number'
typeof NaN === 'number' // 尽管它是 "Not-A-Number" (非数值) 的缩写
typeof Number(1) === 'number' // Number 会尝试把参数解析成数值
typeof Number('shoe') === 'number' // 包括不能将类型强制转换为数字的值

typeof 42n === 'bigint'

// 字符串
typeof '' === 'string'
typeof 'bla' === 'string'
typeof `template literal` === 'string'
typeof '1' === 'string' // 注意内容为数字的字符串仍是字符串
typeof typeof 1 === 'string' // typeof 总是返回一个字符串
typeof String(1) === 'string' // String 将任意值转换为字符串，比 toString 更安全

// 布尔值
typeof true === 'boolean'
typeof false === 'boolean'
typeof Boolean(1) === 'boolean' // Boolean() 会基于参数是真值还是虚值进行转换
typeof !!1 === 'boolean' // 两次调用 !（逻辑非）运算符相当于 Boolean()

// Symbols
typeof Symbol() === 'symbol'
typeof Symbol('foo') === 'symbol'
typeof Symbol.iterator === 'symbol'

// Undefined
typeof undefined === 'undefined'
typeof declaredButUndefinedVariable === 'undefined'
typeof undeclaredVariable === 'undefined'

// 对象
typeof { a: 1 } === 'object'

// 使用 Array.isArray 或者 Object.prototype.toString.call
// 区分数组和普通对象
typeof [1, 2, 4] === 'object'

typeof new Date() === 'object'
typeof /regex/ === 'object'

// 下面的例子令人迷惑，非常危险，没有用处。避免使用它们。
typeof new Boolean(true) === 'object'
typeof new Number(1) === 'object'
typeof new String('abc') === 'object'

// 函数
typeof function () {} === 'function'
typeof class C {} === 'function'
typeof Math.sin === 'function'
```

:::

## `==` 和 `===` 有什么区别？

参考答案

::: details

- **`==`（宽松相等）**：会在比较两个操作数时执行 **类型转换**，尝试将两者转换为相同类型后再比较。
- **`===`（严格相等）**：不会执行类型转换，仅在类型和值完全相同的情况下返回 `true`。
- **推荐使用 `===`**：因为它更严格、更符合预期，能避免潜在的错误。尤其是在需要精确判断值和类型时。
- 实际工作中，使用 if (a == null) 可判断 a 是否是 null 或者 undefined。

**常见比较结果**

| **x**               | **y**               | **==** | **===** |
| ------------------- | ------------------- | ------ | ------- |
| `undefined`         | `undefined`         | ✅     | ✅      |
| `null`              | `null`              | ✅     | ✅      |
| `true`              | `true`              | ✅     | ✅      |
| `false`             | `false`             | ✅     | ✅      |
| `'foo'`             | `'foo'`             | ✅     | ✅      |
| `0`                 | `0`                 | ✅     | ✅      |
| `+0`                | `-0`                | ✅     | ✅      |
| `+0`                | `0`                 | ✅     | ✅      |
| `-0`                | `0`                 | ✅     | ✅      |
| `0n`                | `-0n`               | ✅     | ✅      |
| `0`                 | `false`             | ✅     | ❌      |
| `""`                | `false`             | ✅     | ❌      |
| `""`                | `0`                 | ✅     | ❌      |
| `'0'`               | `0`                 | ✅     | ❌      |
| `'17'`              | `17`                | ✅     | ❌      |
| `[1, 2]`            | `'1,2'`             | ✅     | ❌      |
| `new String('foo')` | `'foo'`             | ✅     | ❌      |
| `null`              | `undefined`         | ✅     | ❌      |
| `null`              | `false`             | ❌     | ❌      |
| `undefined`         | `false`             | ❌     | ❌      |
| `{ foo: 'bar' }`    | `{ foo: 'bar' }`    | ❌     | ❌      |
| `new String('foo')` | `new String('foo')` | ❌     | ❌      |
| `0`                 | `null`              | ❌     | ❌      |
| `0`                 | `NaN`               | ❌     | ❌      |
| `'foo'`             | `NaN`               | ❌     | ❌      |
| `NaN`               | `NaN`               | ❌     | ❌      |

说明：

- ✅ 表示比较结果为 `true`
- ❌ 表示比较结果为 `false`

:::

## 你熟悉哪些数组 API ？

参考答案

::: details

1. **创建数组**
   - `Array()`, `Array.of()`, `Array.from()`

```js
Array.of(1, 2, 3) // [1, 2, 3]
Array.from('123') // ['1', '2', '3']
```

2. **添加/删除元素**
   - `push()`: 在末尾添加
   - `pop()`: 删除末尾
   - `unshift()`: 在开头添加
   - `shift()`: 删除开头

```js
let arr = [1, 2]
arr.push(3) // [1, 2, 3]
arr.pop() // [1, 2]
arr.unshift(4) // [4, 1, 2]
arr.shift() // [1, 2]
```

3. **组合/拆分数组**
   - `concat()`: 合并数组，不影响原数组，浅拷贝
   - `join()`: 将数组连接为字符串
   - `slice()`: 截取部分数组（不修改原数组）

```js
;[1, 2]
  .concat([3, 4]) // [1, 2, 3, 4]
  [('a', 'b', 'c')].join('-') // 'a-b-c'
```

4. **替换/重组**
   - `splice()`: 添加、删除或替换元素

```js
let arr = [1, 2, 3]
arr.splice(1, 1, 'a') // [1, 'a', 3]
```

5. **查找单个元素**
   - `indexOf()`: 查找首次出现的索引
   - `lastIndexOf()`: 查找最后出现的索引
   - `find()`: 找到第一个满足条件的元素
   - `findIndex()`: 找到第一个满足条件的索引

```js
;[1, 2, 3]
  .indexOf(2) // 1
  [(1, 2, 3, 2)].lastIndexOf(2) // 3
  [(1, 2, 3)].find((x) => x > 2) // 3
```

6. **判断**
   - `includes()`: 判断是否包含某元素
   - `some()`: 判断是否至少有一个元素满足条件
   - `every()`: 判断是否所有元素满足条件

```js
;[1, 2, 3]
  .includes(2) // true
  [(1, 2, 3)].some((x) => x > 2) // true
  [(1, 2, 3)].every((x) => x > 0) // true
```

7. **迭代**
   - `forEach()`: 遍历元素，无法 break，可以用 try/catch 中 throw new Error 来停止

```js
;[1, 2, 3].forEach((item, index) => console.log(item, index))
```

8. **映射/变换**
   - `map()`: 对每个元素进行操作并生成新数组

```javascript
;[1, 2, 3].map((x) => x * 2) // [2, 4, 6]
```

9. **过滤**
   - `filter()`: 筛选出满足条件的元素

```js
;[1, 2, 3].filter((x) => x > 1) // [2, 3]
```

10. **规约**

- `reduce()`: 将数组缩减为单一值
- `reduceRight()`: 从右向左缩减

```js
;[1, 2, 3]
  .reduce((acc, val) => acc + val, 0) // 6
  [('a', 'b', 'c')].reduceRight((acc, val) => acc + val, '') // 'cba'
```

11. **排序**

- `sort()`: 对数组进行排序
- `reverse()`: 反转数组顺序

```js
;[3, 1, 2]
  .sort((a, b) => a - b) // [1, 2, 3]
  [(1, 2, 3)].reverse() // [3, 2, 1]
```

12. **填充**

- `fill()`: 用指定值填充数组

```js
new Array(3).fill(0) // [0, 0, 0]
```

13. **扁平化**

- `flat()`: 将多维数组展平成一维
- `flatMap()`: 映射并展平

```js
;[1, [2, [3]]]
  .flat(2) // [1, 2, 3]
  [(1, 2)].flatMap((x) => [x, x * 2]) // [1, 2, 2, 4]
```

14. **复制/填充**

- `copyWithin()`: 将数组的部分内容复制到其他位置

```js
;[1, 2, 3, 4].copyWithin(1, 2) // [1, 3, 4, 4]
```

15. **生成键值对**

- `keys()`, `values()`, `entries()`

```js
const arr = ['a', 'b', 'c']
[...arr.keys()] // [0, 1, 2]
[...arr.entries()] // [[0, 'a'], [1, 'b'], [2, 'c']]
```

16. **判断是否是数组**

- `Array.isArray()`

```js
Array.isArray([1, 2, 3]) // true
```

:::

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
