/**
 * `vue-hooks-utils`：通用组合式 hooks（仅依赖 vue）。
 *
 * @packageDocumentation
 */

export { usePageActive } from './usePageActive'
export { useEventListener } from './useEventListener'
export { useScrollVisibility } from './useScrollVisibility'
export { useIframeDocumentWrite } from './useIframeDocumentWrite'

export type { EventTargetLike, MaybeElementRef } from './useEventListener'
export type { ScrollDirection, UseScrollVisibilityOptions } from './useScrollVisibility'
export type { UseIframeDocumentWriteOptions, UseIframeDocumentWriteResult } from './useIframeDocumentWrite'
