<script setup>
  import { useRouter } from 'vue-router'

  const router = useRouter()
  const packages = [
    {
      path: '/vue-hooks-utils',
      name: 'vue-hooks-utils',
      desc: '通用 hooks（usePageActive、useScrollVisibility、useEventListener）',
    },
    {
      path: '/vue-modal-utils',
      name: 'vue-modal-utils',
      desc: '弹窗命令式调用 API（showCommonBottomPopup、showModal、showBottomTip）',
    },
  ]
</script>

<template>
  <div class="home">
    <h1 class="title">vue-toolkit</h1>
    <p class="subtitle">基于 Vue 3 的 UI 工具方法集合</p>
    <van-cell-group>
      <van-cell
        v-for="pkg in packages"
        :key="pkg.path"
        :title="pkg.name"
        :label="pkg.desc"
        is-link
        @click="router.push(pkg.path)"
      />
    </van-cell-group>
  </div>
</template>

<style scoped lang="scss">
  .home {
    padding: 24px 16px;
  }
  .title {
    font-size: 24px;
    font-weight: 600;
    color: #333;
    margin-bottom: 8px;
  }
  .subtitle {
    font-size: 14px;
    color: #999;
    margin-bottom: 24px;
  }
</style>
