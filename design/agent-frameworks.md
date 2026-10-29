# AI Coding Agent 本地存储与适配器调研

范围：国内外主流 AI Coding 工具，重点为 macOS 只读状态监控。这里的“全部”指本轮确定的主流清单，不代表所有小众或企业内部工具。

证据分级：

- **实测**：已在本机用真实交互验证。
- **官方**：官方文档或官方源码明确给出路径/格式。
- **社区**：有社区工具或源码分析支持，仍需实机复核。
- **未确认**：公开资料不足，不能据此承诺监控能力。

## 1. 优先候选

| 产品 | 形态 | macOS 默认会话路径 | 格式与状态证据 | 证据/适配价值 |
|---|---|---|---|---|
| **Kimi Code / Kimi CLI** | VS Code 插件、CLI | `~/.kimi-code/sessions/<workDirKey>/<sessionId>/agents/<role>/wire.jsonl` | JSONL 追加；提交、思考、工具、搜索、正文、完成、取消 | **实测+官方**。当前首选；最终失败和崩溃待补样 |
| **Claude Code** | CLI、IDE 形态 | `~/.claude/projects/<project>/<session>.jsonl` | JSONL 追加；消息、工具调用与结果、请求参数、正文 | **官方**。下一批最优先之一 |
| **GitHub Copilot CLI** | CLI | `~/.copilot/session-state/<session-id>/events.jsonl`；另有 `workspace.yaml`、`~/.copilot/session-store.db` | JSONL 事件流，会话运行期间及结束时增量写入 | **官方**。适合增量监听 |
| **OpenAI Codex CLI / IDE** | CLI、IDE/桌面 | `~/.codex/sessions/YYYY/MM/DD/rollout-*.jsonl`；桌面版另有 SQLite 状态 | JSONL 追加，包含角色、内容、工具调用等 | **社区多源**。优先级高，但桌面版差异和压缩格式需复核 |
| **Google Gemini CLI** | CLI | `~/.gemini/tmp/<project_hash>/chats/` | 完整对话、模型响应、工具输入输出、Token、思考摘要 | **官方路径**。具体 schema 需源码/实机确认 |
| **OpenCode** | CLI、桌面 | `~/.local/share/opencode/opencode.db`；日志 `~/.local/share/opencode/log/opencode.log` | SQLite：projects、sessions、messages；日志追加 | **官方**。适合只读 SQLite 方案 |
| **Aider** | CLI | `<Git 仓库根目录>/.aider.chat.history.md`；输入历史 `.aider.input.history` | Markdown 追加，用户、助手和工具输出 | **官方**。易读，但最终成功/失败语义需另行判断 |
| **Cursor** | 独立 IDE | `~/Library/Application Support/Cursor/User/globalStorage/state.vscdb`；`workspaceStorage/` 下另有工作区数据 | SQLite，含聊天和编辑器状态；部分 Agent transcript 可能为独立文件 | **社区**。需只读/WAL 与版本 schema 验证 |
| **Cline** | VS Code 插件 | `~/Library/Application Support/Code/User/globalStorage/saoudrizwan.claude-dev/` | 任务目录与 JSON/transcript，按任务保存 | **社区**。需验证当前版本目录和状态字段 |
| **Roo Code** | VS Code 插件 | `~/Library/Application Support/Code/User/globalStorage/RooVeterinaryInc.roo-cline/` | 与 Cline 类似的任务/transcript | **社区**。需实机复核 |

### 官方来源摘要

