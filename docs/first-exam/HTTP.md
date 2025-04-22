# HTTP 网络请求

HTTP 和 Ajax 是前后端沟通的桥梁，面试重点考察，无论工作经验长短。

::: tip
如有疑问，可免费 [加群](/docs/services/group.md) 讨论咨询，也可参与 [1v1 面试咨询服务](/docs/services/1v1.md)， 专业、系统、高效、全流程 准备前端面试
:::

## TCP 是如何建立连接的，三次握手，四次挥手

参考答案

::: details

三次握手

- 客户端向服务端发送建立连接请求，客户端进入 SYN-SEND 状态
- 服务端收到建立连接请求后，向客户端发送一个应答，服务端进入 SYN-RECEIVED 状态
- 客户端接收到应答后，向服务端发送确认接收到应答，客户端进入 ESTABLISHED 状态

四次挥手

- 客户端向服务端发送断开连接请求
- 服务端收到断开连接请求后，告诉应用层去释放 tcp 连接
- 服务端向客户端发送最后一个数据包 FINBIT ，服务端进入 LAST-ACK 状态
- 客户端收到服务端的断开连接请求后，向服务端确认应答

> 三次握手四次挥手，客户端都是主动方，服务端都是被动方。在状态方面：三次握手的客户端和服务端都是由原来的 closed 变为 established，四次挥手的客户端和服务端都是由原来的 established 变为 closed。

:::

参考资料

::: details

- https://juejin.cn/post/7350107540327022601
  :::

## HTTP 几个版本的区别

参考答案

::: details

#### HTTP/0.9 - 单行协议

- 只有 GET 请求行，无请求头和请求体
- 只能传输 HTML 文件，以 ASCII 字符流返回
- 无响应头

#### HTTP/1.0 - 多类型支持

- 支持多种文件类型传输，不限于 ASCII 编码
- 引入请求头和响应头( key-value 形式)
- 每个请求都需要建立新的 TCP 连接

#### HTTP/1.1 - 持久连接

- 引入持久连接( keep-alive )：一个 TCP 连接可传输多个 HTTP 请求
- 默认开启 keep-alive，通常限制 6-8 个并发连接
- 存在队头阻塞问题：前面的请求阻塞会影响后续请求
- 引入 Host 字段，支持虚拟主机
- 引入 Chunk transfer 机制处理动态内容长度

#### HTTP/2.0 - 多路复用

- 一个域名只使用一个 TCP 长连接
- 引入二进制分帧层，实现多路复用
- 可对请求设置优先级
- 引入 HTTPS(HTTP + TLS) 加密

#### HTTP/3.0 - QUIC 协议

- 基于 UDP 协议而非 TCP
- 实现了类似 TCP 的流量控制和可靠传输
- 集成 TLS 加密
- 实现多路复用
- 解决 TCP 队头阻塞问题

:::

参考资料

::: details

- https://juejin.cn/post/7350520171611652147
  :::

## HTTP 常见的状态码

参考答案

::: details

- 200 请求成功，请求在服务端被正确处理
- 204 响应成功，没有数据
- 205 服务器处理成功，浏览器应重置文档视图
- 206 服务器成功处理了部分get请求
- 301 资源永久重定向
- 302 资源临时重定向
- 303 让你查看其他地址
- 304 请求的资源没有修改，服务端不会返回任何资源，协商缓存
- 400 请求语法错误，服务器看不懂
- 401 请求没有携带信息，比如 token 认证失败
- 403 请求被拒绝、敏感词
- 404 找不到资源
- 500 服务器内部错误，无法完成请求
- 501 服务器不支持当前请求所需的功能
- 503 服务器系统维护或者超载，暂时无法处理客户端的请求

:::

## HTTP 常见 Header

参考答案

::: details

请求头

- accept: text/html 告诉服务端我期望接收到一个html的文件
- accept-encoding: gzip, deflate, br 告诉服务端以这种方式压缩
- accept-language: zh-CN 告诉服务端以中文的格式返回
- authorization: 告诉服务端授权信息
- cookie: 告诉服务端客户端存储的 cookie
- origin: 告诉服务端请求的来源

响应头

