# Codex App（app-server）SQLite 双源调研

实机摸底日期：2026.10.30（用户「Codex App」= ChatGPT VS Code 插件 openai.chatgpt 内嵌 `codex app-server`，CLI 版本 `0.165.0`）。所有结论来自 `sqlite3 -readonly` 只读查询，未做任何写操作。

## 1. 存储边界（已验证）

- 会话实时数据 **SQLite-first**：`~/.codex/state_5.sqlite` + `~/.codex/thread_history_1.sqlite`（版本号随 app-server 升级变化，监听时必须 glob `state_*.sqlite` / `thread_history_*.sqlite` 并取版本号最大者）。
- 与前期结论的差异：2026.2.6 摸底时「rollout 仅建会话时落 meta」，但本机 `0.165.0` 的 app 会话 rollout 文件包含完整 `task_started`/`response_item`/`task_complete` 记录（25 行/约 97KB）。因此 rollout watcher 与 SQLite 轮询可能同时给同一会话喂事件。
- **双源双宠问题已按工作区聚合解决**（2026.10.30）：所有 Codex 源（CLI/VS Code rollout + App SQLite）的实例 ID 统一为 `codex:<cwd>`，不再带来源段；同 cwd 只有一个桌宠，宿主/导航/名称随最近事件的来源更新（runtime 的 apply/register 本就用 `event.sourceInstance` 覆盖 record.instance，无需额外改动）。旧 settings.json 中 `codex:cli:<cwd>` 等键的实例偏好由 runtime 的 `legacyCodexPreferences` 垫片按 cwd 回退查询。
- **双管道同会话去重**：rollout 文件名 uuid 与 `threads.id` 一致（已实证），前端维护 `rolloutFedSessions`——rollout 管道对某 session 解析出任何有效事件（非 monitor_degraded）后该 session 进入 Set，SQLite 管道对 Set 内的 thread_id 跳过事件转发（thread 索引更新照做）。于是「rollout 只有 meta」的形态下 SQLite 自然接管，本机双写形态下去重。Set 不做淘汰。
- 数据库为 **WAL 模式**：近期提交可能只在 `-wal` 文件里，直接复制 `.sqlite` 主文件会丢数据（断言脚本因此连带复制 `-wal`/`-shm`）。轮询使用 `SQLITE_OPEN_READ_ONLY` + busy_timeout 500ms，打不开/被锁则静默跳过本轮。

## 2. 实机 schema

### state_5.sqlite → `threads`（会话索引，表很小，全量快照 diff 即可）

关键列（已验证存在）：`id, rollout_path, created_at_ms, updated_at_ms, source, cwd, title, originator, thread_source, archived, agent_nickname, agent_role, agent_path, attached_thread_parent_id, git_branch, model, preview` 等。另有 `thread_spawn_edges(parent_thread_id, child_thread_id, status)`（本机为空）。

本机真实样本：

- app-server 会话：`source='exec'`，`originator='codex_exec'`，`cwd=/Users/peter/workspace/iToppy`（5 条合成验证会话）
- VS Code 插件会话：`source='vscode'`，`originator` 为空，`cwd=/Users/peter/workspace/openclaw-mate`
- 前期记录 app-server 被注入 `CODEX_INTERNAL_ORIGINATOR_OVERRIDE=codex_vscode`；本机未复现，两个值都按 app 处理（`sourceKind` 先判 app/desktop 再判 vscode）

### thread_history_1.sqlite

- `thread_items`：PK `(thread_id, turn_id, item_id)`，另有 `UNIQUE(thread_id, rollout_ordinal)`、`created_at_ms, item_type, item_json, started_at_ms, completed_at_ms, updated_at_ordinal`。本机 11 行。rowid 单调，适合增量游标；rowid 回退 = 文件重写。
- `thread_turns`：PK `(thread_id, turn_id)`，`UNIQUE(thread_id, rollout_ordinal)`。关键列：`status, error_json, started_at, completed_at, duration_ms, first_user_item_id, final_agent_item_id, root_turn_id`。**状态原地更新**（不能靠 rowid 游标，需全量快照 diff）。本机 7 行。
- `thread_realtime_items`：本机为空；`item_type IN ('realtime_session_started','realtime_session_closed')` 有边界索引（realtime/语音形态，未实机）。

