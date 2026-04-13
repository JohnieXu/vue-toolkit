<script setup>
  import { computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useDemoTheme } from './useDemoTheme'

  const route = useRoute()
  const router = useRouter()
  const { theme } = useDemoTheme()
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
