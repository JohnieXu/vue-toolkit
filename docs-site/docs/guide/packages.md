# 子包简介

## 包列表

| 包名 | 说明 | 依赖 |
|------|------|------|
| [vue-shared-utils](../packages/vue-shared-utils/guide.md) | 共享工具（mountComponent 等） | vue |
| [vue-hooks-utils](../packages/vue-hooks-utils/guide.md) | 通用组合式 hooks（事件监听、滚动显隐、页面激活） | vue |
| [vue-modal-utils](../packages/vue-modal-utils/guide.md) | 弹窗命令式 API | vue, vant, vue-shared-utils |

## 依赖关系

```
vue-shared-utils (基础工具)
vue-hooks-utils  (通用 hooks)
       ↑                 ↑
       │                 │
       └──── demo / 业务应用 ────┘
       ↑
       │ 依赖
       │
vue-modal-utils (弹窗等命令式 API)
```

## 各子包定位

### vue-shared-utils

提供与 Vue 3 相关的通用工具方法（如 `mountComponent`），供 vue-toolkit 内各子包复用。无 Vant 等 UI 库依赖，可被任意子包安全引用。

### vue-modal-utils

基于 Vant 的弹窗命令式 API，包含：

- `showCommonBottomPopup` / `showBottomTip` - 单按钮底部弹窗
- `showModal` - 统一弹窗，支持 position、多按钮、content、beforeClose

详细用法见 [vue-modal-utils 使用指南](../packages/vue-modal-utils/guide.md)。

### vue-hooks-utils

提供仅依赖 Vue 的通用 composables，当前内置：

- `usePageActive`：keep-alive 场景页面激活状态
- `useScrollVisibility`：基于滚动方向的显隐控制
- `useEventListener`：自动清理事件监听

详细用法见 [vue-hooks-utils 使用指南](../packages/vue-hooks-utils/guide.md)。