- content-encoding: br 告诉浏览器压缩方式是br
- content-type: text/html; charset=utf-8 告诉浏览器以这种方式，编码加载
- cache-control: 告诉浏览器缓存策略
- expires: 告诉浏览器缓存过期时间
- set-cookie: 告诉浏览器设置 cookie
- access-control-allow-origin: \* 告诉浏览器允许跨域

:::

## URL 包含哪些部分？

参考答案

::: details

URL (Uniform Resource Locator) 包含以下部分：

1. 协议 (protocol)：如 `http://`、`https://`、`ftp://` 等

2. 域名 (domain)：如 `www.example.com`

   - 子域名：`www`
   - 主域名：`example`
   - 顶级域名：`com`

3. 端口号 (port)：如 `:80`、`:443`（可选，HTTP 默认 80，HTTPS 默认 443）

4. 路径 (path)：如 `/blog/article`

5. 查询参数 (query string)：如 `?id=123&name=test`

6. 锚点/片段标识符 (fragment)：如 `#header`

示例：https://www.example.com:80/blog/article?id=123&name=test#header

:::

## GET 和 POST 请求的区别

参考答案

::: details

- 协议层面：请求行里一定要有请求方法，官方为了统一语义，定义了 GET 表示拿数据，POST 表示上传数据，PUT 表示修改数据，所以 GET，POST 请求这里仅仅是语义上的差别，没有说哪个请求必须做啥
- 应用层面：开发者约定俗成的规范，GET 请求的请求体会设空，不是没有请求体
- 浏览器层面：GET 请求会缓存，有历史记录

:::

## Ajax Fetch Axios 三者有什么区别？

参考答案

::: details

Ajax、Fetch 和 Axios 都是用于发送 HTTP 请求的技术，但有以下区别：

Ajax (Asynchronous JavaScript and XML)

- 是一种技术统称，不是具体的 API
- 最常用的实现是 XMLHttpRequest (XHR)
- 写法比较繁琐，需要手动处理各种状态
- 回调地狱问题
- 不支持 Promise

Fetch

- 浏览器原生 API
- 基于 Promise
- 更简洁的写法
- 不需要额外引入
- 只对网络请求报错，对 400、500 都当做成功的请求
- 默认不带 cookie
- 不支持请求超时控制
- 不支持请求取消
- 不支持请求进度监控

Axios

- 第三方库，需要额外引入
- 基于 Promise
- 支持浏览器和 Node.js
- 请求/响应拦截器
- 自动转换 JSON 数据
- 客户端支持防止 XSRF
- 支持请求取消
- 支持请求超时控制
- 支持请求进度监控
- 支持并发请求
- 自动转换请求和响应数据

使用建议：

- 如果是简单的请求，使用 Fetch 即可
- 如果需要更多功能，建议使用 Axios
- 现代项目中已经很少直接使用 XMLHttpRequest

:::

## Fetch 和 XMLHTTPRequest 有什么区别？

参考答案

::: details

语法和使用

- Fetch 基于 Promise，代码更简洁优雅
- XHR 使用回调函数，容易产生回调地狱
- Fetch 的 API 设计更简单现代
- XHR 的 API 设计较老，使用相对复杂

功能特性

- Fetch 默认不发送 cookies，需要配置 credentials
- XHR 默认发送 cookies
- Fetch 不能监听上传进度
- XHR 可以监听上传和下载进度
- Fetch 不能直接取消请求（需要 AbortController）
- XHR 可以通过 abort() 直接取消请求

错误处理

- Fetch 只有网络错误才会 reject，HTTP 错误码不会导致 reject
- XHR 可以处理所有类型的错误，包括 HTTP 错误码

浏览器支持

- Fetch 是现代浏览器标准 API
- XHR 有更好的浏览器兼容性，包括旧版本

:::

## 什么是 Restful API ？

参考答案

::: details

RESTful API 是一种软件架构风格，用于设计网络应用程序的接口。主要特点：

资源导向

- 使用 URL 定位资源
- 每个资源都有唯一的 URL
- 资源可以有多种表现形式（如 JSON、XML）

HTTP 方法对应操作

- GET：获取资源
- POST：创建资源
- PUT：更新资源（完整更新）
- PATCH：更新资源（部分更新）
- DELETE：删除资源

无状态

- 服务器不保存客户端状态
- 每个请求包含所需的所有信息
- 有利于横向扩展

统一接口

