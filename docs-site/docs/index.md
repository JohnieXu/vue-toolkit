# vue-toolkit

基于 Vue 3 的 UI 工具方法集合，提供弹窗、挂载等命令式 API，供业务项目快速集成。

## 特性

- 基于 **Vue 3** + **Vant** 的移动端工具
- 命令式调用，无需在模板中声明组件
- 支持底部弹窗、居中弹窗等多种形态
- 共享工具可复用于新子包，避免重复实现

## 快速开始

```bash
pnpm add vue-modal-utils vue vant
```

```js
import { showCommonBottomPopup, showModal } from 'vue-modal-utils'

showCommonBottomPopup({ message: '操作成功' })

const action = await showModal({
  title: '温馨提示',
  message: '确定要取消吗？',
  showCancelButton: true,
})
```

## 文档导航

- [使用指南](./guide/intro.md) - 安装、workspace 使用、引入方式
- [子包简介](./guide/packages.md) - 各子包定位与依赖关系
- [子包文档](./packages/vue-modal-utils/guide.md) - 各子包使用指南与设计文档
- [规范与约定](./standards/code-style.md) - 代码规范、设计规范
