# 前端工程化

前端工程化通过自动化工具和标准化流程，提升开发效率、代码质量和可维护性。其核心目标是优化开发、构建、测试和部署流程，减少人工干预和重复劳动，便于项目扩展和团队协作。

常见的工具，如Vite和Webpack，提供高效的构建和打包能力，显著提升开发效率并丰富前端生态。这些工具的广泛应用使前端开发更加高效，且成为近年来面试中的热门话题。

::: tip
如有疑问，可免费 [加群](/docs/services/group.md) 讨论咨询，也可参与 [1v1 面试咨询服务](/docs/services/1v1.md)， 专业、系统、高效、全流程 准备前端面试
:::

## Vite为什么更快？

::: details 参考答案

Vite 相比传统构建工具（如 Webpack）更快🚀，主要得益于以下几个核心特性：

- 基于原生 ES 模块（ESM）：Vite 利用浏览器原生的 ES 模块，在开发模式下`按需加载`模块，避免了整体打包，从而减少了启动时间。它通过只编译实际修改的文件，提升了开发过程中的反馈速度。
- 高效的热模块替换（HMR）：Vite 在开发模式下利用原生 ES 模块实现模块级的热更新。当文件发生变化时，Vite 只会重新加载发生变化的模块，而不是重新打包整个应用，极大提高了热更新的速度。
- 使用 esbuild 进行快速编译：Vite 默认使用 esbuild 作为编译工具，相比传统的 JavaScript 编译工具（如 Babel、Terser），esbuild 提供显著的性能提升，能够快速完成代码转换和压缩，从而加速开发和构建过程。
- 现代 JavaScript 特性支持：Vite 在生产环境中使用 Rollup 构建，支持优秀的树摇和代码拆分，有效减小构建体积。同时，Vite 利用现代浏览器特性（如动态导入、ES2015+ 模块），减少了 polyfill 的使用，提升了加载速度。
- 预构建和缓存：Vite 在开发时会预构建常用依赖（如 Vue、React），并将其转换为浏览器可执行的格式，避免每次启动时重新编译。同时，Vite 会缓存这些预构建的依赖，并在启动时复用缓存，从而加快启动速度。

:::

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

::: details 参考答案

Vite 的依赖预构建机制通过在开发模式下提前处理常用依赖（如 Vue、React 等），将这些依赖转换为浏览器可以直接执行的格式。这避免了每次启动时重新编译这些依赖，显著提升了启动速度。预构建的依赖被缓存，并在后续启动时复用缓存，进一步加速了开发过程中的构建和启动时间。

具体来说，它的工作原理如下：

- **依赖识别和路径补全**： Vite 会首先识别项目中需要的依赖，并对非绝对路径或相对路径的引用进行路径补全。比如，`Vue` 的加载路径会变为 `node_modules/.vite/deps/Vue.js?v=1484ebe8`，这一路径显示了 Vite 在 `node_modules/.vite/deps` 文件夹下存放了经过预处理的依赖文件。
- **转换成 ES 模块**： 一些第三方包（特别是遵循 CommonJS 规范的包）在浏览器中无法直接使用。为了应对这种情况，Vite 会使用 **esbuild** 工具将这些依赖转换为符合 ES 模块规范的代码。转换后的代码会被存放在 `node_modules/.vite/deps` 文件夹下，这样浏览器就能直接识别并加载这些依赖。
- **统一集成 ES 模块**： Vite 会对每个包的不同模块进行统一集成，将各个分散的模块（如不同的 ES 函数或组件）合并成一个或几个文件。这不仅减少了浏览器发起多个请求的次数，还能够加快页面加载速度。

