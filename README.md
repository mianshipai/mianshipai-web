# 面试派

https://www.mianshipai.com/

[双越老师](https://juejin.cn/user/1714893868765373)联合多位精英博主，整理的前端面试流程和刷题技巧，开源免费，持续维护。

## 本地运行

git clone 源代码

```
npm i
npm run docs:dev
```

## 贡献代码

- 基于当前 `main` 分支最新代码开发
- 提交 PR 到 `main` 分支
  - 注意查看 commits 和 files changed ，不要有无关记录和改动，否则不予合并
  - 添加 reviewer `wangfupeng1988`
- 管理员每天审核 PR 合并或者回复建议

## 发布上线

管理员会统一提交 PR ，把 `main` 合并到 `prod-deploy` 分支，合并后即可触发 [actions](https://github.com/mianshipai/mianshipai-web/actions) 并发布上线。
