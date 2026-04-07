# vue-modal-utils 使用指南

弹窗命令式调用 API，基于 Vant。

## 安装

```bash
pnpm add vue-modal-utils vue vant
```

## 全局配置（可选）

可通过 `configureModalUtils` 设置库级默认配置。

```js
import { configureModalUtils } from 'vue-modal-utils'

configureModalUtils({
  // 支持 number(ms) 或 string("0.3s"/"300ms")
  animationDuration: '0.3s',
})
```

## showCommonBottomPopup / showBottomTip

单按钮底部弹窗。

```js
import { showCommonBottomPopup } from 'vue-modal-utils'

showCommonBottomPopup({
  title: '提示',       // 可选，默认「提示」
  message: '操作成功',
  buttonText: '知道了',  // 可选
  showClose: true,    // 可选，是否显示关闭按钮
  animationDuration: 260, // 可选，单次调用覆盖（优先级高于全局配置）
})
```

`showBottomTip` 为 `showCommonBottomPopup` 的别名。

## showModal

统一弹窗 API，支持 position、多按钮、content、完全自定义弹窗（modalComponent）、beforeClose 等。

```js
import { showModal } from 'vue-modal-utils'

const action = await showModal({
  position: 'bottom',   // 'bottom' | 'center' | 'top'
  title: '温馨提示',
  message: '确定要取消吗？',
  showCancelButton: true,
  cancelText: '再想想',
  confirmText: '确认取消',
  animationDuration: '320ms', // 可选，单次调用覆盖
})

// action: 'confirm' | 'cancel' | 'overlay' | 'close' | 自定义 key
```

### 仅自定义内容区域（content / component）

- **content**：渲染函数 `() => VNode`，只替换弹窗**内容区**，标题、按钮仍由内置布局提供。
- **component / componentProps**：传入业务组件及 props，同样只渲染在内容区。

### 完全自定义整弹窗（modalComponent）

需要自己控制整弹窗结构（含头部、蒙层、按钮等）时，使用 **modalComponent** + **modalComponentProps**：

```js
import { showModal } from 'vue-modal-utils'
import CustomFullModal from './CustomFullModal.vue'

const action = await showModal({
  modalComponent: CustomFullModal,
  modalComponentProps: { bizId: '123' },
  beforeClose: async (action, payload) => {
    if (action === 'confirm' && payload) {
      // 使用自定义组件通过 requestConfirm(payload) 传入的数据
      await save(payload)
    }
    return true
  },
})
```

自定义组件会收到以下 **props**（含 `modalComponentProps` 展开）：

| Prop | 说明 |
|------|------|
| `show` | 是否显示，可绑定到 `van-popup` 的 `v-model:show` |
| `requestConfirm(payload?)` | 触发「确认」并走 beforeClose → 关闭 → Promise resolve('confirm') |
| `requestCancel(payload?)` | 触发「取消」并关闭，resolve('cancel') |
| `requestClose(payload?)` | 触发关闭，resolve('close') |
| `requestAction(action, payload?)` | 任意 action，resolve(action) |

通过 **事件** 也可触发同一套逻辑：`emit('confirm', payload)`、`emit('cancel', payload)`、`emit('close', payload)`、`emit('action', action, payload)` 或 `emit('update:show', false)`。

参考模板见：[CustomFullModal.vue 参考模板](#custom-full-modal)。

### 高级用法小结

- **content**：自定义内容区（渲染函数）
- **component / componentProps**：自定义内容区（组件）
- **modalComponent / modalComponentProps**：完全自定义整弹窗
- **buttons**：`[{ text, type?, key? }]` 自定义按钮列表（仅内置布局时有效）
- **beforeClose(action, payload)**：异步函数，返回 `false` 可阻止关闭；自定义组件可通过 payload 回传数据
- **onOpen / onClose**：生命周期回调
- **animationDuration**：动画时长，支持 `number(ms)`、`"300ms"`、`"0.3s"`

## 动画时长优先级

`unmountDelay` 的来源按以下优先级解析：

1. 单次调用参数 `options.animationDuration`
2. 全局配置 `configureModalUtils({ animationDuration })`
3. Vant 主题变量（`ConfigProvider` 影响的 CSS 变量）
4. 回退值 `300ms`

---

## CustomFullModal.vue 参考模板 {#custom-full-modal}

以下为「完全自定义弹窗」的参考实现，可直接复制到业务中按需修改。内部确认/取消通过 `requestConfirm` / `requestCancel` 与 showModal 的 beforeClose、关闭时序、Promise 一致。

```vue
<script setup>
  import { ref } from 'vue'

  const props = defineProps({
    show: { type: Boolean, default: true },
    title: { type: String, default: '提示' },
    confirmText: { type: String, default: '确认' },
    cancelText: { type: String, default: '取消' },
    showCancelButton: { type: Boolean, default: false },
    showClose: { type: Boolean, default: true },
    // 由 showModal 注入的关闭桥接方法
    requestConfirm: { type: Function, default: null },
    requestCancel: { type: Function, default: null },
    requestClose: { type: Function, default: null },
    requestAction: { type: Function, default: null },
    // 业务自定义 props（modalComponentProps）
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
  .custom-full-modal-content { padding: 16px; }
  .custom-full-modal-header {
    display: flex; align-items: center; justify-content: center; height: 40px; margin-bottom: 8px;
    .custom-full-modal-title { flex: 1; text-align: center; font-size: 16px; font-weight: 600; color: #333; }
    .close-icon { padding: 8px; }
  }
  .custom-full-modal-body { padding: 16px; background: #fff; border-radius: 8px; min-height: 40px; }
  .biz-info { font-size: 12px; color: #999; margin-bottom: 8px; }
  .custom-full-modal-footer {
    display: flex; gap: 12px; margin-top: 16px;
    .btn-cancel { flex: 1; border: 1px solid #dcdee0; color: #333; }
    .btn-confirm { flex: 1; background: #ff5712; border: none; }
  }
</style>
```

包内同路径可参考：`packages/vue-modal-utils/examples/CustomFullModal.vue`。
