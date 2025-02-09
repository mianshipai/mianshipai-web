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
;[1, 2].concat([3, 4]) // [1, 2, 3, 4]
;['a', 'b', 'c'].join('-') // 'a-b-c'
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
;[1, 2, 3].indexOf(2) // 1
;[1, 2, 3, 2].lastIndexOf(2) // 3
;[1, 2, 3].find((x) => x > 2) // 3
```

6. **判断**
   - `includes()`: 判断是否包含某元素
   - `some()`: 判断是否至少有一个元素满足条件
   - `every()`: 判断是否所有元素满足条件

```js
;[1, 2, 3].includes(2) // true
;[1, 2, 3].some((x) => x > 2) // true
;[1, 2, 3].every((x) => x > 0) // true
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
;[1, 2, 3].reduce((acc, val) => acc + val, 0) // 6
;['a', 'b', 'c'].reduceRight((acc, val) => acc + val, '') // 'cba'
```

11. **排序**

- `sort()`: 对数组进行排序
- `reverse()`: 反转数组顺序

```js
;[3, 1, 2].sort((a, b) => a - b) // [1, 2, 3]
;[1, 2, 3].reverse() // [3, 2, 1]
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
;[1, [2, [3]]].flat(2) // [1, 2, 3]
;[1, 2].flatMap((x) => [x, x * 2]) // [1, 2, 2, 4]
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
;[...arr.keys()] // [0, 1, 2]
;[...arr.entries()] // [[0, 'a'], [1, 'b'], [2, 'c']]
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

参考答案

::: details

| 特性               | 值类型                                                                | 引用类型                                     |
| ------------------ | --------------------------------------------------------------------- | -------------------------------------------- |
| **存储内容**       | 数据值本身                                                            | 数据的引用（地址）                           |
| **存储位置**       | 栈内存                                                                | 栈存引用，堆存实际数据                       |
| **赋值方式**       | 拷贝值                                                                | 拷贝引用（地址）                             |
| **变量之间独立性** | 互相独立，互不影响                                                    | 指向同一数据，互相影响                       |
| **常见数据类型**   | 基本数据类型（如 `number，string，boolean，undefined，null，symbol`） | 复杂数据类型（如 `Object，Array，Function`） |

1. 为什么有值类型和引用类型？

- **值类型**适合存储简单、占用内存较小的数据，操作快速。
- **引用类型**适合存储复杂、占用内存较大的数据，支持动态扩展。

2. 如何避免引用类型的共享问题？

- 如果需要创建引用类型的副本，使用深拷贝，而非浅拷贝。

深拷贝例子：

```javascript
const obj1 = { name: 'Alice' }
const obj2 = JSON.parse(JSON.stringify(obj1)) // 创建深拷贝
obj2.name = 'Bob'
console.log(obj1.name) // "Alice"
```

浅拷贝例子：

```javascript
const obj1 = { name: 'Alice' }
const obj2 = { ...obj1 } // 浅拷贝
obj2.name = 'Bob'
console.log(obj1.name) // "Alice"
```

:::

## 箭头函数和普通函数的区别

参考答案

::: details

| 特性                       | 箭头函数                                       | 普通函数                              |
| -------------------------- | ---------------------------------------------- | ------------------------------------- |
| 语法                       | 简洁，使用 `=>` 定义                           | 使用 `function` 定义                  |
| `this` 绑定                | 词法绑定，继承外层 `this`                      | 动态绑定，调用时决定                  |
| `arguments` 对象           | 没有，需要使用 `...args`                       | 有自己的 `arguments` 对象             |
| 是否能作为构造函数         | 不能                                           | 可以                                  |
| 是否有 `prototype` 属性    | 没有                                           | 有                                    |
| 是否支持 `bind/call/apply` | 不支持                                         | 支持                                  |
| 适用场景                   | 用于回调函数、闭包、需要继承外层 `this` 的场景 | 需要动态绑定 `this`，或用作构造函数时 |

