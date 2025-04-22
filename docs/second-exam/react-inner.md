# React 原理

国内面试，大厂必考原理。

::: tip

1. 目标**不在**中大厂的同学，可以略过这一节。
2. 对 React 使用尚不熟练的同学，不要在此花费太多精力，先熟悉使用再说。

:::

::: tip
如有疑问，可免费 [加群](/docs/services/group.md) 讨论咨询，也可参与 [1v1 面试咨询服务](/docs/services/1v1.md)， 专业、系统、高效、全流程 准备前端面试
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

参考资料

::: details

- https://juejin.cn/post/7348651815759282226

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

## Fiber 结构和普通 VNode 区别

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

## React 和 Vue diff 算法的区别

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

## React JSX 循环为何使用 `key` ？

参考答案

::: details

1. **元素的高效识别与复用**

React 通过 `key` 唯一标识列表中的每个元素。当列表发生变化（增删改排序）时，React 会通过 `key` 快速判断：

- **哪些元素是新增的**（需要创建新 DOM 节点）
- **哪些元素是移除的**（需要销毁旧 DOM 节点）
- **哪些元素是移动的**（直接复用现有 DOM 节点，仅调整顺序）

如果没有 `key`，React 会默认使用数组索引（`index`）作为标识，这在动态列表中会导致 **性能下降** 或 **状态错误**。

2. **避免状态混乱**

如果列表项是 **有状态的组件**（比如输入框、勾选框等），错误的 `key` 会导致状态与错误的内容绑定。例如：

```jsx
// 如果初始列表是 [A, B]，用索引 index 作为 key：
<ul>
  {items.map((item, index) => (
    <li key={index}>{item}</li>
  ))}
</ul>

// 在头部插入新元素变为 [C, A, B] 时：
// React 会认为 key=0 → C（重新创建）
// key=1 → A（复用原 key=0 的 DOM，但状态可能残留）
// 此时，原本属于 A 的输入框状态可能会错误地出现在 C 中。
```

3. **提升渲染性能**

通过唯一且稳定的 `key`（如数据 ID），React 可以精准判断如何复用 DOM 节点。如果使用随机数或索引，每次渲染都会强制重新创建所有元素，导致性能浪费。

:::

## React 事件和 DOM 事件区别

参考答案

::: details

1. **事件绑定方式**

- **React 事件**
  使用**驼峰命名法**（如 `onClick`、`onChange`），通过 JSX 属性直接绑定函数：

  ```jsx
  <button onClick={handleClick}>点击</button>
  ```

- **DOM 事件**
  使用**全小写命名**（如 `onclick`、`onchange`），通过字符串或 `addEventListener` 绑定：
  ```html
  <button onclick="handleClick()">点击</button>
  ```
  ```javascript
  button.addEventListener('click', handleClick)
  ```

2. **事件对象（Event Object）**

- **React 事件**
  使用**合成事件（SyntheticEvent）**，是原生事件对象的跨浏览器包装。

  - 通过 `e.nativeEvent` 访问原生事件。
  - 事件对象会被复用（事件池机制），异步访问需调用 `e.persist()`。

  ```jsx
  const handleClick = (e) => {
    e.persist() // 保持事件对象引用
    setTimeout(() => console.log(e.target), 100)
  }
  ```

- **DOM 事件**
  直接使用浏览器原生事件对象，无复用机制。
  ```javascript
  button.addEventListener('click', (e) => {
    console.log(e.target) // 直接访问
  })
  ```

3. **事件传播与默认行为**

- **React 事件**

  - **阻止默认行为**：必须显式调用 `e.preventDefault()`。
  - **阻止冒泡**：调用 `e.stopPropagation()`。

  ```jsx
  const handleSubmit = (e) => {
    e.preventDefault() // 阻止表单默认提交
    e.stopPropagation() // 阻止事件冒泡
  }
  ```