- 使用标准的 HTTP 方法
- 使用标准的 HTTP 状态码
- 返回格式一致（通常是 JSON）

:::

## 什么是 GraphQL ？

参考答案

::: details

GraphQL 是一种用于 API 的查询语言和运行时，由 Facebook 开发。主要特点：

查询灵活性

- 客户端可以精确指定需要哪些数据
- 可以在一个请求中获取多个资源
- 避免了传统 REST API 的过度获取和获取不足问题

类型系统

- 强类型的 Schema 定义
- 自动生成文档
- 开发时有更好的类型提示

单个端点

- 只需要一个 API 端点
- 所有查询都发送到同一个地址
- 通过查询语句区分不同的操作

主要操作类型

- Query：获取数据
- Mutation：修改数据
- Subscription：实时数据订阅

优点

- 减少网络请求
- 避免版本化问题
- 强类型保障
- 更好的开发体验

缺点

- 学习成本较高
- 缓存较为复杂
- 服务端实现复杂度增加

:::

## 如何理解 cookie

参考答案

::: details

Cookie 是服务器发送到用户浏览器并保存在本地的一小块数据。

主要特点：

- 由服务器生成，浏览器进行存储
- 每次请求时会自动携带对应域名下的 cookie
- 可设置过期时间
- 默认情况下随着浏览器关闭而删除（会话 cookie）

常用属性：

- name：cookie 名称
- value：cookie 值
- domain：指定 cookie 所属域名
- path：指定 cookie 所属路径
- expires/max-age：过期时间
- secure：只在 HTTPS 下传输
- httpOnly：禁止 JS 访问
- sameSite：跨站点请求限制

使用场景：

- 会话状态管理（用户登录状态、购物车等）
- 个性化设置（用户偏好、主题等）
- 浏览器行为跟踪（分析用户行为等）

限制：

- 大小限制：通常为 4KB
- 数量限制：每个域名下的 cookie 数量有限
- 安全性：明文传输（除非使用 HTTPS）
- 作用域：只能在所属域名下使用

:::

## 为何现代浏览器都禁用第三方 cookie

参考答案

::: details

主要原因是保护用户隐私和安全：

隐私问题

- 第三方 Cookie 可以跨站点追踪用户行为
- 广告商可以构建用户画像和浏览历史
- 用户数据可能被未经授权收集和使用

安全风险

- 增加 CSRF（跨站请求伪造）攻击风险
- 可能被用于会话劫持
- 恶意网站可能滥用第三方 Cookie

技术影响

- Safari 和 Firefox 已默认禁用第三方 Cookie
- Chrome 计划在 2024 年完全禁用第三方 Cookie
- 替代方案：
  - First-Party Cookie
  - localStorage
  - Privacy Sandbox
  - FLoC (Federated Learning of Cohorts)

:::

## 如何理解 Session ？

参考答案

::: details

Session 是服务器端的会话管理机制：

基本概念

- 服务器为每个用户创建的临时会话存储空间
- 用于保存用户的会话状态
- 通过 SessionID 来识别不同用户
- SessionID 通常保存在 Cookie 中

工作流程

1. 用户首次访问服务器时，服务器创建 Session 并生成 SessionID
2. 服务器将 SessionID 通过 Cookie 发送给客户端
3. 客户端后续请求会自动携带包含 SessionID 的 Cookie
4. 服务器通过 SessionID 找到对应 Session 并识别用户

特点

- 安全性较高：敏感数据存储在服务器
- 服务器负载较大：需要存储所有用户的 Session
- 依赖 Cookie：通常需要 Cookie 来存储 SessionID
- 集群问题：需要考虑 Session 共享

使用场景

- 用户登录状态管理
- 购物车
- 权限验证
- 表单验证

与 Cookie 的区别

- 存储位置：Session 在服务器，Cookie 在客户端
- 安全性：Session 较安全，Cookie 相对不安全
- 存储容量：Session 容量较大，Cookie 通常限制 4KB
- 性能：Session 消耗服务器资源，Cookie 消耗带宽资源

:::

## 什么是 JWT 描述它的工作过程

参考答案

::: details

JWT (JSON Web Token) 是一种开放标准，用于在各方之间安全地传输信息。

组成部分（用 . 分隔的三部分）：

- Header（头部）：指定加密算法和令牌类型
- Payload（负载）：包含声明（claims）的实际数据
- Signature（签名）：对前两部分的签名，用于验证消息未被篡改

