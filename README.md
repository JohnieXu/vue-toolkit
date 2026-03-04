# vue-toolkit

基于 Vue 3 的 UI 工具方法集合，采用 pnpm workspace 架构。

## 包含包

- **vue-modal-utils**：弹窗命令式调用 API（showCommonBottomPopup、showModal、showBottomTip）

## 技术栈

Vite、Sass、Vant、Vue 3

## 快速开始

```bash
pnpm install
pnpm build
```

## 本地调试接入

在主项目（如 trainResource-b2c）中接入本地 vue-toolkit 进行联调：

### 1. 依赖配置

在主项目 `package.json` 中添加：

```json
{
  "dependencies": {
    "vue-modal-utils": "file:./vue-toolkit/packages/vue-modal-utils"
  }
}
```

要求：`vue-toolkit` 文件夹须与主项目 `package.json` 同级（如 `trainResource-b2c/vue-toolkit/`）。

### 2. 样式引入（必选）

在主项目入口（如 `src/main.js`）引入：

```js
import 'vant/lib/index.css'
import 'vue-modal-utils/style'
```

### 3. 构建与安装

```bash
# 1. 先构建 vue-toolkit
cd vue-toolkit
pnpm build

# 2. 回到主项目安装依赖
cd ..
pnpm install
```

### 4. 开发调试

修改 `vue-toolkit` 源码后需重新构建才能在主项目中生效。推荐方式：

- **方式 A**：在 vue-toolkit 根目录执行 `pnpm build`，每次改完手动构建
- **方式 B**：在 `packages/vue-modal-utils` 中执行 `pnpm dev`（watch 模式），源码变更后自动构建，主项目热更新即可看到效果

### 注意事项

- 主项目需已安装 `vue` 和 `vant`，vue-modal-utils 以 peerDependencies 形式依赖
- 首次接入或 `pnpm install` 后，若主项目报错找不到包，先确认 vue-toolkit 已执行 `pnpm build` 且 `dist/` 目录存在
- 发布 npm 后，可将 `file:./vue-toolkit/...` 改为版本号（如 `^0.1.0`）使用线上包

## 文档

- 详细设计：[docs/](docs/)
- 在线文档：`pnpm docs:dev` 启动后访问本地预览
