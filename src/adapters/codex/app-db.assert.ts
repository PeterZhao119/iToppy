import { DatabaseSync } from "node:sqlite";
import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  CodexAppItemsParser,
  CodexAppThreadIndex,
  codexAppThreadShadowed,
  codexRolloutFeedsSession,
  type CodexAppThreadRow,
  type CodexAppTurnWire,
} from "./app-db.js";
import { CodexSessionIndex } from "./source-index.js";
import type { AgentReadHost } from "../../core/agents/host.js";
import type { AgentEvent, SourceInstance, TaskSnapshot } from "../../core/agents/model.js";
import { SourceInstanceRuntime } from "../../core/agents/source-instance-runtime.js";
import { initialTaskSnapshot, reduceTaskSnapshot } from "../../core/agents/state-machine.js";
import { defaultAppSettings, normalizeSettings } from "../../core/settings.js";

let passed = 0;
let failed = 0;

function assert(condition: boolean, label: string): void {
  if (condition) {
    passed += 1;
    console.log(`PASS  ${label}`);
  } else {
    failed += 1;
    console.error(`FAIL  ${label}`);
  }
}

function eventTypes(events: AgentEvent[]): string[] {
  return events.map((event) => event.type);
}

function drain(parser: CodexAppItemsParser, item: unknown): AgentEvent[] {
  return parser.parseItem(item as Parameters<CodexAppItemsParser["parseItem"]>[0]);
}

function reduceAll(events: AgentEvent[]): TaskSnapshot {
  let snapshot = initialTaskSnapshot("assert-session");
  for (const event of events) snapshot = reduceTaskSnapshot(snapshot, event);
  return snapshot;
}

const home = process.env.HOME ?? "";
const codexHome = process.env.CODEX_HOME?.trim() || join(home, ".codex");
const scratch = join(tmpdir(), `itoppy-app-db-assert-${process.pid}`);
mkdirSync(scratch, { recursive: true });

// ---- 本机真实数据：复制到 /tmp 后只读查询 ----
// 数据库是 WAL 模式，近期提交可能只在 -wal 文件里，必须一并复制。
const realHistorySource = join(codexHome, "thread_history_1.sqlite");
const realStateSource = join(codexHome, "state_5.sqlite");
const historyCopy = join(scratch, "thread_history.sqlite");
const stateCopy = join(scratch, "state.sqlite");
for (const source of [realHistorySource, realStateSource]) {
  const target = source.includes("thread_history") ? historyCopy : stateCopy;
  copyFileSync(source, target);
  for (const suffix of ["-wal", "-shm"]) {
    try {
      copyFileSync(source + suffix, target + suffix);
    } catch {
      // -wal/-shm 不存在时可忽略。
    }
  }
}
const history = new DatabaseSync(historyCopy, { readOnly: true });
const stateDb = new DatabaseSync(stateCopy, { readOnly: true });

type ItemRow = { thread_id: string; turn_id: string; item_type: string; item_json: string };
type TurnRow = { thread_id: string; turn_id: string; status: string; error_json: string | null };

function itemsFor(threadId: string): ItemRow[] {
  return history.prepare(
    "SELECT thread_id, turn_id, item_type, item_json FROM thread_items WHERE thread_id = ? ORDER BY rollout_ordinal",
  ).all(threadId) as unknown as ItemRow[];
}

function turnsFor(threadId: string): TurnRow[] {
  return history.prepare(
    "SELECT thread_id, turn_id, status, error_json FROM thread_turns WHERE thread_id = ?",
  ).all(threadId) as unknown as TurnRow[];
}

