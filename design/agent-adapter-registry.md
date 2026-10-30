# Agent 适配器类别与本地存储总表

用途：作为后续适配器注册、角色分配和实机验证的统一登记表。

说明：

- 路径均为 macOS 缺省路径，`~` 表示当前用户主目录；环境变量或用户自定义目录应优先于缺省值。
- “未实现”表示尚未开始适配器实现；“待实机”表示公开资料不足或当前版本结构未确认。
- 缺省角色形象只登记当前决定。DeepSeek Q 版是 Kimi Code 的原型角色，不代表其他框架的官方形象。
- 同一品牌的普通聊天 App、CLI、IDE 插件和云端 Agent 不当然共享存储规则。

| Agent 大类 | Agent 小类（产品形态） | macOS 缺省目录或关键文件 | 存储格式与写入逻辑 | 当前支持状态 | 已验证版本/范围 | 缺省角色形象 | 特殊情况与备注 |
|---|---|---|---|---|---|---|---|
| `kimi-code` | Kimi Code VS Code 插件、Kimi CLI | `~/.kimi-code/sessions/<workDirKey>/<sessionId>/agents/<role>/wire.jsonl` | JSONL 追加；提交、思考、工具、搜索、正文、完成、取消等结构化事件 | **已支持核心链路**；最终失败、崩溃恢复待验证 | 本机当前 Wire schema；插件版本号未记录 | **Kimi 娘（腹黑少女）** | `KIMI_CODE_HOME` 可迁移；`session_index.jsonl` 可映射工作区；子代理有独立 Wire |
| `kimi-app` | Kimi 普通聊天 App、Web | 未确认；不能套用 `~/.kimi-code` | 未确认 | 未实现，待实机 | 未实机 | 未分配 | 普通 Kimi 聊天与 Kimi Code 不是同一适配器 |
| `claude-code` | Claude Code CLI、IDE 扩展、Desktop Code 标签 | `${CLAUDE_CONFIG_DIR:-~/.claude}/projects/<project>/<session>.jsonl` | 共享 JSONL；user/assistant 消息、thinking/text/tool_use、API 错误及结果状态 | **已支持核心链路**；真实 CLI 提交、工具、成功、失败已验证，取消用增量样本验证 | CLI `2.1.312`（`sdk-cli`）；IDE/Desktop Code 未实机 | **Claude 娘** | 普通 Chat/Cowork 不在本适配器范围；子代理记录不抢占主状态；`cost-state` 不独立代表成功；CLI 中转 Base URL 不包含 `/v1` |
| `claude-desktop` | Claude Desktop 普通 Chat/Cowork | `~/Library/Application Support/Claude-3p/local-agent-mode-sessions/` | 与 Claude Code 会话物理隔离 | 暂不作为 Coding 监控目标 | 不适用 | 无 | Desktop Code 标签归 `claude-code`，不复用普通聊天路径与状态规则 |
| `codex` | OpenAI Codex CLI、Codex VS Code 插件、Codex App | `${CODEX_HOME:-~/.codex}/sessions/YYYY/MM/DD/rollout-*.jsonl` | 共享 JSONL 增量事件；`session_meta` 提供 `cwd/source/originator`，`task_started/task_complete/turn_aborted` 提供结果边界 | **已支持核心链路**；真实 CLI 提交、思考、工具、成功、失败及 VS Code 来源已验证，搜索/取消用增量样本验证 | CLI `0.165.0`；VS Code 样本 `0.118.0`；App 未实机 | **GPT 娘** | 三者共用一个适配器和监听器，以来源 + 工作区区分实例；`source/originator` 支持字符串或对象并过滤子代理 turn；普通 ChatGPT 聊天不在本适配器范围 |
| `chatgpt-app` | ChatGPT 普通桌面/Web 聊天 | 未确认；不得套用 Codex 目录 | 缓存/配置与 Coding 会话不同 | 暂不作为 Coding 监控目标 | 不适用 | 无 | ChatGPT 与 Codex 是不同产品形态 |
| `copilot-cli` | GitHub Copilot CLI | `~/.copilot/session-state/<session-id>/events.jsonl`；`workspace.yaml`；`~/.copilot/session-store.db` | JSONL 事件流；会话期间及结束时增量写入 | 未实现，**高优先候选** | 未实机 | 未分配 | 与 Copilot IDE 插件分开；官方确认本地会话与可选云同步 |
| `copilot-ide` | VS Code/JetBrains 的 GitHub Copilot 插件 | VS Code 可见 `~/Library/Application Support/Code/User/globalStorage/github.copilot-chat/`，会话结构未确认 | 未确认；不能直接复用 CLI 的 JSONL 规则 | 未实现，待实机 | 未实机 | 未分配 | 插件与 CLI 的会话和状态格式可能不同 |
| `gemini-cli` | Google Gemini CLI | `~/.gemini/tmp/<project_hash>/chats/` | 官方确认保存完整对话、工具输入输出、Token、思考摘要；具体 schema 待确认 | 未实现，**高优先候选** | 未实机 | 未分配 | 官方确认路径；需继续核对文件格式、增量游标和保留策略 |
| `google-jules` | Google Jules 云端 Agent | 以云端数据为主，无已确认本地会话目录 | 未确认 | 暂不优先 | 不适用 | 无 | 不适合作为首批磁盘监控目标 |
| `opencode` | OpenCode CLI、OpenCode Desktop | `~/.local/share/opencode/opencode.db`；日志 `~/.local/share/opencode/log/opencode.log` | SQLite：projects、sessions、messages；日志追加 | 未实现，**高优先候选** | 未实机 | 未分配 | 可作为数据库型适配器参考；Desktop UI 状态另有 `ai.opencode.desktop` 目录 |
| `openclaw` | OpenClaw Gateway、CLI、Control UI、消息类 Agent | `~/.openclaw/agents/<agentId>/agent/openclaw-agent.sqlite`；归档 `~/.openclaw/agents/<agentId>/sessions/` | 每 Agent 独立 SQLite，保存 session rows 与 transcripts；归档 JSONL；含运行轨迹、完成/错误/取消等状态 | 未实现，**高优先候选** | 本机安装 `2026.2.6`；适配未实机 | 未分配 | 与 OpenCode 是不同产品；旧 `~/.openclaw/sessions/` 不再作为隐式回退；支持 `sessions tail --follow` |
| `aider` | Aider CLI | `<Git 仓库根目录>/.aider.chat.history.md`；`.aider.input.history` | Markdown 追加，包含用户、助手和工具输出 | 未实现，**高优先候选** | 未实机 | 未分配 | 不是 `~/.aider`；最终成功/失败语义需验证 |
| `cursor` | Cursor 独立 IDE | `~/Library/Application Support/Cursor/User/globalStorage/state.vscdb`；另有 `workspaceStorage/` | SQLite，聊天、编辑器状态及部分 Agent transcript | 未实现，中期候选 | 未实机 | 未分配 | 需处理 WAL、只读连接、schema 版本和大数据库性能 |
| `windsurf` | Windsurf 独立 IDE | 未统一确认；社区存在 `~/Library/Application Support/Windsurf/User/globalStorage/state.vscdb` 与 LevelDB 等不同说法 | SQLite/LevelDB 等待实机确认 | 未实现，待实机 | 未实机 | 未分配 | 不应直接套用 Cursor；产品形态和路径可能变化 |
| `cline` | Cline VS Code 插件 | `~/Library/Application Support/Code/User/globalStorage/saoudrizwan.claude-dev/` | 任务目录、JSON 元数据和 transcript，按任务保存 | 未实现，中期候选 | 未实机 | 未分配 | 扩展 ID 为 `saoudrizwan.claude-dev`；需核对当前版本字段 |
| `roo-code` | Roo Code VS Code 插件 | `~/Library/Application Support/Code/User/globalStorage/RooVeterinaryInc.roo-cline/` | 与 Cline 类似的任务和 transcript | 未实现，中期候选 | 未实机 | 未分配 | 扩展 ID 为 `RooVeterinaryInc.roo-cline`；与 Cline 分别验证 |
| `continue` | Continue VS Code/JetBrains 插件 | `~/.continue/` | 配置 JSON/YAML 已确认；当前会话格式未确认 | 未实现，待实机 | 未实机 | 未分配 | 配置目录不等于可监控的任务状态目录 |
| `qoder` / 通义灵码 | Qoder IDE、CLI、通义灵码插件、SDK | 社区线索为 `~/.qoder/`；官方 SDK 另有外部会话镜像接口 | 本地格式未公开；外部镜像条目为 SDK 定义的不透明 transcript | 未实现，待实机 | 未实机 | 未分配 | 不得仅凭 SDK 推断默认目录；先验证本地真实结构 |
| `trae` / MarsCode | Trae 独立 IDE、MarsCode 插件 | 未确认 | 未确认 | 未实现，待实机 | 未实机 | 未分配 | 需要安装后检查独立 IDE 与插件各自的存储 |
| `comate` | 百度文心 Comate IDE、插件 | 未确认 | 未确认 | 未实现，待实机 | 未实机 | 未分配 | 云 IDE、独立 IDE 和插件不能共用假设 |
| `codebuddy` | 腾讯 CodeBuddy IDE、CLI | 配置线索：`~/.codebuddy/`；国内版 `~/.codebuddycn/` | 配置 JSON 和记忆文件可见；会话格式未确认 | 未实现，待实机 | 未实机 | 未分配 | 配置发现与任务状态监控需分开验证 |
| `workbuddy` | 腾讯 WorkBuddy 桌面办公 Agent | `~/.workbuddy/`；应用内另有可配置 Storage Path | 本地任务与工作区数据；具体会话文件、数据库结构和增量格式未确认 | 未实现，待实机 | 未实机 | 未分配 | 与 CodeBuddy 是不同产品；官方提供日志目录入口，任务状态结构需实机验证 |
| `codegeex` | 智谱 CodeGeeX VS Code/JetBrains 插件 | 未确认；可检查 VS Code 扩展 `aminer.codegeex` 对应存储 | 未确认 | 未实现，待实机 | 未实机 | 未分配 | 需要实际插件会话验证，不能只扫描扩展安装目录 |
| `iflycode` | 讯飞 iFlyCode IDE 插件 | 未确认 | 未确认 | 未实现，待实机 | 未实机 | 未分配 | 公开本地会话资料不足 |
| `codearts` | 华为 CodeArts Agent、云 IDE、CLI/插件 | 未确认桌面端本地会话目录 | 未确认 | 未实现，待实机 | 未实机 | 未分配 | 云服务与桌面端需要分别判断 |
| `deepseek-app` | DeepSeek 官方客户端、Web | 未确认；不得把 SDK 持久化抽象当客户端路径 | 未确认 | 未实现，待实机 | 未实机 | 未分配 | DeepSeek 模型本身不是 Agent 框架；需按具体客户端适配 |
| `openhands` | OpenHands CLI/服务 | 未确认 | 未确认 | 未实现，待实机 | 未实机 | 未分配 | 开源工具可优先查源码和运行目录 |
| `devin` | Devin、Devin Desktop | 未确认 | 未确认 | 未实现，待实机 | 未实机 | 未分配 | 云端任务与桌面形态分别验证 |
| `amazon-q` | Amazon Q Developer CLI/IDE | 未确认 | 未确认 | 未实现，待实机 | 未实机 | 未分配 | CLI 与 IDE 插件需分别验证 |
| `jetbrains-ai` | JetBrains AI Assistant、Junie | `~/Library/Application Support/JetBrains/<IDE>` 仅为宿主目录；会话未确认 | 未确认 | 未实现，待实机 | 未实机 | 未分配 | 需按具体 IDE 和插件版本确认 |
| `zed-ai` | Zed 独立 IDE | `~/Library/Application Support/Zed` 仅为宿主目录候选；会话未确认 | 未确认 | 未实现，待实机 | 未实机 | 未分配 | 不应把编辑器目录直接当 Agent 状态目录 |
| `sourcegraph-cody` / `amp` | Sourcegraph Cody、Amp IDE/CLI | 未确认 | 未确认 | 未实现，待实机 | 未实机 | 未分配 | Cody 与 Amp 应分别评估 |
| `tabnine` | Tabnine IDE 插件 | 未确认 | 未确认 | 未实现，待实机 | 未实机 | 未分配 | 需区分补全历史与 Agent 会话 |
| `augment` | Augment Code IDE/CLI | 未确认 | 未确认 | 未实现，待实机 | 未实机 | 未分配 | 未确认本地会话结构 |
| `factory` | Factory Agent 平台 | 未确认 | 未确认 | 未实现，待实机 | 未实机 | 未分配 | 云端与本地运行形态需确认 |
| `warp-agent` | Warp 终端 Agent | 未确认 Agent 会话目录 | 未确认 | 未实现，待实机 | 未实机 | 未分配 | 不能把终端配置目录当 Agent 状态目录 |
| `goose` | Goose CLI/桌面 | 未确认 | 未确认 | 未实现，待实机 | 未实机 | 未分配 | 开源，可进一步查源码 |
| `antigravity` | Google Antigravity IDE | 未确认当前版本目录和格式 | 未确认 | 未实现，待实机 | 未实机 | 未分配 | 不根据 Windsurf 或其他 IDE 推测 |
| `replit-agent` | Replit Agent | 以云端数据为主 | 未确认本地运行态文件 | 暂不优先 | 不适用 | 无 | 云端优先，不适合首批磁盘监控 |

## 状态约定

- **已支持核心链路**：已有真实文件解析和状态机实现，但仍受备注中的未验证分支限制。
- **高优先候选**：路径和结构证据较强，适合下一批实现。
- **中期候选**：可做，但需先完成 schema、只读连接或性能验证。
- **待实机**：当前不能根据公开资料承诺支持，需要安装后验证默认路径和写入逻辑。
- **暂不优先/暂不适用**：云端为主或普通聊天形态，不作为首批 Coding Agent 监控目标。
- “已验证版本/范围”只记录实际跑过的客户端版本；未实机不代表该 Agent 不存在或不可用。

## 默认角色分配约定

- `kimi-code` 使用 Kimi 娘，`codex` 使用 GPT 娘，`claude-code` 使用 Claude 娘。
- 其他框架统一标记为“未分配”，后续由官方角色集确定，不自动复用 DeepSeek。
- 角色分配与适配器解耦：用户可以按 Agent 实例更换，新增适配器不要求立即制作专属角色。
