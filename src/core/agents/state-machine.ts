import type { AgentEvent, AgentSource, TaskSnapshot } from "./model.js";

export function initialTaskSnapshot(sessionId: string, source?: AgentSource): TaskSnapshot {
  return {
    sessionId,
    state: "idle",
    activity: "generic",
    monitorHealth: "healthy",
    source,
  };
}

export function reduceTaskSnapshot(snapshot: TaskSnapshot, event: AgentEvent): TaskSnapshot {
  switch (event.type) {
    case "task_submitted":
      return {
        ...snapshot,
        state: "running",
        activity: "generic",
        statusMessage: event.message ?? "开始处理任务",
        latestResponse: undefined,
        monitorHealth: "healthy",
        monitorMessage: undefined,
      };
    case "activity_observed":
      return snapshot.state === "running" && event.activity !== undefined
        ? {
            ...snapshot,
            activity: event.activity,
            statusMessage: event.message ?? snapshot.statusMessage,
          }
        : snapshot;
    case "response_observed":
      return snapshot.state === "running" && event.response !== undefined
        ? { ...snapshot, latestResponse: event.response, statusMessage: event.response }
        : snapshot;
    case "task_succeeded":
      return snapshot.state === "running"
        ? {
            ...snapshot,
            state: "succeeded",
            latestResponse: event.response ?? snapshot.latestResponse,
          }
        : snapshot;
    case "task_failed":
      return snapshot.state === "running"
        ? {
            ...snapshot,
            state: "failed",
            latestResponse: event.response ?? snapshot.latestResponse,
            monitorMessage: event.message,
          }
        : snapshot;
    case "task_interrupted":
      return snapshot.state === "running"
        ? {
            ...snapshot,
            state: "idle",
            activity: "generic",
            statusMessage: undefined,
            latestResponse: undefined,
          }
        : snapshot;
    case "result_settled":
      if (snapshot.state === "succeeded") return { ...snapshot, state: "succeeded_idle" };
      if (snapshot.state === "failed") return { ...snapshot, state: "failed_idle" };
      return snapshot;
    case "source_updated":
      return { ...snapshot, source: event.source ?? snapshot.source };
    case "monitor_degraded":
      return { ...snapshot, monitorHealth: "degraded", monitorMessage: event.message };
    case "monitor_recovered":
      return { ...snapshot, monitorHealth: "healthy", monitorMessage: undefined };
  }
}