// 1. 真实成功链路（2026.2.6 验证会话：userMessage → reasoning → commandExecution → agentMessage(final_answer)）
const successThread = "01a18743-5768-75a3-a772-c2bfb88e82e9";
{
  const parser = new CodexAppItemsParser({ agentType: "codex", sessionId: successThread, workspacePath: "/Users/peter/workspace/iToppy" });
  const events: AgentEvent[] = [];
  for (const item of itemsFor(successThread)) events.push(...drain(parser, item));
  const types = eventTypes(events);
  assert(types[0] === "task_submitted", "真实数据：第一条 userMessage 开任务");
  assert(types.filter((type) => type === "task_submitted").length === 1, "真实数据：同 turn 不重复开任务");
  const thinking = events.find((event) => event.type === "activity_observed" && event.activity === "thinking");
  assert(thinking !== undefined, "真实数据：reasoning → activity_observed(thinking)");
  const tool = events.find((event) => event.type === "activity_observed" && event.activity === "tool_calling");
  assert(tool !== undefined, "真实数据：commandExecution → activity_observed(tool_calling)");
  const responses = events.filter((event) => event.type === "response_observed");
  assert(responses.length > 0 && responses.every((event) => typeof event.response === "string" && event.response !== ""), "真实数据：agentMessage → response_observed(text)");
  const turns = turnsFor(successThread);
  assert(turns.length === 1 && turns[0]?.status === "completed", "真实数据：thread_turns 记录 completed");
  const turnEvents = turns.map((turn) => parser.parseTurn(turn as CodexAppTurnWire)).flat();
  const succeeded = turnEvents.find((event) => event.type === "task_succeeded");
  assert(succeeded !== undefined && succeeded.response === "Codex 默认配置与工具事件验证成功。", "真实数据：completed turn → task_succeeded（latestResponse=final_answer 文本）");
  const snapshot = reduceAll(events.concat(turnEvents));
  assert(snapshot.state === "succeeded" && snapshot.latestResponse === succeeded?.response, "状态机：真实事件流归约为 succeeded");
}

// 2. 真实失败链路（401 失败会话：thread_turns.status = failed + error_json）
const failedThread = "01a18722-efe5-7932-a123-a9c4c7a34aea";
{
  const parser = new CodexAppItemsParser({ agentType: "codex", sessionId: failedThread });
  const events: AgentEvent[] = [];
  for (const item of itemsFor(failedThread)) events.push(...drain(parser, item));
  const turns = turnsFor(failedThread);
  const turnEvents = turns.map((turn) => parser.parseTurn(turn as CodexAppTurnWire)).flat();
  const failedEvent = turnEvents.find((event) => event.type === "task_failed");
  assert(turns[0]?.status === "failed", "真实数据：thread_turns 记录 failed");
  assert(failedEvent !== undefined, "真实数据：failed turn → task_failed");
  assert(typeof failedEvent?.message === "string" && failedEvent.message.length > 0 && !failedEvent.message.includes("sk-"), "真实数据：task_failed.message 取自 error_json 且不泄露密钥");
  const again = turns.map((turn) => parser.parseTurn(turn as CodexAppTurnWire)).flat();
  assert(again.length === 0, "真实数据：同状态重复 turn 行不产生重复事件");
  const snapshot = reduceAll(events.concat(turnEvents));
  assert(snapshot.state === "failed", "状态机：失败事件流归约为 failed");
}

