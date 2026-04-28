import { onBeforeUnmount, readonly, ref, type Ref } from 'vue'
import { type MaybeElementRef, useEventListener } from './useEventListener'

/**
 * 软键盘监听的焦点事件目标。
 *
 * @public
 */
export type SoftKeyboardFocusTarget = Document | HTMLElement

/**
 * 软键盘状态快照。
 *
 * @public
 */
export interface SoftKeyboardVisibilityState {
  /**
   * 软键盘是否可见。
   */
  isKeyboardVisible: boolean
  /**
   * 估算的软键盘高度，单位为 px。
   */
  keyboardHeight: number
  /**
   * 当前可视视口高度，单位为 px。
   */
  viewportHeight: number
  /**
   * 作为比较基准的视口高度，单位为 px。
   */
  baselineHeight: number
}

/**
 * `useSoftKeyboardVisibility` 的配置项。
 *
 * @public
 */
export interface UseSoftKeyboardVisibilityOptions {
  /**
   * 监听 `focusin` / `focusout` 的目标，默认使用 `document`。
   */
  target?: MaybeElementRef<SoftKeyboardFocusTarget>
  /**
   * 视口高度差超过该阈值时认为软键盘弹出，单位为 px。
   *
   * 默认值：`100`
   */
  threshold?: number
  /**
   * 初始软键盘可见状态。
   *
   * 默认值：`false`
   */
  initialVisible?: boolean
  /**
   * 聚焦输入框后延迟更新状态的时间，单位为毫秒。
   *
   * 默认值：`80`
   */
  focusDelay?: number
  /**
   * 失焦后延迟更新状态的时间，单位为毫秒。
   *
   * 默认值：`120`
   */
  blurDelay?: number
  /**
   * 软键盘状态变化时触发的回调。
   */
  onChange?: (state: SoftKeyboardVisibilityState) => void
}

/**
 * `useSoftKeyboardVisibility` 返回值。
 *
 * @public
 */
export interface UseSoftKeyboardVisibilityResult {
  /**
   * 软键盘是否可见。
   */
  isKeyboardVisible: Readonly<Ref<boolean>>
  /**
   * 估算的软键盘高度，单位为 px。
   */
  keyboardHeight: Readonly<Ref<number>>
  /**
   * 当前可视视口高度，单位为 px。
   */
  viewportHeight: Readonly<Ref<number>>
  /**
   * 作为比较基准的视口高度，单位为 px。
   */
  baselineHeight: Readonly<Ref<number>>
  /**
   * 立即重新计算软键盘状态。
   */
  update: () => void
  /**
   * 重置基准高度并重新计算状态。
   */
  reset: () => void
}

const getDefaultTarget = () => {
  if (typeof document === 'undefined') return null
  return document
}

const getVisualViewport = () => {
  if (typeof window === 'undefined') return null
  return window.visualViewport ?? null
}

const getViewportHeight = () => {
  const visualViewport = getVisualViewport()
  if (visualViewport) return visualViewport.height
  if (typeof window !== 'undefined') return window.innerHeight
  if (typeof document !== 'undefined') return document.documentElement.clientHeight
  return 0
}

const getWindowHeight = () => {
  if (typeof window !== 'undefined') return window.innerHeight
  if (typeof document !== 'undefined') return document.documentElement.clientHeight
  return 0
}

const normalizeNumber = (value: number | undefined, fallback: number) => {
  return typeof value === 'number' && Number.isFinite(value) ? Math.max(0, value) : fallback
}

const isEditableElement = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) return false
  if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement) {
    return true
  }
  return target.isContentEditable
}

/**
 * 监听移动端软键盘可见状态。
 *
 * @param options - 监听配置。
 * @returns 软键盘可见状态、估算高度与手动更新方法。
 * @remarks
 * 优先使用 `visualViewport` 计算高度差；不可用时退回到 `window.innerHeight` 变化。
 * Hook 仅输出状态，不直接修改底部按钮、工具栏等业务 DOM。
 * @public
 */
export function useSoftKeyboardVisibility(
  options: UseSoftKeyboardVisibilityOptions = {}
): UseSoftKeyboardVisibilityResult {
  const {
    target = getDefaultTarget,
    initialVisible = false,
    onChange,
  } = options

  const threshold = normalizeNumber(options.threshold, 100)
  const focusDelay = normalizeNumber(options.focusDelay, 80)
  const blurDelay = normalizeNumber(options.blurDelay, 120)
  const initialHeight = getWindowHeight()
  const isKeyboardVisible = ref(Boolean(initialVisible))
  const keyboardHeight = ref(0)
  const viewportHeight = ref(getViewportHeight())
  const baselineHeight = ref(initialHeight)
  const pendingTimers = new Set<ReturnType<typeof setTimeout>>()

  const emitChange = () => {
    onChange?.({
      isKeyboardVisible: isKeyboardVisible.value,
      keyboardHeight: keyboardHeight.value,
      viewportHeight: viewportHeight.value,
      baselineHeight: baselineHeight.value,
    })
  }

  const setState = (visible: boolean, height: number, viewport: number) => {
    const finalHeight = Math.max(0, height)
    const changed = isKeyboardVisible.value !== visible ||
      keyboardHeight.value !== finalHeight ||
      viewportHeight.value !== viewport

    isKeyboardVisible.value = visible
    keyboardHeight.value = finalHeight
    viewportHeight.value = viewport

    if (changed) emitChange()
  }

  const update = () => {
    const visualViewport = getVisualViewport()
    const viewport = getViewportHeight()
    const windowHeight = getWindowHeight()

    if (visualViewport) {
      const heightDiff = Math.max(0, windowHeight - visualViewport.height)
      setState(heightDiff > threshold, heightDiff, viewport)
      if (heightDiff <= threshold) {
        baselineHeight.value = Math.max(baselineHeight.value, windowHeight)
      }
      return
    }

    if (windowHeight > baselineHeight.value) {
      baselineHeight.value = windowHeight
    }

    const heightDiff = Math.max(0, baselineHeight.value - windowHeight)
    setState(heightDiff > threshold, heightDiff, viewport)
  }

  const reset = () => {
    baselineHeight.value = getWindowHeight()
    update()
  }

  const scheduleUpdate = (delay: number) => {
    const timer = setTimeout(() => {
      pendingTimers.delete(timer)
      update()
    }, delay)
    pendingTimers.add(timer)
  }

  const clearPendingTimers = () => {
    pendingTimers.forEach((timer) => {
      clearTimeout(timer)
    })
    pendingTimers.clear()
  }

  const handleFocus = (event: Event) => {
    if (!isEditableElement(event.target)) return
    scheduleUpdate(focusDelay)
  }

  const handleBlur = (event: Event) => {
    if (!isEditableElement(event.target)) return
    scheduleUpdate(blurDelay)
  }

  useEventListener(getVisualViewport, 'resize', update)
  useEventListener(() => (typeof window === 'undefined' ? null : window), 'resize', update)
  useEventListener(target, 'focusin', handleFocus, { capture: true })
  useEventListener(target, 'focusout', handleBlur, { capture: true })

  onBeforeUnmount(() => {
    clearPendingTimers()
  })

  return {
    isKeyboardVisible: readonly(isKeyboardVisible),
    keyboardHeight: readonly(keyboardHeight),
    viewportHeight: readonly(viewportHeight),
    baselineHeight: readonly(baselineHeight),
    update,
    reset,
  }
}