```js
// 箭头函数 this
const obj = {
  name: 'Alice',
  say: () => {
    console.log(this.name) // undefined (继承全局作用域的 this)
  },
}
obj.say()

// 普通函数 this
const obj = {
  name: 'Alice',
  say: function () {
    console.log(this.name) // "Alice" (this 指向 obj)
  },
}
obj.say()

// 箭头函数 不能作为构造函数
const Person = (name) => {
  this.name = name
}
const p = new Person('Alice') // TypeError: Person is not a constructor

// 普通函数 构造函数
function Person(name) {
  this.name = name
}
const p = new Person('Alice')
console.log(p.name) // "Alice"

// 箭头函数 ...args
const add = (...args) => {
  console.log(args) // [1, 2, 3]
}
add(1, 2, 3)

// 普通函数 arguments
function add() {
  console.log(arguments) // Arguments(3) [1, 2, 3]
}
add(1, 2, 3)

// 箭头函数 不支持 `bind/call/apply`
const obj = {
  value: 42,
}
const arrowFn = () => {
  console.log(this.value)
}
arrowFn.call(obj) // undefined

// 普通函数 支持 `bind/call/apply`
const obj = {
  value: 42,
}
function normalFn() {
  console.log(this.value)
}
normalFn.call(obj) // 42
```

:::

## 什么时候不能使用箭头函数

参考答案

::: details

1. 需要动态绑定 `this` 的场景。
2. 作为`构造函数`。
3. 需要 `arguments` 对象的场景。
4. 需要显式修改 `this` 的场景（使用 `bind/call/apply` 等）。
5. 类的实例方法（特别是 `getter 和 setter`）。—— 无法动态绑定 `this`

:::

## for...in 和 for...of 的区别

参考答案

::: details

| 特性               | `for...in`                   | `for...of`                              |
| ------------------ | ---------------------------- | --------------------------------------- |
| **用途**           | 遍历对象的 **可枚举属性**    | 遍历 **可迭代对象**（如数组、字符串等） |
| **返回值**         | 返回 **键**（属性名）        | 返回 **值**（元素值）                   |
| **适用范围**       | 对象、数组（不推荐用于数组） | 数组、字符串、Set、Map等可迭代对象      |
| **是否遍历原型链** | 会遍历原型链上的可枚举属性   | 不会遍历原型链                          |

```javascript
// for...in 遍历对象
const obj = { name: 'Alice', age: 25 }

for (let key in obj) {
  console.log(key) // 输出属性名：name, age
  console.log(obj[key]) // 输出属性值：Alice, 25
}

// for...in 遍历数组，不推荐
const arr = [10, 20, 30]

for (let index in arr) {
  console.log(index) // 输出索引：0, 1, 2
  console.log(arr[index]) // 输出值：10, 20, 30
}

// for...of 遍历数组
const arr = [10, 20, 30]

for (let value of arr) {
  console.log(value) // 输出值：10, 20, 30
}
```

:::

## JS 原型和原型链

参考答案

::: details

![proto](../imgs/proto.jpg)

**1. 原型（Prototype）**

- 每个 **函数**（构造函数）都有一个 `prototype` 属性，指向其 **原型对象**。
- 每个 **对象** 都有一个 `__proto__` 指向其构造函数的 `prototype`，形成继承关系。

**2. 原型链（Prototype Chain）**

- 访问对象属性时，先查找自身属性，找不到则沿 `__proto__` 逐级向上查找，直到 `null` 终止。
- `Object.prototype.__proto__ === null`，原型链的顶端是 `Object.prototype`。

```js
function Person(name) {
  this.name = name
}
Person.prototype.sayHello = function () {
  console.log('Hello!')
}

const p = new Person('Rain')
console.log(p.__proto__ === Person.prototype) // true
console.log(Person.prototype.__proto__ === Object.prototype) // true
console.log(Object.prototype.__proto__ === null) // true
```

:::

## JS 继承有几种方式？

参考答案

::: details

**1. 原型链继承**

**核心思路：** 让子类的 `prototype` 指向父类实例。

```js
function Parent() {
  this.name = 'Parent'
}
Parent.prototype.sayHello = function () {
  console.log('Hello from Parent')
}

function Child() {}
Child.prototype = new Parent() // 继承 Parent
Child.prototype.constructor = Child

const child = new Child()
console.log(child.name) // "Parent"
child.sayHello() // "Hello from Parent"
```

