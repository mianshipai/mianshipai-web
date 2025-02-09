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

## 数组转树

通常我们有一个包含父子关系的数组，目标是将其转化为树形结构。

示例数据：

```javascript
const arr = [
  { id: 1, parentId: null, name: 'Root' },
  { id: 2, parentId: 1, name: 'Child 1' },
  { id: 3, parentId: 1, name: 'Child 2' },
  { id: 4, parentId: 2, name: 'Grandchild 1' },
]
```

目标生成：

```javascript
const tree = [
  {
    id: 1,
    name: 'Root',
    children: [
      {
        id: 2,
        name: 'Child 1',
        children: [{ id: 4, name: 'Grandchild 1', children: [] }],
      },
      {
        id: 3,
        name: 'Child 2',
        children: [],
      },
    ],
  },
]
```

参考答案:

::: details

实现思路：

1. 遍历数组，将每个元素存储到一个以 `id` 为键的 Map 中。
2. 再次遍历数组，根据 `parentId` 将子节点挂载到父节点的 `children` 属性上。
3. 提取 `parentId` 为 `null` 的顶层节点作为树的根。

代码实现：

```javascript
function arrayToTree(arr) {
  const idMap = new Map()
  const result = []

  // 初始化 Map
  arr.forEach((item) => {
    idMap.set(item.id, { ...item, children: [] })
  })

  // 构建树
  arr.forEach((item) => {
    const parent = idMap.get(item.parentId)
    if (parent) {
      parent.children.push(idMap.get(item.id))
    } else {
      result.push(idMap.get(item.id))
    }
  })

  return result
}

console.log(JSON.stringify(arrayToTree(arr), null, 2))
```

注意点：

- 确保 `parentId` 为 `null` 的节点是根节点。
- 避免循环依赖：输入数据需要合法，否则会导致死循环。
  :::

## 树转数组

将树形结构扁平化为数组，保留原有的层级关系。

示例数据：

```javascript
const tree = [
  {
    id: 1,
    name: 'Root',
    children: [
      {
        id: 2,
        name: 'Child 1',
        children: [{ id: 4, name: 'Grandchild 1', children: [] }],
      },
      {
        id: 3,
        name: 'Child 2',
        children: [],
      },
    ],
  },
]
```

目标生成：

```javascript
const arr = [
  { id: 1, name: 'Root', parentId: null },
  { id: 2, name: 'Child 1', parentId: 1 },
  { id: 3, name: 'Child 2', parentId: 1 },
  { id: 4, name: 'Grandchild 1', parentId: 2 },
]
```

参考答案:

::: details

实现思路：

1. 使用递归遍历树。
2. 在每次递归中记录当前节点的 `parentId`。
3. 将节点及其子节点逐一添加到结果数组中。

代码实现：

```javascript
function treeToArray(tree, parentId = null) {
  const result = []

  tree.forEach((node) => {
    const { id, name, children } = node
    result.push({ id, name, parentId })
    if (children && children.length > 0) {
      result.push(...treeToArray(children, id))
    }
  })

  return result
}

console.log(JSON.stringify(treeToArray(tree), null, 2))
```

注意点：

- 递归中需避免重复引用。
- 树节点的 `children` 属性需要有效（可以为空数组但不能为 `undefined`）。

:::

## cookie localStorage sessionStorage 三者有什么区别，有什么应用场景？

参考答案：
:::details
区别：
| **特性** | **Cookie** | **LocalStorage** | **SessionStorage** |
|-------------------|-----------------------------|--------------------------|--------------------------|
| 写入方式 | 服务端和前端都可写入，不过http-only情况下只允许服务端写入 | 前端 | 前端 |
| 存储大小 | 4KB 左右 | 5~10MB | 5~10MB |
| 生命周期 | 手动设置，默认关闭浏览器失效 | 长期保留，直至用户手动清理缓存 | 当前会话，关闭页面清除 |
| 服务器交互 | **会**随请求发送到服务器 | 不会 | 不会 |
| 数据共享 | 同域下所有页面共享 | 同域下所有页面共享 | 当前页面及子页面共享 |

应用场景：

- **Cookie**：小数据量、需与服务器交互的场景，如保存会话标识（如 `token`）。
- **LocalStorage**：需持久化存储、跨页面共享的数据，如用户设置、主题偏好。
- **SessionStorage**：页面刷新或跳转时临时保存的数据，如表单填写进度。
  :::

## 前端会有哪些安全问题？该如何预防？

先从应用架构的角度来看，前端可以分为多个核心模块，每个模块都有可能成为攻击目标。

:::details

### 1. 用户界面与数据展示层

- **攻击风险**：跨站脚本攻击（XSS）、HTML注入、点击劫持
- **防御措施**：
  - 严格过滤和转义用户输入，防止恶意代码注入
  - 使用安全模板渲染，避免直接操作 DOM（例如避免使用 innerHTML）
  - 配置内容安全策略（CSP），限制脚本来源
  - 设置 X-Frame-Options 或 CSP 的 frame-ancestors 指令防止点击劫持

### 2. 业务逻辑层

- **攻击风险**：业务逻辑漏洞导致未授权访问或功能滥用
- **防御措施**：
  - 实现完善的权限校验和身份验证机制
  - 定期进行代码审查和安全测试，及时发现逻辑漏洞

### 3. 数据交互层

- **攻击风险**：跨站请求伪造（CSRF）、中间人攻击、数据窃取
- **防御措施**：
  - 使用 HTTPS 加密数据传输，防止数据在传输过程中被窃取或篡改
  - 在请求中加入 CSRF Token，并在服务器端验证请求合法性
  - 配置严格的 CORS 策略，确保 API 调用来源可信

### 4. 数据存储层

- **攻击风险**：本地存储数据泄露（LocalStorage、SessionStorage）、Cookie 劫持
- **防御措施**：
  - 避免在前端存储敏感信息，如必须存储应进行加密处理
  - 对 Cookie 设置 HttpOnly、Secure 等属性，降低被脚本读取的风险

### 5. 资源加载与依赖管理层

- **攻击风险**：第三方依赖库漏洞、供应链攻击、外部资源篡改
- **防御措施**：
  - 定期更新和审查第三方依赖，及时修补已知漏洞
  - 使用子资源完整性（SRI）校验机制，确保加载的外部资源未被篡改
  - 仅从可信源加载资源，杜绝未知或不受信任的代码注入

### 6. 构建与部署流程

- **攻击风险**：构建工具或 CI/CD 流程被攻击，导致恶意代码注入
- **防御措施**：
  - 加强构建环境安全管理，定期更新和审查构建工具及依赖
  - 采用代码签名、版本管理和自动化安全测试，确保发布版本的完整性和可追溯性
  - 将安全检测纳入 CI/CD 流程，实现自动化的安全漏洞扫描

综上所述，只有从整体应用架构的角度出发，针对各个模块的不同攻击面采取多层次防御措施，才能真正保障前端系统的安全性和稳定性。
:::

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
