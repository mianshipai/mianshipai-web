# 场景题

## 如何设计实现一个准确的前端倒计时

这个问题的核心是：**单纯用 `setInterval` 倒计时是不准时不可靠的**。`setInterval(fn, 1000)` 并不保证每 1000ms 准时执行一次。

JS 是单线程的，当遇到大量计算、页面渲染、长任务等，`setInterval` 会被延迟执行。页面切到后台，定时器会被浏览器降频。本该 1 秒减一次，结果 1.2 秒甚至 2 秒才执行一次 → 倒计时变慢。

设计要点：

- 计时要以时间戳为基准（使用 `Date.now` 计时），而不是递减秒数
- `setInterval` 只作为刷新工具。

代码示例

```js
const endTime = Date.now() + 60 * 1000 // 1分钟倒计时

const timer = setInterval(() => {
  const now = Date.now()
  const remain = endTime - now

  if (remain <= 0) {
    clearInterval(timer)
    console.log('倒计时结束')
    return
  }

  console.log(Math.floor(remain / 1000) + '秒')
}, 1000)
```

总之，一个准确的前端倒计时应该以**时间戳差值**为核心，而不是依赖 `setInterval` 的次数；定时器只负责刷新 UI，每次通过 `目标时间 - 当前时间` 重新计算剩余时间，才能保证在卡顿、切后台等场景下依然准确。

## 如何设计实现一个精准的支付秒杀倒计时

这个问题的核心是：**前端倒计时必须和服务器时间一致，不能靠本地时间瞎算。**

设计要点

- 以服务器时间为准。禁止用 `new Date()` 直接作为倒计时依据（用户电脑时间不准）。必须先获取一次服务端当前时间。
- 只计算时间差，不依赖本地绝对时间。计算公式 `剩余时间 = 活动开始时间 - 服务器时间`
- 防止前端篡改计时，即真正是否可支付由后端控制，前端倒计时只是展示。篡改了也支付不了。

代码示例

```js
const diff = serverTime - Date.now()

setInterval(() => {
  const remain = startTime - (Date.now() + diff)
  updateUI(remain)
}, 1000)
```

## 一个 Web 管理系统，使用越来越慢，如何排查

这个问题的核心是：**慢在哪里，要先定位瓶颈，再针对性优化**。一般分网络、前端、后端三个方向进行定位。

先定位问题，用 Chrome DevTools：

- **Network**：看接口是否变慢（TTFB、响应时间）
- **Performance**：看是否卡在 JS 执行或渲染
- **Memory**：是否有内存泄漏（页面越用越卡）

前端常见的问题有

- 页面组件越来越多，**重复渲染 / 状态管理混乱**
- **大列表一次性渲染**（上千条数据）
- 事件监听未释放，导致**内存泄漏**
- 打包体积变大，首屏加载慢

对应的解决方案有：

- 虚拟列表（只渲染可视区域）
- 减少不必要的 re-render（memo、拆组件）
- 检查未销毁的定时器、监听器
- 按需加载（懒加载模块）

接口慢常见的问题有

- 接口响应时间变长
- 一次请求返回数据过多
- 串行请求过多

对应的解决方案有

- 分页 / 按需加载数据
- 合并接口 or 并行请求
- 开启 gzip / CDN / 缓存

## 后端接口返回几万条数据 前端表格如何去展示处理

这个问题考察的是：**大数据量渲染性能 + 用户体验 + 架构设计能力**。

设计的关键点是

- 不一次性渲染几万条数据（会卡死浏览器）
- 分批加载 + 按需渲染
- 保证滚动和操作流畅

解决方案有

- 后端分页返回（如果可以的话，但面试时一般规定后端一次性返回）
- 前端使用虚拟表格，每次只渲染几十个 DOM
- 如有数据处理，使用 web worker 解决，防止阻塞主线程
- 减少 DOM 嵌套和复杂度

## H5 瀑布流展示商品信息，低端安卓机和网络不稳定，如何优化？

