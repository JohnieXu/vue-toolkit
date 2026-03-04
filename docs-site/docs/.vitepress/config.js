import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'vue-toolkit',
  description: '基于 Vue 3 的 UI 工具方法集合',
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '指南', link: '/guide/vue-modal-utils' },
    ],
    sidebar: [
      {
        text: '指南',
        items: [
          { text: 'vue-modal-utils', link: '/guide/vue-modal-utils' },
        ],
      },
    ],
  },
})
