# 前端工程化

前端工程化通过自动化工具和标准化流程，提升开发效率、代码质量和可维护性。其核心目标是优化开发、构建、测试和部署流程，减少人工干预和重复劳动，便于项目扩展和团队协作。常见的工具，如Vite和Webpack，提供高效的构建和打包能力，显著提升开发效率并丰富前端生态。这些工具的广泛应用使前端开发更加高效，且成为近年来面试中的热门话题。

## Vite为什么更快？

## vite中如何使用环境变量？

::: details 参考答案

根据当前的代码环境变化的变量就叫做**环境变量**。比如，在生产环境和开发环境将BASE_URL设置成不同的值，用来请求不同的环境的接口。

Vite内置了 `dotenv` 这个第三方库， dotenv会自动读取 `.env` 文件， dotenv 从你的 `环境目录` 中的下列文件加载额外的环境变量：

> .env # 所有情况下都会加载
> .env.[mode] # 只在指定模式下加载

默认情况下

- `npm run dev` 会加载 `.env` 和 `.env.development` 内的配置
- `npm run build` 会加载 `.env` 和 `.env.production` 内的配置
- `mode` 可以通过命令行 `--mode` 选项来重写。
  环境变量需以 VITE\_ 前缀定义，且通过 `import.meta.env` 访问。

示例：
.env.development：

```js
VITE_API_URL = 'http://localhost:3000'
```

在代码中使用：

```js
console.log(import.meta.env.VITE_API_URL) // http://localhost:3000
```