- Kimi：[Data locations](https://www.kimi.com/code/docs/en/kimi-code-cli/configuration/data-locations.html) 明确 `agents/main/wire.jsonl`、子代理 Wire、`session_index.jsonl` 和 `KIMI_CODE_HOME`。
- Claude Code：[Claude directory](https://code.claude.com/docs/en/claude-directory) 明确 `projects/<project>/<session>.jsonl` 为明文会话，含工具输入输出和请求内容。
- Copilot CLI：[Session data / chronicle](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/chronicle) 明确会话目录和增量写入。
- Gemini CLI：[Session management](https://geminicli.com/docs/cli/session-management/) 明确 `~/.gemini/tmp/<project_hash>/chats/` 及保存内容。
- OpenCode：[Troubleshooting](https://opencode.ai/docs/troubleshooting/) 明确 `opencode.db` 包含 projects、sessions、messages。
- Aider：[FAQ](https://aider.chat/docs/faq.html) 明确 `.aider.chat.history.md`。

## 2. 国内主流工具

| 产品 | 形态 | 本地路径与格式结论 | 当前判断 |
|---|---|---|---|
| **Kimi App** | 桌面/Web | 与 Kimi Code 不应混为一谈；本地 Agent 会话路径未确认 | 不纳入 Kimi Code 已验证规则 |
| **Kimi CLI / Kimi Code 插件** | CLI、VS Code | `~/.kimi-code/`，Wire JSONL；`KIMI_CODE_HOME` 可迁移 | 已验证，可适配 |
| **DeepSeek 官方客户端** | 桌面/Web | 官方客户端本地会话路径未确认；开源 SDK 的持久化抽象不等于桌面路径 | 实机验证 |
| **通义灵码 / Qoder** | IDE、CLI、SDK | SDK 文档确认本地会话及外部镜像，但默认本地路径和格式未公开 | 实机验证；不要仅凭 SDK 推断目录 |
| **Trae / MarsCode** | 独立 IDE、插件 | 未确认 | 实机验证 |
| **文心 Comate** | 独立 IDE、插件 | 未确认 | 实机验证 |
| **腾讯 CodeBuddy** | IDE、CLI | 配置线索为 `~/.codebuddy/`、国内版 `~/.codebuddycn/`；会话格式未确认 | 配置可发现，状态监控待验证 |
| **智谱 CodeGeeX** | VS Code、JetBrains | 未确认 | 实机验证 |
| **讯飞 iFlyCode** | IDE 插件 | 未确认 | 实机验证 |
| **华为 CodeArts Agent** | 云 IDE、CLI/插件 | 未确认桌面端本地会话路径 | 实机验证 |

国内工具普遍需要区分“宿主编辑器配置”“扩展 globalStorage”“真正的会话记录”。不能仅发现扩展目录就宣称可识别任务状态。

## 3. 海外主流工具

| 产品 | 形态 | 本地路径与格式结论 | 当前判断 |
|---|---|---|---|
| **Claude Desktop** | 桌面 | `~/Library/Application Support/Claude/claude_desktop_config.json` 主要是配置；不是 Claude Code 会话格式 | 不与 Claude Code 混用适配器 |
| **Claude Code** | CLI、IDE | `~/.claude/projects/` JSONL | 高优先级 |
| **ChatGPT / Codex 桌面与 IDE** | 桌面、IDE | Codex 主要线索为 `~/.codex/sessions/` JSONL，桌面版另有 SQLite | Codex 优先验证；ChatGPT 普通聊天不套用 |
| **GitHub Copilot CLI** | CLI | `~/.copilot/session-state/` JSONL | 高优先级 |
| **GitHub Copilot IDE 插件** | VS Code/JetBrains | 与 CLI 不应混用；当前插件会话与运行状态格式需单独验证 | 待验证 |
| **Gemini CLI** | CLI | `~/.gemini/tmp/<project_hash>/chats/` | 高优先级，schema 待确认 |
| **Jules** | Web/云端 Agent | 本地运行态会话路径未确认 | 不适合作为首批磁盘监控目标 |
| **Antigravity** | IDE | 未确认当前版本本地格式 | 实机验证 |
| **Windsurf** | 独立 IDE | 社区同时存在 `state.vscdb` 与 LevelDB 等说法，且产品形态有变化 | 必须实机确认，不直接复用 Cursor 假设 |
| **Continue** | VS Code/JetBrains | `~/.continue/` 配置明确；当前会话格式未确认 | 实机验证 |
| **Cline** | VS Code | 扩展 globalStorage + 任务/transcript | 中优先级 |
| **Roo Code** | VS Code | 扩展 globalStorage + 任务/transcript | 中优先级 |
| **Aider** | CLI | 项目级 Markdown 历史 | 高优先级但需状态语义验证 |
| **OpenHands** | CLI/服务 | 未确认默认会话路径与格式 | 实机验证 |
| **Devin / Devin Desktop** | 云端/桌面 | 未确认 | 实机验证 |
| **Amazon Q Developer** | CLI/IDE | 未确认 | 实机验证 |
| **JetBrains AI / Junie** | JetBrains | 未确认，需按 IDE 与插件版本检查 | 实机验证 |
| **Zed AI** | 独立 IDE | 未确认 | 实机验证 |
| **Replit Agent** | Web/云端 | 以云端为主 | 不作为首批本地监控目标 |
| **Sourcegraph Cody / Amp** | IDE/CLI | 未确认 | 实机验证 |
| **Tabnine** | IDE | 未确认 | 实机验证 |
| **Augment Code** | IDE/CLI | 未确认 | 实机验证 |
| **Factory** | Agent 平台 | 未确认 | 实机验证 |
| **Warp Agent** | 终端 | 未确认 Agent 会话格式 | 实机验证 |
| **Goose** | CLI/桌面 | 未确认 | 实机验证 |
| **OpenCode** | CLI/桌面 | XDG 数据目录下 SQLite | 高优先级 |

## 4. 适配器顺序建议

### 已完成基础验证

1. **Kimi Code**：真实发现、增量解析、状态机、成功/取消和多 Session 已验证。

### 下一批优先

1. **Claude Code**：官方 JSONL，路径和会话内容清晰。
2. **GitHub Copilot CLI**：官方 JSONL 事件流，适合复用增量读取架构。
3. **OpenAI Codex CLI**：JSONL 结构适合，但需先验证当前桌面版差异。
4. **Gemini CLI**：官方确认保存内容丰富，先确定 schema。
5. **OpenCode**：官方 SQLite，可作为数据库型适配器参考。
6. **Aider**：格式简单，但需先验证完成/失败是否可可靠识别。

### 中期

- Cursor、Cline、Roo Code：先确认当前版本目录和 schema，再实现只读解析。
- Qoder、CodeBuddy：先区分配置和真正的运行态会话。
- 其他国内插件：安装后通过扩展 ID、globalStorage 和实际文件变化验证，不扫描全盘。

### 不应优先承诺

- 纯 Web/云端 Agent：没有稳定本地运行态文件时，无法靠磁盘监控精确判断。
- 普通聊天 App 与 Coding Agent 共品牌产品：必须分别写适配器，不能按品牌共用路径或规则。

## 5. 对封装的直接要求

现有 `AgentAdapter` 应保持不变，但每个新适配器必须声明：

- 默认路径、环境变量覆盖和手动目录验证规则
- 文件格式及版本范围
- 增量游标、截断/轮转处理
- 支持的活动与最终结果能力
- 会话和工作区映射
- 未验证分支，禁止把工具失败或文件停止更新当成任务失败

数据库型适配器（OpenCode/Cursor）与 JSONL 适配器可以共享状态机和聚合器，但应有各自的读取游标和只读连接策略。

## 6. 原始调研文件

- `design/research/agent-frameworks-deep-search.md`
- `design/research/agent-frameworks-targeted.md`

原始报告用于发现线索；本文件已按官方页面和本机实测重新分级，未直接采信其中的“疑似”结论或错配引文。
