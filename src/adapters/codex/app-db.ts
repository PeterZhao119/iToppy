import type { AgentEvent, AgentSource, SourceInstance } from "../../core/agents/model.js";
import type { AgentReadHost } from "../../core/agents/host.js";
import { sourceKind } from "./source-index.js";

export interface CodexAppThreadRow {
  id?: unknown;
  rollout_path?: unknown;
  created_at_ms?: unknown;
  updated_at_ms?: unknown;
  source?: unknown;
  cwd?: unknown;
  title?: unknown;
  originator?: unknown;
  thread_source?: unknown;
  archived?: unknown;
  agent_nickname?: unknown;
  agent_role?: unknown;
  agent_path?: unknown;
  attached_thread_parent_id?: unknown;
  git_branch?: unknown;
  model?: unknown;
}

export interface CodexAppItemWire {
  rowid: number;
  thread_id: string;
  turn_id: string;
  item_type: string;
  item_json: string;
}

export interface CodexAppTurnWire {
  thread_id: string;
  turn_id: string;
  status: string;
  error_json?: string | null;
  final_agent_item_id?: string | null;
}

export interface CodexAppDbPayload {
  threads: CodexAppThreadRow[];
  turns: CodexAppTurnWire[];
  items: CodexAppItemWire[];
}

// 判定一轮 rollout 增量是否算「该会话已由 rollout 管道喂过」：
// 只有产出有效事件（非 monitor_degraded）时才让 SQLite 管道闭嘴，
// 这样「rollout 只有 meta、不出事件」的形态下 SQLite 管道仍会接管。
export function codexRolloutFeedsSession(events: AgentEvent[]): boolean {
  return events.some((event) => event.type !== "monitor_degraded");
}

// SQLite 管道去重：thread/session id 与 rollout 文件名 uuid 一致，
// 已被 rollout 管道喂过的 thread 跳过事件转发（thread 索引更新仍照做）。
export function codexAppThreadShadowed(
  rolloutFedSessions: ReadonlySet<string>,
  threadId: string,
): boolean {
  return rolloutFedSessions.has(threadId);
}

export function textOf(value: unknown): string | undefined {
  if (typeof value === "string") return value.trim() === "" ? undefined : value;
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  if (Array.isArray(value)) {
    for (const item of value) {
      const text = textOf(item);
      if (text !== undefined) return text;
    }
  }
  if (typeof value === "object" && value !== null) {
    const record = value as Record<string, unknown>;
    for (const key of ["type", "kind", "name", "source", "originator", "id"]) {
      const text = textOf(record[key]);
      if (text !== undefined) return text;
    }
  }
  return undefined;
}

export class CodexAppThreadIndex {
  private readonly threads = new Map<string, CodexAppThreadRow>();
  private stateDbPath: string | undefined;
  private historyDbPath: string | undefined;

  constructor(private readonly host: AgentReadHost, readonly homePath: string) {}

  async refresh(): Promise<void> {
    this.stateDbPath = await this.latestVersionedDb("state_");
    this.historyDbPath = await this.latestVersionedDb("thread_history_");
  }

  applyThreads(rows: CodexAppThreadRow[]): string[] {
    const changed: string[] = [];
    for (const row of rows) {
      const id = textOf(row.id);
      if (id === undefined) continue;
      this.threads.set(id, row);
      changed.push(id);
    }
    return changed;
  }

  sourceFor(threadId: string): SourceInstance | undefined {
    const row = this.threads.get(threadId);
    if (row === undefined) return undefined;
    // 子代理 / 派生 thread（agent_path 非空或挂载到父 thread）不创建实例。
    if (textOf(row.agent_path) !== undefined || textOf(row.attached_thread_parent_id) !== undefined) {
      return undefined;
    }
    const cwd = textOf(row.cwd);
    if (cwd === undefined) return undefined;
    const kind = sourceKind({
      sessionId: threadId,
      cwd,
      source: textOf(row.source) ?? "",
      originator: textOf(row.originator) ?? "",
    });
    const workspaceName = cwd.split(/[\\/]/).filter(Boolean).at(-1) ?? cwd;
    const hostKind = kind === "vscode" ? "vscode-workspace" : "app";
    const appBundleId = kind === "vscode" ? "com.microsoft.VSCode" : "com.openai.chat";
    return {
      agentType: "codex",
      // 与 rollout 源归一为同一工作区实例（多来源共享 thread/session id）。
      instanceId: `codex:${cwd}`,
      hostKind,
      displayName: `Codex App · ${workspaceName}`,
      navigation: { appBundleId, workspacePath: cwd },
      dataSources: [
        {
          scope: "agent",
          kind: "database",
          role: "state",
          path: this.stateDbPath ?? this.homePath,
        },
        {
          scope: "agent",
          kind: "database",
          role: "transcript",
          path: this.historyDbPath ?? this.homePath,
          sessionId: threadId,
        },
      ],
    };
  }

  discoveredInstances(): SourceInstance[] {
    const instances = new Map<string, SourceInstance>();
    for (const threadId of this.threads.keys()) {
      const instance = this.sourceFor(threadId);
      if (instance !== undefined) instances.set(instance.instanceId, instance);
    }
    return [...instances.values()];
  }

  private async latestVersionedDb(prefix: string): Promise<string | undefined> {
    if (!(await this.host.pathExists(this.homePath))) return undefined;
    let best: { version: number; path: string } | undefined;
    for (const entry of await this.host.readDirectory(this.homePath)) {
      const match = /^([a-z_]+)_(\d+)\.sqlite$/.exec(entry.name);
      if (match === null || match[1] !== prefix.replace(/_$/, "") || match[2] === undefined) {
        continue;
      }
      const version = Number.parseInt(match[2], 10);
      if (best === undefined || version > best.version) {
        best = { version, path: entry.path };
      }
    }
    return best?.path;
  }
}