- **DOM 事件**
  - **阻止默认行为**：可调用 `e.preventDefault()` 或 `return false`（在 HTML 属性中）。
  - **阻止冒泡**：调用 `e.stopPropagation()` 或 `return false`（仅部分情况）。
  ```html
  <form onsubmit="return false">
    <!-- 阻止默认提交 -->
    <button onclick="event.stopPropagation()">按钮</button>
  </form>
  ```

4. **性能优化**

- **React 事件**
  采用**事件委托**机制：

  - React 17 之前将事件委托到 `document` 层级。
  - React 17+ 改为委托到渲染的根容器（如 `ReactDOM.render` 挂载的节点）。
  - 减少内存占用，动态添加元素无需重新绑定事件。

- **DOM 事件**
  直接绑定到元素，大量事件监听时可能导致性能问题。

5. **跨浏览器兼容性**

- **React 事件**
  合成事件抹平了浏览器差异（如 `event.target` 的一致性），无需处理兼容性问题。

- **DOM 事件**
  需手动处理浏览器兼容性（如 IE 的 `attachEvent` vs 标准 `addEventListener`）。

6. **`this` 绑定**

- **React 事件**
  类组件中需手动绑定 `this` 或使用箭头函数：

  ```jsx
  class MyComponent extends React.Component {
    handleClick() {
      console.log(this) // 需绑定，否则为 undefined
    }

    render() {
      return <button onClick={this.handleClick.bind(this)}>点击</button>
    }
  }
  ```

- **DOM 事件**
  事件处理函数中的 `this` 默认指向触发事件的元素：
  ```javascript
  button.addEventListener('click', function () {
    console.log(this) // 指向 button 元素
  })
  ```

| 特性             | React 事件                   | DOM 事件                               |
| ---------------- | ---------------------------- | -------------------------------------- |
| **命名规则**     | 驼峰命名（`onClick`）        | 全小写（`onclick`）                    |
| **事件对象**     | 合成事件（`SyntheticEvent`） | 原生事件对象                           |
| **默认行为阻止** | `e.preventDefault()`         | `e.preventDefault()` 或 `return false` |
| **事件委托**     | 自动委托到根容器             | 需手动实现                             |
| **跨浏览器兼容** | 内置处理                     | 需手动适配                             |
| **`this` 指向**  | 类组件中需手动绑定           | 默认指向触发元素                       |

React 事件系统通过抽象和优化，提供了更高效、一致的事件处理方式，避免了直接操作 DOM 的繁琐和兼容性问题。

:::

## 简述 React batchUpdate 机制

参考答案

::: details

React 的 **batchUpdate（批处理更新）机制** 是一种优化策略，旨在将多个状态更新合并为一次渲染，减少不必要的组件重新渲染次数，从而提高性能。

**核心机制**

1. **异步合并更新**
   当在 **同一执行上下文**（如同一个事件处理函数、生命周期方法或 React 合成事件）中多次调用状态更新（如 `setState`、`useState` 的 `setter` 函数），React 不会立即触发渲染，而是将多个更新收集到一个队列中，最终合并为一次更新，统一计算新状态并渲染。

2. **更新队列**
   React 内部维护一个更新队列。在触发更新的代码块中，所有状态变更会被暂存到队列，直到代码执行完毕，React 才会一次性处理队列中的所有更新，生成新的虚拟 DOM，并通过 Diff 算法高效更新真实 DOM。

**触发批处理的场景**

1. **React 合成事件**
   如 `onClick`、`onChange` 等事件处理函数中的多次状态更新会自动批处理。

   ```jsx
   const handleClick = () => {
     setCount(1) // 更新入队
     setName('Alice') // 更新入队
     // 最终合并为一次渲染
   }
   ```

2. **React 生命周期函数**
   在 `componentDidMount`、`componentDidUpdate` 等生命周期方法中的更新会被批处理。

3. **React 18+ 的自动批处理增强**
   React 18 引入 `createRoot` 后，即使在异步操作（如 `setTimeout`、`Promise`、原生事件回调）中的更新也会自动批处理：
   ```jsx
   setTimeout(() => {
     setCount(1) // React 18 中自动批处理
     setName('Alice') // 合并为一次渲染
   }, 1000)
   ```

