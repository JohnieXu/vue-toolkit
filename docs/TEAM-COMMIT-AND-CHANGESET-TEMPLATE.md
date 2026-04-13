# 团队提交规范模板（Conventional Commits + Changesets）

> 适用范围：`vue-toolkit` monorepo（`packages/*`）。
> 目标：统一提交语义、减少发版沟通成本、保证多包独立版本可追溯。

## 一、提交信息规范（Commit Message）

### 1.1 格式

使用 Conventional Commits：

`<type>(<scope>): <subject>`

示例：

- `feat(vue-hooks-utils): add useIframeDocumentWrite onReady callback`
- `fix(vue-modal-utils): prevent body scroll lock leak`
- `docs(workflow): clarify changeset release process`
- `chore(ci): upgrade publish workflow to changesets`

### 1.2 type 约定

- `feat`：新增能力（通常对应 minor）
- `fix`：缺陷修复（通常对应 patch）
- `docs`：文档变更
- `refactor`：重构（无外部行为变化）
- `perf`：性能优化
- `test`：测试新增或调整
- `build`：构建系统或依赖相关
- `ci`：CI/CD 流程变更
- `chore`：杂项维护

### 1.3 scope 约定（推荐）

- 包名：`vue-hooks-utils` / `vue-modal-utils` / `vue-shared-utils`
- 或领域：`docs` / `workflow` / `repo`

## 二、Changeset 提交规范

### 2.1 什么时候必须加 changeset

以下情况必须执行 `pnpm changeset` 并提交生成文件：

- 对外 API 变化（新增/修改/废弃）
- 运行时行为变化（修复 bug、逻辑调整）
- 会影响使用者的构建产物或类型定义

以下情况通常不需要 changeset：

- 纯文档改动（`docs/**`）
- 仅测试/脚手架调整且不影响对外行为
- 仓库内部维护且不影响发布包

### 2.2 version 类型选择

- `patch`：向后兼容的问题修复
- `minor`：向后兼容的新功能
- `major`：不兼容变更（Breaking Change）

### 2.3 changeset 描述模板

执行 `pnpm changeset` 后，在描述中使用下面模板：

```md
## 变更内容
- xxx
- xxx

## 影响范围
- 影响包：xxx
- 是否有 Breaking Change：否/是（若是，写清迁移方式）

## 验证方式
- xxx
```

## 三、PR 模板（可复制）

```md
## 背景
- 问题/需求：

## 本次变更
- [ ] 代码变更
- [ ] 文档变更
- [ ] CI/工程配置变更

## 影响包
- [ ] vue-hooks-utils
- [ ] vue-modal-utils
- [ ] vue-shared-utils（private）
- [ ] 其他：

## 版本策略
- [ ] 已添加 changeset
- [ ] 无需 changeset（原因：）

## 自测清单
- [ ] `pnpm build` 通过
- [ ] 关键场景手测通过
- [ ] 兼容性检查通过（如有）

## 风险与回滚
- 风险点：
- 回滚方案：
```

## 四、团队执行流程（推荐）

1. 开发完成后，按规范写 commit message。
2. 若影响发布包，执行 `pnpm changeset` 并提交 changeset 文件。
3. 发起 PR，使用上面的 PR 模板补全信息。
4. 合并到主分支后，由 Changesets Action 自动生成/更新版本 PR。
5. 合并版本 PR 后自动发布 npm 包。

## 五、审查规则（Reviewer 快速检查）

- Commit message 是否符合 `<type>(<scope>): <subject>`。
- 涉及发布包变更时是否包含 changeset。
- changeset 的版本级别是否合理（patch/minor/major）。
- PR 中是否写明风险、验证方式和影响范围。
