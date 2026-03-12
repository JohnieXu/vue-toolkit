<script setup>
  /**
   * 完全自定义弹窗参考模板
   * 供 showModal({ modalComponent: CustomFullModal, modalComponentProps }) 使用。
   * 内部确认/取消通过 requestConfirm / requestCancel 与 showModal 的 beforeClose、关闭时序、Promise 一致。
   */
  import { ref } from 'vue'

  const props = defineProps({
    show: { type: Boolean, default: true },
    title: { type: String, default: '提示' },
    confirmText: { type: String, default: '确认' },
    cancelText: { type: String, default: '取消' },
    showCancelButton: { type: Boolean, default: false },
    showClose: { type: Boolean, default: true },
    requestConfirm: { type: Function, default: null },
    requestCancel: { type: Function, default: null },
    requestClose: { type: Function, default: null },
    requestAction: { type: Function, default: null },
    bizId: { type: String, default: '' },
  })

  const emit = defineEmits(['update:show', 'confirm', 'cancel', 'close', 'action'])

  const form = ref({ value: '' })

  const onConfirm = () => {
    const payload = { form: form.value }
    emit('confirm', payload)
    props.requestConfirm?.(payload)
  }
  const onCancel = () => {
    emit('cancel')
    props.requestCancel?.()
  }
  const onClose = () => {
    emit('update:show', false)
    emit('close')
    props.requestClose?.()
  }
</script>

<template>
  <van-popup
    :show="show"
    position="bottom"
    round
    class="custom-full-modal"
    :close-on-click-overlay="false"
    @update:show="$emit('update:show', $event)"
  >
    <div class="custom-full-modal-content">
      <div class="custom-full-modal-header">
        <van-icon v-if="showClose" name="cross" size="20" style="visibility: hidden; padding: 8px" />
        <div class="custom-full-modal-title">{{ title }}</div>
        <van-icon
          v-if="showClose"
          name="cross"
          size="20"
          color="#999"
          class="close-icon"
          @click="onClose"
        />
      </div>
      <div class="custom-full-modal-body">
        <p v-if="bizId" class="biz-info">业务 ID: {{ bizId }}</p>
        <van-field v-model="form.value" label="自定义内容" placeholder="可随 confirm 回传" />
      </div>
      <div class="custom-full-modal-footer">
        <van-button v-if="showCancelButton" class="btn-cancel" @click="onCancel">
          {{ cancelText }}
        </van-button>
        <van-button type="primary" class="btn-confirm" @click="onConfirm">
          {{ confirmText }}
        </van-button>
      </div>
    </div>
  </van-popup>
</template>

<style scoped lang="scss">
  .custom-full-modal-content {
    padding: 16px;
  }
  .custom-full-modal-header {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    margin-bottom: 8px;
    .custom-full-modal-title {
      flex: 1;
      text-align: center;
      font-size: 16px;
      font-weight: 600;
      color: #333;
    }
    .close-icon {
      padding: 8px;
    }
  }
  .custom-full-modal-body {
    padding: 16px;
    background: #fff;
    border-radius: 8px;
    min-height: 40px;
  }
  .biz-info {
    font-size: 12px;
    color: #999;
    margin-bottom: 8px;
  }
  .custom-full-modal-footer {
    display: flex;
    gap: 12px;
    margin-top: 16px;
    .btn-cancel {
      flex: 1;
      border: 1px solid #dcdee0;
      color: #333;
    }
    .btn-confirm {
      flex: 1;
      background: #ff5712;
      border: none;
    }
  }
</style>