工作流程：

1. 用户登录成功后，服务器创建 JWT

   - 设置 Header 和 Payload
   - 使用密钥生成签名
   - 将三部分组合成 token

2. 服务器将 token 返回给客户端

   - 客户端存储在 localStorage 或 cookie 中

3. 后续请求携带 token

   - 通常放在 Authorization header
   - 格式：`Bearer <token>`

4. 服务器验证 token
   - 检查签名是否有效
   - 验证是否过期
   - 验证其他声明（claims）

特点：

- 无状态：服务器不需要存储会话信息
- 可扩展：负载部分可以包含自定义数据
- 跨域友好：可以在不同域名下使用
- 性能好：验证在服务端完成，不需要查询数据库

安全考虑：

- 不要在 payload 中存储敏感信息
- 设置合理的过期时间
- 使用 HTTPS 传输
- 妥善保管签名密钥

:::

参考资料

::: details

- https://juejin.cn/post/7346430299490189348

:::

## JWT 如何自动更新 token ？

参考答案

::: details

JWT token 自动更新主要有以下几种方案：

双 token 机制

- access token：短期令牌，用于接口认证
- refresh token：长期令牌，用于刷新 access token
- 优点：安全性高，即使 access token 泄露影响有限
- 缺点：实现相对复杂，需要额外存储 refresh token

工作流程：

1. 用户登录后获取 access token 和 refresh token
2. 使用 access token 访问接口
3. access token 过期时，使用 refresh token 获取新的 access token
4. refresh token 过期时，需要重新登录

```js
// 前端示例代码
async function request(url, options) {
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    })

    if (res.status === 401) {
      // access token 过期，尝试刷新
      const newToken = await refreshToken()
      if (newToken) {
        // 使用新 token 重试请求
        return request(url, options)
      } else {
        // refresh token 也过期，跳转登录
        redirectToLogin()
      }
    }

    return res
  } catch (error) {
    console.error(error)
  }
}
```

滑动过期机制

- 每次请求都刷新 token 过期时间
- 类似于会话超时机制
- 优点：实现简单，用户体验好
- 缺点：安全性相对较低

无感刷新机制

- 在 token 即将过期时自动刷新
- 可以通过定时器或请求拦截器实现
- 优点：用户无感知，体验好
- 缺点：需要处理并发请求的问题

最佳实践：

- 根据业务安全需求选择合适的方案
- access token 过期时间不宜过长（如 2 小时）
- refresh token 过期时间可以较长（如 7 天）
- 重要操作仍需要二次验证
- 考虑 token 注销机制

:::

## 什么是 SSO 单点登录，描述它的工作过程

参考答案

::: details

SSO (Single Sign On) 单点登录是一种身份验证机制，允许用户使用一组凭证访问多个相关但独立的系统。

基本概念

- 一次登录，全局通用
- 多个子系统共享用户会话
- 统一的认证中心
- 提高用户体验和安全性

工作流程：

用户首次访问系统

- 用户访问系统 A
- 系统 A 检查无登录状态
- 重定向到 SSO 认证中心
- 带上系统 A 的地址作为参数

SSO 认证中心处理

- 检查用户是否已登录 SSO
- 未登录则显示登录页面
- 用户输入账号密码
- 认证中心验证身份

回到系统 A

- SSO 生成票据（ticket）
- 重定向回系统 A
- 带上票据参数
- 系统 A 验证票据
- 创建本地会话

访问系统 B

- 用户访问系统 B
- 系统 B 检查无登录状态
- 重定向到 SSO 认证中心
- SSO 发现用户已登录
- 直接生成票据返回
- 系统 B 验证票据
- 创建本地会话

实现方式：

- 基于 Cookie
- 基于 Token
- 基于 SAML
- 基于 OAuth
- 基于 CAS

优点：

- 提升用户体验
- 减少密码管理
- 统一认证流程
- 提高安全性

缺点：

- 认证中心单点故障
- 配置相对复杂
- 需要额外的安全考虑

:::

参考资料

::: details

- https://juejin.cn/post/7454474417318690831

:::

## 什么是跨域？如何实现跨域通讯？

参考答案

::: details

跨域是指浏览器的同源策略限制，当前域名的 JavaScript 代码试图访问其他域名下的资源时会受到限制。

