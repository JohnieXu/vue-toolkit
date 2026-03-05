# vue-shared-utils 设计文档

## mountComponent 方法设计

### 概述

`mountComponent` 是 `vue-shared-utils` 提供的核心方法，用于将 Vue 组件以命令式方式挂载到 DOM，并返回卸载能力。该方法解决了以下问题：

- **复用性**：将「创建容器 → createApp → mount → 卸载清理」的通用流程抽象，避免各子包重复实现
- **动画支持**：弹窗、Toast 等需要关闭动画的场景，卸载需在动画结束后执行
- **Promise 集成**：通过 `unmount(onDone)` 支持在卸载完成后执行回调（如 resolve），便于与 Promise 结合

### API 规范

#### 签名

```javascript
function mountComponent(component, options = {})
```

#### 参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| component | `Component \| Object` | 是 | Vue 组件或 `{ setup: () => render }` 形式的组件定义 |
| options | `Object` | 否 | 配置项 |
| options.unmountDelay | `number` | 否 | 卸载前延迟（毫秒），默认 0。用于等待关闭动画完成 |
| options.parent | `HTMLElement` | 否 | 挂载父节点，默认 `document.body` |

#### 返回值

```javascript
{
  app: App,           // Vue 应用实例
  instance: any,      // 根组件实例（app.mount 的返回值）
  container: HTMLElement,  // 挂载容器元素
  unmount: (onDone?: () => void) => void  // 卸载方法
}
```

#### unmount 行为

- 若 `unmountDelay > 0`：延迟指定毫秒后执行卸载，再调用 `onDone`
- 若 `unmountDelay === 0`：立即卸载，再调用 `onDone`
- `onDone` 为可选，传入则在卸载完成后执行

### 设计考量

#### 与 Vant 的差异

Vant 的 `mountComponent` 实现简洁，但仅支持立即卸载。本实现在此基础上扩展：

1. **unmountDelay**：弹窗、Toast 等组件有关闭动画，需在动画结束后再卸载，避免闪烁
2. **unmount(onDone)**：支持在卸载完成后执行回调，便于与 `Promise` 的 `resolve` 配合
3. **container.remove()**：使用 `Element.remove()` 替代 `parent.removeChild()`，兼容性更好

#### 为何支持 unmountDelay 与 unmount(onDone)

- **unmountDelay**：如 `van-popup` 关闭动画约 300ms，若立即卸载会导致动画被中断
- **unmount(onDone)**：`showModal` 等 API 返回 Promise，需在真正卸载并清理 DOM 后才 `resolve`，调用方才能进行后续逻辑

### 参考

- **Vant mountComponent**：`node_modules/vant/es/toast/function-call.mjs` 等函数式组件中的挂载逻辑
- **vue-modal-utils 改造**：改造前在 `showCommonBottomPopup`、`showModal` 内重复实现 createApp/mount/container；改造后统一调用 `mountComponent`
