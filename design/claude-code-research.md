# Claude Code 数据存储与中转配置调研

## 结论

- `claude` 命令就是 Claude Code CLI，不是独立产品。
- Claude Code CLI、VS Code/Cursor 扩展共享 `~/.claude/projects/<project-slug>/<session-id>.jsonl` 会话转录；IDE 另有插件 UI 状态目录。
- Claude Desktop 的 Code 标签使用同一 Claude Code 引擎和 transcript，但另有 `claude-code-sessions` 元数据及独立会话列表，不能假设所有客户端的可见会话列表相同。
- Claude Desktop 普通 Chat/Cowork 与 Claude Code 不是同一套会话存储，本项目的 `claude-code` 适配器不监控普通聊天。
- `CLAUDE_CONFIG_DIR` 可重定向 Claude Code 根目录。JSONL 是内部格式，可能随版本变化，适配器必须按真实版本验证。

## 中转配置

Claude Code 支持通过 `ANTHROPIC_BASE_URL` 指向网关。凭据变量不是同一个字段的别名：

- `ANTHROPIC_API_KEY`：API Key 认证。
- `ANTHROPIC_AUTH_TOKEN`：`Authorization: Bearer` 认证。
- 不应同时设置并依赖隐式优先级，按网关要求只选一个。
- Desktop Code 的网关配置与 CLI 不完全相同，不能只设置 shell 环境变量就假设 Desktop 一定继承。

## 本机实测

- 安装版本：`2.1.312 (Claude Code)`。
- 第一组凭据及默认模型返回 `404 model_not_found`，据此先确认了真实失败日志结构。
- 更换为支持 `claude-opus-5-5` 的网关凭据后，直接调用 `/v1/messages` 成功；`x-api-key` 和 Bearer 两种认证方式均可用。
- Claude Code 的 `ANTHROPIC_BASE_URL` 必须设为 `https://api.ciyuanshen.top`，**不要包含 `/v1`**，否则客户端拼接消息路径时会重复 `/v1` 并返回 404。
- 随后 Claude CLI 真实执行一次 `pwd` 工具调用并成功结束，iToppy 解析为 `task_submitted → activity_observed(tool_calling) → response_observed → task_succeeded`。
- 失败会话已写入 `~/.claude/projects/-Users-peter-workspace-iToppy/d9c30b17-f0ca-4ab9-a78f-7013e3b23311.jsonl`，确认：
  - 外部 `type: user` 是任务起点；工具结果也使用 user 类型，不能全部当成新任务。
  - `type: assistant` 的 `message.content` 包含 `thinking`、`text`、`tool_use`。
  - `isApiErrorMessage: true` 是明确失败边界。
  - `cwd`、`sessionId`、`entrypoint` 可用于来源实例映射。
  - `isSidechain` 用于排除子代理对主实例状态的抢占。

## 白盒复核与待实机边界

- 本机五份真实 transcript 的 `entrypoint` 均为 `sdk-cli`。CLI 以来源和 `cwd` 聚合实例，同一工作区的多个 Session 共用一个实例 ID；Session 文件仍按路径区分。
- 只有外部用户输入会开启新任务。带 `toolUseResult` 或 `tool_result` 的 user 记录即使同时含文本，也不会被当作新任务；`isSidechain` 记录整体忽略。
- `stop_reason: end_turn` 和成功 `result` 是成功边界；`cost-state` 只记录用量与耗时，不独立推断成功。失败、取消和成功均为单次终止事件，后续重复或迟到记录不能覆盖，下一外部任务才重置终止状态。
- VS Code/IDE 与 Desktop Code 的 `entrypoint → source → instanceId/appBundleId/workspacePath` 映射仅用合成元数据做了白盒断言，**尚无真实 IDE/Desktop 样本，待实机验证**。尤其不能仅凭共享 JSONL 就声称 Cursor、其他 IDE 或原窗口跳转已经验证。
- CLI 当前跳到 Terminal，不等于识别了实际终端应用或精确标签页。普通 Chat/Cowork 不属于 `claude-code` 适配器。

## 官方资料

- [Claude Code Desktop application](https://code.claude.com/docs/en/desktop)
- [Explore the .claude directory](https://code.claude.com/docs/en/claude-directory)
- [Claude Code data usage](https://docs.anthropic.com/en/docs/claude-code/data-usage)
- [Use Claude Code in VS Code](https://code.claude.com/docs/en/vs-code)
- [Environment variables](https://code.claude.com/docs/en/env-vars)
- [Connect Claude Code to an LLM gateway](https://code.claude.com/docs/en/llm-gateway-connect)
- [Other LLM gateways](https://docs.anthropic.com/en/docs/claude-code/llm-gateway)
- [Claude Desktop user identity and local data](https://claude.com/docs/third-party/claude-desktop/data-storage)

另通过 UniFuncs Deep Search 交叉检索官方资料、GitHub Issue 和格式案例。会话 JSONL 的稳定性和凭据优先级仍应以安装版本的实测为准。
