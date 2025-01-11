# JS 读代码

读懂面试的代码，才能读懂工作中的代码。

::: tip
读代码不要只用眼睛看，拿纸笔写写画画，更容易读懂。
:::

## JS 引用类型

以下代码，执行结果是什么？

```js
let obj1 = { x: 1 };
let obj2 = obj1;
obj2.y = 2;
obj2 = { y: 20 };
console.log("obj1", obj1);
```

答案

::: details

```
obj1 { x: 1, y: 2 }
```

ECMAScript 变量可能包含两种不同类型的值：基本类型值和引用类型值。

基本类型包括：Undefined、Null、Boolean、Number、String、Symbol
引用类型包括：Object、Array

引用类型的值是保存在内存中的对象。与其他语言不同，JavaScript 并不允许直接访问内存中的位置，也就是说不能直接操作对象的内存空间。在操作对象时，实际上是在操作对象的引用而不是实际的对象。

换言之，变量实际保存的是一个指针，这个指针指向放在内存中的对象

当运行 `let obj2 = obj1;` 的时候，实际上是复制了一份指针，而不是复制了一份对象。

![](/value-reference.jpg)

所以 `obj2.y = 2` 能够修改对象的值，`obj1` 能够访问修改后的对象。

运行 `obj2 = { y: 20 };` 时，只是将 obj2 指向了新的对象，`obj1` 还是指向原来的对象。
:::

## JS parseInt

以下代码，执行结果是什么？

```js
["1", "2", "3"].map(parseInt);
```

答案

::: details
[1, NaN, NaN]
:::

## JS this 1

以下代码，执行结果是什么？

```js
const User = {
  count: 1,
  getCount: function () {
    return this.count;
  },
};
console.log("a ", User.getCount()); // what?
const func = User.getCount;
console.log("b", func()); // what?
```

答案

::: details

```
a 1
b undefined
```

:::

## JS this 2

以下代码，执行结果是什么？

```js
const obj = {
  f1() {
    const fn = () => {
      console.log("this1", this);
    };
    fn();
    fn.call(window);
  },
  f2: () => {
    function fn() {
      console.log("this2", this);
    }
    fn();
    fn.call(this);
  },
};
obj.f1();
obj.f2();
```

答案

::: details

```
this1 obj 和 this1 obj
this2 window（严格模式下是 undefined） 和 this2 window
```

:::

## JS 自由变量 1

以下代码，执行结果是什么？

```js
let i;
for (i = 1; i <= 3; i++) {
  setTimeout(function () {
    console.log(i);
  }, 0);
}
```

答案

::: details

```
4 4 4
```

:::

## JS 自由变量 2

以下代码，执行结果是什么？

```js
let n = 10;
function f1() {
  n++;
  function f2() {
    function f3() {
      n++;
    }
    let n = 20;
    f3();
    n++;
  }
  f2();
  n++;
}
f1();
console.log("n", n);
```

答案

::: details

```
n 12
```

:::

## JS 闭包 1

以下代码，执行结果是什么？

```js
const n = 10;
function print() {
  console.log(n);
}

function f1(fn) {
  const n = 20;
  fn();
}
f1(print);
```

答案

::: details

```
10
```

:::

## JS 闭包 2

以下代码，执行结果是什么？

```js
function fn() {
  let num = 10;
  return {
    set: (n) => (num = n),
    get: () => num,
  };
}

let num = 20;
const { get, set } = fn();
console.log("result1: ", get());
set(100);
console.log("result2: ", num);
```

答案

::: details

```
10 20
```

:::

## JS Promise 1

以下代码，执行结果是什么？

```js
const promise = new Promise((resolve, reject) => {
  console.log(1);
  console.log(2);
});
promise.then(() => {
  console.log(3);
});
console.log(4);
```

答案

::: details

```
1 2 4
```

:::

## JS Promise 2

以下代码，执行结果是什么？

```js
const promise = new Promise((resolve, reject) => {
  console.log(1);
  setTimeout(() => {
    console.log("timerStart");
    resolve("success");
    console.log("timerEnd");
  }, 0);
  console.log(2);
});
promise.then((res) => {
  console.log(res);
});
console.log(4);
```

答案

::: details

```
1
2
4
timerStart
timerEnd
success
```

:::

## JS 异步执行顺序 1

以下代码，执行结果是什么？

```js
console.log("start");
setTimeout(() => {
  console.log("a");

  Promise.resolve().then(() => {
    console.log("c");
  });
});
Promise.resolve().then(() => {
  console.log("b");

  setTimeout(() => {
    console.log("d");
  });
});
console.log("end");
```

答案

::: details

```
start end b a c d
```

:::

## JS 异步执行顺序 2

以下代码，执行结果是什么？

```js
Promise.resolve()
  .then(() => {
    console.log(0);
    return Promise.resolve(4);
  })
  .then((res) => {
    console.log(res);
  });

Promise.resolve()
  .then(() => {
    console.log(1);
  })
  .then(() => {
    console.log(2);
  })
  .then(() => {
    console.log(3);
  })
  .then(() => {
    console.log(5);
  })
  .then(() => {
    console.log(6);
  });
```

答案

::: details

```
0 1 2 3 4 5 6
```

:::

## React setState

执行以下代码渲染组件，点击 button ，打印什么？

```jsx
// React 组件
function useStateDemo() {
  console.log("hello");

  const [value, setValue] = useState(100);
  function clickHandler() {
    setValue(value + 1);
    setValue(value + 1);
    console.log("value1 ", value);
    setValue((value) => value + 1);
    setValue((value) => value + 1);
    console.log("value2 ", value);
  }
  return (
    <div>
      <span>{value}</span>
      <button onClick={clickHandler}>increase1</button>
    </div>
  );
}
```

答案

::: details

```
// 分别打印 value1 100 和 value2 100
// DOM 显示 103
// hello 总共会打印两次
```

:::
