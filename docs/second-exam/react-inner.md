# React 原理

国内面试，大厂必考原理。

::: tip

1. 目标**不在**中大厂的同学，可以略过这一节。
2. 对 React 使用尚不熟练的同学，不要在此花费太多精力，先熟悉使用再说。

:::

## JSX 的本质是什么？

参考答案

::: details

**JSX（JavaScript XML）** 是一个 JavaScript 的语法扩展，允许在 JavaScript 代码中通过类 HTML 语法创建 React 元素。它需要通过 Babel 等工具编译为标准的 JavaScript 代码，最终生成 **React 元素对象**（React Element），这些元素共同构成虚拟 DOM（Virtual DOM）树。

**核心原理**

1. **JSX 编译为 React 元素**  
   JSX 会被转换为 `React.createElement()` 调用（或 React 17+ 的 `_jsx` 函数），生成描述 UI 结构的对象（React 元素），而非直接操作真实 DOM。

   ```jsx
   // JSX
   const element = <h1 className="title">Hello, world!</h1>

   // 编译后（React 17 之前）
   const element = React.createElement('h1', { className: 'title' }, 'Hello, world!')

   // 编译后（React 17+，自动引入 _jsx）
   import { jsx as _jsx } from 'react/jsx-runtime'
   const element = _jsx('h1', { className: 'title', children: 'Hello, world!' })
   ```

2. **虚拟 DOM 的运作**
   - React 元素组成虚拟 DOM 树，通过 Diff 算法对比新旧树差异，最终高效更新真实 DOM。
   - 虚拟 DOM 是内存中的轻量对象，避免频繁操作真实 DOM 的性能损耗。

**JSX 的核心特性**

1. **类 HTML 语法与 JavaScript 的融合**

   - **表达式嵌入**：通过 `{}` 嵌入 JavaScript 表达式（如变量、函数调用、三元运算符）：
     ```jsx
     const userName = 'Alice'
     const element = <p>Hello, {userName.toUpperCase()}</p>
     ```
   - **禁止语句**：`{}` 内不支持 `if`/`for` 等语句，需改用表达式（如三元运算符或逻辑与）：
     ```jsx
     <div>{isLoggedIn ? 'Welcome' : 'Please Login'}</div>
     ```

2. **语法规则**

   - **属性命名**：使用驼峰命名（如 `className` 代替 `class`，`htmlFor` 代替 `for`）。
   - **闭合标签**：所有标签必须显式闭合（如 `<img />`）。
   - **单一根元素**：JSX 必须有唯一根元素（或用 `<></>` 空标签包裹）。

3. **安全性**
   - **默认 XSS 防护**：JSX 自动转义嵌入内容中的特殊字符（如 `<` 转为 `&lt;`）。
   - **例外场景**：如需渲染原始 HTML，需显式使用 `dangerouslySetInnerHTML`（需谨慎）：
     ```jsx
     <div dangerouslySetInnerHTML={{ __html: userContent }} />
     ```

**编译与工具链**

1. **编译流程**  
   JSX 需通过 **Babel** 编译为浏览器可执行的 JavaScript。典型配置如下：

   ```json
   // .babelrc
   {
     "presets": ["@babel/preset-react"]
   }
   ```

2. **React 17+ 的优化**
   - 无需手动导入 React：编译器自动引入 `_jsx` 函数。
   - 更简洁的编译输出：减少代码体积，提升可读性。
     :::

## 如何理解 React Fiber 架构？

参考答案

::: details

1. **Fiber 架构的本质与设计目标**

Fiber 是 React 16+ 的**核心算法重写**，本质是**基于链表的增量式协调模型**。其核心目标并非单纯提升性能，而是重构架构以实现：

- **可中断的异步渲染**：将同步递归的调和过程拆解为可暂停/恢复的异步任务。
- **优先级调度**：高优先级任务（如用户输入）可打断低优先级任务（如数据更新）。
- **并发模式基础**：为 `Suspense`、`useTransition` 等特性提供底层支持。

2. **Fiber 节点的核心设计**

每个组件对应一个 **Fiber 节点**，构成**双向链表树结构**，包含以下关键信息：

