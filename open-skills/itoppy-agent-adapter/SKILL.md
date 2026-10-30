---
name: itoppy-agent-adapter
description: 为 iToppy 新增或修正 AI Coding Agent 适配器。适用于本地日志调研、事件解析、来源实例映射、子代理隔离、原生监听接入和真实样本验收。
---

# iToppy Agent 适配器接入

## 核心原则

- **只读对方日志，不改造对方框架。** 不安装侵入式插件，不修改对方配置，不依赖对方 Hooks。
- **先实机样本，后写解析器。** 不要照搬旧版 schema 或社区示例。
- **一个 Agent 大类一个适配器。** CLI、IDE、App 等本地形态如果共享同一份会话数据，应共用解析器，只拆分来源与跳转策略。
- **普通聊天、云端 Agent 和非 Coding 形态不混入 Coding 适配器。**
- **未知结果不要假装成功。** 没有明确成功边界时进入降级或待归属，不用猜测补齐状态。

## 统一契约

适配器最终只产出统一事件：

```text
task_submitted
activity_observed(thinking | tool_calling | searching)
response_observed
task_succeeded
task_failed
task_interrupted
monitor_degraded / monitor_recovered
source_updated
```

运行状态由统一状态机处理。适配器负责把各家日志翻译成事件，不在适配器里直接操作桌宠 UI。

建议目录结构：

```text
src/adapters/<agent-id>/
  descriptor.ts      # 类型、显示名、默认路径、能力声明
  <format>.ts        # 日志解析与元数据提取
  source-index.ts    # 工作区、来源实例、数据源和跳转映射
  adapter.ts         # discover / validate / open
  index.ts           # 对外导出
```

## 接入流程

### 1. 调研真实存储

先确认：

- 缺省目录和环境变量覆盖方式。
- 哪些是主会话，哪些是子代理、归档、索引或临时文件。
- 普通聊天、IDE 状态和 Coding 会话是否分开。
- 文件是 JSONL、Markdown、SQLite、数据库日志还是混合结构。
- 客户端版本和格式稳定性；内部 JSONL 可能随版本变化。

把调研结论写入 `design/`，明确“已验证”和“待实机”。只有真实跑过的客户端版本才能写进登记表。

### 2. 采集最小真实样本

至少覆盖：

- 新任务提交。
- 思考或进度。
- 一次工具调用。
- 正文或最终响应。
- 明确成功。
- 明确失败。
- 取消或中断。
- 多 Session / 子代理（如适用）。

没有真实成功或凭据时，用合成样本验证解析边界，但必须标明“未实机”。

### 3. 实现发现与来源映射

来源实例至少决定：

- `instanceId`：推荐 `<agent-id>:<source>:<workspacePath>`。
- `hostKind`：`vscode-workspace`、`terminal-session`、`app` 或 `manual`。
- `displayName`：例如 `Codex CLI · iToppy`。
- `navigation.appBundleId` 和工作区路径。
- `dataSources`：Agent 根目录、会话 transcript 和诊断数据源。

不要把历史 transcript 的全部会话自动变成桌宠。发现实例只作为候选，是否显示由运行时和用户设置决定。

### 4. 状态边界规则

这些边界比字段名更重要：

- 只有**外部用户输入**开启新任务。工具结果、系统注入、IDE 上下文和队列事件不能误开新任务。
- 思考、正文、工具调用只应更新当前 running 状态，不能提前结束任务。
- 成功必须有明确边界，例如成功 `result`、`end_turn` 或已验证的最终消息。
- 失败必须有明确错误边界；网络重试过程中的临时错误不等于最终失败。
- 取消和中断应回到 idle，并清除未完成任务状态。
- 子代理结束不能结算主代理任务。
- 终止后迟到的重复结果、正文或用量记录不能覆盖既有成功/失败。
- 只有下一条外部用户输入才重置终止保护。

### 5. 子代理与共享数据

共享数据目录经常同时包含主会话和子代理。需要两层防护：

- **文件级**：识别独立子代理会话文件，不创建实例、不驱动桌宠。
- **turn 级**：即使子代理事件写入主会话文件，也用 `parent_turn_id`、`root_turn_id`、`turn_id`、`agent_path`、`isSidechain` 等归属字段过滤。

缺少真实子代理样本时，只实现基于公开字段的保守过滤，并在文档中标注待实机。

### 6. 类型兼容

日志元数据可能不是字符串。例如来源字段可能是：

```json
"source": "cli"
```

也可能是：

```json
"source": { "type": "vscode" }
```

解析器必须做类型归一化，再判断来源。任何 `.toLowerCase()`、`.includes()` 或字符串比较前都要确认值确实是字符串。一个异常记录不应中断整个监听链路。

### 7. 原生接入

原生链路一般需要同时更新：

- `src-tauri/src/watcher.rs`：新增监听根目录、文件识别和增量事件。
- `src-tauri/src/lib.rs`：新增 home 命令、启动监听和 command 注册。
- `src/native.ts`：新增 index、parser、事件监听和 append 处理。
- `src/core/settings.ts` 与 `src-tauri/src/settings.rs`：Agent 开关和默认角色。
- `src/control-panel.ts`：Agent 卡片、手动添加和形象选项。
- `src-tauri/src/menu.rs`：右键切换形象和菜单事件。
- `vite.config.ts`：复制新增角色包。
- `design/agent-adapter-registry.md`：登记路径、版本、验证范围和角色。

新增角色时同步更新角色白名单，否则配置可能保存了但运行时会回落到默认角色。

## 验证

项目没有通用测试脚手架，不为了单批适配器强行引入测试框架。至少用内联断言覆盖：

- 真实成功和真实失败日志。
- 外部输入与工具结果边界。
- 思考、工具、搜索、正文。
- 成功后的重复事件。
- 失败后的迟到事件。
- 取消和子代理样本（真实或合成）。
- 来源字段为对象、数字或缺失时不会抛错。
- discover 返回正确实例 ID、工作区和导航目标。

随后运行：

```bash
npm run typecheck
source "$HOME/.cargo/env" && cargo check
source "$HOME/.cargo/env" && npm run desktop:build
```

真实事件驱动和视觉结果需要在原生 App 中验收；仅靠编译通过不算完成。

## 隐私和性能

- 只监听适配器声明的默认目录和用户明确添加的目录。
- 历史发现优先读取文件前缀，不把超大历史 transcript 全量读入内存。
- 增量监听从启动时的文件末尾开始，不回放历史桌宠。
- 不读取或输出密钥，不把完整会话正文写入项目文档。
- 失败消息展示前做必要脱敏。
- 未知归属进入待归属或提示用户指定，不随机分配工作区。

## 当前实现参考

- Kimi Code：`src/adapters/kimi-code/`
- Codex：`src/adapters/codex/`
- Claude Code：`src/adapters/claude-code/`
- 统一状态机：`src/core/agents/state-machine.ts`
- Agent 登记表：`design/agent-adapter-registry.md`

## 常见坑

1. **把工具结果当新任务**：必须区分外部用户输入和工具/系统 user 记录。
2. **子代理完成误结算主任务**：文件级和 turn 级都要过滤。
3. **中间正文当最终结果**：只有明确 turn/result 边界才能成功。
4. **对象来源字段导致崩溃**：先做类型归一化。
5. **把 IDE 当 CLI**：共享数据不等于共享跳转，来源实例和导航仍需区分。
6. **宣称支持了未实机客户端**：登记“待实机”，不要写“已验证”。
7. **改配置但没加角色白名单**：桌宠仍会回落到默认角色。
