<script setup>
  import { ref } from 'vue'
  import { showToast } from 'vant'
  import { showCommonBottomPopup, showBottomTip } from 'vue-modal-utils'

  const lastAction = ref('')

  const showCorporateRule = () => {
    showCommonBottomPopup({
      message: '你的企业已配置相关预订管控规则，不支持购买儿童票',
    }).then(() => {
      lastAction.value = 'corporateRule'
      showToast('已关闭')
    })
  }
  const showEmployeeCheck = () => {
    showCommonBottomPopup({
      message: '当前订单未包含员工本人，请重新选择乘机人',
    }).then(() => {
      lastAction.value = 'employeeCheck'
      showToast('已关闭')
    })
  }
  const showSubmitLimit = () => {
    showCommonBottomPopup({
      message: '订单提交已达上限，暂无法下单',
    }).then(() => {
      lastAction.value = 'submitLimit'
      showToast('已关闭')
    })
  }
  const showCustomBottom = () => {
    showCommonBottomPopup({
      title: '自定义标题',
      message: '这是一条自定义文案的底部弹窗示例',
      buttonText: '好的',
      showClose: true,
    }).then(() => {
      lastAction.value = 'custom'
      showToast('已关闭')
    })
  }
  const showAliasTip = () => {
    showBottomTip({ message: 'showBottomTip 与 showCommonBottomPopup 等价' })
  }
</script>

<template>
  <div class="phase-page">
    <div class="section">
      <p class="section-desc">单按钮底部弹窗，复用 CommonBottomPopup</p>
      <van-cell-group>
        <van-cell title="企业规则提示" is-link @click="showCorporateRule" />
        <van-cell title="员工本人校验" is-link @click="showEmployeeCheck" />
        <van-cell title="提交上限提示" is-link @click="showSubmitLimit" />
        <van-cell title="自定义文案" is-link @click="showCustomBottom" />
        <van-cell title="showBottomTip 别名" is-link @click="showAliasTip" />
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
