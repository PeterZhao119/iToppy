import type { AgentEvent, AgentSource } from "../../core/agents/model.js";

interface RolloutParseOptions {
  agentType: string;
  sessionId: string;
  workspacePath?: string;
}

interface RolloutContent {
  type?: string;
  text?: string;
}

interface RolloutError {
  message?: string;
}

export interface RolloutPayload {
  type?: string;
  id?: string;
  session_id?: string;
  cwd?: string;
  source?: string;
  originator?: string;
  role?: string;
  name?: string;
  message?: string;
  reason?: string;
  last_agent_message?: string | null;
  error?: RolloutError | string | null;
  content?: RolloutContent[];
}

export interface CodexSessionMetadata {
  sessionId: string;
  cwd: string;
  source: string;
  originator: string;
}

interface RolloutRecord {
  type?: string;
  payload?: RolloutPayload;
}

export function parseCodexSessionMetadata(content: string): CodexSessionMetadata | undefined {
  for (const line of content.split(/\r?\n/)) {
    if (line.trim() === "") continue;
    try {
      const record = JSON.parse(line) as RolloutRecord;
      if (record.type !== "session_meta") continue;
      const payload = record.payload;
      const sessionId = payload?.session_id ?? payload?.id;
      if (typeof sessionId !== "string" || typeof payload?.cwd !== "string") return undefined;
      return {
        sessionId,
        cwd: payload.cwd,
        source: payload.source ?? "cli",
        originator: payload.originator ?? "codex_cli",
      };
    } catch {
      return undefined;
    }
  }
  return undefined;
}

export class CodexRolloutParser {
  private latestResponse: string | undefined;

  constructor(private readonly options: RolloutParseOptions) {}

  parse(content: string): AgentEvent[] {
    const events: AgentEvent[] = [];
    const source: AgentSource = {
      framework: this.options.agentType,
      sessionId: this.options.sessionId,
      workspacePath: this.options.workspacePath,
    };
    const emit = (event: Omit<AgentEvent, "agentType" | "sessionId" | "source">): void => {
      events.push({
        ...event,
        agentType: this.options.agentType,
        sessionId: this.options.sessionId,
        source,
      });
    };

    for (const line of content.split(/\r?\n/)) {
      if (line.trim() === "") continue;
      let record: RolloutRecord;
      try {
        record = JSON.parse(line) as RolloutRecord;
      } catch {
        emit({
          type: "monitor_degraded",
          message: `Codex session '${this.options.sessionId}' contains an invalid rollout record.`,
        });
        continue;
      }
      const payload = record.payload;
      if (payload === undefined) continue;

      if (record.type === "response_item") {
        this.parseResponseItem(payload, emit);
        continue;
      }
      if (record.type !== "event_msg") continue;

      switch (payload.type) {
        case "task_started":
          this.latestResponse = undefined;
          emit({ type: "task_submitted", message: "收到任务，开始处理" });
          break;
        case "task_complete": {
          const failure = errorMessage(payload.error);
          if (failure !== undefined) {
            emit({
              type: "task_failed",
              response: this.latestResponse ?? `任务失败：${failure}`,
              message: failure,
            });
            break;
          }
          const response = nonEmpty(payload.last_agent_message) ?? this.latestResponse;
          if (response === undefined) {
            emit({
              type: "monitor_degraded",
              message: `Codex session '${this.options.sessionId}' completed without a verified response.`,
            });
          } else {
            emit({ type: "task_succeeded", response });
          }
          break;
        }
        case "turn_aborted":
          this.latestResponse = undefined;
          emit({ type: "task_interrupted", message: payload.reason ?? "任务已取消" });
          break;
        case "agent_reasoning":
          emit({ type: "activity_observed", activity: "thinking", message: "正在思考…" });
          break;
        case "agent_message":
          if (typeof payload.message === "string" && payload.message.trim() !== "") {
            this.latestResponse = payload.message;
            emit({ type: "response_observed", response: payload.message });
          }
          break;
        case "web_search_begin":
          emit({ type: "activity_observed", activity: "searching", message: "正在搜索…" });
          break;
        case "exec_command_begin":
        case "mcp_tool_call_begin":
        case "patch_apply_begin":
          emit({
            type: "activity_observed",
            activity: "tool_calling",
            message: `正在调用工具：${toolLabel(payload.type)}`,
          });
          break;
      }
    }
    return events;
  }

  private parseResponseItem(
    payload: RolloutPayload,
    emit: (event: Omit<AgentEvent, "agentType" | "sessionId" | "source">) => void,
  ): void {
    if (payload.type === "message" && payload.role === "assistant") {
      const response = payload.content
        ?.filter((item) => item.type === "output_text" || item.type === "text")
        .map((item) => item.text ?? "")
        .join("\n")
        .trim();
      if (response !== undefined && response !== "") {
        this.latestResponse = response;
        emit({ type: "response_observed", response });
      }
      return;
    }
    if (payload.type === "reasoning") {
      emit({ type: "activity_observed", activity: "thinking", message: "正在思考…" });
      return;
    }
    if (payload.type === "web_search_call") {
      emit({ type: "activity_observed", activity: "searching", message: "正在搜索…" });
      return;
    }
    if (payload.type === "function_call" || payload.type === "custom_tool_call") {
      const toolName = payload.name ?? "工具";
      const searching = toolName.toLowerCase().includes("web_search");
      emit({
        type: "activity_observed",
        activity: searching ? "searching" : "tool_calling",
        message: `${searching ? "正在搜索" : "正在调用工具"}：${toolName}`,
      });
    }
  }
}

export function parseCodexRollout(content: string, options: RolloutParseOptions): AgentEvent[] {
  return new CodexRolloutParser(options).parse(content);
}

function nonEmpty(value: string | null | undefined): string | undefined {
  return typeof value === "string" && value.trim() !== "" ? value : undefined;
}

function errorMessage(error: RolloutError | string | null | undefined): string | undefined {
  const message = typeof error === "string" ? error : error?.message;
  if (message === undefined || message.trim() === "") return undefined;
  return message
    .replace(/sk-[A-Za-z0-9_*-]+/g, "[redacted credential]")
    .split(/\r?\n/, 1)[0] ?? "未知错误";
}

function toolLabel(eventType: string): string {
  switch (eventType) {
    case "exec_command_begin": return "Bash";
    case "mcp_tool_call_begin": return "MCP";
    case "patch_apply_begin": return "apply_patch";
    default: return "工具";
  }
}
