# Nodejs 面试题

## 对 Node.js 的理解

参考答案

::: details
Node.js 是一个基于 Chrome V8 引擎的开源、跨平台的 JavaScript 运行时环境。它具有以下核心特点：

1. **运行环境**：让 JavaScript 可以在浏览器之外运行，使其成为一个服务器端的运行环境

2. **非阻塞 I/O**：

   - 采用非阻塞型 I/O 机制
   - 执行 I/O 操作时不会造成阻塞
   - 操作完成后通过事件通知执行回调函数
   - 例如：执行数据库操作时，不需要等待数据返回，而是继续执行后续代码，数据库返回结果后再通过回调函数处理

3. **事件驱动**：
   - 基于事件循环（Event Loop）
   - 新请求会被压入事件队列
   - 通过循环检测队列中的事件状态变化
   - 当检测到状态变化，执行对应的回调函数

:::

## Node.js 的优缺点

参考答案

::: details
**优点：**

1. 高并发处理能力强
2. 适合 I/O 密集型应用
3. 事件驱动非阻塞模式，程序执行效率高
4. 使用 JavaScript，前后端可以使用同一种语言
5. npm 生态系统非常强大

**缺点：**

1. 不适合 CPU 密集型应用
2. 单线程模式，无法充分利用多核 CPU
3. 可靠性相对较低，一旦出现未捕获的异常，整个程序可能崩溃
4. 回调函数嵌套多时可能产生回调地狱

:::

## Node.js 应用场景

参考答案

::: details
**最适合的场景：**

1. I/O 密集型应用
2. 实时交互应用
3. 高并发请求处理

**具体应用领域：**

1. **Web 应用系统**

   - 后台管理系统
   - 用户表单收集系统
   - 考试系统
   - 高并发 Web 应用

2. **实时通讯应用**

   - 在线聊天室
   - 实时通讯系统
   - 图文直播系统
   - WebSocket 应用

3. **接口服务**

   - RESTful API 服务
   - 数据库操作接口
   - 前端/移动端 API 服务

4. **工具类应用**

   - 构建工具（如 webpack）
   - 开发工具
   - 自动化脚本

5. **微服务**
   - 轻量级微服务
   - 中间层服务（BFF）

注意：虽然 Node.js 理论上可以开发各种应用，但在选择使用时应该考虑其是否适合特定场景，特别是需要避免在 CPU 密集型场景中使用。

:::

## Node.js 的全局对象有哪些？

参考答案

::: details

在 Node.js 中，全局对象与浏览器环境不同。浏览器中的全局对象是 `window`，而 Node.js 中的全局对象是 `global`。需要注意的是，在 Node.js 模块中使用 `var` 声明的变量并不会成为全局变量，它们只在当前模块生效。

Node.js 的全局对象可以分为两类：

1. 真正的全局对象
2. 模块级别的全局变量

**真正的全局对象**

1. **Buffer 类**

   - 用于处理二进制数据
   - 在 V8 堆外分配物理内存
   - 创建后大小固定，不可更改
   - 常用于文件操作、网络操作等场景

2. **process**

   - 提供当前 Node.js 进程信息
   - 常用属性和方法：
     - `process.env`：环境变量
     - `process.argv`：命令行参数
     - `process.cwd()`：当前工作目录
     - `process.pid`：进程 ID
     - `process.platform`：运行平台

3. **console**

   - `console.log()`：标准输出
   - `console.error()`：错误输出
   - `console.trace()`：打印调用栈
   - `console.time()/timeEnd()`：计时器
   - `console.clear()`：清空控制台

4. **定时器函数**

   - `setTimeout()/clearTimeout()`
   - `setInterval()/clearInterval()`
   - `setImmediate()/clearImmediate()`
   - `process.nextTick()`

5. **global**
   - 全局命名空间对象
   - 上述所有全局对象都是 `global` 的属性

**模块级别的全局变量**

这些变量虽然看起来是全局的，但实际上是每个模块独有的：

1. **\_\_dirname**

   - 当前模块的目录名
   - 绝对路径

   ```js
   console.log(__dirname) // 输出：/当前目录的绝对路径
   ```

2. **\_\_filename**

   - 当前模块的文件名
   - 包含绝对路径

   ```js
   console.log(__filename) // 输出：/当前文件的绝对路径/文件名
   ```

