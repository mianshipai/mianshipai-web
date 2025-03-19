# React 使用

React 是全球应用最广泛的框架，国内大厂多用 React

::: tip
如有疑问，可免费 [加群](https://github.com/mianshipai/mianshipai-web/issues/1) 讨论咨询，也可参与 [金牌简历计划 🔥](/docs/services/1v1.md) 专业、系统、高效、全流程 准备前端面试
:::

## React 组件生命周期

::: details 参考答案

React 组件生命周期分为以下三个阶段。

**挂载阶段**：这是组件首次被创建并插入到 DOM 中的阶段。

**更新阶段**：当组件的 props 或 state 发生变化时，就会触发更新阶段。

**卸载阶段**：组件从 DOM 中移除时进入卸载阶段。

函数组件是没有明确的生命周期方法，但可以通过 `useEffect` 来模拟生命周期行为。

模拟**挂载阶段**的生命周期方法：

- 只需要在 `useEffect` 的依赖数组中传入一个空数组 `[]`。这样，该副作用只会在组件挂载后运行一次。

  ```js
  useEffect(() => {
    console.log('代码只会在组件挂载后执行一次')
  }, [])
  ```

模拟**更新阶段**的生命周期方法：

- 通过将依赖项放入依赖数组中，`useEffect` 可以在依赖项更改时执行。如果你省略了依赖数组，副作用将在每次渲染后执行。
  ```js
  // 注意这里没有提供依赖数组
  useEffect(() => {
    console.log('代码会在组件挂载后以及每次更新后执行')
  })
  // 特定依赖更新时执行
  useEffect(() => {
    console.log('代码会在 count 更新后执行')
  }, [count])
  ```

模拟**卸载阶段**的生命周期方法：

- 在 `useEffect` 的函数中返回一个函数，该函数会在组件卸载前执行。

  ```js
  useEffect(() => {
    return () => {
      console.log('代码会在组件卸载前执行')
    }
  }, [])
  ```

  :::

## React 父子组件生命周期调用顺序

::: details 参考答案

函数组件的生命周期通过 `useEffect` 模拟，其调用顺序如下：

**挂载阶段**

- **父组件**：执行函数体（首次渲染）
- **子组件**：执行函数体（首次渲染）
- **子组件**：`useEffect`（挂载阶段）
- **父组件**：`useEffect`（挂载阶段）

**更新阶段**

- **父组件**：执行函数体（重新渲染）
- **子组件**：执行函数体（重新渲染）
- **子组件**：`useEffect` 清理函数（如果依赖项变化）
- **父组件**：`useEffect` 清理函数（如果依赖项变化）
- **子组件**：`useEffect`（如果依赖项变化）
- **父组件**：`useEffect`（如果依赖项变化）

**卸载阶段**

- **父组件**：`useEffect` 清理函数
- **子组件**：`useEffect` 清理函数

:::

## React 组件通讯方式

::: details 参考答案

- **通过props向子组件传递数据**

```js
//父组件
const Parent = () => {
  const message = 'Hello from Parent'
  return <Child message={message} />
}

// 子组件
const Child = ({ message }) => {
  return <div>{message}</div>
}
```

- **通过回调函数向父组件传递数据**

```js
//父组件
const Parent = () => {
  const handleData = (data) => {
    console.log('Data from Child:', data)
  }
  return <Child onSendData={handleData} />
}

// 子组件
const Child = ({ message }) => {
  return <button onClick={() => onSendData('Hello from Child')}>Send Data</button>
}
```

- **使用refs调用子组件暴露的方法**

```js
import React, { useRef, forwardRef, useImperativeHandle } from 'react'

// 子组件
const Child = forwardRef((props, ref) => {
  // 暴露方法给父组件
  useImperativeHandle(ref, () => ({
    sayHello() {
      alert('Hello from Child Component!')
    },
  }))

  return <div>Child Component</div>
})

// 父组件
function Parent() {
  const childRef = useRef(null)

  const handleClick = () => {
    if (childRef.current) {
      childRef.current.sayHello()
    }
  }

  return (
    <div>
      <Child ref={childRef} />
      <button onClick={handleClick}>Call Child Method</button>
    </div>
  )
}

export default Parent
```

- **通过Context进行跨组件通信**

```js
import React, { useState } from 'react'

// 创建一个 Context
const MyContext = React.createContext()

// 父组件
function Parent() {
  const [sharedData, setSharedData] = useState('Hello from Context')

  const updateData = () => {
    setSharedData('Updated Data from Context')
  }

  return (
    // 提供数据和更新函数
    <MyContext.Provider value={{ sharedData, updateData }}>
      <ChildA />
    </MyContext.Provider>
  )
}

// 子组件 A（引用子组件 B）
function ChildA() {
  return (
    <div>
      <ChildB />
    </div>
  )
}

// 子组件 B（使用 useContext）
function ChildB() {
  const { sharedData, updateData } = React.useContext(MyContext)
  return (
    <div>
      <div>ChildB: {sharedData}</div>
      <button onClick={updateData}>Update Data</button>
    </div>
  )
}

export default Parent
```

- **使用状态管理库进行通信**

  - **React Context + useReducer**

    ```js
    import React, { useReducer } from 'react'

    const initialState = { count: 0 }

    function reducer(state, action) {
      switch (action.type) {
        case 'increment':
          return { count: state.count + 1 }
        case 'decrement':
          return { count: state.count - 1 }
        default:
          throw new Error()
      }
    }

    const CounterContext = React.createContext()

    function CounterProvider({ children }) {
      const [state, dispatch] = useReducer(reducer, initialState)
      return <CounterContext.Provider value={{ state, dispatch }}>{children}</CounterContext.Provider>
    }

    function Counter() {
      const { state, dispatch } = React.useContext(CounterContext)
      return (
        <div>
          Count: {state.count}
          <button onClick={() => dispatch({ type: 'increment' })}>+</button>
          <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
        </div>
      )
    }

    function App() {
      return (
        <CounterProvider>
          <Counter />
        </CounterProvider>
      )
    }

    export default App
    ```

  - **Redux**：使用 `Redux Toolkit` 简化 Redux 开发。

    ```js
    import { createSlice, configureStore } from '@reduxjs/toolkit'

    const counterSlice = createSlice({
      name: 'counter',
      initialState: { value: 0 },
      reducers: {
        increment: (state) => {
          state.value += 1
        },
        decrement: (state) => {
          state.value -= 1
        },
      },
    })

    const { increment, decrement } = counterSlice.actions

    const store = configureStore({
      reducer: counterSlice.reducer,
    })

    store.subscribe(() => console.log(store.getState()))

    store.dispatch(increment())
    store.dispatch(decrement())
    ```

  - **MobX**

  ```js
  import { makeAutoObservable } from 'mobx'
  import { observer } from 'mobx-react-lite'

  class CounterStore {
    count = 0

    constructor() {
      makeAutoObservable(this)
    }

    increment() {
      this.count += 1
    }

    decrement() {
      this.count -= 1
    }
  }

  const counterStore = new CounterStore()

  const Counter = observer(() => {
    return (
      <div>
        Count: {counterStore.count}
        <button onClick={() => counterStore.increment()}>+</button>
        <button onClick={() => counterStore.decrement()}>-</button>
      </div>
    )
  })

  export default Counter
  ```

  - **Zustand**

  ```
  import create from "zustand";

  const useStore = create((set) => ({
    count: 0,
    increment: () => set((state) => ({ count: state.count + 1 })),
    decrement: () => set((state) => ({ count: state.count - 1 })),
  }));

  function Counter() {
    const { count, increment, decrement } = useStore();
    return (
      <div>
        Count: {count}
        <button onClick={increment}>+</button>
        <button onClick={decrement}>-</button>
      </div>
    );
  }

  export default Counter;
  ```

- **使用事件总线（Event Bus）进行通信**

可以使用第三方库如 pubsub-js 来实现父子组件间通信。在父组件中订阅一个事件，子组件在特定情况下发布这个事件并传递数据。

```js
import React from 'react'
import PubSub from 'pubsub-js'

const ParentComponent = () => {
  React.useEffect(() => {
    const token = PubSub.subscribe('childData', (msg, data) => {
      console.log('Received data from child:', data)
    })
    return () => {
      PubSub.unsubscribe(token)
    }
  }, [])

  return <ChildComponent />
}

const ChildComponent = () => {
  const sendData = () => {
    PubSub.publish('childData', { message: 'Hello from child' })
  }

  return <button onClick={sendData}>Send data from child</button>
}

export default ParentComponent
```

:::

## state 和 props 有什么区别？

::: details 参考答案

在 React 中，props 和 state 都用于管理组件的数据和状态。

**Props（属性）：**

props 是组件之间传递数据的一种方式，用于从父组件向子组件传递数据。
props 是只读的，即父组件传递给子组件的数据在子组件中不能被修改。
props 是在组件的声明中定义，通过组件的属性传递给子组件。
props 的值由父组件决定，子组件无法直接改变它的值。
当父组件的 props 发生变化时，子组件会重新渲染。

**State（状态）：**

state 是组件内部的数据，用于管理组件的状态和变化。
state 是可变的，组件可以通过 setState 方法来更新和修改 state。
state 是在组件的构造函数中初始化的，通常被定义为组件的类属性。
state 的值可以由组件自身内部改变，通过调用 setState 方法触发组件的重新渲染。
当组件的 state 发生变化时，组件会重新渲染。

**总结：**

props 是父组件传递给子组件的数据，是只读的，子组件无法直接修改它。
state 是组件内部的数据，是可变的，组件可以通过 setState 方法来修改它。
props 用于组件之间的数据传递，而 state 用于管理组件自身的状态和变化。

:::

## React 有哪些内置 Hooks ？

::: details 参考答案

React 目前有多个 Hooks API，可以参考[官方文档 Hooks](https://zh-hans.react.dev/reference/react/hooks)，可以按照功能进行分类:

**1. 状态管理 Hooks**

- useState: 用于在函数组件中添加局部状态。
- useReducer: 用于管理复杂的状态逻辑，类似于 Redux 的 reducer。

**2. 副作用 Hooks**

- useEffect: 用于在函数组件中执行副作用操作（如数据获取、订阅、手动 DOM 操作等）。
- useLayoutEffect: 与 useEffect 类似，但在 DOM 更新后同步执行，适用于需要直接操作 DOM 的场景。

**3. 上下文 Hooks**

- useContext: 用于访问 React 的上下文（Context）。

**4. 引用 Hooks**

- useRef: 用于创建一个可变的引用对象，通常用于访问 DOM 元素或存储可变值。

**5. 性能优化 Hooks**

- useMemo: 用于缓存计算结果，避免在每次渲染时都重新计算。
- useCallback: 用于缓存回调函数，避免在每次渲染时都创建新的回调。

**6. 其他 Hooks**

- useDeferredValue: 延迟更新 UI 的某些部分。
- useActionState: 根据某个表单动作的结果更新 state。
- useImperativeHandle: 用于自定义暴露给父组件的实例值，通常与 forwardRef 一起使用。
- useDebugValue: 用于在 React 开发者工具中显示自定义 Hook 的标签。
- useOptimistic 帮助你更乐观地更新用户界面
- useTransition: 用于标记某些状态更新为“过渡”状态，允许你在更新期间显示加载指示器。
- useId: 用于生成唯一的 ID，可以生成传递给无障碍属性的唯一 ID。
- useSyncExternalStore: 用于订阅外部存储（如 Redux 或 Zustand）的状态。
- useInsertionEffect: 为 CSS-in-JS 库的作者特意打造的，在布局副作用触发之前将元素插入到 DOM 中

:::

## useEffect 和 useLayoutEffect 的区别

::: details 参考答案

**1. 执行时机**

- **useEffect**:

  - **执行时机**: 在浏览器完成绘制（即 DOM 更新并渲染到屏幕）之后异步执行。
  - **适用场景**: 适用于大多数副作用操作，如数据获取、订阅、手动 DOM 操作等，因为这些操作通常不需要阻塞浏览器的渲染。

- **useLayoutEffect**:
  - **执行时机**: 在 DOM 更新之后，但在浏览器绘制之前同步执行。
  - **适用场景**: 适用于需要在浏览器绘制之前同步执行的副作用操作，如测量 DOM 元素、同步更新 DOM 等。由于它是同步执行的，可能会阻塞浏览器的渲染，因此应谨慎使用。

**2. 对渲染的影响**

- **useEffect**:

  - 由于是异步执行，不会阻塞浏览器的渲染过程，因此对用户体验的影响较小。
  - 如果副作用操作导致状态更新，React 会重新渲染组件，但用户不会看到中间的闪烁或不一致的状态。

- **useLayoutEffect**:
  - 由于是同步执行，会阻塞浏览器的渲染过程，直到副作用操作完成。
  - 如果副作用操作导致状态更新，React 会立即重新渲染组件，用户可能会看到中间的闪烁或不一致的状态。

**3. 总结**

- **useEffect**: 异步执行，不阻塞渲染，适合大多数副作用操作。
- **useLayoutEffect**: 同步执行，阻塞渲染，适合需要在绘制前同步完成的副作用操作。

:::

## 为何 dev 模式下 useEffect 执行两次？

::: details 参考答案

React 官方文档其实对这个问题进行了[解答](https://zh-hans.react.dev/reference/react/useEffect#my-effect-runs-twice-when-the-component-mounts)：

在开发环境下，如果开启严格模式，React 会在实际运行 setup 之前额外运行一次 setup 和 cleanup。

这是一个压力测试，用于验证 Effect 的逻辑是否正确实现。如果出现可见问题，则 cleanup 函数缺少某些逻辑。cleanup 函数应该停止或撤消 setup 函数所做的任何操作。一般来说，用户不应该能够区分 setup 被调用一次（如在生产环境中）和调用 setup → cleanup → setup 序列（如在开发环境中）。

借助严格模式的目标是帮助开发者提前发现以下问题：

1. 不纯的渲染逻辑：例如，依赖外部状态或直接修改 DOM。
2. 未正确清理的副作用：例如，未在 useEffect 的清理函数中取消订阅或清除定时器。
3. 不稳定的组件行为：例如，组件在多次挂载和卸载时表现不一致。

通过强制组件挂载和卸载两次，React 可以更好地暴露这些问题。

:::

## React 闭包陷阱

::: details 参考答案

让我们举个例子：

```jsx
function Counter() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      console.log(count) // 每次打印的都是初始值 0
    }, 1000)

    return () => clearInterval(timer)
  }, []) // 依赖数组为空，effect 只运行一次

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  )
}
```

在这个例子中：

- `useEffect` 只在组件挂载时运行一次。
- `setInterval` 的回调函数形成了一个闭包，捕获了初始的 `count` 值（即 0）。
- 即使 `count` 状态更新了，`setInterval` 中的回调函数仍然访问的是旧的 `count` 值。

闭包陷阱的根本原因是 JavaScript 的闭包机制：

- 当一个函数被定义时，它会捕获当前作用域中的变量。
- 如果这些变量是状态或 props，它们的值在函数定义时被“固定”下来。
- 当状态或 props 更新时，闭包中的值并不会自动更新。

为了避免闭包陷阱，可以将依赖的状态或 props 添加到 useEffect 的依赖数组中，这样每次状态更新时，useEffect 都会重新运行，闭包中的值也会更新。

```jsx
useEffect(() => {
  const timer = setInterval(() => {
    console.log(count) // 每次打印最新的 count 值
  }, 1000)

  return () => clearInterval(timer)
}, [count]) // 将 count 添加到依赖数组
```

:::

## React state 不可变数据

::: details 参考答案

在 React 中，**状态（state）的不可变性** 是指你不能直接修改状态的值，而是需要创建一个新的值来替换旧的状态。

使用不可变数据可以带来如下好处：

1. **性能优化**

React 使用浅比较（shallow comparison）来检测状态是否发生变化。如果状态是不可变的，React 只需要比较引用（即内存地址）是否变化，而不需要深度遍历整个对象或数组。

2. **可预测性**

- 不可变数据使得状态的变化更加可预测和可追踪。
- 每次状态更新都会生成一个新的对象或数组，这样可以更容易地调试和追踪状态的变化历史。

3. **避免副作用**

- 直接修改状态可能会导致意外的副作用，尤其是在异步操作或复杂组件中。
- 不可变数据确保了状态的更新是纯函数式的，避免了副作用。

**关于如何实现不可变数据？**

1. **更新对象时使用新的对象**

```jsx
// ❌ 错误：直接修改状态
state.name = 'new name'
setState(state)
```

```jsx
// ✅ 正确：创建新对象
setState({
  ...state, // 复制旧状态
  name: 'new name', // 更新属性
})
```

2. **更新数组时使用新的数组**

```jsx
// ❌ 错误：直接修改数组
state.items.push(newItem)
setState(state)
```

```jsx
// ✅ 正确：创建新数组
setState({
  ...state,
  items: [...state.items, newItem], // 添加新元素
})
```

3. **使用工具库简化不可变更新**

常用的库有：

1. **Immer.js**
   [Immer](https://immerjs.github.io/immer/) 是一个流行的库，它允许你以可变的方式编写代码，但最终生成不可变的数据。

```jsx
import produce from 'immer'

setState(
  produce(state, (draft) => {
    draft.user.profile.name = 'new name' // 直接修改
    draft.items.push(newItem) // 直接修改
  })
)
```

2. **Immutable.js**

[Immutable.js](https://immutable-js.com/) 提供了不可变的数据结构（如 `List`、`Map` 等），可以更方便地处理不可变数据。

```jsx
import { Map } from 'immutable'

const state = Map({ name: 'John', age: 30 })
const newState = state.set('name', 'Jane')
```

:::

## React state 异步更新

::: details 参考答案

在 React 18 之前，React 采用批处理策略来优化状态更新。在批处理策略下，React 将在事件处理函数结束后应用所有的状态更新，这样可以避免不必要的渲染和 DOM 操作。

然而，这个策略在异步操作中就无法工作了。因为 React 没有办法在适当的时机将更新合并起来，所以结果就是在异步操作中的每一个状态更新都会导致一个新的渲染。

例如，当你在一个 onClick 事件处理函数中连续调用两次 setState，React 会将这两个更新合并，然后在一次重新渲染中予以处理。

然而，在某些场景下，如果你在事件处理函数之外调用 setState，React 就无法进行批处理了。比如在 setTimeout 或者 Promise 的回调函数中。在这些场景中，每次调用 setState，React 都会触发一次重新渲染，无法达到批处理的效果。

React 18 引入了自动批处理更新机制，让 React 可以捕获所有的状态更新，并且无论在何处进行更新，都会对其进行批处理。这对一些异步的操作，如 Promise，setTimeout 之类的也同样有效。

这一新特性的实现，核心在于 React 18 对渲染优先级的管理。React 18 引入了一种新的协调器，被称为“React Scheduler”。它负责管理 React 的工作单元队列。每当有一个新的状态更新请求，React 会创建一个新的工作单元并放入这个队列。当 JavaScript 运行栈清空，Event Loop 即将开始新的一轮循环时，Scheduler 就会进入工作，处理队列中的所有工作单元，实现了批处理。

:::

## React state 的“合并”特性

::: details 参考答案

React **状态的“合并”特性** 是指当使用 `setState` 更新状态时，React 会将新状态与旧状态进行浅合并（shallow merge），而不是直接替换整个状态对象。

合并特性在类组件中尤为明显，而在函数组件中需要手动实现类似的行为。

1. **类组件中的状态合并**

在类组件中，`setState` 会自动合并状态对象。例如：

```jsx
class MyComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      name: 'John',
      age: 30,
    }
  }

  updateName = () => {
    this.setState({ name: 'Jane' }) // 只更新 name，age 保持不变
  }

  render() {
    return (
      <div>
        <p>Name: {this.state.name}</p>
        <p>Age: {this.state.age}</p>
        <button onClick={this.updateName}>Update Name</button>
      </div>
    )
  }
}
```

在这个例子中：

- 调用 `this.setState({ name: 'Jane' })` 只会更新 `name` 属性，而 `age` 属性保持不变。
- React 会自动将新状态 `{ name: 'Jane' }` 与旧状态 `{ name: 'John', age: 30 }` 进行浅合并，结果是 `{ name: 'Jane', age: 30 }`。

2. **函数组件中的状态替换**

在函数组件中，`useState` 的 setter 函数不会自动合并状态。如果你直接传递一个新对象，它会完全替换旧状态。

```jsx
function MyComponent() {
  const [state, setState] = useState({
    name: 'John',
    age: 30,
  })

  const updateName = () => {
    setState({ name: 'Jane' }) // ❌ 直接替换，age 会丢失
  }

  return (
    <div>
      <p>Name: {state.name}</p>
      <p>Age: {state.age}</p>
      <button onClick={updateName}>Update Name</button>
    </div>
  )
}
```

在这个例子中：

- 调用 `setState({ name: 'Jane' })` 会完全替换状态对象，导致 `age` 属性丢失。
- 最终状态变为 `{ name: 'Jane' }`，而不是 `{ name: 'Jane', age: 30 }`。

3. **如何在函数组件中实现状态合并？**

在函数组件中，如果需要实现类似类组件的状态合并特性，可以手动合并状态：

方法 1：使用扩展运算符

```jsx
function MyComponent() {
  const [state, setState] = useState({
    name: 'John',
    age: 30,
  })

  const updateName = () => {
    setState((prevState) => ({
      ...prevState, // 复制旧状态
      name: 'Jane', // 更新 name
    }))
  }

  return (
    <div>
      <p>Name: {state.name}</p>
      <p>Age: {state.age}</p>
      <button onClick={updateName}>Update Name</button>
    </div>
  )
}
```

方法 2：使用 `useReducer`
`useReducer` 可以更灵活地管理复杂状态，并实现类似合并的行为。

```jsx
function reducer(state, action) {
  switch (action.type) {
    case 'UPDATE_NAME':
      return {
        ...state,
        name: action.payload,
      }
    default:
      throw new Error()
  }
}

function MyComponent() {
  const [state, dispatch] = useReducer(reducer, {
    name: 'John',
    age: 30,
  })

  const updateName = () => {
    dispatch({ type: 'UPDATE_NAME', payload: 'Jane' })
  }

  return (
    <div>
      <p>Name: {state.name}</p>
      <p>Age: {state.age}</p>
      <button onClick={updateName}>Update Name</button>
    </div>
  )
}
```

:::

## 什么是 React 受控组件？

::: details 参考答案
在 React 中，受控组件（Controlled Component） 是指表单元素（如 `<input>`、`<textarea>`、`<select>` 等）的值由 React 的状态（state）控制，而不是由 DOM 自身管理。换句话说，表单元素的值通过 value 属性绑定到 React 的状态，并通过 onChange 事件处理函数来更新状态。

这是一个简单的受控组件示例：

```jsx
function ControlledInput() {
  const [value, setValue] = useState('')

  const handleChange = (event) => {
    setValue(event.target.value) // 更新状态
  }

  return (
    <div>
      <input
        type="text"
        value={value} // 绑定状态
        onChange={handleChange} // 监听输入变化
      />
      <p>Current value: {value}</p>
    </div>
  )
}
```

受控组件的优点：

1. 完全控制表单数据：React 状态是表单数据的唯一来源，可以轻松地对数据进行验证、格式化或处理。
2. 实时响应输入：可以在用户输入时实时更新 UI 或执行其他操作（如搜索建议）。
3. 易于集成：与其他 React 状态和逻辑无缝集成。

:::

## 使用 React Hook 实现 useCount

```js
// count 从 0 计数，每一秒 +1 （可使用 setInterval）
const { count } = useTimer()
```

::: details 参考答案

```jsx
import { useState, useEffect } from 'react'

function useTimer() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    // 设置定时器，每秒钟增加 count
    const intervalId = setInterval(() => {
      setCount((prevCount) => prevCount + 1)
    }, 1000)

    // 清理定时器
    return () => clearInterval(intervalId)
  }, []) // 空数组表示仅在组件挂载时执行一次

  return { count }
}

export default function TimerComponent() {
  const { count } = useTimer()

  return (
    <div>
      <p>Count: {count}</p>
    </div>
  )
}
```

:::

## 使用 React Hook 实现 useRequest

```js
const { loading, data, error } = useRequest(url) // 可只考虑 get 请求
```

::: details 参考答案

```jsx
import { useState, useEffect } from 'react'
import axios from 'axios'

function useRequest(url) {
  const [data, setData] = useState(null) // 存储请求的数据
  const [loading, setLoading] = useState(true) // 加载状态
  const [error, setError] = useState(null) // 错误信息

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true) // 设置加载状态为 true
      setError(null) // 清空先前的错误

      try {
        const response = await axios.get(url)
        if (!response.ok) {
          throw new Error('请求失败!')
        }
        setData(response.data) // 设置数据
      } catch (err) {
        setError(err.message) // 捕获错误并设置错误信息
      } finally {
        setLoading(false) // 请求结束，设置加载状态为 false
      }
    }

    fetchData()
  }, [url]) // 依赖于 url，当 url 改变时重新发起请求

  return { loading, data, error }
}

// 使用示例
export default function RequestComponent() {
  const { loading, data, error } = useRequest('https://xxx.xxxx.com/data')

  if (loading) return <p>Loading...</p>
  if (error) return <p>错误信息: {error}</p>
  return (
    <div>
      <h3>请求结果:</h3>
      <pre>{JSON.stringify(data)}</pre>
    </div>
  )
}
```

:::

## React 项目可做哪些性能优化？

::: details 参考答案

1. `useMemo`: 用于缓存昂贵的计算结果，避免在每次渲染时重复计算。

```jsx
function ExpensiveComponent({ items, filter }) {
  const filteredItems = useMemo(() => {
    return items.filter((item) => item.includes(filter))
  }, [items, filter]) // 仅在 items 或 filter 变化时重新计算

  return (
    <ul>
      {filteredItems.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}
```

2.  `useCallback`: 用于缓存回调函数，避免在每次渲染时创建新的函数实例。
    `useCallback`

```jsx
function ParentComponent() {
  const [count, setCount] = useState(0)

  const handleClick = useCallback(() => {
    setCount((prevCount) => prevCount + 1)
  }, []) // 空依赖数组，函数不会重新创建

  return (
    <div>
      <ChildComponent onClick={handleClick} />
      <p>Count: {count}</p>
    </div>
  )
}

const ChildComponent = React.memo(({ onClick }) => {
  console.log('ChildComponent rendered')
  return <button onClick={onClick}>Click me</button>
})
```

3.  `React.memo`: 是一个高阶组件，用于缓存组件的渲染结果，避免在 props 未变化时重新渲染

```jsx
const MyComponent = React.memo(({ value }) => {
  console.log('MyComponent rendered')
  return <div>{value}</div>
})

function ParentComponent() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <MyComponent value="Hello" /> {/* 不会因 count 变化而重新渲染 */}
    </div>
  )
}
```

4.  `Suspense`: 用于在异步加载数据或组件时显示加载状态，可以减少初始加载时间，提升用户体验

```jsx
const LazyComponent = React.lazy(() => import('./LazyComponent'))

function MyComponent() {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </React.Suspense>
  )
}
```

5.  `路由懒加载`：通过动态导入（dynamic import）将路由组件拆分为单独的代码块，按需加载。可以减少初始加载的代码量，提升页面加载速度

```jsx
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import React, { Suspense } from 'react'

const Home = React.lazy(() => import('./Home'))
const About = React.lazy(() => import('./About'))

function App() {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Suspense>
    </Router>
  )
}
```

:::

## 如何统一监听 React 组件报错

::: details 参考答案

1. Error Boundaries（错误边界）

默认情况下，如果你的应用程序在渲染过程中抛出错误，React 将从屏幕上删除其 UI。为了防止这种情况，你可以将 UI 的一部分包装到 错误边界 中。错误边界是一个特殊的组件，可让你显示一些后备 UI，而不是显示例如错误消息这样崩溃的部分。

要实现错误边界组件，你需要提供 static getDerivedStateFromError，它允许你更新状态以响应错误并向用户显示错误消息。你还可以选择实现 componentDidCatch 来添加一些额外的逻辑，例如将错误添加到分析服务。

```jsx
import * as React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    // 更新状态，以便下一次渲染将显示后备 UI。
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    logErrorToMyService(
      error,
      // 示例“组件堆栈”：
      // 在 ComponentThatThrows 中（由 App 创建）
      // 在 ErrorBoundary 中（由 APP 创建）
      // 在 div 中（由 APP 创建）
      // 在 App 中
      info.componentStack,
      // 仅在 react@canary 版本可用
      // 警告：Owner Stack 在生产中不可用
      React.captureOwnerStack()
    )
  }

  render() {
    if (this.state.hasError) {
      // 你可以渲染任何自定义后备 UI
      return this.props.fallback
    }

    return this.props.children
  }
}
```

然后你可以用它包装组件树的一部分：

```jsx
<ErrorBoundary fallback={<p>Something went wrong</p>}>
  <Profile />
</ErrorBoundary>
```

如果 Profile 或其子组件抛出错误，ErrorBoundary 将“捕获”该错误，然后显示带有你提供的错误消息的后备 UI，并向你的错误报告服务发送生产错误报告。

2. 全局错误监听

为了捕获 Error Boundaries 无法处理的错误（如事件处理器或异步代码中的错误），可以使用 JavaScript 的全局错误监听机制。

- 使用 window.onerror 监听全局错误。
- 使用 window.addEventListener('error', handler) 监听未捕获的错误。
- 使用 window.addEventListener('unhandledrejection', handler) 监听未处理的 Promise 拒绝。

```jsx
import React, { useEffect } from 'react'

function GlobalErrorHandler() {
  useEffect(() => {
    // 监听全局错误
    const handleError = (error) => {
      console.error('Global error:', error)
    }

    // 监听未捕获的错误
    window.onerror = (message, source, lineno, colno, error) => {
      handleError(error)
      return true // 阻止默认错误处理
    }

    // 监听未处理的 Promise 拒绝
    window.addEventListener('unhandledrejection', (event) => {
      handleError(event.reason)
    })

    // 清理监听器
    return () => {
      window.onerror = null
      window.removeEventListener('unhandledrejection', handleError)
    }
  }, [])

  return null
}

// 在应用的根组件中使用
function App() {
  return (
    <div>
      <GlobalErrorHandler />
      <MyComponent />
    </div>
  )
}
```

注意事项：

1. 全局错误监听可以捕获 Error Boundaries 无法处理的错误，但无法阻止组件崩溃。
2. 需要确保在生产环境中正确处理错误信息，避免暴露敏感信息。

   :::

## React19 升级了哪些新特性？

::: details 参考答案
React 19 的更新内容可以参考 React [官方更新博客](https://zh-hans.react.dev/blog/2024/12/05/react-19)

1. Actions 相关

按照惯例，使用异步过渡的函数被称为 “Actions”。 在 Actions 的基础上，React 19 引入了 useOptimistic 来管理乐观更新，以及一个新的 Hook React.useActionState 来处理 Actions 的常见情况。在 react-dom 中添加了 `<form>` Actions 来自动管理表单和 useFormStatus 来支持表单中 Actions 的常见情况。

2. 新的 API: use

在 React 19 中，我们引入了一个新的 API 来在渲染中读取资源：use。

例如，你可以使用 use 读取一个 promise，React 将挂起，直到 promise 解析完成：

```jsx
import { use } from 'react'

function Comments({ commentsPromise }) {
  // `use` 将被暂停直到 promise 被解决.
  const comments = use(commentsPromise)
  return comments.map((comment) => <p key={comment.id}>{comment}</p>)
}

function Page({ commentsPromise }) {
  // 当“use”在注释中暂停时,
  // 将显示此悬念边界。
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Comments commentsPromise={commentsPromise} />
    </Suspense>
  )
}
```

3. 服务端组件和动作

React 服务端组件现已稳定，允许提前渲染组件。与服务端动作（通过“use server”指令启用）配对后，客户端组件可以无缝调用异步服务端函数。

此外，还有一些 React 19 中的改进：

4. ref 作为一个属性

从 React 19 开始，你现在可以在函数组件中将 ref 作为 prop 进行访问：

```jsx
function MyInput({ placeholder, ref }) {
  return <input placeholder={placeholder} ref={ref} />
}

//...
;<MyInput ref={ref} />
```

新的函数组件将不再需要 forwardRef。

5. 改进了水合错误的错误报告

6. `<Context>` 作为提供者

在 React 19 中，你可以将 `<Context>` 渲染为提供者，就无需再使用 `<Context.Provider>` 了：

```jsx
const ThemeContext = createContext('')

function App({ children }) {
  return <ThemeContext value="dark">{children}</ThemeContext>
}
```

新的 Context 提供者可以使用 `<Context>`，我们将发布一个 codemod 来转换现有的提供者。在未来的版本中，我们将弃用 `<Context.Provider>`。

更多更新请参考[官方更新博客](https://zh-hans.react.dev/blog/2024/12/05/react-19)

:::

## 简述 Redux 单向数据流

::: details 参考答案
这是 Redux 单向数据流的典型流程：

```
View -> Action -> Reducer -> State -> View
```

1. **View**：
   - 用户在界面（View）上触发一个事件（如点击按钮）。
2. **Action**：
   - 事件触发一个 `action`，并通过 `store.dispatch(action)` 分发。
3. **Reducer**：
   - `store` 调用 `reducer`，传入当前的 `state` 和 `action`，生成一个新的 `state`。
4. **State**：
   - `store` 更新 `state`，并通知所有订阅了 `store` 的组件。
5. **View**：
   - 组件根据新的 `state` 重新渲染界面。

**Redux 单向数据流的特点**

1. **可预测性**：
   - 由于状态更新是通过纯函数（`reducer`）完成的，相同的 `state` 和 `action` 总是会生成相同的新的 `state`。
2. **集中管理**：
   - 所有状态都存储在单一的 `store` 中，便于调试和管理。
3. **易于测试**：
   - `reducer` 是纯函数，没有副作用，易于测试。
4. **时间旅行调试**：
   - 通过记录 `action` 和 `state`，可以实现时间旅行调试（如 Redux DevTools）。

---

**示例代码**

以下是一个完整的 Redux 示例：

```javascript
// 1. 定义 Action Types
const ADD_TODO = 'ADD_TODO'

// 2. 定义 Action Creator
function addTodo(text) {
  return {
    type: ADD_TODO,
    payload: text,
  }
}

// 3. 定义 Reducer
function todoReducer(state = [], action) {
  switch (action.type) {
    case ADD_TODO:
      return [...state, action.payload]
    default:
      return state
  }
}

// 4. 创建 Store
const store = Redux.createStore(todoReducer)

// 5. 订阅 Store
store.subscribe(() => {
  console.log('Current State:', store.getState())
})

// 6. 分发 Action
store.dispatch(addTodo('Learn Redux'))
store.dispatch(addTodo('Build a project'))
```

:::

## 用过哪些 Redux 中间件？

::: details 参考答案

Redux 中间件（Middleware）允许你在 `action` 被分发（`dispatch`）到 `reducer` 之前或之后执行额外的逻辑。中间件通常用于处理异步操作、日志记录、错误处理等任务。

常用的 Redux 中间件有

**1. Redux Thunk**

- **描述**: Redux Thunk 是最常用的中间件之一，用于处理异步操作（如 API 调用）。
- **特点**:
  - 允许 `action` 是一个函数（而不仅仅是一个对象）。
  - 函数可以接收 `dispatch` 和 `getState` 作为参数，从而在异步操作完成后手动分发 `action`。
- **使用场景**: 处理异步逻辑（如数据获取）。
- **示例**:
  ```javascript
  const fetchData = () => {
    return (dispatch, getState) => {
      dispatch({ type: 'FETCH_DATA_REQUEST' })
      fetch('/api/data')
        .then((response) => response.json())
        .then((data) => dispatch({ type: 'FETCH_DATA_SUCCESS', payload: data }))
        .catch((error) => dispatch({ type: 'FETCH_DATA_FAILURE', error }))
    }
  }
  ```

**2. Redux Saga**

- **描述**: Redux Saga 是一个基于生成器函数（Generator）的中间件，用于管理复杂的异步流程和副作用。
- **特点**:
  - 使用 ES6 的生成器函数来处理异步逻辑。
  - 提供强大的副作用管理（如取消任务、并发执行等）。
- **使用场景**: 复杂的异步流程（如竞态条件、任务取消等）。
- **示例**:

  ```javascript
  import { call, put, takeEvery } from 'redux-saga/effects'

  function* fetchData() {
    try {
      const data = yield call(fetch, '/api/data')
      yield put({ type: 'FETCH_DATA_SUCCESS', payload: data })
    } catch (error) {
      yield put({ type: 'FETCH_DATA_FAILURE', error })
    }
  }

  function* watchFetchData() {
    yield takeEvery('FETCH_DATA_REQUEST', fetchData)
  }
  ```

**3. Redux Logger**

- **描述**: Redux Logger 是一个用于记录 `action` 和 `state` 变化的中间件。
- **特点**:
  - 在控制台中打印每个 `action` 的分发和 `state` 的变化。
  - 便于调试和开发。
- **使用场景**: 开发环境中的调试。
- **示例**:
  ```javascript
  const store = createStore(rootReducer, applyMiddleware(logger))
  ```

**4. Redux Promise**

- **描述**: Redux Promise 是一个用于处理 Promise 的中间件。
- **特点**:
  - 自动处理 Promise 类型的 `action`。
  - 当 Promise 完成时，自动分发成功的 `action`；当 Promise 失败时，自动分发失败的 `action`。
- **使用场景**: 简单的异步操作。
- **示例**:
  ```javascript
  const fetchData = () => ({
    type: 'FETCH_DATA',
    payload: fetch('/api/data').then((response) => response.json()),
  })
  ```
  :::

## 你用过哪些 React 状态管理库？

::: details 参考答案

根据自己实际的使用情况作答：

1. Redux

Redux 是最流行的 React 状态管理库之一。它提供了一个全局的状态容器，允许你在应用的任何地方访问和更新状态。特点包括: 单向数据流、中间件支持、时间旅行调试。

2. MobX

MobX 是一个响应式状态管理库，它通过自动追踪状态的变化来更新 UI。特点包括: 响应式编程、简单易用、自动依赖追踪。

3. Recoil

Recoil 是 Facebook 推出的一个实验性状态管理库，专为 React 设计。特点包括: 原子状态管理、派生状态、与 React 深度集成。适用于需要细粒度状态管理的应用。

4. zustand

Zustand 是一个轻量级的状态管理库，API 简单且易于使用。特点包括: 轻量、简单、支持中间件。适用于需要轻量级状态管理的应用。

5. Jotai

Jotai 是一个基于原子状态管理的库，类似于 Recoil，但更加轻量。特点包括: 原子状态、简单易用、与 React 深度集成。适用于需要细粒度状态管理的应用。

6. XState

XState 是一个基于状态机的状态管理库，适用于复杂的状态逻辑和流程管理。特点包括: 状态机、可视化工具、复杂状态管理。适用于需要复杂状态逻辑和流程管理的应用。

:::

## 是否用过 SSR 服务端渲染？

::: details 参考答案

**SSR**

服务端渲染（Server-Side Rendering, SSR）是一种在服务器端生成 HTML 并将其发送到客户端的技术。与传统的客户端渲染（CSR）相比，SSR 可以提供更快的首屏加载速度、更好的 SEO 支持以及更友好的用户体验。

**SSR 的核心优势**

1. **更快的首屏加载**：
   - SSR 在服务器端生成 HTML，用户无需等待 JavaScript 加载完成即可看到页面内容。
2. **更好的 SEO**：
   - 搜索引擎可以抓取服务器渲染的完整 HTML 内容，而不是空的 `<div id="root"></div>`。
3. **更好的用户体验**：
   - 对于低性能设备或网络较差的用户，SSR 可以提供更快的初始渲染。

**SSR 的基本原理**

1. **服务器端**：
   - 使用 `ReactDOMServer` 将 React 组件渲染为 HTML 字符串。
   - 将生成的 HTML 字符串嵌入到 HTML 模板中，并发送给客户端。
2. **客户端**：
   - 客户端接收到 HTML 后，React 会“接管”页面（hydration），使其成为可交互的 SPA（单页应用）。

**React SSR 的框架支持**

最常用的框架就是 Next.js，它是一个基于 React 的全栈开发框架，集成了最新的 React 特性，内置 SSR 支持，可以帮助你快速创建全栈应用。
:::
