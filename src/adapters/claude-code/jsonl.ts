import type { AgentEvent, AgentSource } from "../../core/agents/model.js";

interface ClaudeParseOptions {
  agentType: string;
  sessionId: string;
  workspacePath?: string;
}

interface ClaudeContent {
  type?: string;
  text?: string;
  thinking?: string;
  name?: string;
}

interface ClaudeMessage {
  role?: string;
  content?: string | ClaudeContent[];
  stop_reason?: string;
}

interface ClaudeRecord {
  type?: string;
  subtype?: string;
  sessionId?: string;
  cwd?: string;
  entrypoint?: string;
  isSidechain?: boolean;
  isMeta?: boolean;
  isApiErrorMessage?: boolean;
  apiErrorStatus?: number;
  is_error?: boolean;
  error?: string;
  result?: string;
  toolUseResult?: unknown;
  message?: ClaudeMessage;
}

export interface ClaudeSessionMetadata {
  sessionId: string;
  cwd: string;
  entrypoint: string;
}

export function parseClaudeSessionMetadata(content: string): ClaudeSessionMetadata | undefined {
  for (const line of content.split(/\r?\n/)) {
    if (line.trim() === "") continue;
    try {
      const record = JSON.parse(line) as ClaudeRecord;
      if (typeof record.sessionId === "string" && typeof record.cwd === "string") {
        return {
          sessionId: record.sessionId,
          cwd: record.cwd,
          entrypoint: record.entrypoint ?? "cli",
        };
      }
    } catch {
      return undefined;
    }
  }
  return undefined;
}

export class ClaudeJsonlParser {
  private latestResponse: string | undefined;
  private settled = false;

  constructor(private readonly options: ClaudeParseOptions) {}

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
      let record: ClaudeRecord;
      try {
        record = JSON.parse(line) as ClaudeRecord;
      } catch {
        emit({
          type: "monitor_degraded",
          message: `Claude session '${this.options.sessionId}' contains an invalid JSONL record.`,
        });
        continue;
      }
      if (record.isSidechain === true) continue;

      if (record.type === "interrupt" || record.subtype === "interrupt" || record.subtype === "cancelled") {
        if (!this.settled) {
          this.latestResponse = undefined;
          this.settled = true;
          emit({ type: "task_interrupted", message: "任务已取消" });
        }
        continue;
      }

      if (record.type === "user") {
        const content = record.message?.content;
        const toolResult = record.toolUseResult !== undefined ||
          (Array.isArray(content) && content.some((item) => item.type === "tool_result"));
        const submitted = record.isMeta === true || toolResult || record.message?.role !== "user"
          ? undefined
          : textContent(content);
        if (submitted !== undefined) {
          this.latestResponse = undefined;
          this.settled = false;
          emit({ type: "task_submitted", message: "收到任务，开始处理" });
        }
        continue;
      }

      if (record.type === "assistant" && record.message !== undefined) {
        if (this.settled) continue;
        if (record.isApiErrorMessage === true) {
          const failure = textContent(record.message.content) ?? record.error ?? "Claude Code 请求失败";
          this.fail(emit, failure);
          continue;
        }
        for (const item of Array.isArray(record.message.content) ? record.message.content : []) {
          if (item.type === "thinking") {
            emit({ type: "activity_observed", activity: "thinking", message: "正在思考…" });
          } else if (item.type === "text" && item.text?.trim()) {
            this.latestResponse = item.text;
            emit({ type: "response_observed", response: item.text });
          } else if (item.type === "tool_use") {
            const toolName = item.name ?? "工具";
            const searching = /^(websearch|web_search)$/i.test(toolName);
            emit({
              type: "activity_observed",
              activity: searching ? "searching" : "tool_calling",
              message: `${searching ? "正在搜索" : "正在调用工具"}：${toolName}`,
            });
          }
        }
        if (record.message.stop_reason === "end_turn") this.succeed(emit, this.latestResponse);
        continue;
      }

      if (record.type === "result") {
        if (record.is_error === true) {
          const failure = record.result ?? record.error ?? "Claude Code 执行失败";
          this.fail(emit, failure);
        } else {
          this.succeed(emit, record.result ?? this.latestResponse);
        }
        continue;
      }
    }
    return events;
  }

  private fail(
    emit: (event: Omit<AgentEvent, "agentType" | "sessionId" | "source">) => void,
    failure: string,
  ): void {
    if (this.settled) return;
    this.settled = true;
    emit({ type: "task_failed", response: failure, message: failure });
  }

  private succeed(
    emit: (event: Omit<AgentEvent, "agentType" | "sessionId" | "source">) => void,
    response: string | undefined,
  ): void {
    if (this.settled) return;
    if (response === undefined || response.trim() === "") return;
    this.settled = true;
    emit({ type: "task_succeeded", response });
  }
}

export function parseClaudeJsonl(content: string, options: ClaudeParseOptions): AgentEvent[] {
  return new ClaudeJsonlParser(options).parse(content);
}

function textContent(content: string | ClaudeContent[] | undefined): string | undefined {
  if (typeof content === "string") return content.trim() === "" ? undefined : content;
  if (!Array.isArray(content)) return undefined;
  const text = content.filter((item) => item.type === "text" && item.text?.trim())
    .map((item) => item.text)
    .join("\n")
    .trim();
  return text === "" ? undefined : text;
}
