import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'vue-toolkit',
  description: '基于 Vue 3 的 UI 工具方法集合',
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '使用指南', link: '/guide/intro' },
      { text: '本地接入', link: '/guide/local-integration' },
      { text: '子包', link: '/guide/packages' },
      { text: '规范', link: '/standards/code-style' },
    ],
    sidebar: [
      {
        text: '入门',
        items: [
          { text: '首页', link: '/' },
          { text: '使用指南', link: '/guide/intro' },
          { text: '本地接入业务项目', link: '/guide/local-integration' },
          { text: '子包简介', link: '/guide/packages' },
        ],
      },
      {
        text: '子包文档',
        items: [
          {
            text: 'vue-shared-utils',
            items: [
              { text: '使用指南', link: '/packages/vue-shared-utils/guide' },
              { text: '设计文档', link: '/packages/vue-shared-utils/design' },
            ],
          },
          {
            text: 'vue-modal-utils',
            items: [
              { text: '使用指南', link: '/packages/vue-modal-utils/guide' },
              { text: '设计文档', link: '/packages/vue-modal-utils/design' },
            ],
          },
        ],
      },
      {
        text: '规范与约定',
        items: [
          { text: '代码规范', link: '/standards/code-style' },
          { text: '设计规范', link: '/standards/design' },
        ],
      },
    ],
  },
})