✅ **优点：** 父类方法可复用  
❌ **缺点：** 1. 共享引用类型属性（如 `arr = []` 会被多个实例共享），2. 无法向父类构造函数传参

**2. 借用构造函数继承**

**核心思路：** 在子类构造函数中使用 `call` 继承父类属性。

```js
function Parent(name) {
  this.name = name
}
function Child(name, age) {
  Parent.call(this, name) // 继承 Parent
  this.age = age
}
const child = new Child('Rain', 18)
console.log(child.name, child.age) // "Rain", 18
```

✅ **优点：** 1. 解决原型链继承共享问题，2. 可传参  
❌ **缺点：** 无法继承父类原型上的方法

**3. 组合继承（原型链 + 构造函数继承，最常用）**

**核心思路：** 结合前两种方式，**继承属性用构造函数，继承方法用原型链**。

```js
function Parent(name) {
  this.name = name
}
Parent.prototype.sayHello = function () {
  console.log('Hello from Parent')
}

function Child(name, age) {
  Parent.call(this, name) // 第 1 次调用 Parent
  this.age = age
}

Child.prototype = new Parent() // 第 2 次调用 Parent
Child.prototype.constructor = Child

const child = new Child('Rain', 18)
console.log(child.name, child.age) // "Rain", 18
child.sayHello() // "Hello from Parent"
```

✅ **优点：** 解决了前两种方法的缺陷  
❌ **缺点：** 调用两次 `Parent` 构造函数（一次 `call`，一次 `Object.create()`）

**4. Object.create() 继承（原型式继承）**

**核心思路：** 直接用 `Object.create()` 创建一个新对象，继承已有对象。

```js
const parent = {
  name: 'Parent',
  sayHello() {
    console.log('Hello!')
  },
}
const child = Object.create(parent)
child.age = 18
console.log(child.name, child.age) // "Parent", 18
child.sayHello() // "Hello!"
```

✅ **优点：** 适合创建对象而非类的继承  
❌ **缺点：** 不能传参，只适用于简单继承

**5. 寄生组合继承（优化版，推荐）**

**核心思路：** **组合继承的优化版本**，避免了 `Parent` 被调用两次的问题。

```js
function Parent(name) {
  this.name = name
}
Parent.prototype.sayHello = function () {
  console.log('Hello from Parent')
}

function Child(name, age) {
  Parent.call(this, name)
  this.age = age
}
Child.prototype = Object.create(Parent.prototype) // 关键优化
Child.prototype.constructor = Child

const child = new Child('Rain', 18)
console.log(child.name, child.age) // "Rain", 18
child.sayHello() // "Hello from Parent"
```

✅ **优点：** 1. 继承属性和方法，2. 只调用一次 `Parent`  
❌ **缺点：** 代码略微复杂

**6. ES6 class 继承（最现代化的方式）**

**核心思路：** `class` 语法糖，实际仍然基于原型继承。

```js
class Parent {
  constructor(name) {
    this.name = name
  }
  sayHello() {
    console.log('Hello from Parent')
  }
}

class Child extends Parent {
  constructor(name, age) {
    super(name) // 继承属性
    this.age = age
  }
}

const child = new Child('Rain', 18)
console.log(child.name, child.age) // "Rain", 18
child.sayHello() // "Hello from Parent"
```

✅ **优点：** 语法更清晰，易读易用  
❌ **缺点：** 本质仍是 `prototype` 继承

:::

## JS 作用域和作用域链

参考答案

::: details

- **作用域**：变量的可访问范围，分为 **全局作用域、函数作用域、块级作用域**。
- **作用域链**：变量查找机制，从当前作用域 **逐级向上查找**，直到全局作用域或 `ReferenceError`。
- **ES6 关键点**：
  - `let` / `const` **具有块级作用域**，避免 `var` 变量提升带来的问题。
  - **闭包** 利用作用域链，保留外部作用域的变量。

```js
var a = 'global'

function outer() {
  var b = 'outer'

  function inner() {
    var c = 'inner'
    console.log(a, b, c) // ✅ global outer inner
  }

  inner()
}

outer()
console.log(b) // ❌ ReferenceError: b is not defined
```

