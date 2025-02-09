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

## 常见的 git 命令有哪些？

::: details

1. **克隆远程仓库**：每个开发者首先需要将远程仓库克隆到本地，以获取项目的最新代码。

   ```bash
   git clone <远程仓库URL>
   ```

2. **创建并切换到功能分支**：在主分支（如 `main` 或 `master`）上创建一个新的功能分支，以便在该分支上进行开发，避免直接在主分支上工作。

   ```bash
   git checkout -b feature-branch
   ```

3. **进行开发并提交更改**：在功能分支上进行开发，完成后将更改添加到暂存区并提交。

   ```bash
   git add .
   git commit -m "描述本次提交的内容"
   ```

4. **同步远程主分支的最新更改**：在推送之前，先拉取远程主分支的最新更改，以避免推送时发生冲突。

   ```bash
   git fetch origin main
   git merge origin/main
   ```

5. **推送功能分支到远程仓库**：将本地的功能分支推送到远程仓库，以便其他团队成员可以访问。

   ```bash
   git push origin feature-branch
   ```

6. **创建 Pull Request（PR）**：在 GitHub 等平台上，从功能分支向主分支发起 PR，请求将功能分支的更改合并到主分支。

7. **代码审查与合并**：团队成员对 PR 进行审查，提出修改建议或直接在网页上进行评论。审查通过后，项目管理员或有权限的成员将 PR 合并到主分支。

8. **删除已合并的功能分支（可选）**：为保持仓库整洁，合并后可考虑删除远程和本地的功能分支。

   ```bash
   git branch -d feature-branch
   git push origin --delete feature-branch
   ```

**注意事项**：

- **解决冲突**：在拉取远程主分支的更改时，可能会遇到冲突。此时，需要手动解决冲突，然后提交解决后的更改。

- **保持分支同步**：在开发过程中，定期从远程主分支拉取最新的更改，以保持本地分支的同步，减少合并时的冲突。

- **提交规范**：遵循统一的提交规范，如使用清晰的提交信息，方便团队成员理解每次提交的目的和内容。

:::

## 如何使用 git 多人协作开发？

根据项目的规模、性质和团队需求有不同的安排。

::: details

### 1. **小型项目**（例如：1-3 人的小型开发团队）

- **共享仓库模型**：大家都对同一个远程仓库进行操作。
- **策略**：
  - 可以直接使用 `master/main` 分支，所有成员都可以在此分支上工作，避免复杂的分支管理。
  - 每个开发者都在本地创建自己的功能分支进行开发，完成后合并回 `main` 或 `master`。
  - 提交时保持简洁，并且在每次 `push` 前与远程仓库同步（`git pull --rebase`）。
- **具体流程**：
  1.  `git clone` 克隆远程仓库。
  2.  `git checkout -b feature-branch` 创建并切换到自己的功能分支。
  3.  完成功能开发后，`git add .`、`git commit -m "Description"` 提交本地修改。
  4.  使用 `git pull --rebase` 更新远程仓库，解决冲突。
  5.  使用 `git push` 推送到远程仓库。
  6.  其他成员拉取最新的修改，确保项目同步。

### 2. **中型项目**（例如：3-10 人的团队）

- **基于分支的协作**：主分支用于发布，功能开发分支（feature branch）和修复分支（bugfix branch）被广泛使用。
- **策略**：
  - `main` 或 `master` 作为生产分支，稳定且可以随时部署。
  - 开发人员通过功能分支进行开发，提交合并请求（Pull Requests）前进行代码审查。
  - 通过 `develop` 分支进行日常开发，`feature` 分支从 `develop` 分支创建，开发完成后合并回 `develop`。
- **具体流程**：
  1.  `git clone` 克隆远程仓库。
  2.  切换到 `develop` 分支并保持更新（`git pull`）。
  3.  创建自己的功能分支 `git checkout -b feature-branch`。
  4.  开发完成后，将功能分支推送到远程 `git push origin feature-branch`。
  5.  创建 Pull Request (PR)，请求代码审查并合并到 `develop` 分支。
  6.  定期将 `develop` 分支合并回 `main` 或 `master` 分支进行发布。

### 3. **大型项目**（例如：10 人以上的团队）

- **Git Flow**：这是一个非常适合大团队协作的模型。通过多个分支策略进行管理，确保版本发布和功能开发的平稳过渡。
- **策略**：
  - `main` 或 `master` 用于发布稳定版本。
  - `develop` 分支用于日常开发，所有新功能都在此基础上开发。
  - 使用 `feature` 分支进行独立的功能开发。
  - 使用 `release` 分支准备发布版本，包含 Bug 修复和最后的稳定性验证。
  - `hotfix` 分支用于快速修复生产环境的 bug。
- **具体流程**：
  1.  `git clone` 克隆仓库，切换到 `develop` 分支。
  2.  创建并切换到新的功能分支 `git checkout -b feature/feature-name`。
  3.  在功能分支上开发，完成后推送并创建 PR 合并回 `develop` 分支。
  4.  在 `develop` 分支合并后，测试团队测试新的功能，确保没有问题。
  5.  若需发布新版本，从 `develop` 创建 `release` 分支，进行最后的 bug 修复和稳定性测试。
  6.  发布后将 `release` 分支合并到 `main` 和 `develop` 分支。
  7.  快速修复 bug 时，从 `main` 分支创建 `hotfix` 分支，修复后合并回 `main` 和 `develop`。

### 4. **开源项目**

- **Fork & Pull Request 模式**：开源项目通常采用这种模式，每个贡献者通过自己的 Fork 进行开发，并通过 Pull Request 提交贡献。
- **策略**：
  - 贡献者 Fork 项目仓库到自己的 GitHub（或其他平台）账户。
  - 在 Fork 的仓库中开发新的功能或修复 bug。
  - 完成开发后，创建 Pull Request 提交到原仓库进行审查。
  - 项目维护者负责合并经过审查的代码，确保项目稳定。
- **具体流程**：
  1.  `git fork` 仓库到自己的 GitHub 账户。
  2.  `git clone` 自己 Fork 后的仓库。
  3.  创建一个功能分支 `git checkout -b feature-name`。
  4.  在功能分支上进行开发，提交修改并推送到自己的 Fork 仓库。
  5.  提交 PR 请求合并到原仓库的 `main` 或 `develop` 分支。
  6.  原项目维护者审查代码，若通过则合并；如果有问题，贡献者根据反馈修改代码。

### 5. **闭源项目**

- **私有仓库**：闭源项目通常使用私有仓库进行管理，团队协作模式与开源项目类似，但可能不需要开放给外部贡献者。
- **策略**：
  - 仅限团队内部访问，所有成员都在相同的权限范围内操作。
  - 使用与中型项目类似的 Git Flow 或其他基于分支的工作流。
- **具体流程**：
  1.  创建私有仓库并初始化 `main` 或 `master` 分支。
  2.  开发人员从 `develop` 分支创建功能分支进行开发。
  3.  完成后提交 PR 进行代码审查。
  4.  审查通过后，合并回 `develop` 分支并准备发布。
  5.  发布前测试人员验证，发布后合并到 `main`。

### 总结

- **小型项目**：共享仓库模型，简单的开发流程。
- **中型项目**：功能分支管理，使用 `develop` 和 `feature` 分支。
- **大型项目**：Git Flow 模式，多分支管理，发布和修复分支分开。
- **开源项目**：Fork & Pull Request 模式，社区贡献，开放和审查。
- **闭源项目**：私有仓库，常用 Git Flow 或类似工作流，团队内部管理。

:::

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
