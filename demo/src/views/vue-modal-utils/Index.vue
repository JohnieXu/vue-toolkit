<script setup>
  import { useRouter } from 'vue-router'

  const router = useRouter()
  const phases = [
    {
      path: '/vue-modal-utils/phase1',
      title: 'Phase 1: showCommonBottomPopup',
      desc: '单按钮底部弹窗，复用 CommonBottomPopup',
    },
    {
      path: '/vue-modal-utils/phase2',
      title: 'Phase 2: showModal 基础版',
      desc: '支持 position、confirm/cancel',
    },
    {
      path: '/vue-modal-utils/phase3',
      title: 'Phase 3: showModal 全量',
      desc: '多按钮、content、beforeClose',
    },
    {
      path: '/vue-modal-utils/phase4',
      title: 'Phase 4: showModal modalComponent',
      desc: '完全自定义整弹窗，CustomFullModal 示例',
    },
  ]
</script>

<template>
  <div class="module-index">
    <p class="module-desc">弹窗命令式调用 API 示例</p>
    <van-cell-group>
      <van-cell
        v-for="p in phases"
        :key="p.path"
        :title="p.title"
        :label="p.desc"
        is-link
        @click="router.push(p.path)"
      />
    </van-cell-group>
  </div>
</template>

<style scoped lang="scss">
  .module-index {
    padding: 16px;
    padding-bottom: 32px;
  }
  .module-desc {
    font-size: 14px;
    color: #666;
    margin-bottom: 16px;
  }
</style>
