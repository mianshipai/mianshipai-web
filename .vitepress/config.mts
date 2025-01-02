import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'zh-CN',
  title: '前端面试派',
  description: '双越老师整理的前端面试真实流程，大厂面试规范，开源免费',
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'author', content: '双越老师' }],
    [
      'meta',
      {
        name: 'keywords',
        content:
          '前端, 面试, 前端面试, 面试题, 刷题, 面试流程, 前端面试流程, 面试准备, 简历, 前端简历, Javascript, Typescript, React, Vue, webpack, vite, HTTP, 算法',
      },
    ],
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '加群沟通', link: '/docs/services/group.md' },
      { text: '提交面试真题', link: '/docs/services/submit-question.md' },
      { text: '1v1 面试咨询服务 🔥', link: '/docs/services/1v1.md' },
    ],

    sidebar: [
      {
        text: '面试准备',
        items: [
          {
            text: '了解面试流程',
            link: '/docs/before-interview/process.md',
          },
          { text: '分析 JD 招聘要求', link: '/docs/before-interview/jd.md' },
          {
            text: '正确写简历',
            link: '/docs/before-interview/write-resume.md',
          },
          {
            text: '如何投递简历',
            link: '/docs/before-interview/post-resume.md',
          },
        ],
      },
      {
        text: '笔试',
        items: [
          { text: '数据结构和算法', link: '/docs/written-exam/algorithm' },
          { text: 'JS 手写代码', link: '/docs/written-exam/JS-writing' },
          { text: 'JS 读代码', link: '/docs/written-exam/JS-reading' },
        ],
      },
      {
        text: '一面',
        items: [
          { text: 'HTML 和 CSS', link: '/docs/first-exam/HTML-CSS.md' },
          { text: 'JS 基础知识', link: '/docs/first-exam/JS' },
          { text: 'TS 类型', link: '/docs/first-exam/TS' },
          { text: 'HTTP 网络请求', link: '/docs/first-exam/HTTP.md' },
          { text: '综合考察', link: '/docs/first-exam/other.md' },
        ],
      },
      {
        text: '二面',
        items: [
          { text: 'Vue 使用', link: '/docs/second-exam/vue-usage.md' },
          { text: 'Vue 原理', link: '/docs/second-exam/vue-inner.md' },
          { text: 'React 使用', link: '/docs/second-exam/react-usage.md' },
          { text: 'React 原理', link: '/docs/second-exam/react-inner.md' },
          { text: '打包构建', link: '/docs/second-exam/bundler.md' },
          { text: '项目难点/成绩', link: '/docs/second-exam/project.md' },
        ],
      },
      {
        text: '三面',
        items: [
          { text: '前端 Leader 面试', link: '/docs/third-exam/leader-test.md' },
          { text: '交叉面试', link: '/docs/third-exam/cross-test.md' },
        ],
      },
      {
        text: 'HR 面',
        items: [
          { text: '行为面试', link: '/docs/hr-exam/behavioural-test.md' },
          { text: '谈薪技巧', link: '/docs/hr-exam/salary.md' },
        ],
      },
      {
        text: '服务',
        items: [
          { text: '加群沟通', link: '/docs/services/group.md' },
          { text: '提交面试真题', link: '/docs/services/submit-question.md' },
          { text: '1v1 咨询服务 🔥', link: '/docs/services/1v1.md' },
        ],
      },
      // {
      //   text: 'Examples',
      //   items: [
      //     { text: 'Markdown Examples', link: '/docs/markdown-examples' },
      //     { text: 'Runtime API Examples', link: '/docs/api-examples' },
      //   ],
      // },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/mianshipai/mianshipai-web' },
    ],

    footer: {
      message:
        '<a href="https://juejin.cn/user/1714893868765373" target="_blank">双越老师博客</a> | <a href="https://space.bilibili.com/697803545" target="_blank">双越老师 B站</a> | <a href="https://www.huashuiai.com/" target="_blank">划水AI</a>',
      copyright: 'Copyright © 2025-present Mianshipai 面试派',
    },
  },
})
