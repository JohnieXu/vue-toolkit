<script setup>
  /* 单按钮底部弹窗组件（供 showCommonBottomPopup 使用） */
  const props = defineProps({
    show: { type: Boolean, default: false },
    title: { type: String, default: '提示' },
    message: { type: String, required: true },
    buttonText: { type: String, default: '知道了' },
    showClose: { type: Boolean, default: true },
  })

  const emit = defineEmits(['update:show', 'confirm'])

  const close = () => {
    emit('update:show', false)
  }
  const onConfirm = () => {
    emit('confirm')
  }
</script>

<template>
  <van-popup
    v-model:show="props.show"
    position="bottom"
    :round="true"
    class="validate-popup"
    :close-on-click-overlay="true"
  >
    <div class="validate-content">
      <div class="popup-header">
        <van-icon
          v-if="props.showClose"
          name="cross"
          size="20"
          style="visibility: hidden; padding: 8px"
        />
        <div class="title">{{ props.title }}</div>
        <van-icon
          v-if="props.showClose"
          class="icon"
          name="cross"
          size="20"
          color="#999"
          @click="close"
        />
      </div>
      <div class="validate-card">
        <p class="validate-text">{{ props.message }}</p>
        <van-button type="primary" block class="validate-btn" @click="onConfirm">
          {{ props.buttonText }}
        </van-button>
      </div>
    </div>
  </van-popup>
</template>

<style scoped lang="scss">
  .validate-popup {
    .validate-content {
      padding: 16px;
    }
    .validate-card {
      background: #fff;
      border-radius: 8px;
      padding: 16px;
      padding-top: 14px;
    }
    .popup-header {
      height: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 8px;
      .title {
        margin-left: auto;
        font-size: 16px;
        font-weight: 600;
        line-height: 1;
        color: #333;
      }
      .icon {
        padding: 8px;
        margin-left: auto;
      }
    }
    .validate-text {
      font-size: 14px;
      line-height: 20px;
      color: #333;
      text-align: center;
      margin-bottom: 24px;
    }
    .validate-btn {
      background-color: #ff5712;
      border-radius: 6px;
      border-width: 0;
      font-size: 14px;
      font-weight: 600;
    }
  }
</style>
