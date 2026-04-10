import { readonly, ref, watchEffect } from 'vue'
import { type MaybeElementRef, resolveMaybeRefTarget, useEventListener } from './useEventListener'

/**
 * 滚动方向。
 *
 * @public
 */
export type ScrollDirection = 'up' | 'down' | 'none'

/**
 * `useScrollVisibility` 的配置项。
 *
 * @public
 */
export interface UseScrollVisibilityOptions {
  target?: MaybeElementRef<Window | Document | HTMLElement>
  threshold?: number
  initialVisible?: boolean
}

function getDefaultWindow(): Window | null {
  if (typeof window === 'undefined') return null
  return window
}

function resolveScrollTop(target: Window | Document | HTMLElement): number {
  if (target instanceof Window) {
    return target.scrollY ?? target.pageYOffset ?? 0
  }
  if (target instanceof Document) {
    return target.documentElement?.scrollTop ?? target.body?.scrollTop ?? 0
  }
  return target.scrollTop ?? 0
}

/**
 * 根据滚动方向控制显隐状态。
 *
 * @param options - 配置项。
 * @returns 显隐状态、方向与滚动值。
 * @public
 */
export function useScrollVisibility(options: UseScrollVisibilityOptions = {}) {
  const {
    threshold = 0,
    initialVisible = true,
    target = getDefaultWindow(),
  } = options

  const isVisible = ref(Boolean(initialVisible))
  const direction = ref<ScrollDirection>('none')
  const scrollTop = ref(0)

  let lastTop = 0

  watchEffect(() => {
    const unwrappedTarget = resolveMaybeRefTarget(target)
    if (!unwrappedTarget) {
      lastTop = 0
      scrollTop.value = 0
      direction.value = 'none'
      return
    }

    const currentTop = resolveScrollTop(unwrappedTarget)
    lastTop = currentTop
    scrollTop.value = currentTop
  })

  useEventListener(
    target,
    'scroll',
    () => {
      const unwrappedTarget = resolveMaybeRefTarget(target)
      if (!unwrappedTarget) return

      const currentTop = resolveScrollTop(unwrappedTarget)
      const delta = currentTop - lastTop

      scrollTop.value = currentTop

      if (Math.abs(delta) <= threshold) return

      if (delta > 0) {
        direction.value = 'down'
        isVisible.value = false
      } else {
        direction.value = 'up'
        isVisible.value = true
      }

      if (currentTop <= 0) {
        direction.value = 'up'
        isVisible.value = true
      }

      lastTop = currentTop
    },
    { passive: true }
  )

  return {
    isVisible: readonly(isVisible),
    direction: readonly(direction),
    scrollTop: readonly(scrollTop),
  }
}