**绕过批处理的场景**

1. **React 17 及之前的异步代码**
   在 `setTimeout`、`Promise` 或原生事件回调中的更新默认**不会**批处理，每次 `setState` 触发一次渲染：

   ```jsx
   // React 17 中会触发两次渲染
   setTimeout(() => {
     setCount(1) // 渲染一次
     setName('Alice') // 渲染第二次
   }, 1000)
   ```

2. **手动强制同步更新**
   使用 `flushSync`（React 18+）可强制立即更新，绕过批处理：

   ```jsx
   import { flushSync } from 'react-dom'

   flushSync(() => {
     setCount(1) // 立即渲染
   })
   setName('Alice') // 再次渲染
   ```

**设计目的**

1. **性能优化**
   避免频繁的 DOM 操作，减少浏览器重绘和回流，提升应用性能。

2. **状态一致性**
   确保在同一个上下文中多次状态变更后，组件最终基于最新的状态值渲染，避免中间状态导致的 UI 不一致。

**示例对比**

- **自动批处理（React 18+）**

  ```jsx
  const handleClick = () => {
    setCount((prev) => prev + 1) // 更新入队
    setCount((prev) => prev + 1) // 更新入队
    // 最终 count 增加 2，仅一次渲染
  }
  ```

- **非批处理（React 17 异步代码）**
  ```jsx
  setTimeout(() => {
    setCount((prev) => prev + 1) // 渲染一次
    setCount((prev) => prev + 1) // 再渲染一次
    // React 17 中触发两次渲染，count 仍为 2
  }, 1000)
  ```

| 场景                  | React 17 及之前 | React 18+（使用 `createRoot`） |
| --------------------- | --------------- | ------------------------------ |
| **合成事件/生命周期** | 自动批处理      | 自动批处理                     |
| **异步操作**          | 不批处理        | 自动批处理                     |
| **原生事件回调**      | 不批处理        | 自动批处理                     |

React 的批处理机制通过合并更新减少了渲染次数，但在需要即时反馈的场景（如动画）中，可通过 `flushSync` 强制同步更新。

:::

## 简述 React 事务机制

参考答案

::: details

React 的 **事务机制（Transaction）** 是早期版本（React 16 之前）中用于 **批量处理更新** 和 **管理副作用** 的核心设计模式，其核心思想是通过“包装”操作流程，确保在更新过程中执行特定的前置和后置逻辑（如生命周期钩子、事件监听等）。随着 React Fiber 架构的引入，事务机制逐渐被更灵活的调度系统取代。

**核心概念**

1. **事务的定义**
   事务是一个包含 **初始化阶段**、**执行阶段** 和 **收尾阶段** 的流程控制单元。每个事务通过 `Transaction` 类实现，提供 `initialize` 和 `close` 方法，用于在操作前后插入逻辑。例如：

   ```javascript
   const MyTransaction = {
     initialize() {
       /* 前置操作（如记录状态） */
     },
     close() {
       /* 后置操作（如触发更新） */
     },
   }
   ```

2. **包装函数**
   事务通过 `perform` 方法执行目标函数，将其包裹在事务的生命周期中：
   ```javascript
   function myAction() {
     /* 核心逻辑（如调用 setState） */
   }
   MyTransaction.perform(myAction)
   ```

**在 React 中的应用场景**

1. **批量更新（Batching Updates）**
   在事件处理或生命周期方法中，多次调用 `setState` 会被事务合并为一次更新。例如：

   ```javascript
   class Component {
     onClick() {
       // 事务包裹下的多次 setState 合并为一次渲染
       this.setState({ a: 1 })
       this.setState({ b: 2 })
     }
   }
   ```

2. **生命周期钩子的触发**
   在组件挂载或更新时，事务确保 `componentWillMount`、`componentDidMount` 等钩子在正确时机执行。

