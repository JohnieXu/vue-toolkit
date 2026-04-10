# vue-hooks-utils 设计文档

## 目标

`vue-hooks-utils` 用于承载“仅依赖 Vue”的通用 hooks，避免业务项目在不同资源线重复实现同类组合式逻辑。

## 设计原则

1. 仅依赖 `vue`，不引入 Vant、Bridge、业务 service。
2. API 采用 `named exports`，保持 tree-shaking 友好。
3. 默认提供保守行为，复杂策略通过入参配置。

## 当前能力

### usePageActive

- 基于 `onActivated` / `onDeactivated` 维护页面激活状态。
- 适用于 keep-alive 场景中恢复请求、恢复轮询等逻辑。

### useScrollVisibility

- 监听滚动方向，输出 `isVisible`、`direction`、`scrollTop`。
- 支持 `Window` / `Document` / `HTMLElement`，并支持 `Ref` 目标。
- 可通过 `threshold` 忽略微小抖动滚动。

### useEventListener

- 统一事件监听的注册与卸载。
- 当目标是 `Ref` 时，目标变化后会自动切换监听对象。

### useIframeDocumentWrite

- 面向“小程序 `web-view` + H5 + `iframe`”等 `srcdoc` 兼容性不稳定场景。
- 使用 `iframe document.write`（`open/write/close`）注入内容。
- 提供轻量重试机制（`retry` + `retryDelay`），提升挂载时序不稳定时的写入成功率。
- 推荐配合“组件显示后（`nextTick`）写入 + 内容变化后重写”的调用策略。

#### 安全说明

- Hook 仅负责渲染链路，不负责 XSS 过滤。
- 若内容源不可信，调用方必须在传入前完成安全过滤。

## 迁移准入规则

以下规则用于判断业务侧 hook 是否可迁移到 `vue-hooks-utils`：

1. **无业务路径依赖**：不得依赖 `@/xxxResource`、`@/service`、`@/store`。
2. **无 UI 库硬依赖**：不得直接引用 `vant` 或其它组件库能力。
3. **无宿主耦合**：不得直接依赖 Bridge、小程序 SDK、特定容器 API。
4. **环境可注入**：需要宿主上下文时，必须通过入参注入而非硬编码。
5. **行为可复用**：同一抽象至少在两个模块可复用，且命名具备通用语义。

## 非目标

- 不承载支付、验价、路由业务编排。
- 不承载与具体资源线（机票/火车/酒店/门票）绑定的业务逻辑。