同源的定义：

- 协议相同（http/https）
- 域名相同
- 端口相同

跨域解决方案：

CORS（跨域资源共享）

- 服务器设置 Access-Control-Allow-Origin 等响应头
- 可以配置允许的请求方法、请求头、是否允许携带认证信息等
- 最常用的跨域解决方案

JSONP

- 利用 `<script>` 标签不受同源策略限制的特点
- 只支持 GET 请求
- 需要服务器配合返回 JavaScript 代码

代理服务器

- 开发环境：webpack-dev-server、vite 等的 proxy 配置
- 生产环境：Nginx 反向代理

postMessage

- HTML5 标准中的 API
- 用于不同窗口间的跨域通信
- 可以在父子页面（iframe）或者多窗口间通信

WebSocket

- 建立在 TCP 之上的协议
- 天然支持跨域
- 适合需要实时通信的场景

document.domain（已废弃）

- 仅适用于主域名相同的情况
- 将子域和主域的 document.domain 设为相同的主域

最佳实践：

- 优先使用 CORS，配置得当的情况下最安全
- 需要兼容旧浏览器时可以考虑 JSONP
- 开发环境优先使用代理服务器
- 特殊场景（如页面通信）可以考虑 postMessage
- 需要实时通信时使用 WebSocket

:::

参考资料

::: details

- https://juejin.cn/post/7346079038555602955

:::

## HTTP 请求跨域时为何要发送 options 请求

参考答案

::: details

OPTIONS 请求是 CORS 预检请求(Preflight Request)，用于检查实际请求是否可以安全地发送。

触发条件：

- 使用非简单请求方法：除 GET、POST、HEAD 之外的方法
- 使用非简单请求头：除 Accept、Accept-Language、Content-Language、Content-Type 之外的请求头
- Content-Type 不是以下之一：
  - application/x-www-form-urlencoded
  - multipart/form-data
  - text/plain

工作流程：

1. 浏览器发送 OPTIONS 预检请求，包含：

   - Origin：请求来源
   - Access-Control-Request-Method：实际请求使用的方法
   - Access-Control-Request-Headers：实际请求使用的请求头

2. 服务器响应预检请求，返回：

   - Access-Control-Allow-Origin：允许的源
   - Access-Control-Allow-Methods：允许的方法
   - Access-Control-Allow-Headers：允许的请求头
   - Access-Control-Max-Age：预检请求的缓存时间

3. 如果预检通过，浏览器才会发送实际请求

优化建议：

- 尽可能使用简单请求，避免触发预检
- 合理设置 Access-Control-Max-Age 缓存预检结果
- 服务端正确配置 CORS 响应头

:::

参考资料

::: details

- https://juejin.cn/post/7403185402347159588

:::

## options 请求会携带 cookie 吗

参考答案

::: details

OPTIONS 请求通常不会携带 Cookie。它是一个预检请求，用于检查实际请求是否可以安全地发送。浏览器在发送 OPTIONS 请求时，不会自动附带 Cookie 和 Authorization 等认证信息，除非明确设置了 `credentials` 选项。

如果需要在 OPTIONS 请求中携带 Cookie，可以在请求中设置 `credentials: 'include'`，但通常不推荐这样做，因为 OPTIONS 请求的目的就是检查跨域请求的安全性，而不是进行身份验证。

:::

## 简述浏览器的缓存策略

参考答案

::: details

浏览器缓存策略主要分为两种：强缓存和协商缓存。

强缓存

- 不需要向服务器发送请求，直接使用本地缓存
- 通过 HTTP 响应头控制：
  - Cache-Control：
    - max-age：缓存有效时间（秒）
    - no-cache：需要和服务器协商验证
    - no-store：不使用任何缓存
    - private：仅浏览器可缓存
    - public：中间代理/CDN 等也可缓存
  - Expires：过期时间点（已被 Cache-Control 取代）

协商缓存

- 需要向服务器发送请求验证资源是否有效
- 如果有效返回 304，使用本地缓存
- 通过以下响应头实现：
  - Last-Modified/If-Modified-Since：基于文件修改时间
  - ETag/If-None-Match：基于文件内容哈希值

缓存位置（优先级从高到低）：

1. Service Worker
2. Memory Cache（内存缓存）
3. Disk Cache（硬盘缓存）
4. Push Cache（HTTP/2）

