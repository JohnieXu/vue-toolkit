<script setup>
  import { computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  const route = useRoute()
  const router = useRouter()
  const isHome = computed(() => route.path === '/')
  const pageTitle = computed(() => route.meta?.title ?? 'vue-toolkit')

  const onBack = () => {
    if (isHome.value) return
    router.back()
  }
</script>

<template>
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
</template>

<style scoped lang="scss">
  .demo-app {
    min-height: 100vh;
    background: #fff;
  }
  .main {
    min-height: calc(100vh - 46px);
  }
</style>
