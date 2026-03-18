<script setup lang="ts">
  /* 单按钮底部弹窗组件（供 showCommonBottomPopup 使用） */
  interface BottomPopupProps {
    show?: boolean
    title?: string
    message: string
    buttonText?: string
    showClose?: boolean
  }

  const props = withDefaults(defineProps<BottomPopupProps>(), {
    show: false,
    title: '提示',
    buttonText: '知道了',
    showClose: true,
  })

  const emit = defineEmits<{
    (e: 'update:show', value: boolean): void
    (e: 'confirm'): void
  }>()

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
