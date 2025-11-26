# JS 手写代码

程序员最重要的就是动手能力。

::: tip
如有疑问，可免费 [加群](/docs/services/group.md) 讨论咨询，也可参与 [1v1 面试咨询服务](/docs/services/1v1.md)， 专业、系统、高效、全流程 准备前端面试
:::

## 手写深拷贝

考虑循环引用

::: details 参考答案

简单的深拷贝：

```js
function cloneDeep(source, hash = new WeakMap()) {
  if (!isObject(source)) return source
  if (hash.has(source)) return hash.get(source)

  var target = Array.isArray(source) ? [] : {}
  hash.set(source, target)

  for (var key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      if (isObject(source[key])) {
        target[key] = cloneDeep(source[key], hash)
      } else {
        target[key] = source[key]
      }
    }
  }
  return target
}
```

考虑更多比如爆栈的情况：

```js
function cloneDeep(x) {
  const root = {}

  const loopList = [
    {
      parent: root,
      key: undefined,
      data: x,
    },
  ]

  while (loopList.length) {
    const node = loopList.pop()
    const parent = node.parent
    const key = node.key
    const data = node.data

    let res = parent
    if (typeof key !== 'undefined') {
      res = parent[key] = {}
    }

    for (let k in data) {
      if (data.hasOwnProperty(k)) {
        if (typeof data[k] === 'object') {
          loopList.push({
            parent: res,
            key: k,
            data: data[k],
          })
        } else {
          res[k] = data[k]
        }
      }
    }
  }

  return root
}
```

参考阅读：

