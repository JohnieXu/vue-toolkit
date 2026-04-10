import { onBeforeUnmount, type Ref, unref, watchEffect } from 'vue'

/**
 * 事件目标最小能力约束。
 *
 * @public
 */
export type EventTargetLike = Pick<EventTarget, 'addEventListener' | 'removeEventListener'>
/**
 * 支持元素实例、Ref 或 getter 的目标类型。
 *
 * @typeParam T - 目标类型。
 * @public
 */
export type MaybeElementRef<T> = T | Ref<T | null | undefined> | (() => T | null | undefined)

/**
 * 解析元素目标，统一得到可直接使用的实例。
 *
 * @typeParam T - 目标类型。
 * @param target - 元素、Ref 或 getter。
 * @returns 解析后的目标实例，未就绪时返回 `null/undefined`。
 * @public
 */
export function resolveMaybeRefTarget<T>(target: MaybeElementRef<T>): T | null | undefined {
  if (typeof target === 'function') {
    return (target as () => T | null | undefined)()
  }
  return unref(target as T | Ref<T | null | undefined>)
}

/**
 * 统一管理事件监听的注册与清理，支持 Ref 目标。
 *
 * @typeParam T - 目标类型。
 * @param target - 事件目标，支持实例 / Ref / getter。
 * @param eventName - 事件名。
 * @param handler - 事件处理器。
 * @param options - 监听选项。
 * @returns 用于手动停止监听响应的函数。
 * @public
 */
export function useEventListener<T extends EventTargetLike>(
  target: MaybeElementRef<T>,
  eventName: string,
  handler: EventListenerOrEventListenerObject,
  options?: boolean | AddEventListenerOptions
) {
  const stopWatch = watchEffect((onCleanup) => {
    const element = resolveMaybeRefTarget(target)
    if (!element) return
    element.addEventListener(eventName, handler, options)
    onCleanup(() => {
      element.removeEventListener(eventName, handler, options)
    })
  })

  onBeforeUnmount(() => {
    stopWatch()
  })

  return stopWatch
}