最佳实践：

- HTML：使用协商缓存
- CSS、JS、图片：使用强缓存，文件名带 hash
- API 请求：根据业务需求设置合适的缓存策略

:::

参考资料

::: details

- https://juejin.cn/post/7352075703859183667

:::

## 什么是图片防盗链，如何实现？

参考答案

::: details

图片防盗链是指服务器通过 HTTP 协议中的 Referer 字段来判断请求是否来自合法站点，从而防止其他网站直接引用本站图片资源。

实现方式：

服务器端实现

- 检查 HTTP Referer 字段
- 判断请求来源是否在白名单中
- 对非法请求返回 403 或替代图片

Nginx 配置示例：

```nginx
location ~ .*\.(gif|jpg|jpeg|png|bmp)$ {
    valid_referers none blocked server_names *.example.com;
    if ($invalid_referer) {
        return 403;
        # 或者返回替代图片
        # rewrite ^/ /path/to/default.jpg break;
    }
}
```

其他防盗链方案：

- 给图片添加水印
- 使用 Token 验证
- 使用 CDN 提供的防盗链功能
- 对图片进行加密处理

注意事项：

- Referer 可以被伪造，不能作为唯一判断依据
- 移动端 APP 可能不发送 Referer
- 部分浏览器可能禁用 Referer
- 需要考虑用户体验和 SEO 影响

:::

## 简述 HTTPS 加密过程

参考答案

::: details

HTTPS 使用 TLS/SSL 协议进行加密，主要包含以下步骤：

客户端发起请求

- 发送支持的加密算法列表
- 发送随机数 Client Random

服务器回应

- 选择加密算法
- 发送数字证书（包含公钥）
- 发送随机数 Server Random

客户端验证证书

- 验证证书是否由可信 CA 签发
- 验证证书域名是否匹配
- 验证证书是否在有效期内

生成会话密钥

- 客户端生成随机数 Pre-master secret
- 使用服务器公钥加密 Pre-master secret
- 客户端和服务器都通过三个随机数生成会话密钥
  (Client Random + Server Random + Pre-master secret)

开始加密通信

- 双方使用会话密钥进行对称加密通信
- 保证通信内容的机密性和完整性

特点：

- 采用混合加密：非对称加密传输密钥，对称加密传输数据
- 数字证书保证服务器身份可信
- 具有防篡改和不可否认性

:::

## 移动端 H5 如何抓包？

参考答案

::: details

移动端 H5 抓包主要有以下几种方法：

Charles/Fiddler

- 电脑端安装抓包工具
- 手机和电脑连接同一网络
- 手机设置代理为电脑 IP 和端口
- 安装并信任证书（HTTPS 抓包需要）

优点：

- 功能强大，可以查看详细请求信息
- 支持请求修改和重放
- 支持断点调试

vConsole

- 移动端调试面板
- 直接在页面中引入 js 文件
- 可以查看网络请求、console 日志等
- 适合开发环境使用

```js
<script src="https://unpkg.com/vconsole/dist/vconsole.min.js"></script>
<script>
  var vConsole = new VConsole();
</script>
```

Chrome Remote Debug

- 安卓设备通过 USB 连接电脑
- 开启开发者模式和 USB 调试
- Chrome 访问 chrome://inspect
- 可以使用完整的 Chrome DevTools

Safari Web Inspector

- iOS 设备通过 USB 连接 Mac
- 开启 Web 检查器
- Safari 开发菜单中选择设备
- 可以使用完整的 Safari 调试工具

注意事项：

- HTTPS 抓包需要安装证书
- 部分 App 可能有反抓包机制
- 生产环境建议移除调试工具
- 注意数据安全和隐私保护

:::

## script 标签的 defer 和 async 有什么区别

参考答案

::: details

script 标签的 defer 和 async 属性都是用于控制脚本的加载和执行时机：

普通 script

- 阻塞 HTML 解析
- 立即下载并执行脚本
- 按照在文档中的顺序执行

defer

- 异步下载脚本，不阻塞 HTML 解析
- 等到 HTML 解析完成后，DOMContentLoaded 事件触发前执行
- 多个 defer 脚本按照在文档中的顺序执行
- 适用于需要操作 DOM 的脚本
- 只对外部脚本文件有效

