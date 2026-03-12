/**
 * vue-modal-utils
 * 弹窗命令式调用 API：showCommonBottomPopup、showModal、showBottomTip
 */
import { h, ref } from 'vue'
import { mountComponent } from 'vue-shared-utils'
import BottomPopup from './components/BottomPopup.vue'
import ModalRenderer from './ModalRenderer.vue'

const DEFAULT_ANIMATION_DURATION = 300
const VANT_ANIMATION_DURATION_VARS = ['--van-duration-base', '--van-animation-duration-base']

const modalConfig = {
  animationDuration: undefined,
}

function parseAnimationDuration(value) {
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

function readVantAnimationDurationFromCssVar() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return null

  const styles = window.getComputedStyle(document.documentElement)
  for (const cssVarName of VANT_ANIMATION_DURATION_VARS) {
    const cssVarValue = styles.getPropertyValue(cssVarName)
    const parsed = parseAnimationDuration(cssVarValue)
    if (parsed !== null) return parsed
  }

  return null
}

function resolveAnimationDuration(options = {}) {
  const fromCall = parseAnimationDuration(options.animationDuration)
  if (fromCall !== null) return fromCall

  const fromGlobalConfig = parseAnimationDuration(modalConfig.animationDuration)
  if (fromGlobalConfig !== null) return fromGlobalConfig

  const fromVantCssVar = readVantAnimationDurationFromCssVar()
  if (fromVantCssVar !== null) return fromVantCssVar

  return DEFAULT_ANIMATION_DURATION
}

/**
 * 配置 vue-modal-utils 的全局行为
 * @param {Object} [config]
 * @param {number|string} [config.animationDuration] - 动画时长，支持数字（ms）或 "0.3s"/"300ms"
 */
export function configureModalUtils(config = {}) {
  if (!config || typeof config !== 'object') return
  if ('animationDuration' in config) {
    modalConfig.animationDuration = config.animationDuration
  }
}

/**
 * Phase 1: 单按钮底部弹窗
 * @param {Object} options
 * @param {string} [options.title='提示']
 * @param {string} options.message
 * @param {string} [options.buttonText='知道了']
 * @param {boolean} [options.showClose=true]
 * @param {number|string} [options.animationDuration] - 单次调用动画时长，支持数字（ms）或 "0.3s"/"300ms"
 * @returns {Promise<void>}
 */
export function showCommonBottomPopup(options = {}) {
  return new Promise((resolve) => {
    const closeRef = { fn: null }
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
              'onUpdate:show': (v) => {
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

/** showCommonBottomPopup 的别名 */
export const showBottomTip = showCommonBottomPopup

/**
 * Phase 2/3: 统一弹窗 API
 * @param {Object} options
 * @param {'bottom'|'center'|'top'} [options.position='bottom']
 * @param {string} [options.title='提示']
 * @param {string} [options.message]
 * @param {string} [options.confirmText='确认']
 * @param {string} [options.cancelText='取消']
 * @param {boolean} [options.showCancelButton=false]
 * @param {boolean} [options.showClose=true]
 * @param {Function|Object} [options.content] - 渲染函数 () => VNode
 * @param {Object|Function} [options.component] - 业务组件
 * @param {Object} [options.componentProps] - 组件 props
 * @param {Object|Function} [options.modalComponent] - 完全自定义弹窗组件
 * @param {Object} [options.modalComponentProps] - 完全自定义弹窗组件 props
 * @param {Array} [options.buttons] - [{ text, type?, key? }]
 * @param {Function} [options.onOpen]
 * @param {Function} [options.onClose]
 * @param {Function} [options.beforeClose] - async, 返回 false 可阻止关闭；签名 (action, payload)
 * @param {number|string} [options.animationDuration] - 单次调用动画时长，支持数字（ms）或 "0.3s"/"300ms"
 * @returns {Promise<'confirm'|'cancel'|'overlay'|'close'|string>}
 */
export function showModal(options = {}) {
  return new Promise((resolve, reject) => {
    const closeRef = { fn: null }
    const unmountDelay = resolveAnimationDuration(options)

    const show = ref(true)
    let resolved = false
    const finish = (action) => {
      if (resolved) return
      resolved = true
      show.value = false
      options.onClose?.()
      closeRef.fn?.(action)
    }

    const handleAction = async (action, payload) => {
      if (resolved) return
      if (typeof options.beforeClose === 'function') {
        try {
          const result = await options.beforeClose(action, payload)
          if (result === false) return
        } catch (e) {
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
              'onUpdate:show': (v) => {
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