- **组件类型**：函数组件、类组件或原生标签。
- **状态与副作用**：Hooks 状态（如 `useState`）、生命周期标记（如 `useEffect`）。
- **调度信息**：任务优先级（`lane` 模型）、到期时间（`expirationTime`）。
- **链表指针**：`child`（子节点）、`sibling`（兄弟节点）、`return`（父节点）。

```javascript
// Fiber 节点结构简化示例
const fiberNode = {
  tag: FunctionComponent, // 组件类型
  stateNode: ComponentFunc, // 组件实例或 DOM 节点
  memoizedState: {
    /* Hooks 链表 */
  },
  pendingProps: {
    /* 待处理 props */
  },
  lanes: Lanes.HighPriority, // 任务优先级
  child: nextFiber, // 子节点
  sibling: null, // 兄弟节点
  return: parentFiber, // 父节点
}
```

3. **Fiber 协调流程（两阶段提交）**

**阶段 1：Reconciliation（协调/渲染阶段）**

- **可中断的增量计算**：  
  React 将组件树遍历拆解为多个 **Fiber 工作单元**，通过循环（而非递归）逐个处理。
  - 每次循环执行一个 Fiber 节点，生成子 Fiber 并连接成树。
  - 通过 `requestIdleCallback`（或 Scheduler 包）在浏览器空闲时段执行，避免阻塞主线程。
- **对比策略**：  
  根据 `key` 和 `type` 复用节点，标记 `Placement`（新增）、`Update`（更新）、`Deletion`（删除）等副作用。

**阶段 2：Commit（提交阶段）**

- **不可中断的 DOM 更新**：  
  同步执行所有标记的副作用（如 DOM 操作、生命周期调用），确保 UI 一致性。
- **副作用分类**：
  - **BeforeMutation**：`getSnapshotBeforeUpdate`。
  - **Mutation**：DOM 插入/更新/删除。
  - **Layout**：`useLayoutEffect`、`componentDidMount`/`Update`。

4. **优先级调度机制**

React 通过 **Lane 模型** 管理任务优先级（共 31 个优先级车道）：

- **事件优先级**：
  ```javascript
  // 优先级从高到低
  ImmediatePriority（用户输入）
  UserBlockingPriority（悬停、点击）
  NormalPriority（数据请求）
  LowPriority（分析日志）
  IdlePriority（非必要任务）
  ```
- **调度策略**：
  - 高优先级任务可抢占低优先级任务的执行权。
  - 过期任务（如 Suspense 回退）会被强制同步执行。

5. **Fiber 架构的优势与局限性**

**优势**

- **流畅的用户体验**：异步渲染避免主线程阻塞，保障高优先级任务即时响应。
- **复杂场景优化**：支持大规模组件树的高效更新（如虚拟滚动、动画串联）。
- **未来特性基础**：为并发模式（Concurrent Mode）、离线渲染（SSR）提供底层支持。

**局限性**

- **学习成本高**：开发者需理解底层调度逻辑以优化性能。
- **内存开销**：Fiber 树的双向链表结构比传统虚拟 DOM 占用更多内存。

6. **与旧架构的关键差异**

| 特性           | Stack Reconciler（React 15-） | Fiber Reconciler（React 16+） |
| -------------- | ----------------------------- | ----------------------------- |
| **遍历方式**   | 递归（不可中断）              | 循环（可中断 + 恢复）         |
| **任务调度**   | 同步执行，阻塞主线程          | 异步分片，空闲时段执行        |
| **优先级控制** | 无                            | 基于 Lane 模型的优先级抢占    |
| **数据结构**   | 虚拟 DOM 树                   | Fiber 链表树（含调度信息）    |

:::

## Fiber 结构和普通 VNode 有什么区别？

参考答案

::: details

1. **本质差异**

| 维度         | 普通 VNode（虚拟 DOM）          | Fiber 结构                           |
| ------------ | ------------------------------- | ------------------------------------ |
| **设计目标** | 减少真实 DOM 操作，提升渲染性能 | 实现可中断的异步渲染 + 优先级调度    |
| **数据结构** | 树形结构（递归遍历）            | 双向链表树（循环遍历）               |
| **功能范畴** | 仅描述 UI 结构                  | 描述 UI 结构 + 调度任务 + 副作用管理 |