async

- 异步下载脚本，不阻塞 HTML 解析
- 下载完成后立即执行，可能在 HTML 解析完成前执行
- 多个 async 脚本的执行顺序不确定，取决于下载完成时间
- 适用于独立的脚本，如统计和广告代码
- 只对外部脚本文件有效

使用建议：

- 需要操作 DOM 或依赖其他脚本的代码使用 defer
- 独立的、不依赖 DOM 和其他脚本的代码使用 async
- 如果脚本之间有依赖关系，不要使用 async

示例：

```html
<!-- 普通脚本 -->
<script src="script.js"></script>

<!-- defer 脚本 -->
<script defer src="script.js"></script>

<!-- async 脚本 -->
<script async src="script.js"></script>
```

:::

## prefetch 和 dns-prefetch 分别是什么

参考答案

::: details

prefetch 和 dns-prefetch 是两种不同的资源预加载技术：

prefetch

- 用于预加载将来可能需要的资源
- 浏览器空闲时才会下载
- 优先级较低，不影响当前页面加载
- 适用于下一页可能用到的资源

```html
<!-- 预加载资源 -->
<link rel="prefetch" href="/next-page.js" />
<link rel="prefetch" href="/images/large.jpg" />
```

dns-prefetch

- 预先解析域名的 DNS 记录
- 减少 DNS 解析时间
- 适用于即将请求其他域名的资源
- 对跨域资源加载特别有效

```html
<!-- DNS 预解析 -->
<link rel="dns-prefetch" href="//example.com" />
<link rel="dns-prefetch" href="//api.example.com" />
```

使用建议：

- 对确定即将访问的资源使用 prefetch
- 对跨域资源较多的站点使用 dns-prefetch
- 不要过度预加载，可能浪费带宽
- 移动端要谨慎使用，考虑流量消耗

相关技术：

- preload：当前页面必需资源的预加载
- preconnect：预先建立连接（DNS + TCP + TLS）
- prerender：预先渲染整个页面

:::

## WebSocket 和 HTTP 协议有什么区别

参考答案

::: details

WebSocket 和 HTTP 的主要区别：

连接特性

- HTTP 是短连接：每次请求都需要建立新的 TCP 连接（除非使用 keep-alive）
- WebSocket 是持久化的长连接：只需要一次握手，后续可以持续通信

通信方式

- HTTP 是单向通信：客户端请求，服务器响应
- WebSocket 是双向通信：客户端和服务器都可以主动发送数据

数据格式

- HTTP 每次请求都要带完整的 HTTP 头
- WebSocket 第一次握手完成后，后续数据传输只需要很小的头部

应用场景

- HTTP 适合一次性的数据交互
- WebSocket 适合实时性要求高的场景，如：
  - 实时聊天
  - 游戏实时数据
  - 实时协作文档

性能

- WebSocket 的性能和效率通常优于 HTTP 轮询
- WebSocket 可以更好地节省服务器资源和带宽

支持性

- HTTP 被所有浏览器支持
- WebSocket 需要浏览器支持（现代浏览器普遍已支持）

:::

## 如何上传文件？使用 fetch 或者 axios

参考答案

::: details

文件上传主要有以下几种方式：

使用 FormData

```js
// HTML
<input type="file" id="file">

// fetch
const file = document.querySelector('#file').files[0]
const formData = new FormData()
formData.append('file', file)

fetch('/upload', {
    method: 'POST',
    body: formData
})

// axios
const formData = new FormData()
formData.append('file', file)

axios.post('/upload', formData, {
    headers: {
        'Content-Type': 'multipart/form-data'
    }
})
```

使用 Base64

```js
// 将文件转为 Base64
function fileToBase64(file) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.readAsDataURL(file)
  })
}

// fetch
const base64 = await fileToBase64(file)
fetch('/upload', {
  method: 'POST',
  body: JSON.stringify({ file: base64 }),
  headers: {
    'Content-Type': 'application/json',
  },
})

// axios
const base64 = await fileToBase64(file)
axios.post('/upload', {
  file: base64,
})
```

多文件上传

```js
// HTML
<input type="file" multiple id="files">

// fetch
const files = document.querySelector('#files').files
const formData = new FormData()
Array.from(files).forEach(file => {
    formData.append('files', file)
})

fetch('/upload', {
    method: 'POST',
    body: formData
})

// axios
const formData = new FormData()
Array.from(files).forEach(file => {
    formData.append('files', file)
})

axios.post('/upload', formData)
```