3. **事件系统的委托**
   合成事件（如 `onClick`）的处理逻辑通过事务绑定和解绑，确保事件监听的一致性和性能优化。

**事务的工作流程**

1. **初始化阶段**
   执行所有事务的 `initialize` 方法（如记录当前 DOM 状态、锁定事件监听）。
2. **执行目标函数**
   运行核心逻辑（如用户定义的 `setState` 或事件处理函数）。
3. **收尾阶段**
   执行所有事务的 `close` 方法（如对比 DOM 变化、触发更新、解锁事件）。

**事务机制的局限性**

1. **同步阻塞**
   事务的执行是同步且不可中断的，无法支持异步优先级调度（如 Concurrent Mode 的时间切片）。
2. **复杂性高**
   事务的嵌套和组合逻辑复杂，难以维护和扩展。

**Fiber 架构的演进**
React 16 引入的 **Fiber 架构** 替代了事务机制，核心改进包括：

1. **异步可中断更新**
   通过 Fiber 节点的链表结构，支持暂停、恢复和优先级调度。
2. **更细粒度的控制**
   将渲染拆分为多个阶段（如 `render` 和 `commit`），副作用管理更灵活。
3. **替代批量更新策略**
   使用调度器（Scheduler）和优先级队列实现更高效的批处理（如 React 18 的自动批处理）。

| 特性           | 事务机制（React <16）  | Fiber 架构（React 16+）        |
| -------------- | ---------------------- | ------------------------------ |
| **更新方式**   | 同步批量更新           | 异步可中断、优先级调度         |
| **副作用管理** | 通过事务生命周期控制   | 通过 Effect Hook、提交阶段处理 |
| **复杂度**     | 高（嵌套事务逻辑复杂） | 高（但更模块化和可扩展）       |
| **适用场景**   | 简单同步更新           | 复杂异步渲染（如动画、懒加载） |

事务机制是 React 早期实现批量更新的基石，但其同步设计无法满足现代前端应用的复杂需求。Fiber 架构通过解耦渲染过程，为 Concurrent Mode 和 Suspense 等特性奠定了基础，成为 React 高效渲染的核心。
:::

## 理解 React concurrency 并发机制

参考答案

::: details

React 的并发机制（Concurrency）是 React 18 引入的一项重要特性，旨在提升应用的响应性和性能。

**1. 什么是 React 的并发机制？**

React 的并发机制允许 React 在渲染过程中根据任务的优先级进行调度和中断，从而确保高优先级的更新能够及时渲染，而不会被低优先级的任务阻塞。

**2. 并发机制的工作原理：**

- **时间分片（Time Slicing）：** React 将渲染任务拆分为多个小片段，每个片段在主线程空闲时执行。这使得浏览器可以在渲染过程中处理用户输入和其他高优先级任务，避免长时间的渲染阻塞用户交互。

- **优先级调度（Priority Scheduling）：** React 为不同的更新分配不同的优先级。高优先级的更新（如用户输入）会被优先处理，而低优先级的更新（如数据预加载）可以在空闲时处理。

- **可中断渲染（Interruptible Rendering）：** 在并发模式下，React 可以中断当前的渲染任务，处理更高优先级的任务，然后再恢复之前的渲染。这确保了应用在长时间渲染过程中仍能保持响应性。

**3. 并发机制的优势：**

- **提升响应性：** 通过优先处理高优先级任务，React 能够更快地响应用户输入，提升用户体验。

- **优化性能：** 将渲染任务拆分为小片段，避免长时间的渲染阻塞，提升应用的整体性能。

- **更好的资源利用：** 在主线程空闲时处理低优先级任务，充分利用系统资源。

**4. 如何启用并发模式：**

要在 React 应用中启用并发模式，需要使用 `createRoot` API：

```javascript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(<App />)
```

在并发模式下，React 会自动根据任务的优先级进行调度和渲染。

:::

## React reconciliation 协调的过程

参考答案

::: details

