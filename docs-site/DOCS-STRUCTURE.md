# docs-site 文档结构说明

本文档记录 vue-toolkit 文档站的结构设计与编写规范，便于后续 AI 辅助或人工维护时快速理解约定。

## 目录结构

```
docs-site/
├── DOCS-STRUCTURE.md          # 本文档：结构说明与编写规范
├── docs/
│   ├── index.md               # 首页
│   ├── guide/                 # 入门/总览
│   │   ├── intro.md           # 使用指南
│   │   └── packages.md        # 子包简介
│   ├── packages/              # 各子包文档
│   │   └── <包名>/
│   │       ├── guide.md       # 使用指南
│   │       └── design.md     # 设计文档
│   └── standards/             # 规范与约定
│       ├── code-style.md      # 代码规范
│       └── design.md         # 设计规范
└── .vitepress/config.js       # VitePress 配置（nav + sidebar）
```

## 文档分层与职责

### 1. 整体层（guide/）

| 文件 | 职责 |
|------|------|
| `index.md` | 包的整体介绍、特性、快速开始、文档导航入口 |
| `guide/intro.md` | 安装、引入方式、Workspace 使用、Demo/文档命令 |
| `guide/packages.md` | 子包列表表格、依赖关系图、各子包简要定位 |

**编写要点**：面向「第一次接触 vue-toolkit」的读者，侧重总览与入门的实操步骤。

### 2. 子包层（packages/<包名>/）

每个子包统一包含两个文档：

| 文件 | 职责 |
|------|------|
| `guide.md` | 安装、API 列表、使用示例、参数说明 |
| `design.md` | 设计动机、API 规范、与竞品/上游差异、设计考量 |

**编写要点**：
- `guide.md`：偏「怎么用」，示例完整、参数可查
- `design.md`：偏「为什么这样设计」，说明解决的问题和取舍

### 3. 规范层（standards/）

| 文件 | 职责 |
|------|------|
| `code-style.md` | 命名、JSDoc、Vue 约定、包导出方式等代码层面的规范 |
| `design.md` | 子包设计原则、命令式 API 约定、文档要求、扩展规划 |

**编写要点**：面向维护者与贡献者，作为「约定」而非教程。

## 新增内容时的约定

### 新增子包

1. 在 `docs/packages/` 下新建 `<包名>/guide.md` 和 `<包名>/design.md`
2. 在 `guide/packages.md` 的表格中补充该子包及其依赖关系
3. 在 `.vitepress/config.js` 的 sidebar「子包文档」中增加对应入口

### 新增规范文档

1. 在 `docs/standards/` 下新建文档
2. 在 `.vitepress/config.js` 的 nav、sidebar 中增加链接

### 链接写法

- 站内链接使用相对路径，如 `../packages/vue-shared-utils/guide`
- 子包 README 引用设计文档时，路径为 `../../docs-site/docs/packages/<包名>/design.md`

## 格式约定

- 使用 Markdown，VitePress 兼容
- 代码块标明语言（`js`、`bash`、`json` 等）
- 表格用于参数、API 列表等结构化信息
- 中文为主，专业术语可保留英文