针对低端安卓和弱网用户，可以从 **图片压缩 + 懒加载 + 虚拟列表 + 降级策略 + 容错体验** 入手，减少资源体积、降低渲染压力，保证页面能“快加载、不白屏、可用性优先”。

图片资源优化（关键）

- 使用 **WebP / AVIF**，多尺寸图片（srcset），低端机优先加载小图
- 首屏用 **低清图占位（LQIP / blur）** ，滚动再加载高清图
- 图片压缩 + CDN
- 避免一次性加载大量图片

网络加载优化

- **懒加载（IntersectionObserver）** ，只加载可视区域图片
- 分批请求（分页 / 分段加载），不要一次拉全量数据
- 请求失败自动重试 + 超时兜底
- 弱网模式：降低图片质量或数量

网页渲染优化

- 使用 **虚拟列表 / 虚拟瀑布流**，只渲染屏幕内的 DOM
- 避免频繁重排重绘（少用复杂阴影、动画）
- 使用 `transform`、`opacity` 做动画，避免 `top/left`

交互体验优化

- 骨架屏 / loading 占位，避免白屏
- 图片加载失败显示默认图
- 滚动时不阻塞主线程（避免大 JS 计算）

容错和降级方案

- 低端机或弱网：自动切换 **简化模式（少图 / 小图 / 低清图）**
- 关闭复杂动画、特效
- 监控卡顿和加载失败（埋点）

## 设计一个“单选框组件”，选项里面可能是图片、文字等，该如何设计。

如果只包含图片、文本这两个，是比较好设计的，做 if-else 判断显示即可。但如果有其他自定义类型，就需要用到 `<slot>`

```html
<template>
  <RadioGroup v-model="value">
    <!-- 文本选项 -->
    <RadioItem value="text">
      <span>文本选项</span>
    </RadioItem>

    <!-- 图片选项 -->
    <RadioItem value="image">
      <img src="https://via.placeholder.com/80" />
      <p>图片选项</p>
    </RadioItem>

    <!-- 自定义 slot（复杂内容） -->
    <RadioItem value="custom">
      <div>
        <h3>自定义内容</h3>
        <p>可以放任意组件</p>
        <button>按钮</button>
      </div>
    </RadioItem>
  </RadioGroup>
</template>
```

定义两个组件 `RadioGroup` 和 `RadioItem` ，`RadioGroup` 管理选中的数据

```html
<template>
  <div class="radio-group">
    <slot />
  </div>
</template>

<script setup>
  import { provide } from 'vue'

  const props = defineProps({
    modelValue: [String, Number],
  })
  const emit = defineEmits(['update:modelValue'])

  provide('radioValue', props)
  provide('radioChange', (val) => {
    emit('update:modelValue', val)
  })
</script>
```

`RadioItem` 负责各类数据的 UI 渲染，监听 change 事件来修改 value

```
<template>
  <div
    class="radio-item"
    :class="{ active: isChecked }"
    role="radio"
    :aria-checked="isChecked"
    @click="select"
  >
    <slot />
  </div>
</template>

<script setup>
import { inject, computed } from "vue";

const props = defineProps({
  value: [String, Number]
});

const radioValue = inject("radioValue");
const radioChange = inject("radioChange");

const isChecked = computed(() => radioValue.modelValue === props.value);

const select = () => {
  radioChange(props.value);
};
</script>
```

把单选框设计成 **RadioGroup + RadioItem 的组合组件**，用数据驱动选项，通过 slot 支持图片和文字等自定义内容，使用受控模式管理选中状态，并兼顾可访问性和性能。

## 如何排查网页白屏问题

白屏问题本质：**页面没渲染出来或 JS 报错中断了渲染**。排查要有顺序，从外到内、从简单到复杂。

先快速定位问题方向

- 看有没有 JS 报错（语法错误、接口报错、资源 404）。
- 看 HTML、JS、CSS 文件是否加载成功？核心接口是否返回 500 / 超时？
- 看 DOM 是否渲染出来？还是 body 是空的？

如果是 JS 报错了，就需要

