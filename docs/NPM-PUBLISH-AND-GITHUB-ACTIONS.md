# npm 发布与 GitHub Actions 集成方案

本文档与工作流均位于 `vue-toolkit` 模块内。为解决「多包独立版本」与「单一 tag/release 版本冲突」问题，发布流程已重构为 **Changesets** 方案（开源社区成熟实践）。

## 一、为什么从 tag/release 切换到 Changesets

- 旧方案基于单一 tag 版本（如 `v1.2.3`），天然适合“整仓同版本”，不适合“每个子包独立版本”。
- `Changesets` 通过变更文件记录“哪些包升级、升多少”，并自动计算版本关系，避免手工维护。
- 这是 pnpm monorepo 中常见、稳定的开源发布模式。

## 二、重构后的核心机制

### 2.1 独立版本管理

- 每次功能/修复 PR 都提交一个 `.changeset/*.md` 文件（由 `pnpm changeset` 生成）。
- 该文件声明受影响包及升级级别（patch/minor/major）。
- 合并到主分支后，CI 自动生成或更新“版本 PR”（`chore(release): version packages`）。

### 2.2 自动发包

- 版本 PR 合并后，`changesets/action` 会执行 `changeset publish`。
- 只发布发生版本变更且非 `private` 的包。
- 支持 npm provenance（已配置 `--provenance`）。

### 2.3 新包接入

- 新增子包只需放到 `packages/*`，并确保不是 `private: true`。
- 后续通过 changeset 声明升级即可自动纳入版本与发布。

## 三、仓库内已落地改动

1. `package.json`
   - 新增脚本：
     - `pnpm changeset`
     - `pnpm version-packages`
     - `pnpm release`
2. `.changeset/config.json`
   - `access` 改为 `public`，适配公开 npm 包。
3. `.github/workflows/publish.yml`
   - 改为 `changesets/action@v1` 工作流。
   - 触发改为主分支 push（以及手动触发），不再依赖单一 tag/release 版本。

## 四、日常使用流程（推荐）

1. 开发完成后运行 `pnpm changeset`，选择受影响包与版本级别。
2. 提交代码 + changeset 文件并合并到 `main/master`。
3. CI 自动创建/更新版本 PR。
4. 合并版本 PR 后，CI 自动发布到 npm。

## 五、失败处理（开源最佳实践）

- npm 发布是外部不可回滚操作，建议遵循“前置验证 + 可重试”原则：
  - 发布前执行 `pnpm build`（工作流已内置）。
  - 失败后修复问题，重新触发 workflow；Changesets 会基于当前仓库状态继续处理。
- 若出现“部分包已发布、部分失败”，不要回退已发布版本，直接修复后重新发布剩余包（业界标准做法）。

## 六、CI Secrets

- `NPM_TOKEN`：npm 的 token（建议 Granular Token，并具备发布权限）。

## 七、配套团队规范

- 提交与发版协作模板见：`docs/TEAM-COMMIT-AND-CHANGESET-TEMPLATE.md`。
