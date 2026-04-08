import { showToast as vantShowToast } from 'vant'
import { createNotifier } from 'vue-shared-utils'

const getToastMessage = (messageOrOptions, extraOptions = {}) => {
  if (typeof messageOrOptions === 'string') return messageOrOptions
  if (messageOrOptions && typeof messageOrOptions === 'object' && typeof messageOrOptions.message === 'string') {
    return messageOrOptions.message
  }
  if (extraOptions && typeof extraOptions.message === 'string') return extraOptions.message
  return ''
}

const toastNotifier = createNotifier(
  (messageOrOptions, extraOptions = {}) => {
    const toastOptions = { ...(extraOptions ?? {}) }
    delete toastOptions.enableConsoleLog
    return vantShowToast(messageOrOptions, toastOptions)
  },
  {
    enableConsoleLog: true,
    logPrefix: '[demo:showToast]',
    resolveLogMessage: getToastMessage,
  }
)

/**
 * demo 的 showToast 调试封装：
 * 1) 保留 vant showToast 的原有能力
 * 2) 默认同步 console.log，便于页面与控制台同时观察调试信息
 */
export const showToast = toastNotifier.notify
export const setShowToastConfig = toastNotifier.setConfig
export const getShowToastConfig = toastNotifier.getConfig