3. **exports**

   - 模块导出的快捷方式
   - `module.exports` 的引用

   ```js
   exports.myFunction = () => {}
   ```

4. **module**

   - 当前模块的引用
   - 包含模块的元数据

   ```js
   module.exports = {
     // 导出的内容
   }
   ```

5. **require**
   - 用于导入模块
   - 可导入的内容：
     - Node.js 核心模块
     - 第三方模块
     - 本地文件
   ```js
   const fs = require('fs')
   const myModule = require('./myModule')
   ```

**注意事项**

1. 模块级全局变量在 REPL（命令行交互）环境中不可用
2. `exports` 是 `module.exports` 的引用，不能直接赋值
3. Node.js 12 之后，还可以使用 `globalThis` 访问全局对象
4. 某些全局对象在特定版本可能有变化，使用时需注意 Node.js 版本兼容性

:::

## Node.js 事件循环机制

参考答案

::: details

事件循环是 Node.js 实现异步操作的核心机制，它允许 Node.js 执行非阻塞 I/O 操作。Node.js 是单线程的，但通过事件循环机制可以实现高并发。

**事件循环的六个阶段**

事件循环按照固定的顺序，循环执行以下六个阶段：

1. **timers（定时器阶段）**

   - 执行 `setTimeout` 和 `setInterval` 的回调
   - 检查是否有到期的定时器

2. **pending callbacks（待定回调阶段）**

   - 执行延迟到下一个循环迭代的 I/O 回调
   - 处理一些系统操作的回调（如 TCP 错误）

3. **idle, prepare（仅系统内部使用）**

   - 系统内部使用，不需要关注

4. **poll（轮询阶段）**

   - 检索新的 I/O 事件
   - 执行 I/O 相关的回调
   - 如果有必要会阻塞在这个阶段

5. **check（检查阶段）**

   - 执行 `setImmediate()` 的回调
   - 在 poll 阶段结束后立即执行

6. **close callbacks（关闭回调阶段）**
   - 执行关闭事件的回调
   - 如 `socket.on('close', ...)`

**微任务和宏任务**

在事件循环的每个阶段之间，会检查并执行微任务：

**微任务（Microtasks）：**

- `process.nextTick()`（优先级最高）
- `Promise.then/catch/finally`
- `queueMicrotask()`

**宏任务（Macrotasks）：**

- `setTimeout`
- `setInterval`
- `setImmediate`
- I/O 操作

**执行顺序示例**

```js
console.log('1: 同步代码')

setTimeout(() => {
  console.log('2: setTimeout')
}, 0)

Promise.resolve().then(() => {
  console.log('3: Promise')
})

process.nextTick(() => {
  console.log('4: nextTick')
})

setImmediate(() => {
  console.log('5: setImmediate')
})

// 输出顺序：
// 1: 同步代码
// 4: nextTick
// 3: Promise
// 2: setTimeout
// 5: setImmediate
```

**注意事项**

1. **process.nextTick 的特殊性**

   - 不属于事件循环的任何阶段
   - 在每个阶段结束时优先执行
   - 过度使用可能导致 I/O 饥饿

2. **定时器的精确性**

   - `setTimeout` 和 `setInterval` 的延时不能保证精确
   - 受进程繁忙程度影响

3. **setImmediate vs setTimeout(fn, 0)**

   - 主模块中执行顺序不确定
   - I/O 回调中 `setImmediate` 优先级更高

4. **异步错误处理**
   - 推荐使用 async/await 和 try/catch
   - 避免回调地狱

**最佳实践**

1. 避免在关键任务中依赖定时器的精确性
2. 合理使用 `process.nextTick`，避免阻塞事件循环
3. I/O 操作中优先使用 `setImmediate` 而不是 `setTimeout`
4. 使用 Promise 或 async/await 处理异步操作
5. 注意内存泄漏，及时清理不需要的事件监听器

:::

## Node.js 中的 process 对象

参考答案

::: details

process 是 Node.js 中的一个全局对象，它提供了当前 Node.js 进程的信息和控制能力。作为进程，它是计算机系统进行资源分配和调度的基本单位，具有以下特点：

- 每个进程都拥有独立的空间地址和数据栈
- 进程间数据隔离，需通过进程间通信机制实现数据共享
- Node.js 是单线程的，启动一个文件会创建一个主线程

**常用属性和方法**

1. 系统信息相关

