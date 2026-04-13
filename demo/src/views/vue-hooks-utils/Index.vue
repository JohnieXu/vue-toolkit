<script setup>
  import { computed, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useEventListener, usePageActive, useScrollVisibility } from 'vue-hooks-utils'
  import { useDemoTheme } from '../../useDemoTheme'

  const router = useRouter()
  const scrollContainerRef = ref(null)
  const keydownCount = ref(0)
  const { isDarkTheme } = useDemoTheme()

  const { isPageActive } = usePageActive(true)
  const { isVisible, direction, scrollTop } = useScrollVisibility({
    target: scrollContainerRef,
    threshold: 8,
  })

  useEventListener(
    () => (typeof window !== 'undefined' ? window : null),
    'keydown',
    (event) => {
      if (event.key === 'ArrowDown') {
        keydownCount.value += 1
      }
    }
  )

  const directionLabel = computed(() => {
    if (direction.value === 'up') return '上滑'
    if (direction.value === 'down') return '下滑'
    return '无'
  })

</script>

<template>
  <div class="hooks-demo">
    <h2 class="title">vue-hooks-utils</h2>
    <p class="desc">按键盘方向键 ↓ 可触发 useEventListener 计数。</p>

    <van-cell-group inset class="nav-group">
      <van-cell
        title="Demo: useIframeDocumentWrite"
        label="小程序 web-view + iframe 场景下使用 document.write 渲染 HTML"
        is-link
        @click="router.push('/vue-hooks-utils/iframe-write')"
      />
    </van-cell-group>

    <van-cell-group inset>
      <van-cell title="页面激活状态（usePageActive）" :value="isPageActive ? '激活中' : '未激活'" />
      <van-cell title="滚动方向（useScrollVisibility）" :value="directionLabel" />
      <van-cell title="内容区显隐" :value="isVisible ? '显示' : '隐藏'" />
      <van-cell title="当前滚动值" :value="String(Math.round(scrollTop))" />
      <van-cell title="键盘 ↓ 次数（useEventListener）" :value="String(keydownCount)" />
    </van-cell-group>

    <div ref="scrollContainerRef" class="scroll-box" :class="{ 'scroll-box-dark': isDarkTheme }">
      <div v-for="item in 24" :key="item" class="scroll-item">滚动演示项 {{ item }}</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .hooks-demo {
    padding: 16px;
  }
  .title {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 8px;
    color: #333;
  }
  .desc {
    margin: 0 0 12px;
    font-size: 13px;
    color: #666;
  }
  .nav-group {
    margin-bottom: 12px;
  }
  .scroll-box {
    margin-top: 12px;
    max-height: 240px;
    overflow-y: auto;
    background: #fff;
    border-radius: 8px;
    border: 1px solid #eee;
    padding: 8px 12px;
  }
  .scroll-item {
    height: 38px;
    line-height: 38px;
    border-bottom: 1px solid #f4f4f4;
    color: #333;
    &:last-child {
      border-bottom: none;
    }
  }

  .scroll-box-dark {
    background: #1f1f1f;
    border-color: #3a3a3a;

    .scroll-item {
      color: #f5f5f5;
      border-bottom-color: #2e2e2e;
    }
  }
</style>