:::

## JS 自由变量，如何理解

参考答案

::: details
**自由变量** 指的是 **在当前作用域中未声明，但在上层作用域中找到的变量**。

在 JavaScript 中，当代码执行时，如果遇到一个变量：

- **当前作用域** 找不到该变量，就会沿着 **作用域链** 向上查找，直到找到该变量或报 `ReferenceError`。
- **这个在外层作用域中找到的变量，就是自由变量。**

```js
var a = 10 // 全局变量（自由变量）

function foo() {
  console.log(a) // 访问自由变量 a
}

foo() // 10
```

:::

## JS 闭包，如何理解

参考答案

::: details
**闭包的核心特性：**

1. 访问外部函数作用域的变量
2. 即使外部函数执行结束，变量依然被保留
3. 不会被垃圾回收，直到闭包不再被引用

**闭包的应用场景：**

1. 私有变量（模拟封装）

```js
function createCounter() {
  let count = 0 // 私有变量，外部无法直接访问
  return {
    increment: () => ++count,
    decrement: () => --count,
    getCount: () => count,
  }
}

const counter = createCounter()
console.log(counter.increment()) // 1
console.log(counter.increment()) // 2
console.log(counter.getCount()) // 2
console.log(counter.count) // undefined（外部无法直接访问）
```

2. 回调 & 事件监听

```js
function addEventLogger(eventName) {
  return function () {
    console.log(`Event ${eventName} triggered!`)
  }
}

document.addEventListener('click', addEventLogger('click'))
```

3. 定时器 & 异步操作

```js
function delayedGreeting(name) {
  setTimeout(() => {
    console.log(`Hello, ${name}!`)
  }, 2000)
}

delayedGreeting('Rain') // 2 秒后打印 "Hello, Rain!"
```

**闭包的缺点：**

1. 可能导致内存泄漏

- 闭包会持有外部变量的引用，导致变量无法被垃圾回收
- 解决方案：手动将变量置为 null 或谨慎管理作用域

2. 滥用闭包可能影响性能

- 每次调用都会创建新的作用域，影响垃圾回收机制
- 适度使用，避免不必要的闭包

:::

## 同步和异步有什么区别？异步的意义是什么？

参考答案

::: details
**同步**：任务按顺序执行，当前任务未完成时，后续代码必须等待，代码是**阻塞**的。  
**异步**：任务可以**不按顺序执行**，不会阻塞代码，后续代码可以继续执行，代码是**非阻塞**的。

| 特性         | **同步**                         | **异步**                     |
| ------------ | -------------------------------- | ---------------------------- |
| **执行方式** | 顺序执行，阻塞后续任务           | 非阻塞，任务可以并行执行     |
| **代码特点** | **阻塞**，必须等待上一个任务完成 | **非阻塞**，任务可以同时进行 |
| **适用场景** | 计算密集型、简单逻辑处理         | 网络请求、I/O 操作、高并发   |

```js
// 同步
console.log('任务 1')
alert('等待用户操作...')
console.log('任务 2') // 只有用户关闭 alert，任务 2 才能执行
```

```js
// 异步
console.log('任务 1')

setTimeout(() => {
  console.log('任务 2（延迟 2 秒）')
}, 2000)

console.log('任务 3') // 任务 3 不会等待 任务 2
// 任务 1
// 任务 3
// （2 秒后）
// 任务 2（延迟 2 秒）
```

**为什么要用异步？（异步的意义）**

1. 避免阻塞，提升用户体验

- 异步任务（如网络请求、文件读写）可以在后台执行，避免阻塞 UI，保证页面流畅。

2. 提升系统性能，支持高并发

- 服务器可以同时处理多个请求，提高吞吐量（如 Node.js 处理高并发）。

3. 更适合现代 Web 开发

- `Promise` / `async-await` 让异步代码更可读，配合 `fetch` 进行网络请求，提升开发效率。

:::

## JS Promise 有几种状态？如何变化

参考答案

::: details

**1. Promise 有几种状态？**

