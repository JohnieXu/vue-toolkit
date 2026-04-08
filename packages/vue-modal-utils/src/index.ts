/**
 * `vue-modal-utils` 弹窗命令式 API 入口。
 *
 * @packageDocumentation
 */
import { h, ref } from 'vue'
import { mountComponent } from 'vue-shared-utils'
import BottomPopup from './components/BottomPopup.vue'
import ModalRenderer from './ModalRenderer.vue'
import type {
  ModalAction,
  ModalGlobalConfig,
  ShowCommonBottomPopupOptions,
  ShowModalOptions,
} from './types'

const DEFAULT_ANIMATION_DURATION = 300
const VANT_ANIMATION_DURATION_VARS = ['--van-duration-base', '--van-animation-duration-base']

const modalConfig: ModalGlobalConfig = {
  animationDuration: undefined,
}

function parseAnimationDuration(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return Math.max(0, Math.round(value))
  }

  if (typeof value !== 'string') return null

  const normalized = value.trim().split(',')[0]?.trim()
  if (!normalized) return null

  const msMatch = normalized.match(/^(-?\d+(?:\.\d+)?)ms$/i)
  if (msMatch) return Math.max(0, Math.round(Number(msMatch[1])))

  const sMatch = normalized.match(/^(-?\d+(?:\.\d+)?)s$/i)
  if (sMatch) return Math.max(0, Math.round(Number(sMatch[1]) * 1000))

  const rawNumber = Number(normalized)
  return Number.isFinite(rawNumber) ? Math.max(0, Math.round(rawNumber)) : null
}

function readVantAnimationDurationFromCssVar(): number | null {
  if (typeof window === 'undefined' || typeof document === 'undefined') return null

  const styles = window.getComputedStyle(document.documentElement)
  for (const cssVarName of VANT_ANIMATION_DURATION_VARS) {
    const cssVarValue = styles.getPropertyValue(cssVarName)
    const parsed = parseAnimationDuration(cssVarValue)
    if (parsed !== null) return parsed
  }

  return null
}

function resolveAnimationDuration(options: { animationDuration?: number | string } = {}): number {
  const fromCall = parseAnimationDuration(options.animationDuration)
  if (fromCall !== null) return fromCall

  const fromGlobalConfig = parseAnimationDuration(modalConfig.animationDuration)
  if (fromGlobalConfig !== null) return fromGlobalConfig

  const fromVantCssVar = readVantAnimationDurationFromCssVar()
  if (fromVantCssVar !== null) return fromVantCssVar

  return DEFAULT_ANIMATION_DURATION
}

/**
 * 配置 `vue-modal-utils` 的全局行为。
 *
 * @param config - 全局配置。
 * @public
 */
export function configureModalUtils(config: ModalGlobalConfig = {}): void {
  if (!config || typeof config !== 'object') return
  if ('animationDuration' in config) {
    modalConfig.animationDuration = config.animationDuration
  }
}

/**
 * 展示单按钮底部弹窗。
 *
 * @param options - 弹窗展示参数。
 * @returns 用户关闭弹窗后的完成信号。
 * @public
 */
export function showCommonBottomPopup(options: ShowCommonBottomPopupOptions = {}): Promise<void> {
  return new Promise((resolve) => {
    const closeRef: { fn: null | (() => void) } = { fn: null }
    const unmountDelay = resolveAnimationDuration(options)

    const { unmount } = mountComponent(
      {
        setup() {
          const show = ref(true)
          const handleConfirm = () => {
            show.value = false
            closeRef.fn?.()
          }
          return () =>
            h(BottomPopup, {
              show: show.value,
              'onUpdate:show': (v: boolean) => {
                show.value = v
                if (!v) closeRef.fn?.()
              },
              title: options.title ?? '提示',
              message: options.message ?? '',
              buttonText: options.buttonText ?? '知道了',
              showClose: options.showClose ?? true,
              onConfirm: handleConfirm,
            })
        },
      },
      { unmountDelay }
    )

    closeRef.fn = () => unmount(() => resolve())
  })
}

/**
 * `showCommonBottomPopup` 的别名。
 *
 * @public
 */
export const showBottomTip = showCommonBottomPopup

/**
 * 展示统一弹窗（支持位置、按钮组、自定义内容与自定义组件）。
 *
 * @param options - 弹窗展示参数。
 * @returns Promise resolve 为关闭动作类型。
 * @remarks
 * 若传入 `beforeClose` 且返回 `false`，将阻止当前关闭动作。
 * @public
 */
export function showModal(options: ShowModalOptions = {}): Promise<ModalAction> {
  return new Promise((resolve, reject) => {
    const closeRef: { fn: null | ((action: ModalAction) => void) } = { fn: null }
    const unmountDelay = resolveAnimationDuration(options)

    const show = ref(true)
    let resolved = false
    let handlingAction = false
    const finish = (action: ModalAction) => {
      if (resolved) return
      resolved = true
      show.value = false
      options.onClose?.()
      closeRef.fn?.(action)
    }

    const handleAction = async (action: ModalAction, payload?: unknown) => {
      if (resolved || handlingAction) return
      handlingAction = true
      if (typeof options.beforeClose === 'function') {
        try {
          const result = await options.beforeClose(action, payload)
          if (result === false) {
            handlingAction = false
            return
          }
        } catch (e) {
          handlingAction = false
          reject(e)
          return
        }
      }
      finish(action)
    }

    options.onOpen?.()

    const { unmount } = mountComponent(
      {
        setup() {
          return () =>
            h(ModalRenderer, {
              show: show.value,
              'onUpdate:show': (v: boolean) => {
                show.value = v
              },
              onAction: handleAction,
              position: options.position ?? 'bottom',
              title: options.title ?? '提示',
              message: options.message ?? '',
              confirmText: options.confirmText ?? '确认',
              cancelText: options.cancelText ?? '取消',
              showCancelButton: options.showCancelButton ?? false,
              showClose: options.showClose ?? true,
              content: options.content ?? null,
              component: options.component ?? null,
              componentProps: options.componentProps ?? {},
              modalComponent: options.modalComponent ?? null,
              modalComponentProps: options.modalComponentProps ?? {},
              buttons: options.buttons ?? null,
            })
        },
      },
      { unmountDelay }
    )

    closeRef.fn = (action) => unmount(() => resolve(action))
  })
}

export type { ModalAction, ModalGlobalConfig, ShowCommonBottomPopupOptions, ShowModalOptions } from './types'
