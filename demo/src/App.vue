<script setup>
  import { computed } from 'vue'
  import { usePreferredDark } from '@vueuse/core'
  import { useRoute, useRouter } from 'vue-router'

  const route = useRoute()
  const router = useRouter()
  const isDark = usePreferredDark()
  const routeTheme = computed(() => {
    const queryTheme = route.query.theme
    const value = Array.isArray(queryTheme) ? queryTheme[0] : queryTheme
    if (value === 'light' || value === 'dark') return value
    return null
  })
  const theme = computed(() => routeTheme.value ?? (isDark.value ? 'dark' : 'light'))
  const isHome = computed(() => route.path === '/')
  const pageTitle = computed(() => route.meta?.title ?? 'vue-toolkit')

  const onBack = () => {
    if (isHome.value) return
    router.back()
  }
</script>

<template>
  <van-config-provider :theme="theme">
    <div class="demo-app">
      <van-nav-bar
        :title="pageTitle"
        :left-arrow="!isHome"
        fixed
        placeholder
        @click-left="onBack"
      />
      <main class="main">
        <router-view />
      </main>
    </div>
  </van-config-provider>
</template>

<style scoped lang="scss">
  .demo-app {
    min-height: 100vh;
    background: var(--van-background-2);
  }
  .main {
    min-height: calc(100vh - 46px);
  }
</style>