// 3. 外部输入边界：第一条 user 类 item 开任务，后续执行类 item 不再开任务
{
  const parser = new CodexAppItemsParser({ agentType: "codex", sessionId: "synthetic-1" });
  const item = (turnId: string, type: string, extra: Record<string, unknown> = {}) => ({
    rowid: 1,
    thread_id: "synthetic-1",
    turn_id: turnId,
    item_type: type,
    item_json: JSON.stringify({ type, id: `id-${turnId}-${type}`, ...extra }),
  });
  const events: AgentEvent[] = [];
  events.push(...drain(parser, item("turn-a", "userMessage", { content: [{ type: "text", text: "hi" }] })));
  events.push(...drain(parser, item("turn-a", "commandExecution", { command: "pwd" })));
  events.push(...drain(parser, item("turn-a", "agentMessage", { text: "done", phase: "final_answer" })));
  assert(eventTypes(events).filter((type) => type === "task_submitted").length === 1, "合成：同 turn 内工具/结果 item 不重复开任务");
  const turnA = { thread_id: "synthetic-1", turn_id: "turn-a", status: "completed", error_json: null, final_agent_item_id: null };
  const terminal = parser.parseTurn(turnA);
  assert(eventTypes(terminal)[0] === "task_succeeded", "合成：completed → task_succeeded");
  const lateResponse = drain(parser, item("turn-a", "agentMessage", { text: "迟到回复", phase: "final_answer" }));
  assert(eventTypes(lateResponse)[0] === "response_observed", "合成：成功后迟到 item 仍产出 response_observed（由状态机兜底忽略）");
  const finalSnapshot = reduceAll(events.concat(terminal, lateResponse));
  assert(finalSnapshot.state === "succeeded" && finalSnapshot.latestResponse === "done", "状态机：成功后的迟到 response 不覆盖 latestResponse");
  const newTurn = drain(parser, item("turn-b", "userMessage", { content: [{ type: "text", text: "again" }] }));
  assert(eventTypes(newTurn)[0] === "task_submitted", "合成：新 turn 的 user item 重新开任务");
  const afterNewSubmit = reduceAll(events.concat(terminal, newTurn));
  assert(afterNewSubmit.state === "running", "状态机：新任务提交后回到 running");
  // turn 终态只发一次：completed 之后即使出现 failed 行也不改写
  const flip = parser.parseTurn({ ...turnA, status: "failed", error_json: JSON.stringify({ message: "late failure" }) });
  assert(flip.length === 0, "合成：turn 终态不重复（completed 后 failed 被忽略）");
}

// 3. 真实 threads 行：索引解析与实例生成
{
  const host = {
    homeDirectory: () => home,
    environmentVariable: () => undefined,
    joinPath: (...parts: string[]) => parts.join("/"),
    pathExists: async () => true,
    readDirectory: async () => [],
    readTextFile: async () => "",
    md5: (value: string) => value,
  } satisfies AgentReadHost;
  const index = new CodexAppThreadIndex(host, codexHome);
  const rows = stateDb.prepare(
    "SELECT id, rollout_path, created_at_ms, updated_at_ms, source, cwd, title, originator, thread_source, archived, agent_path, attached_thread_parent_id, git_branch, model FROM threads",
  ).all() as unknown as CodexAppThreadRow[];
  index.applyThreads(rows);
  const instance = index.sourceFor(successThread);
  assert(instance?.instanceId === "codex:/Users/peter/workspace/iToppy", "真实数据：threads 行 → 归一实例（cwd 正确）");
  assert(instance?.navigation.appBundleId === "com.openai.chat" && instance.displayName.startsWith("Codex App · "), "真实数据：app-server 来源 → Chat 应用宿主");
  assert(instance?.dataSources.every((source) => source.kind === "database") === true, "真实数据：dataSources 记录 sqlite 来源");
  assert(index.discoveredInstances().length >= 2, "真实数据：多 thread 聚合出去重实例");
}

