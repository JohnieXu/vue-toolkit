# 单元测试与 E2E 测试设计方案

本文档说明 `vue-toolkit` 的自动化测试分层、工具选型、覆盖边界和 CI 运行方式。目标是让工具库的核心逻辑可快速回归，同时用浏览器级 E2E 覆盖 `demo` 中的真实集成链路。

## 一、测试目标

`vue-toolkit` 是 pnpm workspace 形式的 Vue 工具库，主要代码分布在：

- `packages/vue-shared-utils/src`：跨包共享工具，例如 `mountComponent`、`createNotifier`、`decodeHtmlEntities`
- `packages/vue-hooks-utils/src`：通用组合式函数，例如 `useViewportUnit`、`useEventListener`
- `packages/vue-modal-utils/src`：基于 Vant 的命令式弹窗 API
- `demo/src`：用于验证工具库真实使用效果的 Vite + Vue 示例应用

测试体系按职责拆成两层：

- **Vitest 单元测试**：验证 `packages/*/src` 中的公共 API、纯函数、DOM 组合逻辑和可注入逻辑。
- **Playwright E2E 测试**：验证 `demo` 应用中的真实路由、Vant 组件渲染、弹窗挂载、用户点击和 iframe 写入效果。

## 二、工具选型

### 2.1 Vitest

单元测试使用 `vitest`，配置文件为 `vitest.config.ts`。

关键配置：

- `environment: 'happy-dom'`：提供轻量 DOM 环境，覆盖当前 `document`、`window`、事件监听和组件挂载场景。
- `plugins: [vue()]`：支持测试中解析 Vue 组件。
- `include: ['packages/*/src/**/*.{test,spec}.ts']`：单测仅放在各包源码目录下，便于测试与实现一起维护。
- `resolve.alias`：把 workspace 包名解析到源码入口，避免测试依赖构建产物。

### 2.2 Playwright

E2E 测试使用 `@playwright/test`，配置文件为 `playwright.config.ts`。

关键配置：

- `testDir: './e2e'`：E2E 用例集中在根目录 `e2e` 下。
- `baseURL: 'http://127.0.0.1:5173'`：指向 demo Vite dev server。
- `test:e2e` 会先执行 `pnpm build:packages`，确保 `vue-modal-utils/style` 指向的 CSS 构建产物存在。
- `webServer.command: 'pnpm --filter demo dev --host 127.0.0.1'`：Playwright 只负责启动 demo dev server。
- `demo/vite.config.js` 显式 alias 到 workspace 源码和 `vue-modal-utils` 的构建样式，避免 CI 中 Vite 对 workspace package CSS subpath 的解析差异。
- 首版仅启用 `chromium`：降低 CI 时间和不稳定因素；后续可按需要扩展到 WebKit / Firefox。

## 三、单元测试覆盖边界

单测优先覆盖低耦合、高收益逻辑，不测试 Vant 的视觉细节，也不把跨包 UI 集成行为塞进单测。

### 3.1 `vue-shared-utils`

已覆盖：

- `createNotifier`
  - 分发器调用与返回值
  - 日志开关
  - `setConfig` / `getConfig`
  - 对象 `message` 解析
- `mountComponent`
  - 默认挂载到 `document.body`
  - 自定义父节点挂载
  - 立即卸载
  - 延迟卸载与 `onDone` 回调
- `decodeHtmlEntities`
  - 浏览器环境 HTML 实体解码
  - 空值返回
  - 无 `document` 环境兜底

测试文件：

- `packages/vue-shared-utils/src/notifier.test.ts`
- `packages/vue-shared-utils/src/mountComponent.test.ts`
- `packages/vue-shared-utils/src/decodeHtmlEntities.test.ts`

### 3.2 `vue-hooks-utils`

已覆盖：

- `pxToViewportUnit` / `useViewportUnit`
  - 默认设计稿宽度换算
  - 自定义 `designSize`、`designWidth`、单位和精度
  - 字符串透传
  - 数字字符串转换
  - 非法值 fallback
- `resolveMaybeRefTarget` / `useEventListener`
  - 普通值、ref、getter 目标解析
  - 事件监听注册
  - 组件卸载清理
  - ref 目标切换时移除旧监听并注册新监听
  - 手动停止监听

