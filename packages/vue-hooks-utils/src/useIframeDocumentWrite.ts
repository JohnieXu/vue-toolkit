import { ref, type Ref, unref } from 'vue'

type MaybeRefOrGetter<T> = T | Ref<T> | (() => T)

/**
 * `useIframeDocumentWrite` 的配置项。
 *
 * @public
 */
export interface UseIframeDocumentWriteOptions {
  /**
   * 写入失败后的重试次数（不含首次写入）。
   *
   * 默认值：`2`
   */
  retry?: number
  /**
   * 每次重试之间的间隔（毫秒）。
   *
   * 默认值：`60`
   */
  retryDelay?: number
}

/**
 * `useIframeDocumentWrite` 返回值。
 *
 * @public
 */
export interface UseIframeDocumentWriteResult {
  /**
   * 需要绑定到 `iframe` 元素的 Ref。
   */
  iframeRef: Ref<HTMLIFrameElement | null>
  /**
   * 向 iframe 文档写入 HTML 内容。
   *
   * @param content - 可选，优先级高于初始化时传入的 `htmlSource`。
   * @returns 写入是否成功。
   */
  writeIframeContent: (content?: unknown) => Promise<boolean>
}

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

const resolveSource = (source: MaybeRefOrGetter<unknown>) => {
  if (typeof source === 'function') {
    return (source as () => unknown)()
  }
  return unref(source as Ref<unknown>)
}

const normalizeRetry = (value: number | undefined, fallback: number) => {
  if (typeof value !== 'number' || !Number.isFinite(value)) return fallback
  return Math.max(0, Math.floor(value))
}

const getIframeDocument = (iframeEl: HTMLIFrameElement | null) => {
  return iframeEl?.contentWindow?.document || iframeEl?.contentDocument || null
}

const writeOnce = (iframeEl: HTMLIFrameElement | null, html: string) => {
  const iframeDoc = getIframeDocument(iframeEl)
  if (!iframeDoc) return false
  iframeDoc.open()
  iframeDoc.write(html)
  iframeDoc.close()
  return true
}

/**
 * 在 `iframe[srcdoc]` 兼容性不稳定场景下，使用 `document.write` 写入 HTML。
 *
 * @param htmlSource - 默认 HTML 数据源，支持值 / Ref / getter。
 * @param options - 重试配置。
 * @returns `iframeRef` 与写入方法。
 * @remarks
 * 推荐在 `iframe` 挂载完成后调用（例如 `nextTick` 后），并在内容变化时重写。
 * 该 Hook 不做 XSS 过滤，传入内容应为可信 HTML 或已完成安全处理。
 * @public
 */
export function useIframeDocumentWrite(
  htmlSource: MaybeRefOrGetter<unknown> = '',
  options: UseIframeDocumentWriteOptions = {}
): UseIframeDocumentWriteResult {
  const iframeRef = ref<HTMLIFrameElement | null>(null)
  const retry = normalizeRetry(options.retry, 2)
  const retryDelay = normalizeRetry(options.retryDelay, 60)

  const writeIframeContent = async (content?: unknown) => {
    const sourceValue = content ?? resolveSource(htmlSource)
    const finalHtml = String(sourceValue ?? '')

    for (let attempt = 0; attempt <= retry; attempt += 1) {
      if (writeOnce(iframeRef.value, finalHtml)) return true
      if (attempt < retry) {
        await sleep(retryDelay)
      }
    }

    return false
  }

  return {
    iframeRef,
    writeIframeContent,
  }
}
