# vue-modal-utils 设计文档

## 概述

vue-modal-utils 提供弹窗的命令式调用 API，基于 `vue-shared-utils` 的 `mountComponent` 与 Vant 的 Popup、Button 等组件。

## 架构

```
showCommonBottomPopup / showModal
    ↓
mountComponent(vue-shared-utils)
    ↓
BottomPopup.vue / ModalRenderer.vue
    ↓
Vant Popup / van-button 等
```

## 设计要点

1. **Promise 返回**：所有弹窗 API 均返回 Promise，便于 `await` 或 `.then()`
2. **unmountDelay**：弹窗关闭动画约 300ms，卸载前延迟以避免动画中断
3. **beforeClose**：支持异步拦截，返回 `false` 阻止关闭
4. **action 返回值**：`confirm`、`cancel`、`overlay`、`close` 或自定义 key，方便业务分支

## 与 vue-shared-utils 的关系

- 所有弹窗挂载均通过 `mountComponent` 完成
- 关闭流程：用户操作 → `show = false` → 动画结束 → `unmount(onDone)` → `resolve(action)`
