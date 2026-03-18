# 注释规范（TypeScript / TSDoc）

## 结论

迁移到 TypeScript 后，推荐将**导出 API 的注释**统一为 **TSDoc 风格**；内部私有实现可保留简洁行内注释，不强制完整块注释。

## 适用范围

- 必须使用 TSDoc：
  - `packages/*/src` 下对外导出的 `function`、`type`、`interface`
- 可选使用 TSDoc：
  - 复杂但未导出的内部函数
- 无需使用 TSDoc：
  - 明显易懂的局部变量与简单逻辑

## 基本规则

- 注释写在声明上方，使用 `/** ... */`
- 在 TypeScript 已可表达类型时，不重复描述类型本身
- 重点描述语义、默认行为、副作用、边界条件
- 推荐标签：
  - `@public`：对外导出 API
  - `@param`：补充参数语义
  - `@returns`：返回值语义
  - `@remarks`：补充限制/行为说明
  - `@typeParam`：泛型含义
  - `@packageDocumentation`：包入口文件说明

## 示例

```ts
/**
 * 展示统一弹窗。
 *
 * @param options - 弹窗展示参数。
 * @returns Promise resolve 为关闭动作类型。
 * @remarks
 * 若 beforeClose 返回 false，将阻止当前关闭动作。
 * @public
 */
export function showModal(options: ShowModalOptions = {}): Promise<ModalAction> {
  // ...
}
```

```ts
/**
 * 挂载结果。
 *
 * @typeParam TInstance - Vue 组件实例类型。
 * @public
 */
export interface MountComponentResult<TInstance = ComponentPublicInstance | null> {
  // ...
}
```

## 迁移建议

- 先覆盖 `packages` 子包的导出 API（当前已执行）
- `demo` 和 `docs-site` 不强制迁移
- 新增导出 API 时，同步补齐 TSDoc

## 自动化检查（CI）

- 本地检查命令：`pnpm lint:tsdoc`
- CI 会在 Push / PR 时自动执行：
  - `pnpm build:packages`
  - `pnpm lint:tsdoc`
- 当前约束项：
  - `tsdoc/syntax`：校验注释语法
  - `jsdoc/require-jsdoc`：要求导出的 `function/type/interface` 具备注释块
