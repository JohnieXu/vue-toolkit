<script setup>
  import { computed, ref } from 'vue'
  import { useEventListener, usePageActive, useScrollVisibility } from 'vue-hooks-utils'

  const scrollContainerRef = ref(null)
  const keydownCount = ref(0)

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

    <van-cell-group inset>
      <van-cell title="页面激活状态（usePageActive）" :value="isPageActive ? '激活中' : '未激活'" />
      <van-cell title="滚动方向（useScrollVisibility）" :value="directionLabel" />
      <van-cell title="内容区显隐" :value="isVisible ? '显示' : '隐藏'" />
      <van-cell title="当前滚动值" :value="String(Math.round(scrollTop))" />
      <van-cell title="键盘 ↓ 次数（useEventListener）" :value="String(keydownCount)" />
    </van-cell-group>

    <div ref="scrollContainerRef" class="scroll-box">
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
</style>
