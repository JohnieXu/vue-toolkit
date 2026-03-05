# 代码规范

## 通用约定

- 使用 **ESLint** 与 **Prettier** 保持格式一致
- 优先使用 `const` / `let`，避免 `var`
- 优先使用箭头函数，需要 `this` 时使用普通函数

## 命名

| 类型 | 约定 | 示例 |
|------|------|------|
| 文件名 | kebab-case | `bottom-popup.vue` |
| 组件名 | PascalCase | `BottomPopup` |
| 函数/变量 | camelCase | `showModal`, `unmountDelay` |
| 常量 | UPPER_SNAKE_CASE | `ANIMATION_DURATION` |

## JSDoc

对外导出的函数需添加 JSDoc，包含参数与返回值说明：

```js
/**
 * 统一弹窗 API
 * @param {Object} options
 * @param {'bottom'|'center'|'top'} [options.position='bottom']
 * @param {string} [options.title='提示']
 * @returns {Promise<'confirm'|'cancel'|string>}
 */
export function showModal(options = {}) { ... }
```

## Vue 相关

- 使用 Composition API（`setup`）
- 单文件组件使用 `<script setup>` 或 `setup()` 导出
- Props 使用对象形式并注明类型

## 包导出

- 主入口使用具名导出：`export { showModal, showCommonBottomPopup }`
- 样式单独入口：`vue-modal-utils/style`
