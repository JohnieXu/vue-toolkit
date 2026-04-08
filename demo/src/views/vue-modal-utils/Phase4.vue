<script setup>
  import { ref } from 'vue'
  import { showToast } from '../../utils/debugToast'
  import { showModal } from 'vue-modal-utils'
  import CustomFullModal from './CustomFullModal.vue'

  const lastAction = ref('')

  const showFullCustomModal = () => {
    showModal({
      modalComponent: CustomFullModal,
      modalComponentProps: {
        title: '完全自定义弹窗',
        showCancelButton: true,
        cancelText: '取消',
        confirmText: '提交',
        bizId: 'demo-001',
      },
      beforeClose: async (action, payload) => {
        console.log('beforeClose', action, payload)
        if (action === 'confirm' && payload?.form) {
          showToast(`提交内容: ${JSON.stringify(payload.form)}`)
        }
        return true
      },
    }).then((action) => {
      console.log('then', action)
      lastAction.value = `modalComponent:${action}`
      showToast(`操作: ${action}`)
    })
  }
</script>

<template>
  <div class="phase-page">
    <div class="section">
      <p class="section-desc">modalComponent 完全自定义整弹窗，确认/取消与 beforeClose、Promise 一致</p>
      <van-cell-group>
        <van-cell title="完全自定义弹窗 (modalComponent)" is-link @click="showFullCustomModal" />
      </van-cell-group>
    </div>
    <div v-if="lastAction" class="last-action">上次操作: {{ lastAction }}</div>
  </div>
</template>

<style scoped lang="scss">
  .phase-page {
    padding: 16px;
    padding-bottom: 32px;
  }
  .section-desc {
    font-size: 12px;
    color: #999;
    margin-bottom: 12px;
  }
  .last-action {
    margin-top: 24px;
    padding: 12px;
    background: #f7f8fa;
    border-radius: 8px;
    font-size: 12px;
    color: #666;
  }
</style>
