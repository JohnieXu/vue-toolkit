# npm 发布与 GitHub Actions 集成方案

本文档与工作流均位于 **vue-toolkit** 模块内。若 vue-toolkit 作为子目录存在于其他仓库中，需将本目录下的 `.github/workflows/` 复制到**该仓库根目录**的 `.github/workflows/` 下，并相应修改 workflow 中的路径（如增加 `working-directory: vue-toolkit`），因为 GitHub 仅执行仓库根目录下的工作流。

## 一、现状与范围

- **发布范围**：当前可发布包为 **vue-modal-utils**（位于 `packages/vue-modal-utils`）。
- **vue-shared-utils**：为 monorepo 内部共享包，`private: true`，不发布；其逻辑已在构建时被打进 `vue-modal-utils` 的 dist，因此发布 `vue-modal-utils` 时无需单独发布 `vue-shared-utils`。

## 二、发布前准备

### 2.1 npm 账号与包名

1. 登录 [npm](https://www.npmjs.com/)，若无账号需先注册。
2. 确认包名：
   - **无 scope**：`vue-modal-utils`（若已被占用需换名或使用 scope）。
   - **有 scope**（推荐）：例如 `@your-org/vue-modal-utils`，需在 `packages/vue-modal-utils/package.json` 中把 `"name": "vue-modal-utils"` 改为 `"name": "@your-org/vue-modal-utils"`。

### 2.2 依赖与发布兼容性

- `vue-modal-utils` 的构建已把 `vue-shared-utils` 打包进 dist，因此：
  - 将 `vue-shared-utils` 放在 **devDependencies**（workspace 开发用），**不**放在 **dependencies**。
  - 这样发布到 npm 后，用户安装到的包不依赖未发布的 `vue-shared-utils`，可直接使用。
- 已按此在 `packages/vue-modal-utils/package.json` 中调整（见下文「已做修改」）。

### 2.3 版本与发布流程

- 使用**语义化版本**（SemVer）：`主.次.修订`（如 `0.1.0` → `0.1.1`）。
- 发版方式二选一（或同时用）：
  - **手动**：在 `packages/vue-modal-utils` 下执行 `npm version patch/minor/major` 后 `npm publish`。
  - **GitHub 自动化**：通过 GitHub Actions 在「发布 Release / 打 tag」时自动构建并发布到 npm（见第三节）。

### 2.4 npm 令牌（用于 GitHub Actions）

1. 在 npm 网站：Profile → **Access Tokens** → **Generate New Token**。
2. 选择 **Classic**，类型选 **Automation**（适合 CI 发布）。
3. 复制生成的 token，在 GitHub 仓库中：
   - **Settings** → **Secrets and variables** → **Actions**
   - 新增 Secret：名称 `NPM_TOKEN`，值粘贴 token。

## 三、GitHub Actions 工作流

工作流位于 vue-toolkit 根目录下的 **`.github/workflows/`**（当 vue-toolkit 为仓库根时，GitHub 会直接识别）。已整合为两个工作流，无重复：

| 文件 | 用途 | 触发方式 |
|------|------|----------|
| `ci.yml` | 安装依赖、构建包与文档 | 推送到 main/master、PR 到 main/master |
| `publish.yml` | 构建并发布 vue-modal-utils 到 npm | 创建 Release 或推送 `v*` tag |

### 3.1 CI 工作流（ci.yml）

- **触发**：`push`、`pull_request`，仅分支 `main`、`master`。
- **步骤**：
  1. 检出代码。
  2. 使用 Node 20、pnpm 9，在仓库根执行 `pnpm install --frozen-lockfile`。
  3. 执行 `pnpm build`（构建所有 package）。
  4. 执行 `pnpm docs:build`（构建文档站）。
- **作用**：保证 PR/推送不会破坏包与文档的构建，作为发布前检查。

### 3.2 发布工作流（publish.yml）

- **触发**：
  - 创建 **Release**（`release:published`），或
  - 推送 **tag** 且名称匹配 `v*`（如 `v0.1.1`）。
- **步骤**：
  1. 检出代码，安装依赖并执行 `pnpm build`。
  2. 若由 **tag** 触发，则从 tag 解析版本号并写回 `packages/vue-modal-utils/package.json`（保证发布版本与 tag 一致）。
  3. 在 **packages/vue-modal-utils** 下执行 `npm publish --access public --provenance --no-git-checks`。
- **权限**：需要 `contents: read`、`id-token: write`（npm provenance）。
- **密钥**：使用仓库 Secret **`NPM_TOKEN`**（npm Automation Token）。

**发布版本与 tag 的约定**（推荐）：

- 推送 tag 时，工作流会用 **tag 作为发布版本**（如 `v0.1.1` → 发布 `0.1.1`），无需事先改 package.json。
- 推荐流程：在 `packages/vue-modal-utils` 下执行 `npm version patch`（或 minor/major）生成 tag，再 `git push origin v0.1.1`；或本地打 tag 后推送。

### 3.3 若将来发布多个包

若以后需要把 **vue-shared-utils** 也发布到 npm（例如 `@your-org/vue-shared-utils`）：

1. 去掉其 `package.json` 中的 `"private": true`，并设定 `name`（如 `@your-org/vue-shared-utils`）。
2. 在 **publish.yml** 中增加发布步骤：先发布 `vue-shared-utils`，再发布 `vue-modal-utils`（并让 `vue-modal-utils` 的 dependencies 使用已发布版本号，且构建时把 `vue-shared-utils` 设为 external，不再打进 dist）。

当前方案仅发布 **vue-modal-utils**，无需改 vue-shared-utils。

## 四、已做修改摘要

1. **packages/vue-modal-utils/package.json**
   - 将 `vue-shared-utils` 从 **dependencies** 移到 **devDependencies**（构建时仍通过 workspace 解析，发布包中不包含该依赖）。

2. **.github/workflows/ci.yml**
   - 统一 CI：在仓库根安装依赖、执行 `pnpm build` 与 `pnpm docs:build`，仅对 main/master 的 push 与 PR 触发。

3. **.github/workflows/publish.yml**
   - 在创建 Release 或推送 `v*` tag 时构建并发布 `vue-modal-utils`；由 tag 触发时会从 tag 同步版本号再发布，使用 Secret `NPM_TOKEN`。

## 五、本地发布检查清单（可选）

在首次通过 GitHub Actions 发布前，建议在本地做一次完整验证：

1. 在 vue-toolkit 根目录执行：
   - `pnpm install`
   - `pnpm build`
2. 进入 `packages/vue-modal-utils`：
   - `npm pack`
   - 解压生成的 `.tgz`，确认 `package.json` 中无 `vue-shared-utils` 依赖，且 `dist/` 内容完整。
3. 若使用 scope 包（如 `@your-org/vue-modal-utils`），首次发布需加 `--access public`（已在 workflow 中写入）。

完成以上步骤后，即可通过打 tag 或创建 Release 触发自动发布到 npm。
