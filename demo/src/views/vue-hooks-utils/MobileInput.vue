<script setup>
  import { computed, ref } from 'vue'
  import { useAutoScrollOnFocus, useSoftKeyboardVisibility } from 'vue-hooks-utils'

  const formPanelRef = ref(null)
  const changeCount = ref(0)
  const lastKeyboardHeight = ref(0)

  useAutoScrollOnFocus({
    target: formPanelRef,
    fixedSelector: '.mobile-input-actions',
    bottomOffset: 12,
    topOffset: 24,
    scrollBehavior: 'auto',
  })

  const {
    isKeyboardVisible,
    keyboardHeight,
    viewportHeight,
    baselineHeight,
    update,
    reset,
  } = useSoftKeyboardVisibility({
    target: formPanelRef,
    threshold: 100,
    onChange(state) {
      changeCount.value += 1
      lastKeyboardHeight.value = state.keyboardHeight
    },
  })

  const keyboardLabel = computed(() => (isKeyboardVisible.value ? '键盘可见' : '键盘隐藏'))
  const actionLabel = computed(() => (isKeyboardVisible.value ? '键盘弹出，业务可隐藏底部栏' : '底部栏保持展示'))
</script>

<template>
  <div class="mobile-input-demo">
    <p class="desc">
      演示 useAutoScrollOnFocus 与 useSoftKeyboardVisibility。聚焦靠后的输入框时，表单容器会自动滚动；软键盘状态仅输出给业务决定如何展示底部栏。
    </p>

    <van-cell-group inset class="status-group">
      <van-cell title="软键盘状态" :value="keyboardLabel" />
      <van-cell title="估算键盘高度" :value="`${Math.round(keyboardHeight)}px`" />
      <van-cell title="当前视口高度" :value="`${Math.round(viewportHeight)}px`" />
      <van-cell title="基准视口高度" :value="`${Math.round(baselineHeight)}px`" />
      <van-cell title="状态变化次数" :value="String(changeCount)" />
      <van-cell title="上次变化高度" :value="`${Math.round(lastKeyboardHeight)}px`" />
    </van-cell-group>

    <div ref="formPanelRef" class="form-panel" data-testid="mobile-input-panel">
      <van-field label="姓名" placeholder="请输入姓名" />
      <van-field label="手机号" placeholder="请输入手机号" />
      <van-field label="证件号" placeholder="请输入证件号" />
      <van-field label="邮箱" placeholder="请输入邮箱" />
      <van-field label="城市" placeholder="请输入城市" />
      <van-field label="地址" placeholder="请输入地址" />
      <van-field label="备注" placeholder="请输入备注" />
      <div class="native-input-row">
        <label class="native-input-label" for="bottom-native-input">底部原生输入</label>
        <input
          id="bottom-native-input"
          class="native-input"
          data-testid="bottom-input"
          placeholder="聚焦后自动滚动到可视区域"
        />
      </div>
      <van-field
        label="底部输入"
        placeholder="Vant Field 同样会触发 focusin"
      />
    </div>

    <div class="mobile-input-actions">
      <div class="action-state" data-testid="keyboard-status">{{ actionLabel }}</div>
      <div class="action-buttons">
        <van-button size="small" type="primary" @click="update">手动刷新键盘状态</van-button>
        <van-button size="small" @click="reset">重置基准高度</van-button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .mobile-input-demo {
    min-height: calc(100vh - 46px);
    padding: 16px;
    padding-bottom: 88px;
    box-sizing: border-box;
  }

  .desc {
    margin: 0 0 12px;
    font-size: 13px;
    line-height: 1.6;
    color: #666;
  }

  .status-group {
    margin-bottom: 12px;
  }

  .form-panel {
    height: 280px;
    overflow-y: auto;
    border-radius: 8px;
    background: #fff;
    border: 1px solid #eee;
  }

  .native-input-row {
    margin-top: 180px;
    padding: 12px 16px;
    background: #fff;
  }

  .native-input-label {
    display: block;
    margin-bottom: 6px;
    font-size: 14px;
    color: #333;
  }

  .native-input {
    width: 100%;
    height: 36px;
    padding: 0 10px;
    box-sizing: border-box;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 14px;
  }

  .mobile-input-actions {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10;
    padding: 8px 16px 12px;
    background: #fff;
    box-shadow: 0 -4px 16px rgb(0 0 0 / 8%);
  }

  .action-state {
    margin-bottom: 8px;
    font-size: 12px;
    color: #666;
    text-align: center;
  }

  .action-buttons {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }
</style>
