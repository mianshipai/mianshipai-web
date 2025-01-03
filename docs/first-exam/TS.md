# Typescript 面试题

Typescript 已经全面普及，尤其大厂大型项目，前端熟悉 Typescript 是标配。

## TS 优缺点，使用场景

## TS 基础类型有哪些

enum tuple

## 数组 Array 和元组 Tuple 的区别是什么

## 枚举 enum 是什么？有什么使用场景？

## keyof 和 typeof 有什么区别？

## any void never unknown 有什么区别

## unknown 和 any 区别

参考答案

::: details
`unknown` 是更安全的 `any` ，如下代码

```js
const a: any = 'x'
a.toString() // 不报错

const b: unknown = 'y'
// b.toString() // 报错
;(b as string).toString() // 不报错
```

:::

## TS 访问修饰符 public protected private 有什么作用

## type 和 interface 共同和区别，如何选择

共同点

- 都能描述一个对象结构
- 都能被 class 实现
- 都能被扩展

区别

- type 可以声明基础类型
- type 有联合类型和交差类型
- type 可以被 typeof 赋值

如何选择... todo...

## 什么是泛型，如何使用它？

## 什么是交叉类型和联合类型

交叉类型 `T1 & T2`

联合类型 `T1 | T2`

## 是否用过工具类型

Partial Required Omit ReadOnly 等

## TS 这些符号 `?` `?.` `??` `!` `&` `_` `#` 分别什么意思

## 什么是抽象类 abstract class

## 什么是命名空间（Namespace）和模块（Module）

## 如何扩展 window 属性，如何定义第三方模块的类型

参考答案

::: details

```ts
declare interface Window {
  test: string
}

window.test = 'aa'
console.log(window.test)
```

:::

## 是否有过真实的 Typescript 开发经验，讲一下你的使用体验