> 参考博文：[vite的基础使用及其依赖预加载机制](https://juejin.cn/post/7172007612379054093#heading-3)、[手写vite让你深刻了解Vite的文件加载原理](https://juejin.cn/post/7178803290820804667)

:::

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

::: details 参考答案

在 Vite 中使用 CSS 预处理器（如 Sass、Less）是非常简单的，Vite 默认支持这些预处理器，我们只需要安装相应的依赖即可。

安装依赖：

```js
npm install sass--save - dev
```

在 Vue 组件中使用：

```vue
<style lang="scss">
$primary-color: #42b983;
body {
  background-color: $primary-color;
}
</style>
```

此外，我们可以通过在vite的 `preprocessorOptions` 中进行配置，使用CSS 预处理器的一些强大功能。

对于 Less，假如我们需要在项目中全局使用某些变量，我们可以在 `vite.config.js` 中配置 `globalVars` ，使得变量在所有文件中无需单独引入：

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  css: {
    preprocessorOptions: {
      less: {
        globalVars: {
          blue: '#1CC0FF', // 定义全局变量
        },
      },
    },
  },
})
```

一旦配置了全局变量，我们就可以在任何 Vue 组件中直接使用它，无需再次引入：

```vue
<style scoped lang="less">
.wrap {
  background: red;
  color: @blue; // 使用全局变量
}
</style>
```

> 参考博文：[vite中如何更优雅的使用css](https://juejin.cn/post/7175366648659411000)、[Vite中预处理器(如less)的配置](https://juejin.cn/post/7177549666291515447)、[使用postcss完善vite项目中的css配置](https://juejin.cn/post/7178454300572516409)

:::

## vite中可做的项目优化有哪些？

::: details 参考答案

1️⃣ 启用 Gzip/Brotli 压缩

使用 `vite-plugin-compression` 插件开启 Gzip 或 Brotli 压缩，可以有效减小传输的文件体积，提升加载速度。

安装依赖：

```javascript
npm install vite - plugin - compression--save - dev
```

配置示例：

```javascript
import compression from 'vite-plugin-compression'
export default defineConfig({
  plugins: [
    compression({
      algorithm: 'gzip', // 或 'brotli' 压缩
      threshold: 10240, // 文件大于 10KB 时启用压缩
    }),
  ],
})
```

> 参考博文：[vite打包优化vite-plugin-compression的使用](https://juejin.cn/post/7222901994840244279)

2️⃣ 代码分割

- 🎯 路由分割

使用动态导入实现按需加载，减小初始包的体积，提高页面加载速度。

```javascript
const module = import('./module.js') // 动态导入
```

或者在路由中使用懒加载：

```javascript
const MyComponent = () => import('./MyComponent.vue')
```

- 🎯 手动控制分包

在 Vite 中，你可以通过配置 Rollup 的 `manualChunks` 选项来手动控制如何分割代码。这个策略适用于想要将特定的依赖或模块提取成单独的 chunk 文件。

```javascript
import { defineConfig } from 'vite'
export default defineConfig({
  build: {
    minify: false,
    // 在这里配置打包时的rollup配置
    rollupOptions: {
      manualChunks: (id) => {
        if (id.includes('node_modules')) {
          return 'vendor'
        }
      },
    },
  },
})
```

> 参考博文：[Vite性能优化之分包策略](https://juejin.cn/post/7177982374259949624)

3️⃣ 图片优化

使用 `vite-plugin-imagemin` 插件对项目中的图片进行压缩，减少图片体积，提升加载速度。

```javascript
npm install vite - plugin - imagemin--save - dev
```

```javascript
export default defineConfig({
  plugins: [
    ViteImagemin({
      gifsicle: {
        optimizationLevel: 3,
      },
      optipng: {
        optimizationLevel: 7,
      },
      mozjpeg: {
        quality: 85,
      },
      pngquant: {
        quality: [0.65, 0.9],
      },
    }),
  ],
})
```

4️⃣ 依赖优化

配置 Vite 的 `optimizeDeps` 选项，提前预构建常用依赖，减少开发环境下的启动时间。

```javascript
export default defineConfig({
  optimizeDeps: {
    include: ['lodash', 'vue', 'react'], // 预构建依赖
  },
})
```

> 参考博文：[vite的基础使用及其依赖预加载机制](https://juejin.cn/post/7172007612379054093#heading-3)

:::

## 简述vite插件开发流程？

::: details 参考答案

Vite 插件开发基于 Rollup 插件系统，因此其生命周期和钩子与 Rollup 插件非常相似。以下是开发流程和关键步骤：

1️⃣ **理解插件生命周期**
Vite 插件有一系列生命周期钩子，每个钩子对应不同的功能需求，主要钩子包括：

- **config**：用于修改 Vite 配置，通常在构建或开发过程中使用。
- **configureServer**：用于修改开发服务器的行为，如自定义请求处理。
- **transform**：对文件内容进行转换，适用于文件类型转换或代码处理。
- **buildStart** 和 **buildEnd**：在构建过程开始和结束时触发，适用于日志记录或优化操作。

插件开发的核心是根据具体需求，在合适的生命周期钩子中实现业务逻辑。

2️⃣ **插件基本结构**

Vite 插件的基本结构如下：

```javascript
export default function myVitePlugin() {
  return {
    name: 'vite-plugin-example', // 插件名称
    config(config) {
      // 修改 Vite 配置
    },
    configureServer(server) {
      // 修改开发服务器行为
    },
    transform(src, id) {
      // 对文件内容进行转换
    },
  }
}
```

插件对象必须包含一个 `name` 属性，用于标识插件，还可以根据需求实现其他钩子。

3️⃣ **插件开发**

在插件开发过程中，根据需求实现不同的钩子逻辑。例如，假设我们需要创建一个插件来处理自定义文件类型并将其转换为 JavaScript：

```javascript
const fileRegex = /\.(my-file-ext)$/