注意事项：

- 设置正确的 Content-Type
- 考虑文件大小限制
- 添加上传进度显示
- 处理上传错误
- 考虑文件类型限制
- 添加取消上传功能

:::

## 如何上传大文件？

参考答案

::: details

大文件上传主要有以下几种方案：

切片上传

- 将大文件分割成小块
- 并发上传多个切片
- 服务端合并所有切片
- 支持断点续传和进度显示

实现步骤：
前端切片

```js
function createFileChunk(file, size = 1 * 1024 * 1024) {
  const chunks = []
  let cur = 0
  while (cur < file.size) {
    chunks.push(file.slice(cur, cur + size))
    cur += size
  }
  return chunks
}
```

上传切片

```js
async function uploadChunks(chunks) {
  const requests = chunks.map((chunk, index) => {
    const formData = new FormData()
    formData.append('chunk', chunk)
    formData.append('index', index)
    return axios.post('/upload', formData)
  })
  await Promise.all(requests)
}
```

发送合并请求

```js
await axios.post('/merge', {
  filename: file.name,
  size: chunks.length,
})
```

断点续传

- 记录已上传的切片
- 重新上传时跳过已上传的部分
- 可以通过 localStorage 存储进度
- 使用 hash 标识文件和切片

秒传

- 上传前先发送文件 hash
- 服务端存在相同文件则直接返回
- 可以使用 spark-md5 计算文件 hash

性能优化

- 并发控制：限制同时上传的切片数
- 切片大小：根据网络状况动态调整
- 进度显示：计算整体上传进度
- 错误重试：单个切片上传失败后重试

:::

参考资料

::: details

- https://juejin.cn/post/7356817667574136884

:::

## 如何实现图片懒加载？

参考答案

::: details

IntersectionObserver API

```js
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.src = entry.target.dataset.original
      entry.target.removeAttribute('data-original')
      io.unobserve(entry.target)
    }
  })
})
const imgs = document.querySelectorAll('img[data-original]')
imgs.forEach((item) => {
  io.observe(item)
})
```

原生 loading 属性

```js
let viewHeight = window.innerHeight
function lazyLoad() {
  let imgs = document.querySelectorAll('img[data-original]')
  imgs.forEach((el) => {
    let rect = el.getBoundingClientRect()
    if (rect.top < viewHeight) {
      let image = new Image()
      image.src = el.dataset.original
      image.onload = function () {
        el.src = image.src
      }
      el.removeAttribute('data-original')
    }
  })
}
lazyLoad() // 页面初始加载时调用一次
document.addEventListener('scroll', lazyLoad)
```

:::

参考资料

::: details

- https://juejin.cn/post/7320513026188116003

:::

## 在网络层面可做哪些性能优化？

参考答案

::: details

网络性能优化可以从以下几个方面考虑：

减少请求数量

- 合并文件（CSS/JS 打包）
- 雪碧图（CSS Sprites）
- 图片懒加载
- 按需加载/异步加载
- 合理使用缓存

减小资源体积

- 代码压缩（minify）
- Gzip/Brotli 压缩
- 图片优化（压缩、webp格式）
- Tree Shaking
- 代码分割（Code Splitting）

CDN 优化

- 使用 CDN 分发静态资源
- 合理设置 CDN 缓存
- 选择合适的 CDN 节点
- 配置 CDN 预热和刷新策略

HTTP 优化

- 使用 HTTP/2 多路复用
- 开启 Keep-Alive
- 合理设置缓存策略
- DNS 预解析（dns-prefetch）
- 预连接（preconnect）
- 预加载（prefetch/preload）

资源加载优化

- 关键资源优先加载
- 非关键资源延迟加载
- 内联关键 CSS/JS
- 异步加载非关键 JS（async/defer）
- 优化资源加载顺序

接口优化

- 接口合并
- GraphQL 按需查询
- 数据缓存
- 避免重复请求
- 设置合理的超时时间

监控和分析

- 性能监控
- 错误监控
- 用户体验监控
- 性能数据分析
- 持续优化

:::

参考资料

::: details

- https://juejin.cn/post/7362080157237116978

:::
