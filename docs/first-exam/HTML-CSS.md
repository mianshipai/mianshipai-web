# HTML 和 CSS

随着 Vue React 等框架，和各种 CSS UI 组件库的普及，HTML 和 CSS 很容易被忽略。

如果你是实习生、应届生或刚毕业不久，HTML 和 CSS 知识一定要认真准备，大厂必考。

## DOCTYPE 是什么，都有哪些属性？

## meta 标签是干什么的，都有什么属性和作用

## 什么是 DOM 它和 HTML 有什么区别？

## 如何理解 HTML 语义化 ？有哪些常见的语义化标签？

第一代码可读性，第二有利于 SEO

## DOM 节点的 attr 和 property 有何区别

## 如何一次性插入多个 DOM 节点？

使用 fragment

## offsetHeight scrollHeight clientHeight 区别

## HTMLCollection 和 NodeList 的区别

## 对于一个无线下拉加载图片的页面，如何给每个图片绑定 click 事件

## window.onload 和 DOMContentLoaded 的区别

## script 标签放在 head 那里怎么解决加载问题

## 网页多标签页之间如何通讯？

## 常见的 HTML 标签哪些是 inline 元素，哪些是 block 元素，哪些是 inline-block 元素

## CSS 盒子模型，尺寸计算

如下代码，请问 `div1` 的 `offsetWidth` 是多大？

```html
<!-- 如下代码，请问 div1 的 offsetWidth 是多大？ -->
<style>
  #div1 {
    width: 100px;
    padding: 10px;
    border: 1px solid #ccc;
    margin: 10px;
  }
</style>

<div id="div1"></div>
```

答案

::: details
`offsetWidth` 是指 `元素内容 + 内间距 + 边框`的距离，不包括外间距<br>
所以 `offsetWidth` 是 `122px`
:::

追问：如果想要让 `offsetWidth` 等于 `100px` ，还需要再增加一个什么属性？

答案

::: details
增加 `box-sizing: border-box;`
:::

## margin 纵向重叠

如下代码，`AAA` 和 `BBB` 之间的距离是多少？

```html
<!-- 如下代码，AAA 和 BBB 之间的距离是多少？ -->
<style>
  p {
    font-size: 16px;
    line-height: 1;
    margin-top: 10px;
    margin-bottom: 15px;
  }
</style>

<p>AAA</p>
<p></p>
<p></p>
<p></p>
<p>BBB</p>
```

答案

::: details
`AAA` 和 `BBB` 之间的距离是 `15px`
:::

## lineHeight 如何继承？

如下代码，`<p>` 标签的行高将会是多少？

```html
<!--如下代码，p 标签的行高将会是多少？-->
<style>
  body {
    font-size: 20px;
    line-height: 200%;
  }
  p {
    font-size: 16px;
  }
</style>

<body>
  <p>AAA</p>
</body>
```

答案

::: details
`line-height` 不同类型的值，继承规则是不一样的

- 写具体的数值，如 `30px`，则继承该数值 —— 比较好理解
- 写百分比，如 `200%` ，则继承当前计算出来的值，如上述题目 —— 重要！！！
- 写比例，如 `2` 或 `1.5` ，则继承比例

所以，该问题的的答案是，继承 `40px` 。
:::

## margin 负值问题

## 什么是 BFC 如何触发 BFC？

## 使用 CSS 实现居中对齐，有哪几种方式？

## 什么是 CSS 定位上下文？absolute 和 relative 分别依据谁来定位？

## `overflow: hidden` `display：none` 和 `visibility: hidden` 有什么区别

## `px` `%` `em` `rem` `vw/vh` 的区别

## 如何实现 Retina 屏 1px 像素边框

## 使用 CSS 画一个三角形

## 如何实现黑白主题变化？

## 如何理解 `z-index` ？

## 使用 flex 设计一个“四合院”布局

如下图

![](../imgs/css-layout.png)

参考答案

::: details

```html
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CSS 四合院</title>
    <style>
      html * {
        margin: 0;
        padding: 0;
      }
      html {
        height: 100%;
      }
      body {
        display: flex;
        flex-direction: column;
        height: 100%;
      }
      #header {
        height: 50px;
        background-color: red;
      }
      #container {
        flex: 1;
        display: flex;
      }
      #left-container {
        width: 100px;
        background-color: green;
      }
      #main-container {
        flex: 1;
        background-color: #ccc;
      }
      #right-container {
        width: 200px;
        background-color: yellow;
      }
      #footer {
        height: 50px;
        background-color: blue;
      }
    </style>
  </head>
  <body>
    <!-- HTML5 标签 语义化 -->
    <header id="header">header</header>
    <section id="container">
      <aside id="left-container">left</aside>
      <section id="main-container">main</section>
      <!-- 或者用 article ，看用途 -->
      <aside id="right-container">right</aside>
      <!-- 或者用 section ，看用途 -->
    </section>
    <footer id="footer">footer</footer>
  </body>
</html>
```

:::

## 你用过哪些 CSS 相关的技术，如库、框架、预处理语言等
