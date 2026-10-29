# Kimi Code 可观察性验证报告

状态：新版实时监听已验证；正常完成、用户取消、思考、工具、搜索及多 Session 聚合已确认，最终失败与进程崩溃样本仍需补充。

## 1. 验证范围与版本

本机发现：

- VS Code 扩展标识：`moonshot-ai.kimi-code`
- 内置 Kimi：1.23.0
- Wire Protocol：1.5
- 已存在的真实会话 Wire 文件包含 1.3 格式记录，适配器不能只按最新协议假设历史文件结构。

未修改任何 Kimi Code、VS Code 或会话文件，未上传日志和会话内容。

## 2. 已确认的默认路径

### 扩展发现与身份

```text
~/Library/Application Support/Code/User/globalStorage/moonshot-ai.kimi-code/
~/Library/Application Support/Code/User/globalStorage/moonshot-ai.kimi-code/bin/kimi/installed.json
```

`installed.json` 可用于确认内置 Kimi 版本与平台。目录存在只能证明安装过，不能证明 Agent 正在运行。

### VS Code 输出日志

```text
~/Library/Application Support/Code/logs/<启动时间>/window<N>/exthost/output_logging_<时间>/1-Kimi Code.log
```

可见事件包括：

- `streamChat` 调用开始与结束
- `abortChat`
- `respondApproval`
- `openFile`、`trackFiles`
- Provider retry

`ok=true` 只表示桥接调用成功，不能作为整个任务成功。

### 会话与工作区

历史会话格式：

```text
~/.kimi/sessions/<工作区路径 MD5>/<会话 UUID>/wire.jsonl
~/.kimi/sessions/<工作区路径 MD5>/<会话 UUID>/context.jsonl
```

当前 VS Code 插件实时格式：

```text
~/.kimi-code/sessions/<工作区标识>/<session UUID>/agents/main/wire.jsonl
~/.kimi-code/sessions/<工作区标识>/<session UUID>/agents/<子代理标识>/wire.jsonl
```

已验证旧版工作区目录名等于工作区绝对路径 UTF-8 字符串的 MD5。新版使用 `wd_*` 和 `session_*` 标识。`window<N>` 不是工作区标识，不能用来替代工作区路径。

