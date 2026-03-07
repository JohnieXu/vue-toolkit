# vue-modal-utils 使用指南

弹窗命令式调用 API，基于 Vant。

## 安装

```bash
pnpm add vue-modal-utils vue vant
```

## 全局配置（可选）

可通过 `configureModalUtils` 设置库级默认配置。

```js
import { configureModalUtils } from 'vue-modal-utils'

configureModalUtils({
  // 支持 number(ms) 或 string("0.3s"/"300ms")
  animationDuration: '0.3s',
})
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
  animationDuration: 260, // 可选，单次调用覆盖（优先级高于全局配置）
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
  animationDuration: '320ms', // 可选，单次调用覆盖
})

// action: 'confirm' | 'cancel' | 'overlay' | 'close'
```

### 高级用法

- **content**：自定义渲染内容（渲染函数 `() => VNode`）
- **component / componentProps**：传入业务组件及 props
- **buttons**：`[{ text, type?, key? }]` 自定义按钮列表
- **beforeClose**：异步函数，返回 `false` 可阻止关闭
- **onOpen / onClose**：生命周期回调
- **animationDuration**：动画时长，支持 `number(ms)`、`"300ms"`、`"0.3s"`

## 动画时长优先级

`unmountDelay` 的来源按以下优先级解析：

1. 单次调用参数 `options.animationDuration`
2. 全局配置 `configureModalUtils({ animationDuration })`
3. Vant 主题变量（`ConfigProvider` 影响的 CSS 变量）
4. 回退值 `300ms`
