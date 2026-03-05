# 设计规范

## 子包设计原则

1. **单一职责**：每个子包聚焦一类能力（如弹窗、工具方法）
2. **依赖最小化**：vue-shared-utils 仅依赖 vue；vue-modal-utils 再依赖 vant
3. **可复用**：通用逻辑抽到 vue-shared-utils，供多子包复用

## 命令式 API 设计

- **Promise 返回**：弹窗、确认等交互类 API 返回 Promise
- **动画友好**：卸载前使用 unmountDelay 等待关闭动画
- **回调支持**：unmount 支持 onDone，便于与 resolve 结合

## 文档要求

- 每个子包需有使用指南（guide）与设计文档（design）
- 新增 API 需同步更新文档与 JSDoc
- 设计文档说明：解决的问题、API 规范、设计考量

## 扩展规划

新增子包或方法时：

1. 评估是否可复用到 vue-shared-utils
2. 更新 pnpm-workspace 与 package 依赖
3. 在 docs-site 中建立对应 guide / design 文档
