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

## Webpack 中的入口和出口是什么？

## Webpack 中的 Loaders 和 Plugins 有什么区别

## Webpack中, 如何实现按需加载？

## 什么是 Tree Shaking？如何在 Webpack 中启用它？
