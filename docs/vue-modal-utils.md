# vue-modal-utils

Vue 3 弹窗命令式调用 API，基于 Vant。

## 安装

```bash
pnpm add vue-modal-utils vue vant
```

## 样式引入（必选）

在应用入口（如 `main.js`）引入样式：

```js
import 'vant/lib/index.css'
import 'vue-modal-utils/style'
```

可选：初始化全局配置（例如动画时长）：

```js
import { configureModalUtils } from 'vue-modal-utils'

configureModalUtils({
  // 支持 number(ms) 或 string("0.3s"/"300ms")
  animationDuration: '0.28s',
})
```

## API

### showCommonBottomPopup / showBottomTip（Phase 1）

单按钮底部弹窗。

```js
import { showCommonBottomPopup } from 'vue-modal-utils'

showCommonBottomPopup({
  title: '提示',
  message: '你的企业已配置相关预订管控规则',
  buttonText: '知道了',
  showClose: true,
  // 单次调用覆盖动画时长（优先级高于全局配置）
  animationDuration: 260
}).then(() => console.log('closed'))
```

### showModal（Phase 2/3）

统一弹窗 API。

```js
import { showModal } from 'vue-modal-utils'
import { h } from 'vue'

// 基础
const action = await showModal({
  position: 'bottom',  // bottom | center | top
  title: '温馨提示',
  message: '确定要取消吗？',
  showCancelButton: true,
  cancelText: '再想想',
  confirmText: '确认取消',
  animationDuration: '320ms'
})

// 多按钮
showModal({
  title: '选择操作',
  buttons: [
    { text: '取消', type: 'default', key: 'cancel' },
    { text: '暂存', type: 'default', key: 'save' },
    { text: '提交', type: 'primary', key: 'submit' }
  ]
})

// content 渲染函数
showModal({
  content: () => h('div', null, '自定义 VNode'),
  confirmText: '知道了'
})

// beforeClose
showModal({
  async beforeClose(action) {
    if (action === 'confirm') {
      await someAsyncCheck()
      return false  // 阻止关闭
    }
    return true
  }
})
```

## 参数说明

| 参数 | 类型 | 说明 |
|------|------|------|
| position | 'bottom' \| 'center' \| 'top' | 弹窗位置 |
| title | string | 标题 |
| message | string | 文案 |
| confirmText | string | 确认按钮文案 |
| cancelText | string | 取消按钮文案 |
| showCancelButton | boolean | 是否显示取消 |
| content | () => VNode | 自定义内容渲染 |
| component | Component | 业务组件 |
| componentProps | object | 组件 props |
| buttons | array | 多按钮配置 |
| beforeClose | (action) => boolean \| Promise<boolean> | 关闭前钩子 |
| animationDuration | number \| string | 动画时长，支持 `ms`/`s` 格式；优先级：单次调用 > 全局配置 > Vant 主题变量 > 300ms |

### configureModalUtils

配置库级默认行为。

```js
import { configureModalUtils } from 'vue-modal-utils'

configureModalUtils({
  animationDuration: '0.3s',
})
```

| 参数 | 类型 | 说明 |
|------|------|------|
| animationDuration | number \| string | 全局默认动画时长，支持 `ms`/`s` 格式 |
