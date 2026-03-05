# vue-shared-utils 使用指南

Vue 3 共享工具方法包，供 vue-toolkit 各子包复用。

## 安装

### peerDependencies

- `vue: ^3.5.0`

### Workspace 依赖

```json
{
  "dependencies": {
    "vue-shared-utils": "workspace:*"
  }
}
```

## API 列表

| 方法 | 说明 |
|------|------|
| `mountComponent` | 将 Vue 组件挂载到 DOM，返回实例与卸载方法，支持动画延时卸载 |

详见 [mountComponent 设计文档](./design.md)。

## 使用示例

### 基础用法（无延时）

```js
import { mountComponent } from 'vue-shared-utils'
import MyComponent from './MyComponent.vue'

const { instance, unmount } = mountComponent(MyComponent)
unmount()
```

### 弹窗场景（带延时与 Promise）

```js
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
unmount(() => resolve())
```

### 自定义父节点

```js
const { unmount } = mountComponent(MyComponent, {
  parent: document.getElementById('modal-root'),
})
```