// 4. 子代理 / 派生 thread 过滤 + 来源字段容错
{
  const host = {
    homeDirectory: () => home,
    environmentVariable: () => undefined,
    joinPath: (...parts: string[]) => parts.join("/"),
    pathExists: async () => true,
    readDirectory: async () => [],
    readTextFile: async () => "",
    md5: (value: string) => value,
  } satisfies AgentReadHost;
  const index = new CodexAppThreadIndex(host, codexHome);
  index.applyThreads([
    { id: "t-normal", cwd: "/ws/project", source: "exec", originator: "codex_exec" },
    { id: "t-agent", cwd: "/ws/project", source: "exec", originator: "codex_exec", agent_path: "agents/researcher" },
    { id: "t-attached", cwd: "/ws/project", source: "exec", originator: "codex_exec", attached_thread_parent_id: "t-normal" },
    { id: "t-vscode", cwd: "/ws/other", source: "vscode", originator: null },
    { id: "t-weird", cwd: "/ws/weird", source: { type: "app" }, originator: 42 },
  ] as CodexAppThreadRow[]);
  const normal = index.sourceFor("t-normal");
  assert(normal?.instanceId === "codex:/ws/project" && normal.navigation.appBundleId === "com.openai.chat", "过滤：普通 thread → 归一实例（Chat 应用）");
  assert(index.sourceFor("t-agent") === undefined, "过滤：agent_path 非空 → 子代理，不建实例");
  assert(index.sourceFor("t-attached") === undefined, "过滤：attached_thread_parent_id 非空 → 派生 thread，不建实例");
  const vscode = index.sourceFor("t-vscode");
  assert(vscode?.navigation.appBundleId === "com.microsoft.VSCode" && vscode.hostKind === "vscode-workspace", "过滤：vscode 来源 → VS Code 宿主");
  const weird = index.sourceFor("t-weird");
  assert(weird !== undefined && weird.instanceId === "codex:/ws/weird", "容错：source 对象 / originator 数字不抛错");
  let threw = false;
  try {
    index.sourceFor("t-unknown");
  } catch {
    threw = true;
  }
  assert(!threw, "容错：未知 thread 查询不抛错");
  assert(index.sourceFor("t-missing-cwd" as string) === undefined, "容错：缺失行返回 undefined");
}

// 5. item_json 损坏：降级事件只报一次，不抛错
{
  const parser = new CodexAppItemsParser({ agentType: "codex", sessionId: "broken" });
  const bad = { rowid: 1, thread_id: "broken", turn_id: "t1", item_type: "", item_json: "{not json" };
  const first = drain(parser, bad);
  const second = drain(parser, { ...bad, rowid: 2 });
  assert(eventTypes(first)[0] === "monitor_degraded" && second.length === 0, "容错：损坏 item_json → 单次 monitor_degraded");
}

// 6. 状态机层：迟到成功不改写已失败结果，非 running 时活动事件被忽略
{
  const parser = new CodexAppItemsParser({ agentType: "codex", sessionId: "sm" });
  const item = { rowid: 1, thread_id: "sm", turn_id: "t1", item_type: "userMessage", item_json: JSON.stringify({ type: "userMessage" }) };
  const events = drain(parser, item);
  const failed = parser.parseTurn({ thread_id: "sm", turn_id: "t1", status: "failed", error_json: JSON.stringify({ message: "boom" }) });
  const snapshot = reduceAll([...events, ...failed, {
    type: "task_succeeded",
    agentType: "codex",
    sessionId: "sm",
    response: "迟到成功",
  } satisfies AgentEvent, {
    type: "activity_observed",
    agentType: "codex",
    sessionId: "sm",
    activity: "thinking",
  } satisfies AgentEvent]);
  assert(snapshot.state === "failed" && snapshot.latestResponse?.includes("boom") === true, "状态机：已失败不被迟到成功覆盖");
  assert(snapshot.activity === "generic", "状态机：非 running 时活动事件被忽略");
}