- try/catch 关键逻辑
- 接入全局错误监控（`window.onerror`、`unhandledrejection`）

如果是 HTML、JS、CSS 文件加载失败，就检查 CDN 是否配置错误？这一般不会是程序问题。

如果核心接口返回 500 / 超时，那就在前端做容错方案，例如展示“获取数据失败，请刷新重试”

还可以加 ErrorBoundary 容错组件，来最大范围的概括各类组件渲染报错，给用户提示友好信息。

总之，先看控制台和网络请求，确认是 JS 报错、资源加载失败还是接口问题；再定位到具体代码。工程上通过错误监控、兜底 UI 和自动化监控来预防和快速发现白屏问题。

## 让你启动一个新项目，你将如何开始这个项目？

第一，要明确需求，先和产品、设计、后端对齐，搞清楚几个核心问题：

- **做什么**：后台管理系统、C端页面、还是小程序？
- **面向谁**：用户量多大、对性能/SEO 有没有要求？
- **工期多久**：赶进度就用成熟方案，不搞花活

第二，技术选型，要按公司团队情况选择，不要盲目求新

- **语言** JS TS
- **框架** Vue React Nextjs 等
- **UI 组件库** AntD Element 等
- **构建工具** Vite

第三，工程化搭建，环境搭好，后续才能高效协作

- 代码规范 ESLint + Prettier，保证风格统一
- 配置 CI/CD 流程（GitHub Actions / Jenkins）。
- 配置环境变量、打包优化（Tree Shaking、Code Splitting）和性能监控（Lighthouse / Sentry）。

第四，架构设计

- 代码目录结构
- Vuex Redux 等前端状态数据结构
- API 接口规范
- 请求封装：Axios 统一封装，处理 token、错误码、loading
- 权限控制：路由守卫 + 按钮级权限指令提前想好

```
src/
├── api/        # 所有接口，按模块拆分
├── components/ # 通用组件（Button、Modal...）
├── views/      # 页面级组件
├── hooks/      # 复用逻辑（useUser、useTable...）
├── stores/     # 状态管理（Pinia / Zustand）
├── router/     # 路由配置 + 权限守卫
└── utils/      # 工具函数
```

## 如何实现前端线上监控 前端线上报错如何排查

三个主要步骤：采集、上报、分析

采集什么？

- JS错误：`window.onerror`、`try-catch`捕获
- 资源加载失败：`window.addEventListener('error')`监听资源
- 接口请求：重写`XMLHttpRequest`和`fetch`
- 性能数据：`Performance API`获取FP、FCP、LCP等
- 用户行为：点击路径、路由变化

怎么上报？

- 封装成固定数据结构（错误信息、环境、用户、时间戳）
- 使用`Navigator.sendBeacon`（页面关闭时也能发）
- 图片打点（`new Image().src`）做简单上报
- 批量压缩上报，减少请求次数

数据存储和分析

- 后端可用 **ElasticSearch/Kafka/数据库** 保存日志
- 提供 **错误聚合、告警、统计报表**，快速定位问题

前端问题如何排查

- 前端报错日志分类、聚合，找出发生概率比较大的
- 使用 source map 将压缩代码映射回原始源代码
- 根据堆栈和出错代码判断逻辑或环境问题
- 在本地开发环境复现问题，并修复问题

## 一百万个人同时抢一个商品，如何判断谁是第一个？

这个问题的关键不在于前端，而在于后端，前端只是发起请求和展示结果。所以这个问题一般会考察全栈岗位或者高级前端岗位，需要有一定后段能力的。

后端实现这个功能，需要满足两点：

- 支持高并发，因为有一百万人同时抢购
- 要能准确识别第一个人，响应要快

常见的解决方案是 **后端原子操作** ，这个方案最简单可靠，容易支持高并发

- 所有请求打到后端
- 用 Redis / 数据库做原子判断

```
SETNX product_lock userId
```

第一个写入的 user 就是赢家，其他人直接返回失败。前端只负责发起请求和展示结果。
