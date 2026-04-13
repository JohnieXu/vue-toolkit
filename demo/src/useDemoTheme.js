import { computed } from 'vue'
import { usePreferredDark } from '@vueuse/core'
import { useRoute } from 'vue-router'

export const useDemoTheme = () => {
  const route = useRoute()
  const isDark = usePreferredDark()

  const routeTheme = computed(() => {
    const queryTheme = route.query.theme
    const value = Array.isArray(queryTheme) ? queryTheme[0] : queryTheme
    if (value === 'light' || value === 'dark') return value
    return null
  })

  const theme = computed(() => routeTheme.value ?? (isDark.value ? 'dark' : 'light'))
  const isDarkTheme = computed(() => theme.value === 'dark')

  return {
    theme,
    isDarkTheme,
    routeTheme,
  }
}
