# vue-modal-utils

弹窗命令式调用 API，基于 Vant。

## 安装

```bash
pnpm add vue-modal-utils vue vant
```

## showCommonBottomPopup

单按钮底部弹窗。

```js
import { showCommonBottomPopup } from 'vue-modal-utils'

showCommonBottomPopup({
  message: '操作成功'
})
```

## showModal

统一弹窗 API，支持 position、多按钮、content、beforeClose。

```js
import { showModal } from 'vue-modal-utils'

const action = await showModal({
  position: 'bottom',
  title: '温馨提示',
  message: '确定要取消吗？',
  showCancelButton: true,
  cancelText: '再想想',
  confirmText: '确认取消'
})
```

完整 API 详见项目仓库 `docs/vue-modal-utils.md`。
