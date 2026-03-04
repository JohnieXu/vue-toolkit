<script setup>
  import { ref } from 'vue'
  import { showToast } from 'vant'
  import { showModal } from 'vue-modal-utils'
  import { h } from 'vue'

  const lastAction = ref('')

  const showModalMultiButton = () => {
    showModal({
      position: 'bottom',
      title: '选择操作',
      message: '请选择要执行的操作',
      buttons: [
        { text: '取消', type: 'default', key: 'cancel' },
        { text: '暂存', type: 'default', key: 'save' },
        { text: '提交', type: 'primary', key: 'submit' },
      ],
    }).then((action) => {
      lastAction.value = `multi:${action}`
      showToast(`点击了: ${action}`)
    })
  }
  const showModalContent = () => {
    showModal({
      position: 'bottom',
      title: '自定义内容',
      message: '',
      content: () =>
        h('div', { style: 'padding: 8px; text-align: center; color: #666;' }, [
          h('p', null, '这是通过 content 渲染函数注入的内容'),
          h('p', { style: 'font-size: 12px; margin-top: 8px;' }, '支持返回 VNode'),
        ]),
      confirmText: '知道了',
    }).then((action) => {
      lastAction.value = `content:${action}`
      showToast(`操作: ${action}`)
    })
  }
  const showModalBeforeClose = () => {
    showModal({
      position: 'bottom',
      title: 'beforeClose 示例',
      message: '点击确认后 2 秒内会阻止关闭，之后才关闭',
      showCancelButton: true,
      async beforeClose(action) {
        if (action === 'confirm') {
          showToast('2 秒后关闭...')
          await new Promise((r) => setTimeout(r, 2000))
        }
        return true
      },
    }).then((action) => {
      lastAction.value = `beforeClose:${action}`
      showToast(`已关闭: ${action}`)
    })
  }
</script>

<template>
  <div class="phase-page">
    <div class="section">
      <p class="section-desc">多按钮、content、beforeClose</p>
      <van-cell-group>
        <van-cell title="多按钮" is-link @click="showModalMultiButton" />
        <van-cell title="content 渲染函数" is-link @click="showModalContent" />
        <van-cell title="beforeClose 阻止关闭" is-link @click="showModalBeforeClose" />
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