interface CodexAppParseOptions {
  agentType: string;
  sessionId: string;
  workspacePath?: string;
}

export class CodexAppItemsParser {
  private latestResponse: string | undefined;
  private threadSubmitted = false;
  private readonly submittedTurns = new Set<string>();
  private readonly terminalTurns = new Set<string>();
  private readonly seenTurnStatus = new Map<string, string>();
  private reportedInvalidItem = false;

  constructor(private readonly options: CodexAppParseOptions) {}

  parseItem(item: CodexAppItemWire): AgentEvent[] {
    const events: AgentEvent[] = [];
    const source: AgentSource = {
      framework: this.options.agentType,
      sessionId: this.options.sessionId,
      workspacePath: this.options.workspacePath,
    };
    const emit = (event: Omit<AgentEvent, "agentType" | "sessionId" | "source">): void => {
      events.push({ ...event, agentType: this.options.agentType, sessionId: this.options.sessionId, source });
    };

    let record: Record<string, unknown> | undefined;
    try {
      const parsed: unknown = JSON.parse(item.item_json);
      if (typeof parsed === "object" && parsed !== null) record = parsed as Record<string, unknown>;
    } catch {
      record = undefined;
    }
    if (record === undefined) {
      if (!this.reportedInvalidItem) {
        this.reportedInvalidItem = true;
        emit({
          type: "monitor_degraded",
          message: `Codex app thread '${this.options.sessionId}' contains an invalid history item.`,
        });
      }
      return events;
    }

    // 任务边界兜底：新 turn 的第一条 item 视为任务提交（同 turn 不重复）；
    // 若 item 没有 turn_id（旧 schema），退化为每 thread 只提交一次。
    if (item.turn_id !== "") {
      if (!this.submittedTurns.has(item.turn_id)) {
        this.submittedTurns.add(item.turn_id);
        emit({ type: "task_submitted", message: "收到任务，开始处理" });
      }
    } else if (!this.threadSubmitted) {
      this.threadSubmitted = true;
      emit({ type: "task_submitted", message: "收到任务，开始处理" });
    }

    const type = textOf(record.type) ?? item.item_type;
    switch (type) {
      case "userMessage":
        // 任务提交已由上面的兜底逻辑覆盖。
        break;
      case "reasoning":
        emit({ type: "activity_observed", activity: "thinking", message: "正在思考…" });
        break;
      case "agentMessage": {
        const text = textOf(record.text);
        if (text !== undefined) {
          const phase = textOf(record.phase) ?? "";
          if (phase.toLowerCase().includes("final")) this.latestResponse = text;
          emit({ type: "response_observed", response: text });
        }
        break;
      }
      case "commandExecution":
        emit({ type: "activity_observed", activity: "tool_calling", message: "正在调用工具：shell" });
        break;
      default:
        if (type !== undefined && /search/i.test(type)) {
          emit({ type: "activity_observed", activity: "searching", message: "正在搜索…" });
        } else if (type !== undefined && /(exec|execution|tool_call|toolcall|patch|mcp)/i.test(type)) {
          // 其他执行类 item 归入 tool_calling；具体类型枚举待实机补充。
          emit({ type: "activity_observed", activity: "tool_calling", message: "正在调用工具…" });
        }
        break;
    }
    return events;
  }

  parseTurn(turn: CodexAppTurnWire): AgentEvent[] {
    const events: AgentEvent[] = [];
    const status = turn.status.toLowerCase();
    if (this.seenTurnStatus.get(turn.turn_id) === status) return events;
    this.seenTurnStatus.set(turn.turn_id, status);
    // turn 状态原地更新，只对每个 turn 发一次终态事件；进行中状态值待实机确认，一律忽略。
    if (this.terminalTurns.has(turn.turn_id)) return events;
    const source: AgentSource = {
      framework: this.options.agentType,
      sessionId: this.options.sessionId,
      workspacePath: this.options.workspacePath,
    };
    const emit = (event: Omit<AgentEvent, "agentType" | "sessionId" | "source">): void => {
      events.push({ ...event, agentType: this.options.agentType, sessionId: this.options.sessionId, source });
    };
    if (status === "completed") {
      this.terminalTurns.add(turn.turn_id);
      if (this.latestResponse === undefined) {
        emit({
          type: "monitor_degraded",
          message: `Codex app thread '${this.options.sessionId}' completed without a verified response.`,
        });
      } else {
        emit({ type: "task_succeeded", response: this.latestResponse });
      }
    } else if (status === "failed") {
      this.terminalTurns.add(turn.turn_id);
      const failure = turnErrorMessage(turn.error_json) ?? "未知错误";
      emit({
        type: "task_failed",
        response: this.latestResponse ?? `任务失败：${failure}`,
        message: failure,
      });
    }
    return events;
  }
}

function turnErrorMessage(errorJson: string | null | undefined): string | undefined {
  if (typeof errorJson !== "string" || errorJson.trim() === "") return undefined;
  try {
    const parsed: unknown = JSON.parse(errorJson);
    const message = textOf(typeof parsed === "object" && parsed !== null
      ? (parsed as Record<string, unknown>).message
      : parsed);
    return message
      ?.replace(/sk-[A-Za-z0-9_*-]+/g, "[redacted credential]")
      .split(/\r?\n/, 1)[0];
  } catch {
    return undefined;
  }
}