// 7. 双源实例 ID 归一：同一 cwd 的 rollout 源与 SQLite 源生成相同 instanceId
{
  const fileHost = {
    homeDirectory: () => home,
    environmentVariable: () => undefined,
    joinPath: (...parts: string[]) => parts.join("/"),
    pathExists: async () => true,
    readDirectory: async () => [],
    readTextFile: async (path: string) => readFileSync(path, "utf8"),
    md5: (value: string) => value,
  } satisfies AgentReadHost;
  const rolloutIndex = new CodexSessionIndex(fileHost, codexHome);
  const rolloutPath = stateDb.prepare("SELECT rollout_path FROM threads WHERE id = ?")
    .get(successThread) as { rollout_path: string };
  const rolloutInstance = await rolloutIndex.sourceForWithRefresh(successThread, rolloutPath.rollout_path);
  const host = {
    homeDirectory: () => home,
    environmentVariable: () => undefined,
    joinPath: (...parts: string[]) => parts.join("/"),
    pathExists: async () => true,
    readDirectory: async () => [],
    readTextFile: async () => "",
    md5: (value: string) => value,
  } satisfies AgentReadHost;
  const appIndex = new CodexAppThreadIndex(host, codexHome);
  appIndex.applyThreads(stateDb.prepare("SELECT id, cwd, source, originator FROM threads WHERE id = ?")
    .all(successThread) as unknown as CodexAppThreadRow[]);
  const appInstance = appIndex.sourceFor(successThread);
  assert(rolloutInstance?.instanceId === "codex:/Users/peter/workspace/iToppy", "归一：rollout 源实例 ID 不再含来源段");
  assert(appInstance?.instanceId === rolloutInstance?.instanceId, "归一：双源同 cwd → 同一实例 ID（无双宠）");
}

// 8. preferences 旧键回退垫片：codex:cli:/path 等旧偏好迁移到 codex:/path
{
  const runtime = new SourceInstanceRuntime();
  runtime.configure(normalizeSettings({
    ...defaultAppSettings,
    instances: {
      "codex:vscode:/ws/project": { characterIdOverride: "kimi" },
      "codex:/ws/direct": { characterIdOverride: "qq" },
    },
  }));
  const instance: SourceInstance = {
    agentType: "codex",
    instanceId: "codex:/ws/project",
    hostKind: "app",
    displayName: "Codex · project",
    navigation: { appBundleId: "com.openai.chat", workspacePath: "/ws/project" },
    dataSources: [],
  };
  const migrated = runtime.register(instance);
  assert(migrated.settings.characterId === "kimi", "垫片：旧 codex:vscode 键的偏好被新实例继承");
  const direct = runtime.register({ ...instance, instanceId: "codex:/ws/direct" });
  assert(direct.settings.characterId === "qq", "垫片：新键直查优先于旧键回退");
  const untouched = runtime.register({ ...instance, instanceId: "codex:/ws/other" });
  assert(untouched.settings.characterId === "gpt", "垫片：无旧配置时回落到 codex 角色默认（gpt）");
}

// 9. 双管道去重：rollout 喂过有效事件的 thread，SQLite 管道跳过事件转发
{
  const fed = new Set<string>();
  const degradedOnly: AgentEvent[] = [{ type: "monitor_degraded", agentType: "codex", sessionId: "t1", message: "x" }];
  assert(codexRolloutFeedsSession(degradedOnly) === false, "去重：仅 monitor_degraded 不算喂过（meta-only 形态 SQLite 仍接管）");
  const effective: AgentEvent[] = [{ type: "task_submitted", agentType: "codex", sessionId: "t1", message: "开始" }];
  assert(codexRolloutFeedsSession(effective) === true, "去重：有效事件标记会话");
  if (codexRolloutFeedsSession(effective)) fed.add("t1");
  const parser = new CodexAppItemsParser({ agentType: "codex", sessionId: "t1" });
  const item = { rowid: 1, thread_id: "t1", turn_id: "a", item_type: "userMessage", item_json: JSON.stringify({ type: "userMessage" }) };
  const forwarded = codexAppThreadShadowed(fed, item.thread_id) ? [] : parser.parseItem(item);
  assert(forwarded.length === 0 && fed.has("t1"), "去重：rollout 喂过的 thread，SQLite 事件被跳过（不重复 task_submitted）");
  const freshItem = { ...item, thread_id: "t2", rowid: 2 };
  const freshEvents = codexAppThreadShadowed(fed, freshItem.thread_id) ? [] : parser.parseItem(freshItem);
  assert(freshEvents.length > 0, "去重：未喂过的 thread 照常转发");
}

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
