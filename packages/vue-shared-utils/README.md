# vue-shared-utils

Vue 3 共享工具方法包，供 vue-toolkit 各子包复用。

## 包简介

vue-shared-utils 提供与 Vue 3 相关的通用工具方法，旨在减少 vue-toolkit 内各子包的重复实现，统一维护、便于演进。

## 安装与依赖

### peerDependencies

- `vue: ^3.5.0`

仅依赖 Vue，无 Vant 等 UI 库，可被任意子包安全复用。

### Workspace 依赖

在 vue-toolkit 的 pnpm workspace 内使用：

```json
{
  "dependencies": {
    "vue-shared-utils": "workspace:*"
  }
}
```

## 子包设计

### 为何抽取共享工具

- 多处子包存在相同的「组件挂载 / 卸载」等逻辑，抽到 vue-shared-utils 可避免重复
- 集中维护，便于统一调整行为与兼容性
- 新子包可直接复用，无需重写

### 与其他子包的关系

```
vue-shared-utils (基础工具)
       ↑
       │ 依赖
       │
vue-modal-utils (弹窗等命令式 API)
       ↑
       │ 依赖
       │
demo / 业务应用
```

## API 列表

| 方法 | 说明 |
|------|------|
| `mountComponent` | 将 Vue 组件挂载到 DOM，返回实例与卸载方法，支持动画延时卸载 |
| `createNotifier` | 创建可复用的通知封装，支持统一日志开关与日志前缀 |

详见 [设计文档](../../docs-site/docs/packages/vue-shared-utils/design.md)。

## 使用示例

### 从 vue-modal-utils 调用 mountComponent

```javascript
import { mountComponent } from 'vue-shared-utils'
import { h, ref } from 'vue'
import BottomPopup from './BottomPopup.vue'

const { unmount } = mountComponent(
  {
    setup() {
      const show = ref(true)
      return () => h(BottomPopup, { show: show.value, ...props })
    },
  },
  { unmountDelay: 300 }
)

// 关闭时：等待动画后卸载
unmount(() => resolve())
```

## 扩展规划

未来可纳入的通用工具（示例）：

- `debounce` / `throttle`：防抖与节流
- `format`：日期、金额等格式化
- 其他与 Vue 使用场景相关的工具

新增方法时需同步更新本 README 与 `docs-site` 中对应的设计文档。