2. **数据结构对比**

**普通 VNode（React 15 及之前）**

```javascript
const vNode = {
  type: 'div', // 节点类型（组件/原生标签）
  props: { className: 'container' }, // 属性
  children: [vNode1, vNode2], // 子节点（树形结构）
  key: 'unique-id', // 优化 Diff 性能
  // 无状态、调度、副作用信息
}
```

- **核心字段**：仅包含 UI 描述相关属性（type、props、children）。

**Fiber 节点（React 16+）**

```javascript
const fiberNode = {
  tag: HostComponent, // 节点类型（函数组件/类组件/DOM元素）
  type: 'div', // 原生标签或组件构造函数
  key: 'unique-id', // Diff 优化标识
  stateNode: domNode, // 关联的真实 DOM 节点
  pendingProps: { className: 'container' }, // 待处理的 props
  memoizedProps: {}, // 已生效的 props
  memoizedState: {
    // Hooks 状态（函数组件）
    hooks: [state1, effectHook],
  },
  updateQueue: [], // 状态更新队列（类组件）
  lanes: Lanes.HighPriority, // 调度优先级（Lane 模型）
  child: childFiber, // 第一个子节点
  sibling: siblingFiber, // 下一个兄弟节点
  return: parentFiber, // 父节点（构成双向链表）
  effectTag: Placement, // 副作用标记（插入/更新/删除）
  nextEffect: nextEffectFiber, // 副作用链表指针
}
```

- **核心扩展**：
  - **调度控制**：`lanes` 优先级、任务到期时间。
  - **状态管理**：Hooks 链表（函数组件）、类组件状态队列。
  - **副作用追踪**：`effectTag` 标记和副作用链表。
  - **遍历结构**：`child`/`sibling`/`return` 构成双向链表。

3. **协调机制对比**

| 流程           | VNode（Stack Reconciler） | Fiber Reconciler              |
| -------------- | ------------------------- | ----------------------------- |
| **遍历方式**   | 递归遍历（不可中断）      | 循环遍历链表（可中断 + 恢复） |
| **任务调度**   | 同步执行，阻塞主线程      | 异步分片，空闲时间执行        |
| **优先级控制** | 无                        | Lane 模型（31 个优先级车道）  |
| **副作用处理** | 统一提交 DOM 更新         | 构建副作用链表，分阶段提交    |

- **Fiber 两阶段提交**：
  1. **协调阶段**（可中断）：
     - 增量构建 Fiber 树，标记副作用（`effectTag`）。
     - 通过 `requestIdleCallback` 或 Scheduler 包分片执行。
  2. **提交阶段**（同步不可中断）：
     - 遍历副作用链表，执行 DOM 操作和生命周期方法。

4. **能力扩展示例**

   **a. 支持 Hooks 状态管理**

- Fiber 节点通过 `memoizedState` 字段存储 Hooks 链表：

```javascript
// 函数组件的 Hooks 链表
fiberNode.memoizedState = {
  memoizedState: 'state value', // useState 的状态
  next: {
    // 下一个 Hook（如 useEffect）
    memoizedState: { cleanup: fn },
    next: null,
  },
}
```

- VNode 无状态管理能力，仅描述 UI。

**b. 优先级调度实战**

- **高优先级任务抢占**：
  ```javascript
  // 用户输入触发高优先级更新
  input.addEventListener('input', () => {
    React.startTransition(() => {
      setInputValue(e.target.value) // 低优先级
    })
    // 高优先级更新立即执行
  })
  ```
- VNode 架构无法实现任务中断和优先级插队。

**c. 副作用批处理**

- Fiber 通过 `effectList` 链表收集所有变更，统一提交：
  ```javascript
  // 提交阶段遍历 effectList
  let nextEffect = fiberRoot.firstEffect
  while (nextEffect) {
    commitWork(nextEffect)
    nextEffect = nextEffect.nextEffect
  }
  ```
- VNode 架构在 Diff 后直接操作 DOM，无批处理优化。