> 参考博文：[vite中环境变量的使用与配置](https://juejin.cn/post/7172012247852515335)

:::

## vite如何实现根据不同环境(qa、dev、prod)加载不同的配置文件？

::: details 参考答案

在 Vite 中，根据不同环境设置不同配置的方式，类似于 Webpack 时代的配置方法，但更加简化。Vite 使用 `defineConfig` 函数，通过判断 `command` 和 `mode` 来加载不同的配置。

- **通过 `defineConfig` 动态配置：**

Vite 提供的 `defineConfig` 函数可以根据 `command` 来区分开发环境（ `serve` ）和生产环境（ `build` ），并返回不同的配置。

```javascript
import { defineConfig } from 'vite'
import viteBaseConfig from './vite.base.config'
import viteDevConfig from './vite.dev.config'
import viteProdConfig from './vite.prod.config'

export default defineConfig(({ command, mode, ssrBuild }) => {
  if (command === 'serve') {
    // 开发环境独有配置
    return {
      ...viteBaseConfig,
      ...viteDevConfig,
    }
  } else {
    // 生产环境独有配置
    return {
      ...viteBaseConfig,
      ...viteProdConfig,
    }
  }
})
```

- **创建不同的配置文件**

`vite.base.config.ts` ：基础配置，适用于所有环境。

```javascript
import {
    defineConfig
} from "vite";
export default defineConfig({
    // 基础配置->使用所有场景
    return {
        plugins: [
            vue()
        ],
    }
});
```

`vite.dev.config.ts` ：开发环境配置。

```javascript
import { defineConfig } from 'vite'
export default defineConfig({
  // 开发环境专有配置
})
```

`vite.prod.config.ts` ：生产环境配置。

```javascript
import { defineConfig } from 'vite'
export default defineConfig({
  // 生产环境专有配置
})
```

> 参考博文：[vite指定配置文件及其在多环境下的配置集成方案](https://juejin.cn/post/7172009616967942175)

:::

## 简述Vite的依赖预加载机制。

## vite中如何加载、处理静态资源？

::: details 参考答案

🎯 **静态资源目录（public 目录）**：

- 静态资源可以放在 `public` 目录下，这些文件不会经过构建处理，直接按原样复制到输出目录。在开发时可以通过 `/` 路径直接访问，如 `/icon.png`。
- `public` 目录可通过 `vite.config.js` 中的 `publicDir` 配置项修改。

🎯 **资源引入**：

- **图片、字体、视频**：通过 `import` 引入，Vite 会自动将其处理为 URL 并生成带哈希值的文件名。在开发时，引用会是根路径（如 `/img.png`），在生产构建后会是如 `/assets/img.2d8efhg.png` 的路径。
- **CSS、JS**：CSS 会被自动注入到页面中，JS 按模块处理。

🎯 **强制作为 URL 引入**：通过 `?url` 后缀可以显式强制将某些资源作为 URL 引入。

```js
import imgUrl from './img.png?url'
```

🎯 **强制作为原始内容引入**：通过 `?raw` 后缀将文件内容作为字符串引入。

🎯 `new URL()` ：通过 `import.meta.url` 可以动态构建资源的 URL，这对于一些动态路径很有用。

```js
const imgUrl = new URL('./img.png', import.meta.url).href
document.getElementById('hero-img').src = imgUrl
```

> 参考博文：[vite中静态资源（css、img、svg等）的加载机制及其相关配](https://juejin.cn/post/7173467405522305055)

:::

## 如何在Vite项目中引入CSS预处理器?

## vite中可做的项目优化有哪些？

## 简述vite插件开发流程？

## 如何在Vite中配置代理？

## Vite如何集成TypeScript？如何配置？

## 什么是 Webpack？它的作用是什么？

## 如何使用 Webpack 配置多环境的不同构建配置？

## Webpack 的核心概念有哪些？请简单解释。

## 如何在 Webpack 中实现 CSS 和 Sass 的处理？

参考答案

::: details

在 Webpack 中处理 CSS 和 Sass（SCSS）需要配置相应的加载器（loaders）和插件（plugins）。

**1. 安装所需依赖**

```bash
npm install --save-dev \
  style-loader \
  css-loader \
  sass-loader \
  sass \
  postcss-loader \
  autoprefixer \
  mini-css-extract-plugin \
  css-minimizer-webpack-plugin
```

- **核心依赖**：
  - `style-loader`：将 CSS 注入 DOM。
  - `css-loader`：解析 CSS 文件中的 `@import` 和 `url()`。
  - `sass-loader`：将 Sass/SCSS 编译为 CSS。
  - `sass`：Sass 编译器（Dart Sass 实现）。
- **可选工具**：
  - `postcss-loader` 和 `autoprefixer`：自动添加浏览器前缀。
  - `mini-css-extract-plugin`：提取 CSS 为独立文件（生产环境推荐）。
  - `css-minimizer-webpack-plugin`：压缩 CSS（生产环境推荐）。

**2. 基础 Webpack 配置**
在 `webpack.config.js` 中添加以下规则和插件：

**配置 CSS 和 SCSS 处理**

```javascript
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')

module.exports = {
  module: {
    rules: [
      // 处理 CSS 文件
      {
        test: /\.css$/,
        use: [
          // 开发环境用 style-loader，生产环境用 MiniCssExtractPlugin.loader
          process.env.NODE_ENV === 'production' ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader',
          'postcss-loader', // 可选：添加浏览器前缀
        ],
      },
      // 处理 SCSS/Sass 文件
      {
        test: /\.(scss|sass)$/,
        use: [
          process.env.NODE_ENV === 'production' ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader',
          'postcss-loader', // 可选：添加浏览器前缀
          'sass-loader',
        ],
      },
    ],
  },
  plugins: [
    // 提取 CSS 为独立文件（生产环境）
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),
  ],
  optimization: {
    minimizer: [
      // 压缩 CSS（生产环境）
      new CssMinimizerPlugin(),
    ],
  },
}
```

**3. 配置 PostCSS（可选）**
创建 `postcss.config.js` 文件以启用 `autoprefixer`：

```javascript
module.exports = {
  plugins: [
    require('autoprefixer')({
      // 指定浏览器兼容范围
      overrideBrowserslist: ['last 2 versions', '>1%', 'not dead'],
    }),
  ],
}
```

通过配置 `css-loader`、`sass-loader` 和 `MiniCssExtractPlugin`，Webpack 可以高效处理 CSS 和 Sass。关键点包括：

1. 加载器顺序：从右到左（如 `[sass-loader, css-loader, style-loader]`）。
2. 生产环境提取 CSS：使用 `MiniCssExtractPlugin`。
3. 浏览器兼容性：通过 `postcss-loader` 和 `autoprefixer` 自动处理。

:::

## Webpack 中的入口和出口是什么？

参考答案

::: details

在 Webpack 中，**入口（Entry）** 和 **出口（Output）** 是配置文件中的核心概念，决定了打包的起点和终点。它们共同定义了 Webpack 如何处理代码以及最终生成的资源。

1. **入口（Entry）**
   入口是 Webpack 构建依赖图的起点，它告诉 Webpack：**“从哪个文件开始分析代码的依赖关系？”**

**作用**

- 指定应用程序的起始文件。
- 根据入口文件递归构建依赖关系树。
- 支持单入口（单页面应用）或多入口（多页面应用）。

**配置方式**
在 `webpack.config.js` 中通过 `entry` 属性配置：

```javascript
module.exports = {
  entry: './src/index.js', // 单入口（默认配置）

  // 多入口（多页面应用）
  entry: {
    home: './src/home.js',
    about: './src/about.js',
  },
}
```

**默认行为**

- 如果未手动配置 `entry`，Webpack 默认使用 `./src/index.js` 作为入口。

2. **出口（Output）**
   出口是 Webpack 打包后的资源输出位置，它告诉 Webpack：**“打包后的文件放在哪里？如何命名？”**

**作用**

- 定义打包文件的输出目录和命名规则。
- 处理静态资源的路径（如 CSS、图片等）。

**配置方式**
在 `webpack.config.js` 中通过 `output` 属性配置：

```javascript
const path = require('path')

module.exports = {
  output: {
    path: path.resolve(__dirname, 'dist'), // 输出目录（必须为绝对路径）
    filename: 'bundle.js', // 单入口输出文件名

    // 多入口时，使用占位符确保唯一性
    filename: '[name].[contenthash].js',
    clean: true, // 自动清理旧文件（Webpack 5+）
  },
}
```

**常用占位符**
| 占位符 | 说明 |
|---------------------|-------------------------------|
| `[name]` | 入口名称（如多入口的 `home`） |
| `[hash]` | 根据构建生成的唯一哈希值 |
| `[contenthash]` | 根据文件内容生成的哈希值 |
| `[chunkhash]` | 根据代码块生成的哈希值 |

:::

## Webpack 中的 Loaders 和 Plugins 有什么区别

参考答案

::: details

在 Webpack 中，**Loaders（加载器）** 和 **Plugins（插件）** 是构建流程中的两大核心概念，它们的作用和职责有明显区别。

**1. 核心区别总结**
| **特性** | **Loaders** | **Plugins** |
|----------------|---------------------------------|------------------------------------|
| **主要作用** | **转换文件内容**（如转译、预处理） | **扩展构建流程**（优化、资源管理、注入环境变量等） |
| **执行时机** | 在模块加载时（文件转换为模块时） | 在整个构建生命周期（从初始化到输出）的各个阶段 |
| **配置方式** | 通过 `module.rules` 数组配置 | 通过 `plugins` 数组配置（需要 `new` 实例化） |
| **典型场景** | 处理 JS/CSS/图片等文件转译 | 生成 HTML、压缩代码、提取 CSS 等全局操作 |
| **依赖关系** | 针对特定文件类型（如 `.scss`） | 不依赖文件类型，可干预整个构建流程 |

**2. Loaders 的作用与使用**
**核心功能**

- 将非 JavaScript 文件（如 CSS、图片、字体等）**转换为 Webpack 能处理的模块**。
- 对代码进行预处理（如 Babel 转译、Sass 编译）。

**配置示例**

```javascript
// webpack.config.js
module.exports = {
  module: {
    rules: [
      // 处理 CSS 文件
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      // 处理 TypeScript 文件
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
      },
      // 处理图片文件
      {
        test: /\.(png|jpg|gif)$/,
        type: 'asset/resource', // Webpack 5 内置方式（替代 file-loader）
      },
    ],
  },
}
```

**常见 Loaders**

- `babel-loader`: 将 ES6+ 代码转译为 ES5。
- `css-loader`: 解析 CSS 中的 `@import` 和 `url()`。
- `sass-loader`: 将 Sass/SCSS 编译为 CSS。
- `file-loader`: 处理文件（如图片）的导入路径。

**3. Plugins 的作用与使用**
**核心功能**

- 扩展 Webpack 的能力，干预构建流程的**任意阶段**。
- 执行更复杂的任务，如代码压缩、资源优化、环境变量注入等。

**配置示例**

```javascript
// webpack.config.js
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  plugins: [
    // 自动生成 HTML 文件，并注入打包后的资源
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
    // 提取 CSS 为独立文件
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),
  ],
}
```

**常见 Plugins**

- `HtmlWebpackPlugin`: 生成 HTML 文件并自动引入打包后的资源。
- `MiniCssExtractPlugin`: 将 CSS 提取为独立文件（替代 `style-loader`）。
- `CleanWebpackPlugin`: 清理构建目录（Webpack 5 中可用 `output.clean: true` 替代）。
- `DefinePlugin`: 注入全局常量（如 `process.env.NODE_ENV`）。

**4. 执行流程对比**
**Loaders 的执行流程**

```plaintext
文件资源 (如 .scss) → 匹配 Loader 规则 → 按顺序应用 Loaders → 转换为 JS 模块
```

- **顺序关键**：Loaders 从右到左（或从下到上）执行。  
  例如：`use: ['style-loader', 'css-loader', 'sass-loader']` 的执行顺序为：  
  `sass-loader` → `css-loader` → `style-loader`。

**Plugins 的执行流程**

```plaintext
初始化 → 读取配置 → 创建 Compiler → 挂载 Plugins → 编译模块 → 优化 → 输出
```

- **生命周期钩子**：Plugins 通过监听 Webpack 的[生命周期钩子](https://webpack.js.org/api/compiler-hooks/)（如 `emit`、`done`）干预构建流程。

**5. 协作示例**
一个同时使用 Loaders 和 Plugins 的典型场景：

```javascript
// webpack.config.js
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        // Loaders 处理链：sass → css → MiniCssExtractPlugin
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
    ],
  },
  plugins: [
    // Plugin：提取 CSS 为文件
    new MiniCssExtractPlugin(),
    // Plugin：生成 HTML
    new HtmlWebpackPlugin(),
  ],
}
```

:::

## Webpack中, 如何实现按需加载？

参考答案

::: details

在 Webpack 中实现按需加载（代码分割/懒加载）的核心思路是 **将代码拆分为独立 chunk，在需要时动态加载**。

**一、基础方法：动态导入（Dynamic Import）**
通过 `import()` 语法实现按需加载，Webpack 会自动将其拆分为独立 chunk。

**1. 代码中使用动态导入**

```javascript
// 示例：点击按钮后加载模块
document.getElementById('btn').addEventListener('click', async () => {
  const module = await import('./module.js')
  module.doSomething()
})
```

**2. 配置 Webpack**
确保 `webpack.config.js` 的 `output` 配置中包含 `chunkFilename`：

```javascript
module.exports = {
  output: {
    filename: '[name].bundle.js',
    chunkFilename: '[name].[contenthash].chunk.js', // 动态导入的 chunk 命名规则
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/', // 确保 chunk 的公共路径正确
  },
}
```

**二、框架集成：React/Vue 路由级按需加载**
结合前端框架的路由系统实现组件级懒加载。

**React 示例**

```javascript
import React, { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

const Home = lazy(() => import('./routes/Home'))
const About = lazy(() => import('./routes/About'))

function App() {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/about" component={About} />
        </Switch>
      </Suspense>
    </Router>
  )
}
```

**Vue 示例**

```javascript
const routes = [
  {
    path: '/',
    component: () => import('./views/Home.vue'),
  },
  {
    path: '/about',
    component: () => import('./views/About.vue'),
  },
]
```

**三、优化配置：代码分割策略**
通过 `SplitChunksPlugin` 优化公共代码提取。

**Webpack 配置**

```javascript
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all', // 对所有模块进行分割（包括异步和非异步）
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors', // 提取 node_modules 代码为 vendors 块
          priority: 10, // 优先级
          reuseExistingChunk: true,
        },
        common: {
          minChunks: 2, // 被至少两个 chunk 引用的代码
          name: 'common',
          priority: 5,
          reuseExistingChunk: true,
        },
      },
    },
  },
}
```

**四、Babel 配置（如需支持旧浏览器）**
安装 Babel 插件解析动态导入语法：

```bash
npm install @babel/plugin-syntax-dynamic-import --save-dev
```

在 `.babelrc` 或 `babel.config.json` 中添加插件：

```json
{
  "plugins": ["@babel/plugin-syntax-dynamic-import"]
}
```

**五、预加载与预取（可选优化）**
通过注释提示浏览器提前加载资源（需结合框架使用）。

**React 示例**

```javascript
const About = lazy(
  () =>
    import(
      /* webpackPrefetch: true */ // 预取（空闲时加载）
      /* webpackPreload: true */ // 预加载（与父 chunk 并行加载）
      './routes/About'
    )
)
```

**六、验证效果**

1. **构建产物分析**：

   - 运行 `npx webpack --profile --json=stats.json` 生成构建报告。
   - 使用 [Webpack Bundle Analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer) 可视化分析 chunk 分布。

2. **网络请求验证**：
   - 打开浏览器开发者工具，观察触发动态导入时是否加载新 chunk。

:::

## 什么是 Tree Shaking？如何在 Webpack 中启用它？

参考答案

::: details

**Tree Shaking（摇树优化）** 是一种在打包过程中 **移除 JavaScript 项目中未使用代码（Dead Code）** 的优化技术。它的名字形象地比喻为“摇动树以掉落枯叶”，即通过静态代码分析，识别并删除未被引用的模块或函数，从而减小最终打包体积。

**Tree Shaking 的工作原理**

1. **基于 ES Module（ESM）的静态结构**  
   ESM 的 `import/export` 是静态声明（代码执行前可确定依赖关系），而 CommonJS 的 `require` 是动态的。只有 ESM 能被 Tree Shaking 分析。
2. **标记未使用的导出**  
   打包工具（如 Webpack）通过分析代码，标记未被任何模块导入的导出。
3. **压缩阶段删除**  
   结合代码压缩工具（如 Terser）删除这些标记的未使用代码。

**在 Webpack 中启用 Tree Shaking 的步骤**
**1. 使用 ES Module 语法**
确保项目代码使用 `import/export`，而非 CommonJS 的 `require`。

```javascript
// ✅ 正确：ESM 导出
export function add(a, b) {
  return a + b
}
export function subtract(a, b) {
  return a - b
}

// ✅ 正确：ESM 导入
import { add } from './math'

// ❌ 错误：CommonJS 导出
module.exports = { add, subtract }
```

**2. 配置 Webpack 的 `mode` 为 `production`**
在 `webpack.config.js` 中设置 `mode: 'production'`，这会自动启用 Tree Shaking 和代码压缩。

```javascript
module.exports = {
  mode: 'production', // 启用生产模式优化
  // ...
}
```

**3. 禁用模块转换（Babel 配置）**
确保 Babel 不会将 ESM 转换为 CommonJS。在 `.babelrc` 或 `babel.config.json` 中设置：

```json
{
  "presets": [
    ["@babel/preset-env", { "modules": false }] // 保留 ESM 语法
  ]
}
```

**4. 标记副作用文件（可选）**
在 `package.json` 中声明哪些文件有副作用（如全局 CSS、Polyfill），避免被错误删除：

```json
{
  "sideEffects": [
    "**/*.css", // CSS 文件有副作用（影响样式）
    "src/polyfill.js" // Polyfill 有副作用
  ]
}
```

若项目无副作用文件，直接设为 `false`：

```json
{
  "sideEffects": false
}
```

**5. 显式配置 `optimization.usedExports`**
在 `webpack.config.js` 中启用 `usedExports`，让 Webpack 标记未使用的导出：

```javascript
module.exports = {
  optimization: {
    usedExports: true, // 标记未使用的导出
    minimize: true, // 启用压缩（删除未使用代码）
  },
}
```

**验证 Tree Shaking 是否生效**
**方法 1：检查打包后的代码**
若未使用的函数（如 `subtract`）被删除，说明 Tree Shaking 生效：

```javascript
// 打包前 math.js
export function add(a, b) {
  return a + b
}
export function subtract(a, b) {
  return a - b
}

// 打包后（仅保留 add）
function add(a, b) {
  return a + b
}
```

**方法 2：使用分析工具**
通过 [Webpack Bundle Analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer) 可视化分析打包结果：

```bash
npm install --save-dev webpack-bundle-analyzer
```

配置 `webpack.config.js`：

```javascript
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = {
  plugins: [new BundleAnalyzerPlugin()],
}
```

运行构建后，浏览器将自动打开分析页面，检查未使用的模块是否被移除。

| **步骤**             | **关键配置**                         | **作用**                     |
| -------------------- | ------------------------------------ | ---------------------------- |
| 使用 ESM 语法        | `import/export`                      | 提供静态分析基础             |
| 设置生产模式         | `mode: 'production'`                 | 自动启用 Tree Shaking 和压缩 |
| 配置 Babel           | `"modules": false`                   | 保留 ESM 结构                |
| 标记副作用文件       | `package.json` 的 `sideEffects` 字段 | 防止误删有副作用的文件       |
| 显式启用 usedExports | `optimization.usedExports: true`     | 标记未使用的导出             |

:::