- **process.env**：环境变量对象

  ```js
  console.log(process.env.NODE_ENV) // 获取环境变量
  ```

- **process.platform**：运行平台

  ```js
  console.log(process.platform) // 'darwin' for macOS
  ```

- **process.version**：Node.js 版本
  ```js
  console.log(process.version) // 'v16.x.x'
  ```

2. 进程信息相关

- **process.pid**：当前进程 ID
- **process.ppid**：父进程 ID
- **process.uptime()**：进程运行时间
- **process.title**：进程名称
  ```js
  console.log(process.pid) // 进程ID
  process.title = 'my-app' // 设置进程标题
  ```

3. 路径与命令行

- **process.cwd()**：当前工作目录

  ```js
  console.log(process.cwd()) // 返回当前工作目录的绝对路径
  ```

- **process.argv**：命令行参数
  ```js
  // node app.js --port 3000
  const args = process.argv.slice(2) // ['--port', '3000']
  ```

4. 事件循环相关

- **process.nextTick(callback)**：下一个事件循环触发回调
  ```js
  process.nextTick(() => {
    console.log('下一个事件循环执行')
  })
  ```

5. 标准流操作

- **process.stdout**：标准输出
- **process.stdin**：标准输入
- **process.stderr**：标准错误
  ```js
  process.stdout.write('Hello World\n')
  ```

6. 事件监听

- **进程异常处理**

  ```js
  process.on('uncaughtException', (err) => {
    console.error('未捕获的异常：', err)
  })
  ```

- **进程退出监听**
  ```js
  process.on('exit', (code) => {
    console.log(`进程退出码：${code}`)
  })
  ```

**使用注意事项**

1. **process.nextTick 与 setTimeout 的区别**

   - `process.nextTick` 在当前事件循环结束时执行
   - `setTimeout(fn, 0)` 在下一个事件循环开始时执行
   - `nextTick` 优先级更高

2. **环境变量的使用**

   ```js
   // 推荐使用
   const NODE_ENV = process.env.NODE_ENV || 'development'
   ```

3. **工作目录**

   - `process.cwd()` 返回 Node.js 进程执行时的工作目录
   - 与 `__dirname` 不同，`process.cwd()` 可能会随着工作目录的改变而改变

4. **异常处理**
   - 建议使用 `uncaughtException` 捕获未处理的异常
   - 但不建议用它来代替正常的错误处理流程

:::

## Express middleware(中间件) 工作原理

参考答案

::: details

中间件（Middleware）是 Express 的核心概念，它是一个函数，可以访问请求对象（req）、响应对象（res）和应用程序请求-响应周期中的下一个中间件函数（next）。

**工作流程**

1. **请求处理流程**

   - 请求从上到下依次经过中间件
   - 每个中间件可以对请求进行处理和修改
   - 通过 next() 将请求传递给下一个中间件
   - 如果不调用 next()，请求将终止

2. **基本结构**

```js
function middleware(req, res, next) {
  // 1. 处理请求
  // 2. 修改请求或响应对象
  // 3. 调用 next() 传递给下一个中间件
  next()
}
```

**中间件分类**

1. **应用级中间件**

```js
const app = express()

// 全局中间件
app.use((req, res, next) => {
  console.log('Time:', Date.now())
  next()
})

// 路由特定中间件
app.use('/user', (req, res, next) => {
  console.log('Request Type:', req.method)
  next()
})
```

2. **路由级中间件**

```js
const router = express.Router()

router.use((req, res, next) => {
  console.log('Router Specific Middleware')
  next()
})
```

3. **错误处理中间件**

```js
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})
```

**执行顺序示例**

```js
app.use((req, res, next) => {
  console.log('1. First Middleware')
  next()
})

app.use((req, res, next) => {
  console.log('2. Second Middleware')
  next()
})

app.get('/api', (req, res) => {
  console.log('3. Route Handler')
  res.send('Hello')
})

// 访问 /api 时的输出：
// 1. First Middleware
// 2. Second Middleware
// 3. Route Handler
```

**中间件特点**

1. **顺序重要性**

   - 中间件的注册顺序决定了执行顺序
   - 错误处理中间件应该放在最后

2. **功能独立性**

   - 每个中间件负责特定功能
   - 可以组合使用多个中间件

3. **请求响应周期**
   - 可以修改请求和响应对象
   - 可以终止请求-响应周期
   - 可以调用下一个中间件

**常见使用场景**

