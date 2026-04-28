/**
 * `vue-hooks-utils`：通用组合式 hooks（仅依赖 vue）。
 *
 * @packageDocumentation
 */

export { usePageActive } from './usePageActive'
export { useEventListener } from './useEventListener'
export { useScrollVisibility } from './useScrollVisibility'
export { useIframeDocumentWrite } from './useIframeDocumentWrite'
export { pxToViewportUnit, useViewportUnit } from './useViewportUnit'
export { useAutoScrollOnFocus } from './useAutoScrollOnFocus'
export { useSoftKeyboardVisibility } from './useSoftKeyboardVisibility'

export type { EventTargetLike, MaybeElementRef } from './useEventListener'
export type { ScrollDirection, UseScrollVisibilityOptions } from './useScrollVisibility'
export type { UseIframeDocumentWriteOptions, UseIframeDocumentWriteResult } from './useIframeDocumentWrite'
export type {
  PxToViewportUnitOptions,
  UseViewportUnitOptions,
  UseViewportUnitResult,
  ViewportUnit,
  ViewportUnitPxValue,
} from './useViewportUnit'
export type { AutoScrollFocusTarget, UseAutoScrollOnFocusOptions } from './useAutoScrollOnFocus'
export type {
  SoftKeyboardFocusTarget,
  SoftKeyboardVisibilityState,
  UseSoftKeyboardVisibilityOptions,
  UseSoftKeyboardVisibilityResult,
} from './useSoftKeyboardVisibility'
