# vue-hooks-utils 使用指南

仅依赖 Vue 的通用组合式 hooks 子包。

## 安装

### peerDependencies

- `vue: ^3.5.0`

### Workspace 依赖

```json
{
  "dependencies": {
    "vue-hooks-utils": "workspace:*"
  }
}
```

## API 列表

| 方法 | 说明 |
|------|------|
| `usePageActive` | 提供 keep-alive 场景下页面激活状态 |
| `useScrollVisibility` | 监听滚动方向并输出显隐状态 |
| `useEventListener` | 自动注册/清理事件监听，支持 Ref 目标 |
| `useIframeDocumentWrite` | 在 `iframe[srcdoc]` 不稳定环境下改用 `document.write` 渲染 HTML |
| `useViewportUnit` | 将运行时 px 动态样式值转换为 vw/vh/vmin/vmax |
| `useAutoScrollOnFocus` | 输入框聚焦时自动滚动到可视区域 |
| `useSoftKeyboardVisibility` | 监听移动端软键盘可见状态与估算高度 |

## 使用示例

### usePageActive

```ts
import { usePageActive } from 'vue-hooks-utils'

const { isPageActive } = usePageActive(true)
```

### useScrollVisibility

```ts
import { ref } from 'vue'
import { useScrollVisibility } from 'vue-hooks-utils'

const containerRef = ref<HTMLElement | null>(null)

const { isVisible, direction, scrollTop } = useScrollVisibility({
  target: containerRef,
  threshold: 8,
})
```

### useEventListener

```ts
import { useEventListener } from 'vue-hooks-utils'

useEventListener(window, 'resize', () => {
  // do something
})
```

### useViewportUnit

```ts
import { useViewportUnit } from 'vue-hooks-utils'

const { pxToVw, pxToViewportUnit } = useViewportUnit({
  designSize: 375,
  precision: 4,
})

const iconSize = pxToVw(12)
const sheetHeight = pxToViewportUnit(240, {
  designSize: 812,
  unit: 'vh',
})
```

模板里的动态绑定值不会经过 PostCSS 的 px-to-viewport 转换，可用 `useViewportUnit` 在运行时统一换算。字符串输入默认原样返回，便于调用方传入 `10px`、`10vw`、`clamp(...)` 等已经带单位的值。

### useAutoScrollOnFocus

```ts
import { useAutoScrollOnFocus } from 'vue-hooks-utils'

useAutoScrollOnFocus({
  fixedSelector: '.bottom-action-bar',
  bottomOffset: 12,
})
```

移动端表单页可在组件 `setup` 中调用。Hook 会监听 `focusin`，当 `input` / `textarea` 被软键盘遮挡时触发滚动；iOS 下会优先寻找最近的可滚动父容器，非 iOS 环境使用 `scrollIntoView` 兜底。

### useSoftKeyboardVisibility

```ts
import { useSoftKeyboardVisibility } from 'vue-hooks-utils'

const { isKeyboardVisible, keyboardHeight } = useSoftKeyboardVisibility({
  threshold: 100,
  onChange(state) {
    console.log(state.isKeyboardVisible, state.keyboardHeight)
  },
})
```

Hook 仅输出软键盘状态，不直接修改业务元素样式。页面可以根据 `isKeyboardVisible` 决定是否隐藏底部按钮、排序栏或浮层操作区。

### useIframeDocumentWrite

```ts
import { nextTick, ref, watch } from 'vue'
import { useIframeDocumentWrite } from 'vue-hooks-utils'

const visible = ref(false)
const decodedHtml = ref('<h1>Hello iframe</h1>')

const { iframeRef, writeIframeContent } = useIframeDocumentWrite(decodedHtml, {
  retry: 2,
  retryDelay: 60,
})

const tryWriteIframeContent = async () => {
  const success = await writeIframeContent()
  if (!success) {
    console.warn('iframe 内容写入失败，请检查 iframe 是否已挂载。')
  }
}

watch(visible, (value) => {
  if (!value) return
  nextTick(() => {
    void tryWriteIframeContent()
  })
})

watch(decodedHtml, () => {
  nextTick(() => {
    void tryWriteIframeContent()
  })
})
```

更多设计细节见 [vue-hooks-utils 设计文档](./design.md)。
