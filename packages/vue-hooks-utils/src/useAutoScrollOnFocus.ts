import { onBeforeUnmount } from 'vue'
import { type MaybeElementRef, resolveMaybeRefTarget, useEventListener } from './useEventListener'

/**
 * 自动滚动时支持的目标元素。
 *
 * @public
 */
export type AutoScrollFocusTarget = Document | HTMLElement

/**
 * `useAutoScrollOnFocus` 的配置项。
 *
 * @public
 */
export interface UseAutoScrollOnFocusOptions {
  /**
   * 监听 `focusin` 的目标，默认使用 `document`。
   */
  target?: MaybeElementRef<AutoScrollFocusTarget>
  /**
   * 底部固定元素选择器。匹配到元素时会把其高度作为底部避让距离。
   */
  fixedSelector?: string
  /**
   * 底部额外避让距离，单位为 px。
   *
   * 默认值：`0`
   */
  bottomOffset?: number
  /**
   * iOS 聚焦后的滚动延迟，单位为毫秒。
   *
   * 默认值：`300`
   */
  iosDelay?: number
  /**
   * 非 iOS 聚焦后的滚动延迟，单位为毫秒。
   *
   * 默认值：`500`
   */
  defaultDelay?: number
  /**
   * iOS 下将输入框滚动到距容器顶部的偏移量，单位为 px。
   *
   * 默认值：`100`
   */
  topOffset?: number
  /**
   * 滚动行为。
   *
   * 默认值：`smooth`
   */
  scrollBehavior?: ScrollBehavior
  /**
   * 非 iOS 下调用 `scrollIntoView` 的块级对齐方式。
   *
   * 默认值：`center`
   */
  block?: ScrollLogicalPosition
}

const getDefaultTarget = () => {
  if (typeof document === 'undefined') return null
  return document
}

const isTextInputElement = (target: EventTarget | null): target is HTMLInputElement | HTMLTextAreaElement => {
  if (typeof HTMLInputElement === 'undefined' || typeof HTMLTextAreaElement === 'undefined') return false
  return target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement
}

const isIOSDevice = () => {
  if (typeof navigator === 'undefined') return false
  return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.userAgent.includes('Mac') && navigator.maxTouchPoints > 1)
}

const normalizeNumber = (value: number | undefined, fallback: number) => {
  return typeof value === 'number' && Number.isFinite(value) ? Math.max(0, value) : fallback
}

const getFixedHeight = (fixedSelector: string | undefined, bottomOffset: number) => {
  if (typeof document === 'undefined' || !fixedSelector) return bottomOffset
  const element = document.querySelector<HTMLElement>(fixedSelector)
  return element ? element.offsetHeight : bottomOffset
}

const findScrollContainer = (element: HTMLElement): HTMLElement | Window => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return window

  let node: HTMLElement | null = element
  while (node && node !== document.body && node !== document.documentElement) {
    const style = window.getComputedStyle(node)
    const overflowY = style.overflowY
    if ((overflowY === 'auto' || overflowY === 'scroll') && node.scrollHeight > node.clientHeight) {
      return node
    }
    node = node.parentElement
  }

  return window
}

const isWindow = (value: HTMLElement | Window): value is Window => {
  return typeof window !== 'undefined' && value === window
}

const getContainerViewport = (container: HTMLElement | Window, bottomOffset: number) => {
  if (isWindow(container)) {
    return {
      top: 0,
      bottom: window.innerHeight - bottomOffset,
      scrollTop: window.scrollY ?? window.pageYOffset ?? 0,
    }
  }

  const rect = container.getBoundingClientRect()
  return {
    top: rect.top,
    bottom: rect.bottom - bottomOffset,
    scrollTop: container.scrollTop ?? 0,
  }
}

const scrollContainerTo = (container: HTMLElement | Window, top: number, behavior: ScrollBehavior) => {
  const finalTop = Math.max(0, top)
  if (isWindow(container)) {
    window.scrollTo({
      top: finalTop,
      behavior,
    })
    return
  }

  container.scrollTo({
    top: finalTop,
    behavior,
  })
}

/**
 * 在输入框聚焦时自动滚动到可视区域。
 *
 * @param options - 滚动与监听配置。
 * @remarks
 * 该 Hook 面向移动端 H5 表单场景。iOS 下会优先寻找最近的可滚动父容器，非 iOS 环境使用
 * `scrollIntoView` 作为保守兜底。Hook 不修改业务 DOM 样式。
 * @public
 */
export function useAutoScrollOnFocus(options: UseAutoScrollOnFocusOptions = {}) {
  const {
    target = getDefaultTarget,
    fixedSelector = '',
    scrollBehavior = 'smooth',
    block = 'center',
  } = options

  const bottomOffset = normalizeNumber(options.bottomOffset, 0)
  const iosDelay = normalizeNumber(options.iosDelay, 300)
  const defaultDelay = normalizeNumber(options.defaultDelay, 500)
  const topOffset = normalizeNumber(options.topOffset, 100)
  const pendingTimers = new Set<ReturnType<typeof setTimeout>>()

  const clearPendingTimers = () => {
    pendingTimers.forEach((timer) => {
      clearTimeout(timer)
    })
    pendingTimers.clear()
  }

  const handleFocus = (event: Event) => {
    const inputElement = event.target
    if (!isTextInputElement(inputElement)) return

    clearPendingTimers()

    const isIOS = isIOSDevice()
    const timer = setTimeout(() => {
      pendingTimers.delete(timer)

      const rect = inputElement.getBoundingClientRect()
      const fixedHeight = getFixedHeight(fixedSelector, bottomOffset)
      const visibleBottom = window.innerHeight - fixedHeight

      if (!isIOS) {
        const isVisible = rect.top >= 0 && rect.bottom <= visibleBottom
        if (!isVisible) {
          inputElement.scrollIntoView({
            behavior: scrollBehavior,
            block,
          })
        }
        return
      }

      const scrollContainer = findScrollContainer(inputElement)
      const viewport = getContainerViewport(scrollContainer, fixedHeight)
      const isVisible = rect.top >= viewport.top && rect.bottom <= viewport.bottom
      if (isVisible) return

      const targetTop = viewport.scrollTop + rect.top - viewport.top - topOffset
      scrollContainerTo(scrollContainer, targetTop, scrollBehavior)
    }, isIOS ? iosDelay : defaultDelay)

    pendingTimers.add(timer)
  }

  useEventListener(target, 'focusin', handleFocus, { capture: true })

  onBeforeUnmount(() => {
    clearPendingTimers()
  })
}