export default function transformFilePlugin() {
  return {
    name: 'vite-plugin-transform-file',
    transform(src, id) {
      if (fileRegex.test(id)) {
        return {
          code: compileFileToJS(src), // 将文件内容转换为 JavaScript
          map: null, // 可以返回 source map
        }
      }
    },
  }
}
```

- **transform**：此钩子对符合 `fileRegex` 正则表达式的文件（`.my-file-ext`）进行转换，并返回转换后的 JavaScript 代码。

4️⃣ **插件使用**

插件开发完成后，可以在 Vite 配置中使用：

```javascript
import transformFilePlugin from 'vite-plugin-transform-file'

export default {
  plugins: [transformFilePlugin()],
}
```

5️⃣ **发布插件**

开发完成后，插件可以通过 npm 发布，或者将其托管在 GitHub 上，方便团队或社区使用。

> 参考博文：[https://juejin.cn/post/7270528132167417915](https://juejin.cn/post/7270528132167417915)

:::

## 如何在Vite中配置代理？

::: details 参考答案
在 Vite 中配置代理可以通过 `server.proxy` 选项来实现。以下是一个示例配置：

```javascript
// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    proxy: {
      // 代理 /api 请求到目标服务器
      '/api': {
        target: 'http://localhost:5000', // 目标服务器地址
        changeOrigin: true, // 修改请求头中的 Origin 字段为目标服务器的 origin
        secure: false, // 是否允许 HTTPS 请求
        rewrite: (path) => path.replace(/^\/api/, ''), // 重写请求路径，将 /api 替换为空
      },

      // 代理某些静态资源请求
      '/assets': {
        target: 'http://cdn-server.com', // 目标是静态资源服务器
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/assets/, '/static'), // 将 /assets 路径重写为 /static
      },
    },
  },
})
```

:::

## Vite如何集成TypeScript？如何配置？

::: details 参考方案

Vite 对 TypeScript 提供了开箱即用的支持，无需额外安装插件。

我们创建一个 `index.html` 文件并引入 `main.ts` 文件：

```javascript
<script src="./main.ts" type="module">
  {' '}
</script>
```

在 `main.ts` 中，可以写入一些 TypeScript 代码：

```javascript
let tip: string = "这是一个vite项目，使用了ts语法";
console.log('tip: ', tip);
```

运行 `vite` 后，可以看到控制台输出内容，表明 Vite 天生支持 TypeScript。

在 Vite 项目中，虽然默认支持 TypeScript，但 Vite 本身不会阻止编译时出现 TypeScript 错误。为了更严格的类型检查和错误提示，我们需要配置 TypeScript。

- 添加 TypeScript 配置（如果没有）

通过以下命令生成 `tsconfig.json` 配置文件

```plain
npx tsc --init
```

创建好 `tsconfig.json` 后，Vite 会根据该配置文件来编译 TypeScript。

- 强化 TypeScript 错误提示

Vite 默认不会阻止编译时的 TypeScript 错误。如果我们想要在开发时严格检查 TypeScript 错误并阻止编译，可以使用 `vite-plugin-checker` 插件。

```javascript
npm i vite - plugin - checker--save - dev
```

然后在 `vite.config.ts` 中引入并配置该插件：

```typescript
// vite.config.ts
import checker from 'vite-plugin-checker'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [checker({ typescript: true })],
})
```

这样，任何 TypeScript 语法错误都会在控制台显示，并阻止编译。

- 打包时进行 TypeScript 检查

虽然 Vite 只会执行 `.ts` 文件的转译，而不会执行类型检查，但我们可以通过以下方式确保在打包时进行 TypeScript 类型检查。

修改 `package.json` 配置

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc --noEmit && vite build"
  }
}
```

