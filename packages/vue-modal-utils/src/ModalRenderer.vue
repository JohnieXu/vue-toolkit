<script setup lang="ts">
  /* 通用弹窗渲染组件，供 showModal 命令式调用使用 */
  import { ref, computed, watch, defineComponent, h } from 'vue'
  import type { ModalAction, ModalButton, ModalRendererProps } from './types'

  const props = withDefaults(defineProps<ModalRendererProps>(), {
    show: true,
    position: 'bottom',
    title: '提示',
    message: '',
    confirmText: '确认',
    cancelText: '取消',
    showCancelButton: false,
    showClose: true,
    content: null,
    component: null,
    componentProps: () => ({}),
    modalComponent: null,
    modalComponentProps: () => ({}),
    buttons: null,
  })

  const emit = defineEmits<{
    (e: 'update:show', value: boolean): void
    (e: 'confirm'): void
    (e: 'cancel'): void
    (e: 'close'): void
    (e: 'action', action: ModalAction, payload?: unknown): void
  }>()

  const internalShow = ref(props.show)

  watch(
    () => props.show,
    (v) => {
      internalShow.value = v
    }
  )

  const hasCustomContent = computed(() => !!(props.content || props.component))
  const hasMultipleButtons = computed(() => Array.isArray(props.buttons) && props.buttons.length > 0)

  const onOverlayClick = () => emit('action', 'overlay')
  const onConfirm = () => {
    emit('confirm')
    emit('action', 'confirm')
  }
  const onCancel = () => {
    emit('cancel')
    emit('action', 'cancel')
  }
  const onButtonClick = (btn: ModalButton, index: number) => {
    const key = btn.key ?? String(index)
    emit('action', key)
    if (typeof btn.onClick === 'function') btn.onClick()
  }
  const onCloseIconClick = () => emit('action', 'close')
  const onShowUpdate = (v: boolean) => {
    internalShow.value = v
    emit('update:show', v)
    if (!v) emit('action', 'close')
  }
  const onCustomAction = (action: ModalAction, payload?: unknown) => emit('action', action, payload)
  const onCustomConfirm = (payload?: unknown) => emit('action', 'confirm', payload)
  const onCustomCancel = (payload?: unknown) => emit('action', 'cancel', payload)
  const onCustomClose = (payload?: unknown) => emit('action', 'close', payload)

  const renderContent = () => {
    if (props.component) return h(props.component, props.componentProps)
    if (typeof props.content === 'function') return props.content()
    if (props.content?.render) return props.content.render()
    return props.message ? h('p', { class: 'modal-renderer-message' }, props.message) : null
  }

  const DynamicContent = defineComponent({
    setup() {
      return () => renderContent()
    },
  })

  const customModalProps = computed(() => ({
    ...props.modalComponentProps,
    show: internalShow.value,
    position: props.position,
    title: props.title,
    message: props.message,
    confirmText: props.confirmText,
    cancelText: props.cancelText,
    showCancelButton: props.showCancelButton,
    showClose: props.showClose,
    content: props.content,
    component: props.component,
    componentProps: props.componentProps,
    buttons: props.buttons,
    requestAction: onCustomAction,
    requestConfirm: onCustomConfirm,
    requestCancel: onCustomCancel,
    requestClose: onCustomClose,
  }))
</script>

<template>
  <component
    v-if="modalComponent"
    :is="modalComponent"
    v-bind="customModalProps"
    @update:show="onShowUpdate"
    @action="onCustomAction"
    @confirm="onCustomConfirm"
    @cancel="onCustomCancel"
    @close="onCustomClose"
  />
  <van-popup
    v-else
    v-model:show="internalShow"
    :position="position"
    :round="true"
    class="modal-renderer-popup"
    :close-on-click-overlay="false"
    @update:show="onShowUpdate"
    @click-overlay="onOverlayClick"
  >
    <div class="modal-renderer-content">
      <div class="modal-renderer-header">
        <van-icon v-if="showClose" name="cross" size="20" style="visibility: hidden; padding: 8px" />
        <div class="modal-renderer-title">{{ title }}</div>
        <van-icon
          v-if="showClose"
          class="modal-renderer-close"
          name="cross"
          size="20"
          color="#999"
          @click="onCloseIconClick"
        />
      </div>
      <div class="modal-renderer-body">
        <template v-if="!hasCustomContent">
          <p v-if="message" class="modal-renderer-text">{{ message }}</p>
        </template>
        <component v-else :is="DynamicContent" />
      </div>
      <div class="modal-renderer-footer">
        <template v-if="hasMultipleButtons">
          <van-button
            v-for="(btn, idx) in buttons"
            :key="idx"
            :type="btn.type || 'default'"
            class="modal-renderer-btn"
            @click="onButtonClick(btn, idx)"
          >
            {{ btn.text }}
          </van-button>
        </template>
        <template v-else>
          <van-button
            v-if="showCancelButton"
            type="default"
            class="modal-renderer-btn modal-renderer-btn-cancel"
            @click="onCancel"
          >
            {{ cancelText }}
          </van-button>
          <van-button
            type="primary"
            class="modal-renderer-btn modal-renderer-btn-confirm"
            @click="onConfirm"
          >
            {{ confirmText }}
          </van-button>
        </template>
      </div>
    </div>
  </van-popup>
</template>

<style scoped lang="scss">
  .modal-renderer-popup {
    .modal-renderer-content { padding: 16px; }
    .modal-renderer-header {
      height: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 8px;
      .modal-renderer-title {
        flex: 1;
        text-align: center;
        font-size: 16px;
        font-weight: 600;
        line-height: 1;
        color: #333;
      }
      .modal-renderer-close { padding: 8px; }
    }
    .modal-renderer-body {
      background: #fff;
      border-radius: 8px;
      padding: 16px;
      padding-top: 14px;
      min-height: 40px;
    }
    .modal-renderer-text, .modal-renderer-message {
      font-size: 14px;
      line-height: 20px;
      color: #333;
      text-align: center;
      margin-bottom: 24px;
    }
    .modal-renderer-footer {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-top: 16px;
      .modal-renderer-btn {
        flex: 1;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 600;
        &.modal-renderer-btn-cancel {
          border: 1px solid #dcdee0;
          color: #333;
          background: #fff;
        }
        &.modal-renderer-btn-confirm {
          background-color: #ff5712;
          border: none;
        }
      }
    }
  }
</style>
