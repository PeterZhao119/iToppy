import type { AgentEvent, AgentSource } from "../../core/agents/model.js";

interface WireParseOptions {
  agentType: string;
  sessionId: string;
  workspacePath?: string;
}

interface WireRecord {
  type?: string;
  reason?: string;
  event?: {
    type?: string;
    part?: {
      type?: string;
      text?: string;
    };
    name?: string;
  };
  message?: {
    type?: string;
    payload?: {
      type?: string;
      text?: string;
      think?: string;
      function?: {
        name?: string;
      };
    };
  };
}

function isSearchTool(name: string): boolean {
  return name.toLowerCase().includes("search");
}

export class WireParser {
  private latestResponse: string | undefined;

  constructor(private readonly options: WireParseOptions) {}

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

      let record: WireRecord;
      try {
        record = JSON.parse(line) as WireRecord;
      } catch {
        emit({
          type: "monitor_degraded",
          message: `Session '${this.options.sessionId}' contains an invalid Wire record.`,
        });
        continue;
      }

      if (record.type === "turn.prompt") {
        this.latestResponse = undefined;
        emit({ type: "task_submitted", message: "收到任务，开始处理" });
        continue;
      }

      if (record.type === "turn.ended") {
        if (record.reason === "cancelled") {
          this.latestResponse = undefined;
          emit({ type: "task_interrupted", message: record.reason });
        } else if (record.reason === "completed" && this.latestResponse !== undefined) {
          emit({ type: "task_succeeded", response: this.latestResponse });
        } else if (record.reason === "failed" || record.reason === "error") {
          emit({ type: "task_failed", response: this.latestResponse, message: record.reason });
        } else {
          emit({
            type: "monitor_degraded",
            message: `Session '${this.options.sessionId}' ended without a verified outcome: ${record.reason ?? "unknown"}.`,
          });
        }
        continue;
      }

      if (record.type === "context.append_loop_event") {
        const loopEvent = record.event;
        if (loopEvent?.type === "content.part" && loopEvent.part?.type === "think") {
          emit({ type: "activity_observed", activity: "thinking", message: "正在思考…" });
        } else if (loopEvent?.type === "content.part" && loopEvent.part?.type === "text" && loopEvent.part.text !== undefined) {
          this.latestResponse = loopEvent.part.text;
          emit({ type: "response_observed", response: this.latestResponse });
        } else if (loopEvent?.type === "tool.call") {
          const toolName = loopEvent.name ?? "";
          const searching = isSearchTool(toolName);
          emit({
            type: "activity_observed",
            activity: searching ? "searching" : "tool_calling",
            message: toolName === ""
              ? searching ? "正在搜索…" : "正在调用工具…"
              : `${searching ? "正在搜索" : "正在调用工具"}：${toolName}`,
          });
        }
        continue;
      }

      const message = record.message;
      if (message?.type === undefined) continue;

      switch (message.type) {
        case "TurnBegin":
          this.latestResponse = undefined;
          emit({ type: "task_submitted", message: "收到任务，开始处理" });
          break;
        case "ContentPart":
          if (message.payload?.type === "think") {
            emit({ type: "activity_observed", activity: "thinking", message: "正在思考…" });
          } else if (message.payload?.type === "text" && message.payload.text !== undefined) {
            this.latestResponse = message.payload.text;
            emit({ type: "response_observed", response: this.latestResponse });
          }
          break;
        case "ToolCall": {
          const toolName = message.payload?.function?.name ?? "";
          const searching = isSearchTool(toolName);
          emit({
            type: "activity_observed",
            activity: searching ? "searching" : "tool_calling",
            message: toolName === ""
              ? searching ? "正在搜索…" : "正在调用工具…"
              : `${searching ? "正在搜索" : "正在调用工具"}：${toolName}`,
          });
          break;
        }
        case "TurnEnd":
          if (this.latestResponse === undefined) {
            emit({
              type: "monitor_degraded",
              message: `Session '${this.options.sessionId}' ended without a final response; outcome is unverified.`,
            });
          } else {
            emit({ type: "task_succeeded", response: this.latestResponse });
          }
          break;
      }
    }

    return events;
  }
}

export function parseWire(content: string, options: WireParseOptions): AgentEvent[] {
  return new WireParser(options).parse(content);
}