`tsc --noEmit` 会执行类型检查，但不会生成编译后的文件。如果存在类型错误，打包过程会被阻止。

- TypeScript 智能提示

Vite 默认为 `import.meta.env` 提供了类型定义，但是对于自定义的 `.env` 文件，TypeScript 的智能提示默认不生效。为了实现智能提示，可以在 `src` 目录下创建一个 `env.d.ts` 文件：

```typescript
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_APP_HAHA: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

> 参考博文:https://juejin.cn/post/7177210200330829885

:::

## 什么是 Webpack？它的作用是什么？

参考答案

::: details

Webpack 是一个开源的 **前端静态模块打包工具**，主要用于将现代 JavaScript 应用中的各种资源（代码、样式、图片等）转换为优化的静态文件。它是现代前端开发的核心工具之一，尤其在复杂项目中扮演着关键角色。

**Webpack 的核心作用**

1. **模块化支持**

   - **解决问题**：将代码拆分为多个模块（文件），管理依赖关系。
   - **支持语法**：

     - ES Modules ( `import/export` )
     - CommonJS ( `require/module.exports` )
     - AMD 等模块化方案。

```javascript
// 模块化开发
import Header from './components/Header.js'
import styles from './styles/main.css'
```

2. **资源整合**
   - **处理非 JS 文件**：将 CSS、图片、字体、JSON 等资源视为模块，统一管理。

```javascript
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg)$/,
        type: 'asset/resource',
      },
    ],
  },
}
```

3. **代码优化**

   - **功能**：

     - **Tree Shaking**：删除未使用的代码。
     - **代码分割（Code Splitting）**：按需加载代码，减少首屏体积。
     - **压缩**：减小文件体积，提升加载速度。

```javascript
// 动态导入实现按需加载
button.addEventListener('click', () => {
  import('./module.js').then((module) => module.run())
})
```

4. **开发工具集成**

   - **功能**：

     - **热更新（HMR）**：实时预览代码修改效果。
     - **Source Map**：调试时映射压缩代码到源代码。
     - **本地服务器**：快速启动开发环境。

```javascript
devServer: {
        hot: true, // 启用热更新
        open: true, // 自动打开浏览器
    },
    devtool: 'source-map', // 生成 Source Map
```

5. **生态扩展**
   - **Loader**：处理特定类型文件（如 `.scss` → `.css` ）。
   - **Plugin**：优化构建流程（如生成 HTML、压缩代码）。

```javascript
plugins: [
    new HtmlWebpackPlugin({
        template: './src/index.html'
    }),
    new MiniCssExtractPlugin(),
],
```

**Webpack 的工作流程**

1. **入口（Entry）**：从指定文件（如 `index.js`）开始分析依赖。
2. **依赖图（Dependency Graph）**：递归构建模块间的依赖关系。
3. **加载器（Loaders）**：转换非 JS 资源（如编译 Sass、处理图片）。
4. **插件（Plugins）**：在构建生命周期中执行优化任务。
5. **输出（Output）**：生成优化后的静态文件（如 `bundle.js`）。

**与其他工具对比**
| **工具** | **定位** | **与 Webpack 的区别** |
|----------------|-----------------------------|-------------------------------------------|
| Gulp/Grunt | 任务运行器（Task Runner） | 处理文件流，但无模块化支持 |
| Rollup | 库打包工具 | 更适合库开发，Tree Shaking 更激进 |
| Vite | 新一代构建工具 | 基于原生 ESM，开发环境更快，生产依赖 Rollup |

**适用场景**

- **单页应用（SPA）**：如 React、Vue、Angular 项目。
- **复杂前端工程**：多页面、微前端架构。
- **静态网站生成**：结合 Markdown、模板引擎使用。

Webpack 通过 **模块化整合**、**代码优化** 和 **开发效率提升**，解决了前端工程中资源管理混乱、性能瓶颈和开发体验差的问题。它不仅是打包工具，更是现代前端工程化的基础设施。

:::

## 如何使用 Webpack 配置多环境的不同构建配置？

参考答案

::: details

在 Webpack 中配置多环境（如开发环境、测试环境、生产环境）的构建配置，可以通过 **环境变量注入** 和 **配置合并** 的方式实现。

**步骤 1：安装依赖工具**

```bash
npm install webpack-merge cross-env --save-dev
```

- **webpack-merge**：用于合并基础配置和环境专属配置。
- **cross-env**：跨平台设置环境变量（兼容 Windows 和 macOS/Linux）。

**步骤 2：创建配置文件结构**

```
project/
├── config/
│   ├── webpack.common.js    # 公共配置
│   ├── webpack.dev.js       # 开发环境配置
│   └── webpack.prod.js      # 生产环境配置
├── src/
│   └── ...                  # 项目源码
└── package.json
```

**步骤 3：编写公共配置 ( `webpack.common.js` )**

```javascript
// config/webpack.common.js
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, '../dist'),
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
}
```

**步骤 4：编写环境专属配置**

开发环境 ( `webpack.dev.js` )

```javascript
// config/webpack.dev.js
const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')
const webpack = require('webpack')