测试文件：

- `packages/vue-hooks-utils/src/useViewportUnit.test.ts`
- `packages/vue-hooks-utils/src/useEventListener.test.ts`

### 3.3 `vue-modal-utils`

`showModal` / `showCommonBottomPopup` 的完整行为涉及 Vant、Vue 渲染、命令式挂载和用户交互，主要由 E2E 覆盖。单测只覆盖内部可独立验证的动画时长解析逻辑。

已将动画时长解析抽到：

- `packages/vue-modal-utils/src/animationDuration.ts`

已覆盖：

- 数字与数字字符串解析为毫秒
- `ms` / `s` 单位解析
- 逗号分隔 duration 取第一个值
- 负数归零
- 非法值返回 `null`
- 调用配置优先于全局配置
- 全局配置优先于 Vant CSS 变量
- Vant CSS 变量优先于默认值 `300ms`

测试文件：

- `packages/vue-modal-utils/src/animationDuration.test.ts`

## 四、E2E 覆盖边界

E2E 只覆盖用户可见行为和跨包集成链路，重点验证 demo 作为真实使用方能正确消费各包。

已覆盖：

- 首页导航
  - 访问 `/`
  - 进入 `/vue-hooks-utils`
  - 返回首页
  - 进入 `/vue-modal-utils`
- 底部提示弹窗
  - 访问 `/vue-modal-utils/phase1`
  - 打开 `showCommonBottomPopup`
  - 点击确认关闭
  - 验证页面状态更新
- 基础 modal
  - 访问 `/vue-modal-utils/phase2`
  - 打开底部单按钮 modal
  - 点击确认
  - 验证 `confirm` 动作回写
- iframe 写入
  - 访问 `/vue-hooks-utils/iframe-write`
  - 打开预览
  - 验证 `useIframeDocumentWrite` 写入 iframe 内容

测试文件：

- `e2e/demo-smoke.spec.ts`

## 五、运行命令

本地常用命令：

```bash
# 运行全部单元测试
pnpm test:unit -- --run

# 监听模式运行单元测试
pnpm test:unit:watch

# 运行 E2E 测试
pnpm test:e2e

# 运行完整测试链路
pnpm test
```

首次运行 Playwright 前，如本机尚未安装浏览器，需要执行：

```bash
pnpm exec playwright install chromium
```

## 六、CI 设计

CI 继续沿用原有 `verify` job，并按以下顺序执行：

```yaml
- run: pnpm build:packages
- run: pnpm lint:tsdoc
- run: pnpm test:unit -- --run
- run: pnpm exec playwright install --with-deps chromium
- run: pnpm test:e2e
```

顺序设计原因：

- `build:packages` 先验证各包构建产物和类型声明。
- `lint:tsdoc` 保持对外 API 注释规范。
- `test:unit` 快速验证核心逻辑。
- `test:e2e` 最后运行，覆盖耗时更高的浏览器集成链路。

## 七、文件与产物约定

测试文件放置规则：

- 单元测试与被测模块同目录，例如 `packages/vue-hooks-utils/src/useViewportUnit.test.ts`
- E2E 测试统一放在 `e2e`

构建与 lint 规则：

- 各包 `tsconfig.json` 排除 `src/**/*.test.ts` 和 `src/**/*.spec.ts`，避免测试声明进入包产物。
- `eslint.tsdoc.config.mjs` 排除测试文件，TSDoc 强制规则只约束对外源码 API。

生成产物忽略规则：

- `playwright-report/`
- `test-results/`

## 八、后续扩展建议

后续新增测试时遵循以下原则：

- 优先测试公共 API 和用户可观察行为。
- 纯函数、可注入逻辑和 DOM 抽象优先放在 Vitest。
- 真实路由、Vant 组件渲染、弹窗交互、iframe 行为优先放在 Playwright。
- 不为 Vant 内部实现、样式像素细节或 Vue 自身行为写重复测试。
- 当 `vue-modal-utils` 增加新的关闭策略、按钮配置或 `beforeClose` 规则时，先补单测覆盖纯逻辑，再补 E2E 覆盖真实交互。