1. **请求日志记录**

```js
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`)
  next()
})
```

2. **身份验证**

```js
function authenticate(req, res, next) {
  if (req.headers.authorization) {
    next()
  } else {
    res.status(401).send('Unauthorized')
  }
}
```

3. **数据处理**

```js
app.use(express.json()) // 解析 JSON 请求体
app.use(express.urlencoded({ extended: true })) // 解析 URL 编码的请求体
```

**最佳实践**

1. **合理使用 next()**

   - 除非终止请求，否则总是调用 next()
   - 在异步操作中正确处理 next()

2. **错误处理**

   - 使用 try-catch 捕获同步错误
   - 使用 Promise 处理异步错误
   - 通过 next(error) 传递错误

3. **中间件设计**
   - 保持中间件功能单一
   - 适当使用路由级中间件
   - 避免中间件中的副作用

:::

## Koa 洋葱模型

参考答案

::: details

Koa 的中间件模型被称为`"洋葱模型"`，这是因为请求和响应像洋葱一样，需要经过多层"表皮"（中间件）的处理。这个过程是：

- 请求从外到内依次经过中间件的前置处理
- 到达最里层后
- 响应从内到外依次经过中间件的后置处理

**工作原理**

1. **执行流程**

```js
const Koa = require('koa')
const app = new Koa()

// 中间件1
app.use(async (ctx, next) => {
  console.log('1. 进入中间件1')
  await next()
  console.log('5. 离开中间件1')
})

// 中间件2
app.use(async (ctx, next) => {
  console.log('2. 进入中间件2')
  await next()
  console.log('4. 离开中间件2')
})

// 中间件3
app.use(async (ctx) => {
  console.log('3. 到达中间件3')
  ctx.body = 'Hello World'
})

// 输出顺序：
// 1. 进入中间件1
// 2. 进入中间件2
// 3. 到达中间件3
// 4. 离开中间件2
// 5. 离开中间件1
```

**特点说明**

1. **异步处理**

   - 通过 async/await 实现异步操作的同步写法
   - 每个中间件都可以等待下一个中间件执行完成

2. **双向流动**

   - 请求阶段：从外到内
   - 响应阶段：从内到外
   - 可以在响应阶段对数据进行再处理

3. **错误处理**

```js
app.use(async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    ctx.status = err.status || 500
    ctx.body = err.message
    ctx.app.emit('error', err, ctx)
  }
})
```

**实际应用示例**

1. **日志记录**

```js
app.use(async (ctx, next) => {
  const start = Date.now()
  await next()
  const ms = Date.now() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})
```

2. **响应处理**

```js
app.use(async (ctx, next) => {
  await next()
  // 响应阶段可以修改返回数据
  if (ctx.body) {
    ctx.body = {
      code: 0,
      data: ctx.body,
      message: 'success',
    }
  }
})
```

:::

## Koa 与 Express 的区别

参考答案

::: details

1. **中间件机制**

   - Express：单向流动，中间件通过 next() 线性执行，一旦响应结束就不能修改
   - Koa：洋葱模型，中间件既可以处理请求也可以处理响应，支持统一的错误处理

2. **异步处理**

   - Express：基于回调函数，容易陷入回调地狱，异步错误处理相对复杂
   - Koa：基于 Promise 和 async/await，代码更简洁，异步流程控制更直观

3. **上下文对象**

   - Express：req 和 res 是分离的对象，功能相对分散
   - Koa：ctx 统一上下文，封装了 request 和 response，API 设计更简洁优雅

4. **功能内置**

   - Express：内置了很多中间件，功能齐全，开箱即用
   - Koa：核心功能精简，需要通过第三方中间件扩展，更加灵活

5. **路由系统**

   - Express：内置了强大的路由系统，支持链式调用
   - Koa：路由需要通过第三方中间件实现（如 koa-router）

6. **社区生态**

   - Express：历史更悠久，社区更成熟，资源更丰富
   - Koa：较新但发展迅速，设计更现代，适合新项目

7. **错误处理**

   - Express：通过特殊的错误处理中间件，需要手动传递错误
   - Koa：通过 try/catch 优雅地处理错误，统一的错误处理更方便

8. **适用场景**
   - Express：适合快速开发，现有项目迁移，团队熟悉度高
   - Koa：适合追求优雅代码，需要更好的异步流程控制的场景

:::

> 未完待续...