React 的 **协调（Reconciliation）** 是用于高效更新 UI 的核心算法。当组件状态或属性变化时，React 会通过对比新旧虚拟 DOM（Virtual DOM）树，找出最小化的差异并应用更新。以下是协调过程的详细步骤：

1. **生成虚拟 DOM 树**

- 当组件状态或属性变化时，React 会重新调用组件的 `render` 方法，生成新的**虚拟 DOM 树**（一个轻量级的 JavaScript 对象，描述 UI 结构）。
- 虚拟 DOM 是实际 DOM 的抽象表示，操作成本远低于直接操作真实 DOM。

2. **Diffing 算法（差异对比）**
   React 使用 **Diffing 算法** 比较新旧两棵虚拟 DOM 树，找出需要更新的部分。对比规则如下：

**规则一：不同类型的元素**

- 如果新旧元素的 `type` 不同（例如从 `<div>` 变为 `<span>`），React 会**销毁旧子树**，**重建新子树**。
  - 旧组件的生命周期方法（如 `componentWillUnmount`）会被触发。
  - 新组件的生命周期方法（如 `constructor`、`componentDidMount`）会被触发。

**规则二：相同类型的元素**

- 如果元素的 `type` 相同（例如 `<div className="old">` → `<div className="new">`），React 会**保留 DOM 节点**，仅更新变化的属性。
  - 对比新旧属性，仅更新差异部分（例如 `className`）。
  - 组件实例保持不变，生命周期方法（如 `componentDidUpdate`）会被触发。

**规则三：递归处理子节点**

- 对于子节点的对比，React 默认使用**逐层递归**的方式。
- **列表对比优化**：
  - 当子元素是列表（例如通过 `map` 生成的元素）时，React 需要唯一 `key` 来标识元素，以高效复用 DOM 节点。
  - 若未提供 `key`，React 会按顺序对比子节点，可能导致性能下降或状态错误（例如列表顺序变化时）。

3. **更新真实 DOM**

- 通过 Diffing 算法找出差异后，React 将生成一系列**最小化的 DOM 操作指令**（例如 `updateTextContent`、`replaceChild`）。
- 这些指令会被批量应用到真实 DOM 上，以减少重绘和重排的次数，提高性能。

4. **协调的优化策略**

- **Key 的作用**：为列表元素提供唯一的 `key`，帮助 React 识别元素的移动、添加或删除，避免不必要的重建。
- **批量更新（Batching）**：React 会将多个状态更新合并为一次渲染，减少重复计算。
- **Fiber 架构**（React 16+）：
  - 将协调过程拆分为可中断的“工作单元”（Fiber 节点），允许高优先级任务（如动画）优先处理。
  - 支持异步渲染（Concurrent Mode），避免长时间阻塞主线程。

:::

## React 组件渲染和更新的全过程

参考答案

::: details

React 组件的渲染和更新过程涉及多个阶段，包括 **初始化、渲染、协调、提交、清理** 等。以下是 React 组件渲染和更新的全过程，结合源码逻辑和关键步骤进行详细分析。

---

**1. 整体流程概述**
React 的渲染和更新过程可以分为以下几个阶段：

1. **初始化阶段**：创建 Fiber 树和 Hooks 链表。
2. **渲染阶段**：生成新的虚拟 DOM（Fiber 树）。
3. **协调阶段**：对比新旧 Fiber 树，找出需要更新的部分。
4. **提交阶段**：将更新应用到真实 DOM。
5. **清理阶段**：重置全局变量，准备下一次更新。

**2. 详细流程分析**

**（1）初始化阶段**

- **触发条件**：组件首次渲染或状态/属性更新。
- **关键函数**：`render`、`createRoot`、`scheduleUpdateOnFiber`。
- **逻辑**：
  1. 通过 `ReactDOM.render` 或 `createRoot` 初始化应用。
  2. 创建根 Fiber 节点（`HostRoot`）。
  3. 调用 `scheduleUpdateOnFiber`，将更新任务加入调度队列。

