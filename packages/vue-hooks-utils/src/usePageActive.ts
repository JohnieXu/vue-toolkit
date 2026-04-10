import { readonly, ref } from 'vue'
import { onActivated, onDeactivated } from 'vue'

/**
 * 提供 keep-alive 页面激活状态。
 */
export function usePageActive(initialValue = true) {
  const isPageActive = ref(Boolean(initialValue))

  onActivated(() => {
    isPageActive.value = true
  })

  onDeactivated(() => {
    isPageActive.value = false
  })

  return {
    isPageActive: readonly(isPageActive),
  }
}