5. **性能影响对比**

| 场景                      | VNode 架构         | Fiber 架构                   |
| ------------------------- | ------------------ | ---------------------------- |
| **大型组件树渲染**        | 主线程阻塞导致掉帧 | 分片渲染，保持 UI 响应       |
| **高频更新（如动画）**    | 多次渲染合并困难   | 基于优先级合并或跳过中间状态 |
| **SSR 水合（Hydration）** | 全量同步处理       | 增量水合，优先交互部分       |

:::

## 简述 React diff 算法过程

参考答案

::: details

React Diff 算法通过 **分层对比策略** 和 **启发式规则** 减少树对比的时间复杂度（从 O(n³) 优化至 O(n)）。其核心流程如下：

**1. 分层对比策略**

React 仅对 **同一层级的兄弟节点** 进行对比，若节点跨层级移动（如从父节点 A 移动到父节点 B），则直接 **销毁并重建**，而非移动。  
**原因**：跨层操作在真实 DOM 中成本极高（需递归遍历子树），而实际开发中跨层移动场景极少，此策略以概率换性能。

**2. 节点类型比对规则**

**a. 元素类型不同**

若新旧节点类型不同（如 `<div>` → `<span>` 或 `ComponentA` → `ComponentB`），则：

1. 销毁旧节点及其子树。
2. 创建新节点及子树，并插入 DOM。

```jsx
// 旧树
<div>
  <ComponentA />
</div>

// 新树 → 直接替换
<span>
  <ComponentB />
</span>
```

**b. 元素类型相同**

若类型相同，则复用 DOM 节点并更新属性：

- **原生标签**：更新 `className`、`style` 等属性。
- **组件类型**：
  - 类组件：保留实例，触发 `componentWillReceiveProps` → `shouldComponentUpdate` 等生命周期。
  - 函数组件：重新执行函数，通过 Hooks 状态判断是否需更新。

```jsx
// 旧组件（保留实例并更新 props）
<Button className="old" onClick={handleClick} />

// 新组件 → 复用 DOM，更新 className 和 onClick
<Button className="new" onClick={newClick} />
```

**3. 列表节点的 Key 优化**

处理子节点列表时，React 依赖 **key** 进行最小化更新：

**a. 无 key 时的默认行为**

默认使用 **索引匹配**（index-based diff），可能导致性能问题：

```jsx
// 旧列表
;[<div>A</div>, <div>B</div>][
  // 新列表（首部插入）→ 索引对比导致 B 被误判更新
  ((<div>C</div>), (<div>A</div>), (<div>B</div>))
]
```

此时 React 会认为索引 0 从 A → C（更新），索引 1 从 B → A（更新），并新增索引 2 的 B，实际应仅插入 C。

**b. 使用 key 的优化匹配**

通过唯一 key 标识节点身份，React 可精准识别移动/新增/删除：

```jsx
// 正确使用 key（如数据 ID）
<ul>
  {items.map((item) => (
    <li key={item.id}>{item.text}</li>
  ))}
</ul>
```

**匹配规则**：

1. 遍历新列表，通过 key 查找旧节点：


    - 找到且类型相同 → 复用节点。
    - 未找到 → 新建节点。

2. 记录旧节点中未被复用的节点 → 执行删除。

**c. 节点移动优化**

若新旧列表节点仅顺序变化，React 通过 key 匹配后，仅执行 **DOM 移动操作**（非重建），例如：

```jsx
// 旧列表：A (key=1), B (key=2)
// 新列表：B (key=2), A (key=1)
// React 仅交换 DOM 顺序，而非销毁重建
```

**4. 性能边界策略**

- **子树跳过**：若父节点类型变化，其子节点即使未变化也会被整体销毁。
- **相同组件提前终止**：若组件 `shouldComponentUpdate` 返回 `false`，则跳过其子树 Diff。

:::

## 简述 React 和 Vue diff 算法的区别

参考答案

::: details

React 和 Vue 的 Diff 算法均基于虚拟 DOM，但在实现策略、优化手段和设计哲学上存在显著差异：

**1. 核心算法策略对比**

