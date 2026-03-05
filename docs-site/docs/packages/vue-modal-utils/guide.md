# vue-modal-utils 使用指南

弹窗命令式调用 API，基于 Vant。

## 安装

```bash
pnpm add vue-modal-utils vue vant
```

## showCommonBottomPopup / showBottomTip

单按钮底部弹窗。

```js
import { showCommonBottomPopup } from 'vue-modal-utils'

showCommonBottomPopup({
  title: '提示',       // 可选，默认「提示」
  message: '操作成功',
  buttonText: '知道了',  // 可选
  showClose: true,    // 可选，是否显示关闭按钮
})
```

`showBottomTip` 为 `showCommonBottomPopup` 的别名。

## showModal

统一弹窗 API，支持 position、多按钮、content、beforeClose 等。

```js
import { showModal } from 'vue-modal-utils'

const action = await showModal({
  position: 'bottom',   // 'bottom' | 'center' | 'top'
  title: '温馨提示',
  message: '确定要取消吗？',
  showCancelButton: true,
  cancelText: '再想想',
  confirmText: '确认取消',
})

// action: 'confirm' | 'cancel' | 'overlay' | 'close'
```

### 高级用法

- **content**：自定义渲染内容（渲染函数 `() => VNode`）
- **component / componentProps**：传入业务组件及 props
- **buttons**：`[{ text, type?, key? }]` 自定义按钮列表
- **beforeClose**：异步函数，返回 `false` 可阻止关闭
- **onOpen / onClose**：生命周期回调
