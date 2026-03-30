# 本地接入业务项目（以 trainResource-b2c 为例）

本文档说明如何在不发布 npm 包的前提下，将 `vue-toolkit` 作为本地依赖接入业务项目，并支持联调迭代。

## 适用场景

- `vue-toolkit` 独立开发中，需要在业务项目提前验证
- 不希望每次改动都发布测试版本到 npm
- 需要在业务项目中实时联调 toolkit 改动

## 前置条件

- 目录结构满足：

```text
trainResource-b2c/
├─ package.json
└─ vue-toolkit/
   ├─ package.json
   └─ packages/
```

- 主项目已安装 `vue`、`vant`
- 使用 `pnpm`

## 接入步骤

### 1. 在业务项目中配置本地依赖

编辑 `trainResource-b2c/package.json`：

```json
{
  "dependencies": {
    "vue-modal-utils": "file:./vue-toolkit/packages/vue-modal-utils"
  }
}
```

说明：`file:` 会把本地目录作为依赖源，业务项目安装时不会从 npm 拉取该包。

### 2. 先构建 vue-toolkit

首次接入前，需要先生成子包 `dist` 产物：

```bash
cd vue-toolkit
pnpm install
pnpm build
```

### 3. 回到业务项目安装依赖

```bash
cd ..
pnpm install
```

### 4. 在业务项目入口引入样式

以 `src/main.js` 为例：

```js
import 'vant/lib/index.css'
import 'vue-modal-utils/style'
```

## 联调推荐方式

### 方式 A：手动构建（简单）

每次修改 `vue-toolkit` 后，手动执行：

```bash
cd vue-toolkit
pnpm build
```

### 方式 B：watch 构建（推荐）

开启 toolkit 的监听构建，业务项目保持 dev 运行即可看到变更：

```bash
# 终端 1
cd vue-toolkit/packages/vue-modal-utils
pnpm dev

# 终端 2
cd trainResource-b2c
pnpm dev
```

## 常见问题排查

### 主项目提示找不到 `vue-modal-utils`

优先检查：

1. `vue-toolkit` 是否执行过 `pnpm build`
2. `vue-toolkit/packages/vue-modal-utils/dist` 是否存在
3. 主项目是否重新执行过 `pnpm install`

### 修改 toolkit 源码后主项目未生效

- 确认 `pnpm dev`（watch）是否在运行
- 确认改动后 `dist` 文件时间戳是否更新
- 必要时重启业务项目 dev 服务

## 迁移到 npm 版本（可选）

当 `vue-toolkit` 发布后，可将业务项目依赖从本地路径改为线上版本：

```json
{
  "dependencies": {
    "vue-modal-utils": "^0.1.0"
  }
}
```

