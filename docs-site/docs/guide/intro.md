# 使用指南

## 安装

### 业务项目（npm/pnpm/yarn）

```bash
pnpm add vue-modal-utils vue vant
```

`vue-modal-utils` 依赖 `vue` 和 `vant`，需要一并安装。

### Workspace 内使用

若在 vue-toolkit 的 pnpm workspace 内开发或作为子包引用：

```json
{
  "dependencies": {
    "vue-modal-utils": "workspace:*"
  }
}
```

或引用基础工具包：

```json
{
  "dependencies": {
    "vue-shared-utils": "workspace:*"
  }
}
```

## 引入方式

### ESM

```js
import { showModal, showCommonBottomPopup } from 'vue-modal-utils'
import 'vue-modal-utils/style'
```

### CommonJS

```js
const { showModal, showCommonBottomPopup } = require('vue-modal-utils')
require('vue-modal-utils/style')
```

## 运行 Demo

```bash
pnpm demo
```

## 构建文档

```bash
pnpm docs:dev
pnpm docs:build
```
