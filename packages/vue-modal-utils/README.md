# vue-modal-utils

Vue 3 弹窗命令式调用 API，基于 Vant。详见 [docs/vue-modal-utils.md](../../docs/vue-modal-utils.md)。

## 安装

```bash
pnpm add vue-modal-utils vue vant
```

## 使用

入口引入样式和 API：

```js
import 'vue-modal-utils/style'
import {
  configureModalUtils,
  showCommonBottomPopup,
  showModal,
  showBottomTip,
} from 'vue-modal-utils'

configureModalUtils({
  // 可选：全局动画时长，支持 number(ms) 或 "0.3s"/"300ms"
  animationDuration: '0.3s',
})
```