| 状态                    | 说明                          | 是否可变更  |
| ----------------------- | ----------------------------- | ----------- |
| **Pending（进行中）**   | 初始状态，异步操作未完成      | ✅ 可以变更 |
| **Fulfilled（已完成）** | 操作成功，返回 `resolve` 结果 | ❌ 变更结束 |
| **Rejected（已拒绝）**  | 操作失败，返回 `reject` 错误  | ❌ 变更结束 |

**2. Promise 状态如何变化？**

Promise 的状态**只会从 `Pending` → `Fulfilled` 或 `Pending` → `Rejected`**，且**一旦变化就不会再改变**（不可逆）。

```js
const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('成功')
    // reject("失败"); // 只会触发一次，状态不可逆
  }, 1000)
})

promise.then((result) => console.log('Fulfilled:', result)).catch((error) => console.log('Rejected:', error))
```

---

**3. 面试回答技巧**

> **Promise 有三种状态**：`Pending`（进行中）、`Fulfilled`（已完成）、`Rejected`（已拒绝）。  
> 状态只能从 `Pending` 变为 `Fulfilled` 或 `Rejected`，一旦改变**不可逆**。  
> `then()` 处理成功，`catch()` 处理失败，`finally()` 总会执行。  
> :::

## JS Promise 使用

参考答案

::: details
**1. 什么是 Promise？**

> **Promise 是 JavaScript 处理异步操作的一种方式**，用于解决回调地狱（Callback Hell）问题。  
> 它表示一个未来才会完成（或失败）的异步操作，并提供 `.then()`、`.catch()`、`.finally()` 方法进行处理。

**2. Promise 的基本用法**

**创建一个 Promise**

```js
const myPromise = new Promise((resolve, reject) => {
  setTimeout(() => {
    let success = true
    success ? resolve('操作成功') : reject('操作失败')
  }, 1000)
})
```

**使用 `then`、`catch` 处理结果**

```js
myPromise
  .then((result) => console.log('成功:', result)) // 处理成功
  .catch((error) => console.log('失败:', error)) // 处理失败
  .finally(() => console.log('操作结束')) // 无论成功或失败都会执行
```

**3. Promise 串行执行**

**多个异步操作依次执行（避免回调地狱）**

```js
function step1() {
  return new Promise((resolve) => setTimeout(() => resolve('Step 1 完成'), 1000))
}
function step2() {
  return new Promise((resolve) => setTimeout(() => resolve('Step 2 完成'), 1000))
}

step1()
  .then((result) => {
    console.log(result)
    return step2() // 返回 Promise
  })
  .then((result) => console.log(result))
  .catch((error) => console.error('错误:', error))
```

**4. Promise 并行执行**

**多个异步任务同时执行，全部完成后再处理**

```js
const p1 = new Promise((resolve) => setTimeout(() => resolve('任务 1'), 1000))
const p2 = new Promise((resolve) => setTimeout(() => resolve('任务 2'), 1500))

Promise.all([p1, p2])
  .then((results) => console.log('所有任务完成:', results))
  .catch((error) => console.error('任务失败:', error))
```

**如果只要最快完成的结果**

```js
Promise.race([p1, p2])
  .then((result) => console.log('最先完成的:', result))
  .catch((error) => console.error('失败:', error))
```

**5. 面试回答总结**

> **Promise 解决异步回调问题，提供 `.then()`、`.catch()`、`.finally()` 处理状态变化。支持 `Promise.all()` 并行执行，`Promise.race()` 竞争执行。用 `async/await` 可以让异步代码更清晰。**

:::

## async/await 使用

参考答案

::: details

async/await 是 ES2017（ES8）引入的 基于 Promise 的语法糖，用于更清晰地编写异步代码，使其看起来像同步代码，提高可读性。

- async 关键字：用于声明一个异步函数，返回值始终是 Promise。
- await 关键字：只能在 async 函数中使用，等待 Promise 解析（resolve）并返回结果，而不会阻塞线程。

```js
async function fetchData() {
  try {
    let response = await fetch('https://api.example.com/data')
    let data = await response.json()
    console.log(data)
  } catch (error) {
    console.error('Error:', error)
  }
}
fetchData()
```

:::

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
