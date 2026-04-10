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
