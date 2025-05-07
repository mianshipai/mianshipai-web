---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: '前端面试派'
  text: '系统专业的面试导航'
  tagline: 双越老师 带队制作，大厂面试流程，开源免费
  actions:
    - theme: brand
      text: 刷题
      link: /docs/written-exam/algorithm.html
    - theme: alt
      text: 面试技巧
      link: /docs/hr-exam/behavioural-test.html
    - theme: alt
      text: 1v1 面试咨询 🔥
      link: /docs/services/1v1.md

features:
  - title: 双越老师
    details: 前百度、滴滴 资深工程师，wangEditor 作者，PMP，慕课网金牌讲师，国内最早讲解前端面试题的大厂讲师，学员累计 10w 人。
  - title: 大厂面试流程
    details: 依据大厂真实规范的面试流程，分为笔试、一面、二面、三面、HR 面试，全面覆盖每个面试环节，直接开始刷题，无需再自己查找。
  - title: 多人共建 开源免费
    details: 本网站源码全部开源到 Github，网站内容免费阅读，还可免费加入双越老师学员群，一起交流面试问题和技巧。
  - title: 2025 持续更新
    details: 前端技术变化快，每年都会有新的技术、框架和版本，也会有新的面试题，我们会根据技术变化持续维护，及时更新。
---

### 专业解决面试问题

- 初入职场不知道如何写简历，如何写出内容和亮点
- 不知道如何准备面试题，搜出很多资料，但无从下手
- 工作几年，项目都是重复性的，写不出亮点和成绩
- 工作快 10 年了，但还是一线开发人员，如何体现个人经验？
- 业余不学习，基础知识很差，面试没信心
- 工作多年只会 Vue ，不懂算法，没有技术广度和深度
- 刚毕业，没实际项目经验

如有上述问题，可 [加群](/docs/services/group.md) 讨论咨询，或参与 [1v1 面试咨询服务](/docs/services/1v1.md)， 系统、高效、全流程 准备前端面试～

<!-- <div style="display: grid; gap: 24px; grid-template-columns: repeat(auto-fit, minmax(224px, 1fr)); margin-top: 24px;">
  <div style="flex: 1; text-align: center;">
    <div style="background-color: var(--vp-c-bg-soft); padding: 16px 0 8px 0; border-radius: 6px; cursor: pointer;" onclick="javascript:window.open('https://juejin.cn/user/1714893868765373', '_blank')">
      <figure style="width: 64px; height: 64px; border-radius: 50%; overflow: hidden; margin: 0 auto; box-shadow: var(--vp-shadow-3);">
        <img src="https://github.com/wangfupeng1988.png" loading="lazy"/>
      </figure>
      <div style="text-align: center;">
        <h4 style="font-size: 16px; line-height: 12px; font-weight: 600; text-decoration: none;">双越老师</h4>
        <p style="color: var(--vp-c-text-2); font-size: 14px; line-height: 1.5; padding: 0 16px;">前百度、滴滴 资深工程师，wangEditor 作者，PMP</p>
      </div>
    </div>
  </div>
  <div style="flex: 1; text-align: center;">
    <div style="background-color: var(--vp-c-bg-soft); padding: 16px 0 8px 0; border-radius: 6px; cursor: pointer;">
      <figure style="width: 64px; height: 64px; border-radius: 50%; overflow: hidden; margin: 0 auto; box-shadow: var(--vp-shadow-3);" onclick="javascript:window.open('https://github.com/shixiaoshiOrz', '_blank')">
        <img src="https://github.com/shixiaoshiOrz.png" loading="lazy"/>
      </figure>
      <div style="text-align: center;" onclick="javascript:window.open('https://juejin.cn/user/660148845294712', '_blank')">
        <h4 style="font-size: 16px; line-height: 12px; font-weight: 600;">石小石Orz</h4>
        <p style="color: var(--vp-c-text-2); font-size: 14px; line-height: 1.5; padding: 0 16px;">掘金优秀创作者，阿里云专家博主&评测专家，文章阅读量超100万</p>
      </div>
    </div>
  </div>
  <div style="flex: 1; text-align: center;">
    <div style="background-color: var(--vp-c-bg-soft); padding: 16px 0 8px 0; border-radius: 6px; cursor: pointer;" onclick="javascript:window.open('https://juejin.cn/user/1943592288391496/posts', '_blank')">
      <figure style="width: 64px; height: 64px; border-radius: 50%; overflow: hidden; margin: 0 auto; box-shadow: var(--vp-shadow-3);">
        <img src="https://github.com/RainyNight9.png" loading="lazy"/>
      </figure>
      <div style="text-align: center;">
        <h4 style="font-size: 16px; line-height: 12px; font-weight: 600;">雨夜寻晴天</h4>
        <p style="color: var(--vp-c-text-2); font-size: 14px; line-height: 1.5; padding: 0 16px;">掘金优秀创作者，开源作者，多年大厂经验，擅长Web 小程序和跨端开发</p>
      </div>
    </div>
  </div>
  <div style="flex: 1; text-align: center;">
    <div style="background-color: var(--vp-c-bg-soft); padding: 16px 0 8px 0; border-radius: 6px; cursor: pointer;" onclick="javascript:window.open('https://juejin.cn/user/116975171023884', '_blank')">
      <figure style="width: 64px; height: 64px; border-radius: 50%; overflow: hidden; margin: 0 auto; box-shadow: var(--vp-shadow-3);">
        <img src="https://github.com/DolphinFeng.png" loading="lazy"/>
      </figure>
      <div style="text-align: center;">
        <h4 style="font-size: 16px; line-height: 12px; font-weight: 600;">Dolphin_海豚</h4>
        <p style="color: var(--vp-c-text-2); font-size: 14px; line-height: 1.5; padding: 0 16px;">掘金优秀作者，2023人气 NO.14 ，博客访问量 30w+，擅长各类面试题</p>
      </div>
    </div>
  </div>
