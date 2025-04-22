import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'zh-CN',
  title: '前端面试派',
  description: '系统专业的前端面试导航，大厂面试规范，开源免费',
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'author', content: '双越老师' }],
    [
      'meta',
      {
        name: 'keywords',
        content:
          '前端, 面试, 前端面试, 面试题, 刷题, 面试流程, 前端面试流程, 面试准备, 简历, 前端简历, 开源, 免费, Javascript, Typescript, React, Vue, webpack, vite, HTTP, 算法',
      },
    ],
    // baidu 统计
    [
      'script',
      {},
      `
      var _hmt = _hmt || [];
      (function() {
        if (location.hostname.indexOf('mianshipai.com')<0) return;
        var hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?b53b3c926f6f6f5be6a9ac7e0911622b";
        var s = document.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(hm, s);
      })();
      `,
    ],
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      // { text: '首页', link: '/' },
      // { text: '正确写简历', link: '/docs/before-interview/write-resume.md' },
      { text: '1v1 面试咨询 🔥', link: '/docs/services/1v1.md' },
      { text: '加群讨论答疑', link: '/docs/services/group.md' },
      {
        text: '成为贡献者',
        link: 'https://github.com/mianshipai/mianshipai-web#%E8%B4%A1%E7%8C%AE%E9%A2%98%E7%9B%AE%E5%92%8C%E7%AD%94%E6%A1%88',
      },
    ],

    search: {
      provider: 'local',
    },

    outline: {
      level: [2, 3],
      label: '目录',
    },

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
          { text: '计算机基础', link: '/docs/first-exam/ComputerBase.md' },
          { text: 'HTML 和 CSS', link: '/docs/first-exam/HTML-CSS.md' },
          { text: 'JS 基础知识', link: '/docs/first-exam/JS' },
          { text: 'TS 类型', link: '/docs/first-exam/TS' },
          { text: 'HTTP 网络请求', link: '/docs/first-exam/HTTP.md' },
        ],
      },
      {
        text: '二面',
        items: [
          { text: 'Vue 使用', link: '/docs/second-exam/vue-usage.md' },
          { text: 'Vue 原理', link: '/docs/second-exam/vue-inner.md' },
          { text: 'React 使用', link: '/docs/second-exam/react-usage.md' },
          { text: 'React 原理', link: '/docs/second-exam/react-inner.md' },
          { text: '小程序', link: '/docs/second-exam/mini-program.md' },
          { text: '前端工程化', link: '/docs/second-exam/engineering.md' },
          { text: '鸿蒙应用开发', link: '/docs/second-exam/HarmonyOS-application-development.md' },
          { text: 'Nodejs', link: '/docs/second-exam/nodejs.md' },
        ],
      },
      {
        text: '三面',
        items: [
          { text: '交叉面试', link: '/docs/third-exam/cross-test.md' },
          { text: '项目难点/成绩', link: '/docs/third-exam/project.md' },
          // { text: '系统设计', link: '/docs/third-exam/system-design.md' },
          { text: '前端 Leader 面试', link: '/docs/third-exam/leader-test.md' },
          { text: '反问面试官', link: '/docs/third-exam/ask-in-reply.md' },
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
          { text: '加群讨论答疑', link: '/docs/services/group.md' },
          {
            text: '成为贡献者',
            link: 'https://github.com/mianshipai/mianshipai-web#%E8%B4%A1%E7%8C%AE%E9%A2%98%E7%9B%AE%E5%92%8C%E7%AD%94%E6%A1%88',
          },
          { text: '1v1 面试咨询 🔥', link: '/docs/services/1v1.md' },
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

    socialLinks: [{ icon: 'github', link: 'https://github.com/mianshipai/mianshipai-web' }],

    footer: {
      message:
        '<a href="https://www.wangeditor.com/" target="_blank">wangEditor</a> | <a href="https://www.huashuiai.com/" target="_blank">划水AI</a> | <a href="https://github.com/mianshipai/mianshipai-web/issues" target="_blank">提交问题和建议</a>',
      copyright: 'Copyright © 2025-present Mianshipai 面试派',
    },
  },
  ignoreDeadLinks: ['./vue-inner/index'],
})