module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval-source-map',
  devServer: {
    hot: true,
    open: true,
    port: 3000,
  },
  plugins: [
    // 注入环境变量（可在代码中通过 process.env.API_URL 访问）
    new webpack.DefinePlugin({
      'process.env.API_URL': JSON.stringify('https://dev.api.com'),
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
  ],
})
```

生产环境 ( `webpack.prod.js` )

```javascript
// config/webpack.prod.js
const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const webpack = require('webpack')

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  optimization: {
    minimizer: [
      '...', // 保留默认的 JS 压缩配置
      new CssMinimizerPlugin(),
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.API_URL': JSON.stringify('https://prod.api.com'),
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
  ],
})
```

**步骤 5：配置 `package.json` 脚本**

```json
{
  "scripts": {
    "start": "cross-env NODE_ENV=development webpack serve --config config/webpack.dev.js",
    "build:dev": "cross-env NODE_ENV=development webpack --config config/webpack.dev.js",
    "build:prod": "cross-env NODE_ENV=production webpack --config config/webpack.prod.js"
  }
}
```

**步骤 6：在代码中使用环境变量**

```javascript
// src/index.js
console.log('当前环境:', process.env.NODE_ENV)
console.log('API 地址:', process.env.API_URL)

// 根据不同环境执行不同逻辑
if (process.env.NODE_ENV === 'development') {
  console.log('这是开发环境')
} else {
  console.log('这是生产环境')
}
```

**步骤 7：运行命令**

```bash
# 启动开发服务器（热更新）
npm run start

# 构建开发环境产物
npm run build:dev

# 构建生产环境产物
npm run build:prod
```

**扩展：支持更多环境（如测试环境）**

1. 创建 `webpack.stage.js`

```javascript
// config/webpack.stage.js
const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')
const webpack = require('webpack')

module.exports = merge(common, {
  mode: 'production',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.API_URL': JSON.stringify('https://stage.api.com'),
      'process.env.NODE_ENV': JSON.stringify('staging'),
    }),
  ],
})
```

2. 添加 `package.json` 脚本

```json
{
  "scripts": {
    "build:stage": "cross-env NODE_ENV=staging webpack --config config/webpack.stage.js"
  }
}
```

| **配置项**   | **开发环境**          | **生产环境**           | **测试环境**            |
| ------------ | --------------------- | ---------------------- | ----------------------- |
| `mode`       | `development`         | `production`           | `production`            |
| `devtool`    | `eval-source-map`     | `source-map`           | `source-map`            |
| `devServer`  | ✅ 启用               | ❌ 不启用              | ❌ 不启用               |
| **代码压缩** | ❌ 不压缩             | ✅ CSS/JS 压缩         | ✅ CSS/JS 压缩          |
| **环境变量** | `API_URL=dev.api.com` | `API_URL=prod.api.com` | `API_URL=stage.api.com` |

:::

## Webpack 的核心概念有哪些？请简单解释。

参考答案

::: details

Webpack 的核心概念是理解其工作原理和配置的基础，以下是它们的简要解释：

**1. 入口（Entry）**

- **作用**：定义 Webpack **构建依赖图的起点**，通常为项目的主文件（如 `index.js`）。

```javascript
entry: './src/index.js', // 单入口
    entry: {
        app: './src/app.js',
        admin: './src/admin.js'
    }, // 多入口