</div> -->

### 成为贡献者

- 参与优秀开源项目，结识优秀博主和作者，积累社区知名度
- 贡献内容时，可以插入自己的博客链接，给自己的博客引流

[开始贡献题目和答案](https://github.com/mianshipai/mianshipai-web#%E8%B4%A1%E7%8C%AE%E9%A2%98%E7%9B%AE%E5%92%8C%E7%AD%94%E6%A1%88) ，[查看全部贡献者](https://github.com/mianshipai/mianshipai-web/graphs/contributors)

<div style="display: flex; margin-top: 48px;">
  <div style="flex: 1; text-align: center;">
    <a href="https://talent.didiglobal.com/" target="_blank">
      <img loading="lazy" src="./docs/imgs/logos/didi.png"  style="width: 80%"/>
    </a>
  </div>
  <div style="flex: 1;">
    <a href="https://jobs.bytedance.com/" target="_blank">
      <img loading="lazy" src="./docs/imgs/logos/bd.png"  style="width: 80%"/>
    </a>
  </div>
  <div style="flex: 1; text-align: center;">
    <a href="https://talent.baidu.com/" target="_blank">
      <img loading="lazy" src="./docs/imgs/logos/baidu.png" style="width: 80%"/>
    </a>
  </div>
  <div style="flex: 1;">
    <a href="https://hr.meituan.com/web/home" target="_blank">
      <img loading="lazy" src="./docs/imgs/logos/meituan.png"  style="width: 80%"/>
    </a>
  </div>
</div>

<div style="display: flex; margin-top: 48px;">
  <div style="flex: 1; text-align: center;">
    <a href="https://careers.tencent.com/" target="_blank">
      <img loading="lazy" src="./docs/imgs/logos/tencent.png"  style="width: 80%"/>
    </a>
  </div>
  <div style="flex: 1; text-align: center;">
    <a href="https://career.huawei.com/" target="_blank">
      <img loading="lazy" src="./docs/imgs/logos/huawei.png"  style="width: 80%"/>
    </a>
  </div>
  <div style="flex: 1; text-align: center;">
    <a href="https://zhaopin.jd.com/" target="_blank">
      <img loading="lazy" src="./docs/imgs/logos/jd.png"  style="width: 80%"/>
    </a>
  </div>
  <div style="flex: 1; text-align: center;">
    <a href="https://talent.alibaba.com/" target="_blank">
      <img loading="lazy" src="./docs/imgs/logos/ali.png"  style="width: 80%"/>
    </a>
  </div>
</div>

<div id="qrcode-container" style="position:fixed; bottom:16px; right:0px; width:260px;">
  <!--config.mts 动态插入内容-->
</div>