- [深拷贝的终极探索（99%的人都不知道）](https://segmentfault.com/a/1190000016672263)
  :::

## 手写 getType 函数

获取详细的变量类型

::: details 参考答案

```js
function getType(data) {
  // 获取到 "[object Type]"，其中 Type 是 Null、Undefined、Array、Function、Error、Boolean、Number、String、Date、RegExp 等。
  const originType = Object.prototype.toString.call(data)
  // 可以直接截取第8位和倒数第一位，这样就获得了 Null、Undefined、Array、Function、Error、Boolean、Number、String、Date、RegExp 等
  const type = originType.slice(8, -1)
  // 再转小写，得到 null、undefined、array、function 等
  return type.toLowerCase()
}
```

:::

## 手写 class 继承

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

::: details 参考答案

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

::: details 参考答案

```js
function debounce(func, wait, immediate) {
  var timeout, result

  var debounced = function () {
    var context = this
    var args = arguments

    if (timeout) clearTimeout(timeout)
    if (immediate) {
      // 如果已经执行过，不再执行
      var callNow = !timeout
      timeout = setTimeout(function () {
        timeout = null
      }, wait)
      if (callNow) result = func.apply(context, args)
    } else {
      timeout = setTimeout(function () {
        func.apply(context, args)
      }, wait)
    }
    return result
  }

  debounced.cancel = function () {
    clearTimeout(timeout)
    timeout = null
  }

  return debounced
}
```

参考阅读：

- [JavaScript 专题之跟着 underscore 学防抖](https://github.com/mqyqingfeng/Blog/issues/22)
  :::

## 手写截流 Throttle

::: details 参考答案

```js
function throttle(func, wait, options) {
  var timeout, context, args, result
  var previous = 0
  if (!options) options = {}

  var later = function () {
    previous = options.leading === false ? 0 : new Date().getTime()
    timeout = null
    func.apply(context, args)
    if (!timeout) context = args = null
  }

  var throttled = function () {
    var now = new Date().getTime()
    if (!previous && options.leading === false) previous = now
    var remaining = wait - (now - previous)
    context = this
    args = arguments
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      previous = now
      func.apply(context, args)
      if (!timeout) context = args = null
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining)
    }
  }
  throttled.cancel = function () {
    clearTimeout(timeout)
    previous = 0
    timeout = null
  }
  return throttled
}
```

参考阅读：

- [JavaScript专题之跟着 underscore 学节流](https://github.com/mqyqingfeng/Blog/issues/26)
  :::

## 手写 bind

::: details 参考答案

```js
Function.prototype.bind2 = function (context) {
  if (typeof this !== 'function') {
    throw new Error('Function.prototype.bind - what is trying to be bound is not callable')
  }

  var self = this
  var args = Array.prototype.slice.call(arguments, 1)

  var fNOP = function () {}

  var fBound = function () {
    var bindArgs = Array.prototype.slice.call(arguments)
    return self.apply(this instanceof fNOP ? this : context, args.concat(bindArgs))
  }

  fNOP.prototype = this.prototype
  fBound.prototype = new fNOP()
  return fBound
}
```

参考阅读：

- [JavaScript深入之bind的模拟实现](https://github.com/mqyqingfeng/Blog/issues/12)

:::

## 手写 call 和 apply

::: details 参考答案

```js
Function.prototype.call2 = function (context) {
  var context = context || window
  context.fn = this

  var args = []
  for (var i = 1, len = arguments.length; i < len; i++) {
    args.push('arguments[' + i + ']')
  }

  var result = eval('context.fn(' + args + ')')

  delete context.fn
  return result
}

Function.prototype.apply = function (context, arr) {
  var context = Object(context) || window
  context.fn = this

  var result
  if (!arr) {
    result = context.fn()
  } else {
    var args = []
    for (var i = 0, len = arr.length; i < len; i++) {
      args.push('arr[' + i + ']')
    }
    result = eval('context.fn(' + args + ')')
  }

  delete context.fn
  return result
}
```

参考阅读：

- [JavaScript深入之call和apply的模拟实现](https://github.com/mqyqingfeng/Blog/issues/11)

:::

## 手写 EventBus 自定义事件

::: details 参考答案

```js
class EventBus {
  constructor() {
    this.eventObj = {}
    this.callbackId = 0
  }

  $on(name, callback) {
    if (!this.eventObj[name]) {
      this.eventObj[name] = {}
    }
    const id = this.callbackId++
    this.eventObj[name][id] = callback
    return id
  }
  $emit(name, ...args) {
    const eventList = this.eventObj[name]
    for (const id in eventList) {
      eventList[id](...args)
      if (id.indexOf('D') !== -1) {
        delete eventList[id]
      }
    }
  }
  $off(name, id) {
    delete this.eventObj[name][id]
    if (!Object.keys(this.eventObj[name]).length) {
      delete this.eventObj[name]
    }
  }
  $once(name, callback) {
    if (!this.eventObj[name]) {
      this.eventObj[name] = {}
    }
    const id = 'D' + this.callbackId++
    this.eventObj[name][id] = callback
    return id
  }
}
```

参考阅读：

- [面试官：请手写一个EventBus，让我看看你的代码能力！](https://juejin.cn/post/7101481154565865486)
  :::

## 手写数组拍平 Array Flatten

::: details 参考答案

```js
function flatten(input, shallow, strict, output) {
  // 递归使用的时候会用到output
  output = output || []
  var idx = output.length

  for (var i = 0, len = input.length; i < len; i++) {
    var value = input[i]
    // 如果是数组，就进行处理
    if (Array.isArray(value)) {
      // 如果是只扁平一层，遍历该数组，依此填入 output
      if (shallow) {
        var j = 0,
          length = value.length
        while (j < length) output[idx++] = value[j++]
      }
      // 如果是全部扁平就递归，传入已经处理的 output，递归中接着处理 output
      else {
        flatten(value, shallow, strict, output)
        idx = output.length
      }
    }
    // 不是数组，根据 strict 的值判断是跳过不处理还是放入 output
    else if (!strict) {
      output[idx++] = value
    }
  }

  return output
}
```

参考阅读：

- [JavaScript专题之数组扁平化](https://github.com/mqyqingfeng/Blog/issues/36)
  :::

## 手写解析 URL 参数为 JS 对象

::: details 参考答案

```js
function parseParam(url) {
  const paramsStr = /.+\?(.+)$/.exec(url)[1] // 将 ? 后面的字符串取出来
  //exec() 方法用于检索字符串中的正则表达式的匹配。
  const paramsArr = paramsStr.split('&') // 将字符串以 & 分割后存到数组中
  let paramsObj = {}
  // 将 params 存到对象中
  paramsArr.forEach((param) => {
    if (/=/.test(param)) {
      // 处理有 value 的参数
      let [key, val] = param.split('=') // 分割 key 和 value
      val = decodeURIComponent(val) // 解码
      val = /^\d+$/.test(val) ? parseFloat(val) : val // 判断是否转为数字
      //test() 方法用于检测一个字符串是否匹配某个模式.
      if (paramsObj.hasOwnProperty(key)) {
        // 如果对象有 key，则添加一个值
        paramsObj[key] = [].concat(paramsObj[key], val)
        //concat() 方法用于连接两个或多个数组。
        //该方法不会改变现有的数组，而仅仅会返回被连接数组的一个副本。
      } else {
        // 如果对象没有这个 key，创建 key 并设置值
        paramsObj[key] = val
      }
    } else {
      // 处理没有 value 的参数
      paramsObj[param] = true
    }
  })

  return paramsObj
}
```

参考阅读：

- [解析 URL 参数为对象和字符串模板](https://juejin.cn/post/6950554221242499103)
  :::

## 手写数组去重

::: details 参考答案

```js
var unique = (a) => [...new Set(a)]
```

参考阅读：

- [JavaScript 专题之数组去重](https://github.com/mqyqingfeng/Blog/issues/27)
  :::

## 手写红绿灯

模拟一个红绿灯变化，红灯 1 秒，绿灯 1 秒，黄灯 1 秒，然后循环

::: details 参考答案

```js
function red() {
  console.log('red')
}

function green() {
  console.log('green')
}

function yellow() {
  console.log('yellow')
}

function light(cb, wait) {
  return new Promise((resolve) => {
    setTimeout(() => {
      cb()
      resolve()
    }, wait)
  })
}

function start() {
  return Promise.resolve()
    .then(() => {
      return light(red, 1000)
    })
    .then(() => {
      return light(green, 1000)
    })
    .then(() => {
      return light(yellow, 1000)
    })
    .finally(() => {
      return start()
    })
}

start()
```

:::

## 手写 Promise

::: details 参考答案

```js
class MyPromise {
  // 构造方法
  constructor(executor) {
    // 初始化值
    this.initValue()
    // 初始化this指向
    this.initBind()
    // 执行传进来的函数
    executor(this.resolve, this.reject)
  }

  initBind() {
    // 初始化this
    this.resolve = this.resolve.bind(this)
    this.reject = this.reject.bind(this)
  }

  initValue() {
    // 初始化值
    this.PromiseResult = null // 终值
    this.PromiseState = 'pending' // 状态
  }

  resolve(value) {
    // 如果执行resolve，状态变为fulfilled
    this.PromiseState = 'fulfilled'
    // 终值为传进来的值
    this.PromiseResult = value
  }

  reject(reason) {
    // 如果执行reject，状态变为rejected
    this.PromiseState = 'rejected'
    // 终值为传进来的reason
    this.PromiseResult = reason
  }
}
```

参考阅读：

- [看了就会，手写Promise原理，最通俗易懂的版本！！！](https://juejin.cn/post/6994594642280857630)
  :::

## 手写 Promise.all

::: details 参考答案

```js
static all(promises) {
  const result = []
  let count = 0
  return new MyPromise((resolve, reject) => {
    const addData = (index, value) => {
        result[index] = value
        count++
        if (count === promises.length) resolve(result)
    }
    promises.forEach((promise, index) => {
        if (promise instanceof MyPromise) {
            promise.then(res => {
                addData(index, res)
            }, err => reject(err))
        } else {
            addData(index, promise)
        }
    })
  })
}
```

参考阅读：

- [看了就会，手写Promise原理，最通俗易懂的版本！！！](https://juejin.cn/post/6994594642280857630)
  :::

## 手写 Promise.race

::: details 参考答案

```js
static race(promises) {
  return new MyPromise((resolve, reject) => {
    promises.forEach(promise => {
      if (promise instanceof MyPromise) {
          promise.then(res => {
              resolve(res)
          }, err => {
              reject(err)
          })
      } else {
          resolve(promise)
      }
    })
  })
}
```

参考阅读：

- [看了就会，手写Promise原理，最通俗易懂的版本！！！](https://juejin.cn/post/6994594642280857630)
  :::

## 手写 Promise.allSettled

::: details 参考答案

```js
static allSettled(promises) {
  return new Promise((resolve, reject) => {
    const res = []
    let count = 0
    const addData = (status, value, i) => {
      res[i] = {
          status,
          value
      }
      count++
      if (count === promises.length) {
          resolve(res)
      }
    }
    promises.forEach((promise, i) => {
      if (promise instanceof MyPromise) {
        promise.then(res => {
          addData('fulfilled', res, i)
        }, err => {
          addData('rejected', err, i)
        })
      } else {
        addData('fulfilled', promise, i)
      }
    })
  })
}
```

参考阅读：

- [看了就会，手写Promise原理，最通俗易懂的版本！！！](https://juejin.cn/post/6994594642280857630)
  :::

## 手写一个 LazyMan 实现 sleep 机制

```js
LazyMan('Tony').eat('breakfast').sleep(3).eat('lunch').sleep(1).eat('dinner')
// 输出:
// Hi I am Tony
// I am eating breakfast
// 等待3秒...
// I am eating lunch
// 等待1秒...
// I am eating dinner
```

::: details 参考答案

```js
class LazyMan {
  constructor(name) {
    this.name = name
    this.tasks = [] // 任务队列

    // 初始任务
    this.tasks.push(() => {
      console.log(`Hi I am ${name}`)
      return Promise.resolve()
    })

    // 使用 setTimeout 确保所有任务入队后再执行
    setTimeout(() => {
      this.runTasks()
    }, 0)
  }

  // 执行任务队列
  async runTasks() {
    for (const task of this.tasks) {
      await task()
    }
  }

  eat(food) {
    this.tasks.push(() => {
      console.log(`I am eating ${food}`)
      return Promise.resolve()
    })
    return this
  }

  sleep(seconds) {
    this.tasks.push(() => {
      console.log(`等待${seconds}秒...`)
      return new Promise((resolve) => {
        setTimeout(resolve, seconds * 1000)
      })
    })
    return this
  }
}

// 工厂函数，方便调用
function createLazyMan(name) {
  return new LazyMan(name)
}
```

:::

## 手写 curry 函数，实现函数柯里化

::: details 参考答案

1. 基础版本实现

```js
function curry(fn) {
  return function curried(...args) {
    // 如果传入的参数个数大于等于原函数的参数个数，直接执行
    if (args.length >= fn.length) {
      return fn.apply(this, args)
    }
    // 否则返回一个新函数，等待接收剩余参数
    return function (...args2) {
      return curried.apply(this, args.concat(args2))
    }
  }
}

// 使用示例
function add(a, b, c) {
  return a + b + c
}

const curriedAdd = curry(add)
console.log(curriedAdd(1)(2)(3)) // 6
console.log(curriedAdd(1, 2)(3)) // 6
console.log(curriedAdd(1)(2, 3)) // 6
```

2. 支持占位符的进阶版本

```js
function curry(fn, placeholder = '_') {
  const length = fn.length

  return function curried(...args) {
    // 检查是否所有参数都已经填充（不包含占位符）
    const checkFilled = (args) => {
      // 统计非占位符的参数个数
      const filledArgsCount = args.filter((arg) => arg !== placeholder).length
      return filledArgsCount >= length
    }

    // 合并新旧参数，处理占位符
    const mergeArgs = (existingArgs, newArgs) => {
      const result = [...existingArgs]
      let newArgsIndex = 0

      // 遍历现有参数，将占位符替换为新参数
      for (let i = 0; i < result.length && newArgsIndex < newArgs.length; i++) {
        if (result[i] === placeholder) {
          result[i] = newArgs[newArgsIndex++]
        }
      }

      // 将剩余的新参数添加到结果中
      return result.concat(newArgs.slice(newArgsIndex))
    }

    const mergedArgs = mergeArgs(args, [])

    // 如果参数已经足够，执行原函数
    if (checkFilled(mergedArgs)) {
      // 过滤掉占位符
      const finalArgs = mergedArgs.slice(0, length).filter((arg) => arg !== placeholder)
      return fn.apply(this, finalArgs)
    }

    // 否则继续返回柯里化函数
    return function (...nextArgs) {
      return curried.apply(this, mergeArgs(mergedArgs, nextArgs))
    }
  }
}

// 使用示例
const add = (a, b, c) => a + b + c
const curriedAdd = curry(add)
const _ = '_' // 占位符

console.log(curriedAdd(1)(2)(3)) // 6
console.log(curriedAdd(1, 2)(3)) // 6
console.log(curriedAdd(1)(_, 3)(2)) // 6
console.log(curriedAdd(_, 2)(1)(3)) // 6
console.log(curriedAdd(_, _, 3)(1)(2)) // 6
```

3. ES6 简化版本

```js
const curry = (fn, arity = fn.length) => {
  const curried = (...args) => (args.length >= arity ? fn(...args) : (...more) => curried(...args, ...more))
  return curried
}

// 使用示例
const sum = (a, b, c) => a + b + c
const curriedSum = curry(sum)

console.log(curriedSum(1)(2)(3)) // 6
console.log(curriedSum(1, 2)(3)) // 6
console.log(curriedSum(1)(2, 3)) // 6
```

:::

## 手写 compose 函数

::: details 参考答案

compose 函数是函数式编程中的一个重要概念，它将多个函数组合成一个函数，从右到左执行。

1. 基础实现（使用 reduce）

```js
function compose(...fns) {
  if (fns.length === 0) return (arg) => arg
  if (fns.length === 1) return fns[0]

  return fns.reduce(
    (a, b) =>
      (...args) =>
        a(b(...args))
  )
}

// 使用示例
const add1 = (x) => x + 1
const multiply2 = (x) => x * 2
const addThenMultiply = compose(multiply2, add1)
console.log(addThenMultiply(5)) // (5 + 1) * 2 = 12
```

2. 支持异步函数的实现

```js
async function composeAsync(...fns) {
  if (fns.length === 0) return (arg) => arg
  if (fns.length === 1) return fns[0]

  return fns.reduce((a, b) => async (...args) => {
    const result = await b(...args)
    return a(result)
  })
}

// 使用示例
const asyncAdd = async (x) => {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return x + 1
}
const asyncMultiply = async (x) => {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return x * 2
}

const asyncOperation = composeAsync(asyncMultiply, asyncAdd)
asyncOperation(5).then((result) => console.log(result)) // 12 (after 2 seconds)
```

3. 从左到右执行的 pipe 实现

```js
function pipe(...fns) {
  if (fns.length === 0) return (arg) => arg
  if (fns.length === 1) return fns[0]

  return fns.reduce(
    (a, b) =>
      (...args) =>
        b(a(...args))
  )
}

// 使用示例
const addOne = (x) => x + 1
const multiplyTwo = (x) => x * 2
const addThenMultiplyPipe = pipe(addOne, multiplyTwo)
console.log(addThenMultiplyPipe(5)) // (5 + 1) * 2 = 12
```

4. 带错误处理的实现

```js
function composeWithError(...fns) {
  if (fns.length === 0) return (arg) => arg
  if (fns.length === 1) return fns[0]

  return fns.reduce((a, b) => (...args) => {
    try {
      const result = b(...args)
      return a(result)
    } catch (error) {
      console.error('Error in compose:', error)
      throw error
    }
  })
}

// 使用示例
const divide = (x) => {
  if (x === 0) throw new Error('Cannot divide by zero')
  return 10 / x
}
const square = (x) => x * x

const divideAndSquare = composeWithError(square, divide)
console.log(divideAndSquare(2)) // (10 / 2)² = 25
try {
  divideAndSquare(0) // 抛出错误
} catch (e) {
  console.log('Caught error:', e.message)
}
```

使用场景示例：

1. **数据转换管道**：

```js
const toLowerCase = (str) => str.toLowerCase()
const removeSpaces = (str) => str.replace(/\s/g, '')
const addPrefix = (str) => `prefix_${str}`

const processString = compose(addPrefix, removeSpaces, toLowerCase)
console.log(processString('Hello World')) // 'prefix_helloworld'
```

2. **数学计算**：

```js
const double = (x) => x * 2
const addTen = (x) => x + 10
const square = (x) => x * x

const calculate = compose(square, addTen, double)
console.log(calculate(5)) // (5 * 2 + 10)² = 400
```

3. **数据处理链**：

```js
const filterEven = (arr) => arr.filter((x) => x % 2 === 0)
const multiplyAll = (arr) => arr.map((x) => x * 2)
const sum = (arr) => arr.reduce((a, b) => a + b, 0)

const processNumbers = compose(sum, multiplyAll, filterEven)
console.log(processNumbers([1, 2, 3, 4, 5, 6])) // 2*2 + 4*2 + 6*2 = 24
```

注意事项：

1. compose 函数从右到左执行，而 pipe 函数从左到右执行
2. 确保函数的输入输出类型匹配
3. 处理异步操作时需要使用 async/await 版本
4. 考虑错误处理机制
5. 函数组合应该保持纯函数的特性

compose 函数是函数式编程中的重要工具，它能够帮助我们构建更加模块化和可维护的代码。通过组合小的、单一功能的函数，我们可以构建出复杂的数据转换管道。

:::

## 手写一个 LRU 缓存

::: details 参考答案

LRU（Least Recently Used）是一种缓存淘汰策略，它会优先删除最近最少使用的数据。下面提供两种实现方式：使用 Map 的简单实现和不使用 Map 的基础实现。

1. 使用 Map 的实现

```js
class LRUCache {
  constructor(capacity) {
    this.cache = new Map()
    this.capacity = capacity
  }

  get(key) {
    if (!this.cache.has(key)) return -1

    // 将访问的元素移到最新使用的位置
    const value = this.cache.get(key)
    this.cache.delete(key)
    this.cache.set(key, value)
    return value
  }

  put(key, value) {
    // 如果 key 已存在，先删除
    if (this.cache.has(key)) {
      this.cache.delete(key)
    }
    // 如果达到容量限制，删除最久未使用的元素
    else if (this.cache.size >= this.capacity) {
      // Map 的 keys() 会按插入顺序返回键
      const firstKey = this.cache.keys().next().value
      this.cache.delete(firstKey)
    }

    this.cache.set(key, value)
  }
}

// 使用示例
const cache = new LRUCache(2)
cache.put(1, 1) // 缓存是 {1=1}
cache.put(2, 2) // 缓存是 {1=1, 2=2}
console.log(cache.get(1)) // 返回 1
cache.put(3, 3) // 删除 key 2，缓存是 {1=1, 3=3}
console.log(cache.get(2)) // 返回 -1 (未找到)
```

2. 使用双向链表的实现（不依赖 Map）

```js
// 双向链表节点
class Node {
  constructor(key, value) {
    this.key = key
    this.value = value
    this.prev = null
    this.next = null
  }
}

class LRUCache {
  constructor(capacity) {
    this.capacity = capacity
    this.cache = {} // 哈希表用于O(1)查找
    this.count = 0
    // 创建头尾哨兵节点
    this.head = new Node(0, 0)
    this.tail = new Node(0, 0)
    this.head.next = this.tail
    this.tail.prev = this.head
  }

  // 将节点移到双向链表头部
  moveToHead(node) {
    this.removeNode(node)
    this.addToHead(node)
  }

  // 从链表中删除节点
  removeNode(node) {
    node.prev.next = node.next
    node.next.prev = node.prev
  }

  // 在链表头部添加节点
  addToHead(node) {
    node.prev = this.head
    node.next = this.head.next
    this.head.next.prev = node
    this.head.next = node
  }

  // 删除链表尾部节点
  removeTail() {
    const node = this.tail.prev
    this.removeNode(node)
    return node
  }

  get(key) {
    if (key in this.cache) {
      const node = this.cache[key]
      this.moveToHead(node)
      return node.value
    }
    return -1
  }

  put(key, value) {
    if (key in this.cache) {
      // 如果 key 存在，更新值并移到头部
      const node = this.cache[key]
      node.value = value
      this.moveToHead(node)
    } else {
      // 创建新节点
      const newNode = new Node(key, value)
      this.cache[key] = newNode
      this.addToHead(newNode)
      this.count++

      // 如果超过容量，删除最久未使用的
      if (this.count > this.capacity) {
        const tail = this.removeTail()
        delete this.cache[tail.key]
        this.count--
      }
    }
  }
}

// 使用示例
const cache = new LRUCache(2)
cache.put(1, 1)
cache.put(2, 2)
console.log(cache.get(1)) // 返回 1
cache.put(3, 3) // 删除 key 2
console.log(cache.get(2)) // 返回 -1 (未找到)
cache.put(4, 4) // 删除 key 1
console.log(cache.get(1)) // 返回 -1 (未找到)
console.log(cache.get(3)) // 返回 3
console.log(cache.get(4)) // 返回 4
```

实现原理说明：

1. **Map 实现版本**：

   - 利用 Map 的特性，它能够记住键的原始插入顺序
   - get 操作时将访问的元素移到最后（最新使用）
   - put 操作时如果超出容量，删除第一个元素（最久未使用）

2. **双向链表实现版本**：
   - 使用哈希表实现 O(1) 的查找
   - 使用双向链表维护数据的使用顺序
   - 最近使用的数据放在链表头部
   - 最久未使用的数据在链表尾部

性能分析：

1. **时间复杂度**：

   - get 操作：O(1)
   - put 操作：O(1)

2. **空间复杂度**：
   - O(capacity)，其中 capacity 是缓存的容量

使用场景：

1. **浏览器缓存**：

```js
const browserCache = new LRUCache(100)
browserCache.put('url1', 'response1')
browserCache.put('url2', 'response2')
```

2. **内存缓存**：

```js
const memoryCache = new LRUCache(1000)
memoryCache.put('userId1', userDataObject1)
memoryCache.put('userId2', userDataObject2)
```

3. **数据库查询缓存**：

```js
const queryCache = new LRUCache(50)
function query(sql) {
  const cached = queryCache.get(sql)
  if (cached !== -1) return cached

  const result = executeQuery(sql)
  queryCache.put(sql, result)
  return result
}
```

:::

## 使用 Vue3 Composable 组合式函数，实现 useCount

```js
const { count } = useCount() // count 初始值是 0 ，每一秒 count 加 1
```

::: details 参考答案

```js
import { ref, onMounted, onUnmounted } from 'vue'

export function useCount() {
  const count = ref(0)
  let timer = null

  // 开始计数
  const startCount = () => {
    timer = setInterval(() => {
      count.value++
    }, 1000)
  }

  // 组件挂载时开始计数
  onMounted(() => {
    startCount()
  })

  // 组件卸载时清除定时器
  onUnmounted(() => {
    if (timer) {
      clearInterval(timer)
    }
  })

  return {
    count,
  }
}
```

:::

## 使用 Vue3 Composable 组合式函数，实现 useRequest

```js
const { loading, data, error } = useRequest(url) // 可只考虑 get 请求
```

::: details 参考答案

```js
import { ref } from 'vue'

export function useRequest(url) {
  const data = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const fetchData = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      data.value = await response.json()
    } catch (e) {
      error.value = e
    } finally {
      loading.value = false
    }
  }

  // 立即执行请求
  fetchData()

  return {
    data,
    loading,
    error,
  }
}
```

:::

## 使用 React Hook 实现 useCount

```js
// count 从 0 计数，每一秒 +1 （可使用 setInterval）
const { count } = useTimer()
```

::: details 参考答案

```js
import { useState, useEffect } from 'react'

function useTimer() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCount((prev) => prev + 1)
    }, 1000)

    // 清理函数，组件卸载时清除定时器
    return () => clearInterval(timer)
  }, [])

  return { count }
}

export default useTimer
```

:::

## 使用 React Hook 实现 useRequest

```js
const { loading, data, error } = useRequest(url) // 可只考虑 get 请求
```

::: details 参考答案

```js
import { useState, useEffect } from 'react'

function useRequest(url) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const result = await response.json()
        setData(result)
      } catch (e) {
        setError(e)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [url])

  return { data, loading, error }
}

export default useRequest
```

:::

## 手写 VNode 对象，表示如下 DOM 节点

```html
<div class="container">
  <img src="x1.png" />
  <p>hello</p>
</div>
```

::: details 参考答案

```js
const vnode = {
  tag: 'div',
  props: {
    class: 'container',
  },
  children: [
    {
      tag: 'img',
      props: {
        src: 'x1.png',
      },
    },
    {
      tag: 'p',
      props: {},
      children: ['hello'],
    },
  ],
}
```

:::
