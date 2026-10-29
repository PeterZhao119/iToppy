import type { AgentEvent, TaskSnapshot } from "./model.js";
import { initialTaskSnapshot, reduceTaskSnapshot } from "./state-machine.js";

interface SessionActivity {
  snapshot: TaskSnapshot;
  lastActivityAt: number;
}

export class SessionAggregator {
  private readonly sessions = new Map<string, SessionActivity>();

  apply(event: AgentEvent, occurredAt = Date.now()): TaskSnapshot {
    const current = this.sessions.get(event.sessionId) ?? {
      snapshot: initialTaskSnapshot(event.sessionId, event.source),
      lastActivityAt: occurredAt,
    };
    const snapshot = reduceTaskSnapshot(current.snapshot, event);
    this.sessions.set(event.sessionId, { snapshot, lastActivityAt: occurredAt });
    return snapshot;
  }

  primary(): TaskSnapshot | undefined {
    const sessions = [...this.sessions.values()];
    const running = sessions
      .filter((session) => session.snapshot.state === "running")
      .sort((a, b) => b.lastActivityAt - a.lastActivityAt);
    if (running.length > 0) return running[0]?.snapshot;

    const completed = sessions
      .filter((session) =>
        ["succeeded", "failed", "succeeded_idle", "failed_idle"].includes(session.snapshot.state),
      )
      .sort((a, b) => b.lastActivityAt - a.lastActivityAt);
    if (completed.length > 0) return completed[0]?.snapshot;

    return sessions.sort((a, b) => b.lastActivityAt - a.lastActivityAt)[0]?.snapshot;
  }

  runningCount(): number {
    return [...this.sessions.values()].filter(
      (session) => session.snapshot.state === "running",
    ).length;
  }

  sessionCount(): number {
    return this.sessions.size;
  }
}
