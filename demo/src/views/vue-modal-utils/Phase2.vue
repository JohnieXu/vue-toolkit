<script setup>
  import { ref } from 'vue'
  import { showToast } from 'vant'
  import { showModal } from 'vue-modal-utils'

  const lastAction = ref('')

  const showModalBottomConfirm = () => {
    showModal({
      position: 'bottom',
      title: '温馨提示',
      message: '这是底部位置的确认弹窗',
      confirmText: '知道了',
    }).then((action) => {
      lastAction.value = `bottom:${action}`
      showToast(`操作: ${action}`)
    })
  }
  const showModalBottomCancel = () => {
    showModal({
      position: 'bottom',
      title: '温馨提示',
      message: '确定要取消吗？',
      showCancelButton: true,
      cancelText: '再想想',
      confirmText: '确认取消',
    }).then((action) => {
      lastAction.value = `bottom-cancel:${action}`
      showToast(`操作: ${action}`)
    })
  }
  const showModalCenter = () => {
    showModal({
      position: 'center',
      title: '居中弹窗',
      message: '这是居中位置的弹窗示例',
      showCancelButton: true,
    }).then((action) => {
      lastAction.value = `center:${action}`
      showToast(`操作: ${action}`)
    })
  }
  const showModalTop = () => {
    showModal({
      position: 'top',
      title: '顶部弹窗',
      message: '这是顶部位置的弹窗',
      confirmText: '知道了',
    }).then((action) => {
      lastAction.value = `top:${action}`
      showToast(`操作: ${action}`)
    })
  }
</script>

<template>
  <div class="phase-page">
    <div class="section">
      <p class="section-desc">支持 position、confirm/cancel</p>
      <van-cell-group>
        <van-cell title="底部单按钮" is-link @click="showModalBottomConfirm" />
        <van-cell title="底部确认+取消" is-link @click="showModalBottomCancel" />
        <van-cell title="居中弹窗" is-link @click="showModalCenter" />
        <van-cell title="顶部弹窗" is-link @click="showModalTop" />
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