```

**2. 出口（Output）**

- **作用**：指定打包后的资源**输出位置和命名规则**。

```javascript
output: {
    filename: '[name].bundle.js', // 输出文件名（[name] 为入口名称）
    path: path.resolve(__dirname, 'dist'), // 输出目录（绝对路径）
    clean: true, // 自动清理旧文件（Webpack 5+）
}
```

**3. 加载器（Loaders）**

- **作用**：让 Webpack **处理非 JavaScript 文件**（如 CSS、图片、字体等），将其转换为有效模块。

```javascript
module: {
    rules: [{
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        }, // 处理 CSS
        {
            test: /\.(png|svg)$/,
            type: 'asset/resource'
        }, // 处理图片（Webpack 5+）
    ],
}
```

**4. 插件（Plugins）**

- **作用**：扩展 Webpack 功能，干预**整个构建流程**（如生成 HTML、压缩代码、提取 CSS）。

```javascript
plugins: [
  new HtmlWebpackPlugin({
    template: './src/index.html',
  }), // 生成 HTML
  new MiniCssExtractPlugin(), // 提取 CSS 为独立文件
]
```

**5. 模式（Mode）**

- **作用**：预设优化策略，区分**开发环境**（`development`）和**生产环境**（`production`）。

```javascript
mode: 'production', // 启用代码压缩、Tree Shaking 等优化
```

**6. 模块（Modules）**

- **作用**：Webpack 将每个文件视为**模块**（如 JS、CSS、图片），通过依赖关系构建依赖图。
- **特点**：支持 ESM、CommonJS、AMD 等模块化语法。

**7. 代码分割（Code Splitting）**

- **作用**：将代码拆分为多个文件（chunks），实现**按需加载**或**并行加载**，优化性能。
- **实现方式**：
  - 动态导入（`import()`）
  - 配置 `optimization.splitChunks`

**8. Tree Shaking**

- **作用**：通过静态分析**移除未使用的代码**，减小打包体积。
- **前提**：使用 ES Module（`import/export`），并启用生产模式（`mode: 'production'`）。

:::

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
创建 `postcss.config.js` 文件以启用 `autoprefixer` ：

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

通过配置 `css-loader` 、 `sass-loader` 和 `MiniCssExtractPlugin` ，Webpack 可以高效处理 CSS 和 Sass。关键点包括：

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
| `[name]` | 入口名称（如多入口的 `home` ） |
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
| **依赖关系** | 针对特定文件类型（如 `.scss` ） | 不依赖文件类型，可干预整个构建流程 |

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
  例如： `use: ['style-loader', 'css-loader', 'sass-loader']` 的执行顺序为：
  `sass-loader` → `css-loader` → `style-loader` 。

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
确保 `webpack.config.js` 的 `output` 配置中包含 `chunkFilename` ：

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
      <Suspense fallback={<div> Loading... </div>}>
        {' '}
        <Switch>
          <Route exact path="/" component={Home} />{' '}
          <Route
            path="/about
        "
            component={About}
          />{' '}
        </Switch>{' '}
      </Suspense>{' '}
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
确保项目代码使用 `import/export` ，而非 CommonJS 的 `require` 。

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
module.exports = {
  add,
  subtract,
}
```

**2. 配置 Webpack 的 `mode` 为 `production` **
在 `webpack.config.js` 中设置 `mode: 'production'` ，这会自动启用 Tree Shaking 和代码压缩。

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

若项目无副作用文件，直接设为 `false` ：

```json
{
  "sideEffects": false
}
```

**5. 显式配置 `optimization.usedExports` **
在 `webpack.config.js` 中启用 `usedExports` ，让 Webpack 标记未使用的导出：

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
若未使用的函数（如 `subtract` ）被删除，说明 Tree Shaking 生效：

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

配置 `webpack.config.js` ：

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
