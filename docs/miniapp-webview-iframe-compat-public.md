# 实战：小程序 web-view 中 iframe srcdoc 白屏的兼容性修复

## 一句话结论

在“小程序 `web-view` + H5 + `iframe`”场景里，`iframe[srcdoc]` 不是稳定方案。  
更稳妥的做法是：使用 `iframe document.write` 注入 HTML，并在挂载后与内容变更时重写。

---

## 问题背景

我们在 H5 页面中通过弹窗展示后端返回的富文本，最初写法如下：

```vue
<iframe :srcdoc="decodedHtml" style="width: 100%; height: 100%; border: none;"></iframe>
```

在部分端表现正常，但在 **iOS 小程序** 与 **桌面版小程序** 中出现空白。

---

## 现象与排查

- 数据正常：HTML 字符串有值。
- 普通浏览器可渲染，小程序容器内白屏。
- 组件尺寸正常，不是布局导致不可见。

最终定位为：`srcdoc` 在该复合容器场景下兼容性不稳定。

---

## 修复方案

### 1) 用 `ref` 持有 iframe，不再使用 `srcdoc`

```vue
<iframe ref="iframeRef" style="width: 100%; height: 100%; border: none;"></iframe>
```

### 2) 改为 `document.write` 注入（写入前先 decode）

```js
import { decodeHtmlEntities } from 'vue-shared-utils'

const writeIframeContent = (iframeEl, html) => {
  const iframeDoc = iframeEl?.contentWindow?.document || iframeEl?.contentDocument
  if (!iframeDoc) return false

  iframeDoc.open()
  iframeDoc.write(decodeHtmlEntities(html))
  iframeDoc.close()
  return true
}
```

### 3) 在两个关键时机调用

- 组件显示后（`nextTick`）
- HTML 内容变化后（`watch` + `nextTick`）

---

## 推荐封装：通用 Hook

把兼容逻辑抽成 Hook，避免每个组件重复写平台细节。

```js
import { onBeforeUnmount, ref, unref } from 'vue'
import { decodeHtmlEntities } from 'vue-shared-utils'

export function useIframeDocumentWrite(htmlSource = '', options = {}) {
  const iframeRef = ref()
  const { retry = 2, retryDelay = 60 } = options
  const pendingTimers = new Set()
  let disposed = false

  const sleep = ms => {
    if (disposed) return Promise.resolve(false)
    return new Promise(resolve => {
      const timer = setTimeout(() => {
        pendingTimers.delete(timer)
        resolve(!disposed)
      }, ms)
      pendingTimers.add(timer)
    })
  }

  onBeforeUnmount(() => {
    disposed = true
    pendingTimers.forEach(clearTimeout)
    pendingTimers.clear()
  })

  const getIframeDocument = () => {
    const iframeEl = iframeRef.value
    return iframeEl?.contentWindow?.document || iframeEl?.contentDocument || null
  }

  const writeOnce = html => {
    const iframeDoc = getIframeDocument()
    if (!iframeDoc) return false
    iframeDoc.open()
    iframeDoc.write(html)
    iframeDoc.close()
    return true
  }

  const writeIframeContent = async content => {
    if (disposed) return false
    const finalHtml = decodeHtmlEntities(content ?? unref(htmlSource))
    let lastError = null

    for (let i = 0; i <= retry; i++) {
      try {
        if (writeOnce(finalHtml)) return true
      } catch (error) {
        lastError = error
      }
      if (i < retry) {
        const keepWaiting = await sleep(retryDelay)
        if (!keepWaiting) return false
      }
    }

    if (lastError) {
      console.error('[useIframeDocumentWrite] Failed to write iframe content.', lastError)
    } else {
      console.warn('[useIframeDocumentWrite] Failed to write iframe content.')
    }
    return false
  }

  return { iframeRef, writeIframeContent }
}
```

接入示例：

```js
const { iframeRef, writeIframeContent } = useIframeDocumentWrite(decodedHtml, {
  retry: 2,
  retryDelay: 60,
})

watch(visible, v => {
  if (v) {
    nextTick(async () => {
      const ok = await writeIframeContent()
      if (!ok) console.warn('iframe 内容写入失败，请检查 iframe 是否已挂载。')
    })
  }
})

watch(decodedHtml, () => {
  nextTick(async () => {
    const ok = await writeIframeContent()
    if (!ok) console.warn('iframe 内容写入失败，请检查 iframe 是否已挂载。')
  })
})
```

---

## 注意事项

1. `document.write` 仅适用于可控内容源；不可信 HTML 必须先做 XSS 过滤。  
2. 写入前先进行 HTML 实体 decode（可复用 `vue-shared-utils/decodeHtmlEntities`）。  
3. 写入前要确保 `iframe` 已挂载（`nextTick` 很关键）。  
4. 每次重绘使用 `open/write/close`，避免旧文档状态残留。  
5. 组件卸载时要清理重试定时器，避免潜在内存泄漏。  
6. 调用 `writeIframeContent` 时要处理返回值/异常，避免“失败无感知”。  
7. 同一 `iframe` 不要混用 `srcdoc` 与 `write`。  

---

## 适用场景

- 小程序 `web-view` 容器里需要动态渲染 HTML 片段
- 跨端一致性要求高（尤其 iOS/桌面小程序）
- 希望将兼容性细节集中治理（通过 Hook 复用）

---

## 小结

`iframe[srcdoc]` 在小程序容器中存在已知兼容风险。  
将渲染链路切换到 `document.write`，并配合“decode 后写入 + 挂载后写入 + 内容变更重写 + 轻量重试 + 卸载清理 + 失败可观测”的策略，通常能显著提升稳定性。