| **维度**     | **React**                     | **Vue 2/3**                          |
| ------------ | ----------------------------- | ------------------------------------ |
| **遍历方式** | 单向递归（同层顺序对比）      | 双端对比（头尾指针优化）             |
| **节点复用** | 类型相同则复用，否则销毁重建  | 类型相同则尝试复用，优先移动而非重建 |
| **静态优化** | 需手动优化（如 `React.memo`） | 编译阶段自动标记静态节点             |
| **更新粒度** | 组件级更新（默认）            | 组件级 + 块级（Vue3 Fragments）      |

**2. 列表 Diff 实现细节**

**a. React 的索引对比策略**

- **无 key 时**：按索引顺序对比，可能导致无效更新
  ```jsx
  // 旧列表：[A, B, C]
  // 新列表：[D, A, B, C]（插入头部）
  // React 对比结果：更新索引 0-3，性能低下
  ```
- **有 key 时**：通过 key 匹配节点，减少移动操作
  ```jsx
  // key 匹配后，仅插入 D，其他节点不更新
  ```

**b. Vue 的双端对比策略**

分四步优化对比效率（Vue2 核心逻辑，Vue3 优化为最长递增子序列）：

1. **头头对比**：新旧头指针节点相同则复用，指针后移
2. **尾尾对比**：新旧尾指针节点相同则复用，指针前移
3. **头尾交叉对比**：旧头 vs 新尾，旧尾 vs 新头
4. **中间乱序对比**：建立 key-index 映射表，复用可匹配节点

```js
// 旧列表：[A, B, C, D]
// 新列表：[D, A, B, C]
// Vue 通过步骤3头尾对比，仅移动 D 到头部
```

**3. 静态优化机制**

**a. Vue 的编译时优化**

- **静态节点标记**：  
  模板中的静态节点（无响应式绑定）会被编译为常量，跳过 Diff

  ```html
  <!-- 编译前 -->
  <div>Hello Vue</div>

  <!-- 编译后 -->
  _hoisted_1 = createVNode("div", null, "Hello Vue")
  ```

- **Block Tree（Vue3）**：  
  动态节点按区块（Block）组织，Diff 时仅对比动态部分

**b. React 的运行时优化**

- **手动控制更新**：  
  需通过 `React.memo`、`shouldComponentUpdate` 或 `useMemo` 避免无效渲染
  ```jsx
  const MemoComp = React.memo(() => <div>Static Content</div>)
  ```

**4. 响应式更新触发**

| **框架** | **机制**                   | **Diff 触发条件**                |
| -------- | -------------------------- | -------------------------------- |
| React    | 状态变化触发组件重新渲染   | 父组件渲染 → 子组件默认递归 Diff |
| Vue      | 响应式数据变更触发组件更新 | 依赖收集 → 仅受影响组件触发 Diff |

```javascript
// Vue：只有 data.value 变化才会触发更新
const vm = new Vue({ data: { value: 1 } })

// React：需显式调用 setState
const [value, setValue] = useState(1)
```

**5. 设计哲学差异**

| **维度**     | **React**                  | **Vue**                    |
| ------------ | -------------------------- | -------------------------- |
| **控制粒度** | 组件级控制（开发者主导）   | 细粒度依赖追踪（框架主导） |
| **优化方向** | 运行时优化（Fiber 调度）   | 编译时优化（模板静态分析） |
| **适用场景** | 大型动态应用（需精细控制） | 中小型应用（快速开发）     |

:::

## 为何 React JSX 循环需要使用 `key` ？

@雨夜 将于 2025.02.21 之前提交答案。

## React 事件和 DOM 事件有什么区别？

合成事件

@雨夜 将于 2025.02.21 之前提交答案。

## 简述 React batchUpdate 机制

@雨夜 将于 2025.02.21 之前提交答案。

## 简述 React 事务机制

@雨夜 将于 2025.02.21 之前提交答案。

## 如何理解 React concurrency 并发机制

@雨夜 将于 2025.02.21 之前提交答案。

## 简述 React reconciliation 协调的过程

## React 组件渲染和更新的全过程

## 为何 React Hooks 不能放在条件或循环之内？
