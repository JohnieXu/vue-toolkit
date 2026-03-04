/**
 * vue-modal-utils
 * 弹窗命令式调用 API：showCommonBottomPopup、showModal、showBottomTip
 */
import { createApp, h, ref } from 'vue'
import BottomPopup from './components/BottomPopup.vue'
import ModalRenderer from './ModalRenderer.vue'

const ANIMATION_DURATION = 300

/**
 * Phase 1: 单按钮底部弹窗
 * @param {Object} options
 * @param {string} [options.title='提示']
 * @param {string} options.message
 * @param {string} [options.buttonText='知道了']
 * @param {boolean} [options.showClose=true]
 * @returns {Promise<void>}
 */
export function showCommonBottomPopup(options = {}) {
  return new Promise((resolve) => {
    const container = document.createElement('div')
    document.body.appendChild(container)

    const show = ref(true)
    const handleConfirm = () => {
      show.value = false
      setTimeout(() => {
        app.unmount()
        container.remove()
        resolve()
      }, ANIMATION_DURATION)
    }

    const app = createApp({
      setup() {
        return () =>
          h(BottomPopup, {
            show: show.value,
            'onUpdate:show': (v) => {
              show.value = v
              if (!v) {
                setTimeout(() => {
                  app.unmount()
                  container.remove()
                  resolve()
                }, ANIMATION_DURATION)
              }
            },
            title: options.title ?? '提示',
            message: options.message ?? '',
            buttonText: options.buttonText ?? '知道了',
            showClose: options.showClose ?? true,
            onConfirm: handleConfirm,
          })
      },
    })
    app.mount(container)
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
 * @param {Array} [options.buttons] - [{ text, type?, key? }]
 * @param {Function} [options.onOpen]
 * @param {Function} [options.onClose]
 * @param {Function} [options.beforeClose] - async, 返回 false 可阻止关闭
 * @returns {Promise<'confirm'|'cancel'|'overlay'|'close'|string>}
 */
export function showModal(options = {}) {
  return new Promise((resolve, reject) => {
    const container = document.createElement('div')
    document.body.appendChild(container)

    const show = ref(true)
    let resolved = false
    const finish = (action) => {
      if (resolved) return
      resolved = true
      show.value = false
      options.onClose?.()
      setTimeout(() => {
        app.unmount()
        container.remove()
        resolve(action)
      }, ANIMATION_DURATION)
    }

    const handleAction = async (action) => {
      if (typeof options.beforeClose === 'function') {
        try {
          const result = await options.beforeClose(action)
          if (result === false) return
        } catch (e) {
          reject(e)
          return
        }
      }
      finish(action)
    }

    options.onOpen?.()

    const app = createApp({
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
            buttons: options.buttons ?? null,
          })
      },
    })
    app.mount(container)
  })
}