**（2）渲染阶段**

- **触发条件**：调度器开始执行任务。
- **关键函数**：`performSyncWorkOnRoot`、`beginWork`、`renderWithHooks`。
- **逻辑**：
  1. 调用 `performSyncWorkOnRoot`，开始渲染任务。
  2. 调用 `beginWork`，递归处理 Fiber 节点。
  3. 对于函数组件，调用 `renderWithHooks`，执行组件函数并生成新的 Hooks 链表。
  4. 对于类组件，调用 `instance.render`，生成新的虚拟 DOM。
  5. 对于 Host 组件（如 `div`），生成对应的 DOM 节点。

**（3）协调阶段**

- **触发条件**：新的虚拟 DOM 生成后。
- **关键函数**：`reconcileChildren`、`diff`。
- **逻辑**：
  1. 调用 `reconcileChildren`，对比新旧 Fiber 节点。
  2. 根据 `diff` 算法，找出需要更新的节点。
  3. 为需要更新的节点打上 `Placement`、`Update`、`Deletion` 等标记。

**（4）提交阶段**

- **触发条件**：协调阶段完成后。
- **关键函数**：`commitRoot`、`commitWork`。
- **逻辑**：
  1. 调用 `commitRoot`，开始提交更新。
  2. 调用 `commitWork`，递归处理 Fiber 节点。
  3. 根据节点的标记，执行 DOM 操作（如插入、更新、删除）。
  4. 调用生命周期钩子（如 `componentDidMount`、`componentDidUpdate`）。

**（5）清理阶段**

- **触发条件**：提交阶段完成后。
- **关键函数**：`resetHooks`、`resetContext`。
- **逻辑**：
  1. 重置全局变量（如 `currentlyRenderingFiber`、`currentHook`）。
  2. 清理上下文和副作用。
  3. 准备下一次更新。

:::

## 为何 Hooks 不能放在条件或循环之内？

参考答案

::: details

一个组件中的 hook 会以链表的形式串起来， FiberNode 的 memoizedState 中保存了 Hooks 链表中的第一个 Hook。

在更新时，会复用之前的 Hook，如果通过了条件或循环语句，增加或者删除 hooks，在复用 hooks 过程中，会产生复用 hooks状态和当前 hooks 不一致的问题。

:::

## useEffect 的底层是如何实现的（美团）

参考答案

::: details

useEffect 是 React 用于管理副作用的 Hook，它在 commit 阶段 统一执行，确保副作用不会影响渲染。

在 React 源码中，useEffect 通过 Fiber 机制 在 commit 阶段 进行处理：

**(1) useEffect 存储在 Fiber 节点上**

React 组件是通过 Fiber 数据结构 组织的，每个 useEffect 都会存储在 fiber.updateQueue 中。

**(2) useEffect 何时执行**

React 组件更新后，React 在 commit 阶段 统一遍历 effect 队列，并执行 useEffect 副作用。

React 使用 `useEffectEvent()` 注册 effect，在 commitLayoutEffect 之后，异步执行 useEffect，避免阻塞 UI 渲染。

**(3) useEffect 依赖变化的处理**

依赖数组的比较使用 `Object.is()`，只有依赖变化时才重新执行 useEffect。

在更新阶段，React 遍历旧 effect，并先执行清理函数，然后再执行新的 effect。

**简化的 useEffect 实现如下：**

```js
function useEffect(callback, dependencies) {
  const currentEffect = getCurrentEffect() // 获取当前 Fiber 节点的 Effect

  if (dependenciesChanged(currentEffect.dependencies, dependencies)) {
    cleanupPreviousEffect(currentEffect) // 先执行上次 effect 的清理函数
    const cleanup = callback() // 执行 useEffect 传入的回调
    currentEffect.dependencies = dependencies
    currentEffect.cleanup = cleanup // 存储清理函数
  }
}
```

相比 useLayoutEffect，useEffect 是 异步执行，不会阻塞 UI 渲染。

:::