[Kimi Code 官方 Data locations](https://www.kimi.com/code/docs/en/kimi-code-cli/configuration/data-locations.html) 进一步确认：`workDirKey` 由工作目录生成，格式为 `wd_<slug>_<sha256 前 12 位>`；`session_index.jsonl` 直接记录 `sessionId / sessionDir / workDir`，可用于来源工作区映射。用户设置 `KIMI_CODE_HOME` 后，配置、会话和日志会整体迁移，因此自动发现应优先读取该环境变量，再回退到 `~/.kimi-code`。

同一 session 的后续交互不会每轮新建文件，而是向现有 `wire.jsonl` 追加记录。监听器应按文件保存读取偏移，只读取新增内容，并保留跨批次的响应上下文。

新 Session 可能先写 Wire、后写索引。适配器因此保留 `workDirKey → workDir` 的已验证映射：同一工作区的新 Session 可直接归属，避免 running 事件留在待归属队列并错误展示旧 Session 的结果；未知工作区仍必须等待明确索引。

## 3. 事件映射

当前插件记录：

| 记录 | 建议统一事件/行为 | 注意事项 |
|---|---|---|
| `turn.prompt` | `task_submitted`，进入 `running.generic` | 表示用户提交新任务 |
| `context.append_loop_event(event.type=content.part, part.type=think)` | `running.thinking` | 只取类型，不读取思考正文 |
| `context.append_loop_event(event.type=tool.call)` | `running.tool_calling` | 工具名包含 search 时映射搜索 |
| 上述工具名为 `SearchWeb`、`WebSearch` 等 | `running.searching` | 使用工具别名注册表 |
| `context.append_loop_event(event.type=content.part, part.type=text)` | 收集候选最新响应 | 在回合结束前不宣告成功 |
| `turn.ended.reason=completed` | 结合最终文本映射 `task_succeeded` | 没有最终文本时标记结果未验证，不伪造成功 |
| `turn.ended.reason=cancelled` | `task_interrupted` | 不再同时处理 `turn.cancel`，避免重复中断 |
| `turn.ended.reason=failed/error` | `task_failed` 候选 | 仍需真实最终失败样本确认 |

历史记录中的 `TurnBegin / ContentPart / ToolCall / TurnEnd` 继续作为旧格式支持。`ToolResult.is_error=true` 只表示工具失败，不能映射成任务失败。Provider retry 也不等于最终失败。

当前真实数据已验证链路：

```text
turn.prompt
→ content.part(think) / tool.call
→ content.part(text)
→ turn.ended(completed)
```

用户取消链路：

```text
turn.cancel
→ agent.turn.ended(aborted)
→ turn.ended(cancelled)
→ prompt.aborted
```

因此，成功气泡可以取 `turn.ended(completed)` 前最后一轮助手 `content.part(text)` 的文本，再按 50 个用户可见字符截断。解析器只使用 `turn.ended` 作为完成/取消结果事件，避免同回合重复通知。

## 4. 自动发现策略

建议默认注册两个根路径：

1. 扩展安装标记：`globalStorage/moonshot-ai.kimi-code`
2. 当前会话根目录：`~/.kimi-code/sessions`

历史目录 `~/.kimi/sessions` 可作为旧格式回放来源，不应替代当前实时目录。发现时只检查这些明确位置，不扫描全盘。适配器先识别身份为 `Kimi Code`，再枚举会话文件。是否正在运行由新事件和辅助进程信息判断，不能由旧目录或旧日志推断。

手动添加目录时，应验证目录中是否存在 `session_*/agents/*/wire.jsonl`，而不是只检查旧版工作区 MD5 结构。

## 5. 对状态机的直接影响

- 正常成功、思考、工具调用和搜索可以基于结构化记录实现，不需要截屏、OCR 或注入插件。
- 工具错误不等于任务失败，必须保留 running。
- 文件没有更新不等于 idle，可能正在等待网络或用户。
- 最新响应与状态事件来自同一 Wire 文件时，可以可靠关联会话。
- 输出日志与会话文件应作为互补来源：会话文件负责状态和响应，输出日志负责审批、取消和诊断。

## 6. 多 Session 聚合规则

桌宠不按最新创建或最新变动的 Session 简单切换，而是先比较状态优先级，再比较最近活动时间：

1. 有运行中的 Session 时，主状态保持 running，并展示运行数量；由最近有变动的运行中 Session 驱动子动作。
2. 某个 Session 刚完成、但另一个仍在运行时，完成结果保留在会话列表或标记中，不抢走 running 主状态。
3. 没有运行中的 Session 时，由最近有变动的已完成 Session 展示 success/fail 和气泡。
4. 同优先级下，选择最近有变动的 Session。

该规则已在 `SessionAggregator` 中实现并通过多 Session smoke 验证。

## 7. 尚未通过的验证

### 最终失败与进程崩溃

当前新版真实数据已覆盖正常完成和用户取消，但仍需补采：

1. 一个最终失败任务，确认实际 `turn.ended.reason` 和最终错误文本。
2. 一个执行中关闭 VS Code/结束进程的任务，确认是否留下未闭合 Turn，以及恢复时如何标记。

### 来源 App 精确跳转

新版 `wd_*` 与 VS Code 窗口的映射仍需验证。首版可先激活 VS Code，再评估通过 VS Code 工作区记录定位窗口。

## 8. 当前结论

无感只读方案已在本机真实交互中成立。新版解析器能够处理提交、思考、工具、搜索、最终响应、正常完成和用户取消；实时监听器也已验证同一 Wire 文件追加读取。下一步可以进入 macOS 桌宠壳与实时状态驱动，但最终失败和崩溃恢复完成前仍不宣称所有异常状态可靠。