## 3. item 类型（本机 item_json 样本）

| item_type | 样本字段 | 映射 |
|---|---|---|
| `userMessage` | `content:[{type:'text',text}]` | 新 turn 的第一条 → `task_submitted` |
| `reasoning` | `summary:[], content:[]` | `activity_observed(thinking)` |
| `commandExecution` | `command, cwd, processId, status, aggregatedOutput, exitCode`（`pluginId/scriptPath` 可空） | `activity_observed(tool_calling)` |
| `agentMessage` | `text, phase:'final_answer'`（其他 phase 值未实机） | `response_observed(text)`；phase 含 final → 记 latestResponse |

## 4. 成功/失败边界（最终判定）

- **已验证**：`thread_turns.status = 'completed'` → `task_succeeded`（response 取 phase 含 final 的最后 agentMessage）；`status = 'failed'` → `task_failed`（message 取 `error_json.message`，含密钥片段时按 rollout 同款正则脱敏）。真实样本：3 条 failed（401 Incorrect API key，error_json 结构 `{message}`）+ 4 条 completed。
- **进行中状态的枚举值未实机**：本机快照里全部是终态（completed/failed），无法确认 in-flight turn 的 status 取值，因此未知状态一律忽略（不写假成功）。
- turn 状态原地更新 + 每 turn 终态只发一次（parser 内 `seenTurnStatus`/`terminalTurns` 去重）；状态机层 `task_succeeded/failed` 只在 running 时生效，迟到事件不覆盖已结算结果（断言覆盖）。
- 兜底：item 无 `turn_id`（旧 schema）时退化为一 thread 一次 `task_submitted`。

## 5. 待实机清单

- app-server 进行中 turn 的 `thread_turns.status` 取值与写入时机。
- `agentMessage.phase` 除 `final_answer` 外的取值（如 streaming 中间态）。
- 搜索类 item（webSearch 等）是否存在及类型名；当前按类型名含 search/execution 关键字保守映射。
- 子代理链路：本机 `agent_path`/`attached_thread_parent_id`/`thread_spawn_edges` 均为空，过滤逻辑仅按非空判定，未实机验证真实子代理会话。
- app-server 鉴权形态差异（ChatGPT 账号登录 vs API key）对 threads 列内容的影响。
- ~~双源重叠~~（已解决，2026.10.30）：rollout 完整写入的版本上同一 app 会话双管道同达；现按 `codex:<cwd>` 聚合为单实例，并用 `rolloutFedSessions` 去重（见第 1 节）。
- 版本号文件切换（state_6.sqlite 等出现）时的行为（已实现游标重置，未实机）。
- `thread_realtime_items`（realtime 会话）结构。

## 6. 实现要点（已落地）

- Rust：`src-tauri/src/codex_app.rs`，1.5s 轮询，只读连接，启动时游标初始化为 `max(rowid)`（不回放历史），items 每批 ≤500 分事件发送（`codex-app-db`），threads/turns 全量快照 diff 按 `updated_at_ms`/status 判断变化。
- TS：`src/adapters/codex/app-db.ts`（`CodexAppThreadIndex` + `CodexAppItemsParser` + 去重纯函数 `codexRolloutFeedsSession`/`codexAppThreadShadowed`），接线在 `src/native.ts`；实例缺失（子代理/未知 thread）时事件进 pending，不创建实例。
- 聚合：`source-index.ts` 与 `app-db.ts` 的实例 ID 均为 `codex:<cwd>`（来源段只影响宿主/导航/名称）；`source-instance-runtime.ts` 的 `legacyCodexPreferences` 垫片把旧键 `codex:cli|vscode|app:<cwd>` 的偏好回退迁移到新键。
- 断言：`npx tsx src/adapters/codex/app-db.assert.ts`（复制本机两个 sqlite 含 -wal/-shm 到 /tmp 后只读验证，43 条断言）。
