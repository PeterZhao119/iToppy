import type { AgentReadHost } from "../../core/agents/host.js";
import type { SourceInstance } from "../../core/agents/model.js";

interface SessionIndexEntry {
  sessionId: string;
  sessionDir: string;
  workDir: string;
}

export function resolveKimiCodeHome(host: AgentReadHost): string {
  const configured = host.environmentVariable("KIMI_CODE_HOME")?.trim();
  if (configured === undefined || configured === "") {
    return host.joinPath(host.homeDirectory(), ".kimi-code");
  }
  if (configured === "~") return host.homeDirectory();
  if (configured.startsWith("~/")) {
    return host.joinPath(host.homeDirectory(), configured.slice(2));
  }
  return configured;
}

export function workspaceDisplayName(workspacePath: string): string {
  return workspacePath.split(/[\\/]/).filter((part) => part !== "").at(-1) ?? workspacePath;
}

export class KimiSessionIndex {
  private readonly entries = new Map<string, SessionIndexEntry>();
  private readonly workspaceEntries = new Map<string, SessionIndexEntry>();
  readonly sessionsPath: string;
  private readonly indexPath: string;

  constructor(private readonly host: AgentReadHost, readonly homePath = resolveKimiCodeHome(host)) {
    this.sessionsPath = host.joinPath(homePath, "sessions");
    this.indexPath = host.joinPath(homePath, "session_index.jsonl");
  }

  async refresh(): Promise<void> {
    if (!(await this.host.pathExists(this.indexPath))) return;
    const content = await this.host.readTextFile(this.indexPath);
    for (const line of content.split(/\r?\n/)) {
      if (line.trim() === "") continue;
      try {
        const entry = JSON.parse(line) as Partial<SessionIndexEntry>;
        if (
          typeof entry.sessionId !== "string" ||
          typeof entry.sessionDir !== "string" ||
          typeof entry.workDir !== "string"
        ) continue;
        const normalized = {
          sessionId: entry.sessionId,
          sessionDir: entry.sessionDir,
          workDir: entry.workDir,
        };
        this.entries.set(entry.sessionId, normalized);
        const workDirKey = workDirKeyFromPath(entry.sessionDir);
        if (workDirKey !== undefined) this.workspaceEntries.set(workDirKey, normalized);
      } catch {
        continue;
      }
    }
  }

  sourceFor(sessionId: string, wirePath?: string): SourceInstance | undefined {
    let entry = this.entries.get(sessionId);
    if (entry === undefined && wirePath !== undefined) {
      const workDirKey = workDirKeyFromPath(wirePath);
      const workspace = workDirKey === undefined ? undefined : this.workspaceEntries.get(workDirKey);
      if (workspace !== undefined) {
        entry = { sessionId, sessionDir: workspace.sessionDir, workDir: workspace.workDir };
      }
    }
    if (entry === undefined) return undefined;
    const dataSources: SourceInstance["dataSources"] = [
      {
        scope: "agent",
        kind: "directory",
        role: "session-root",
        path: this.sessionsPath,
      },
      {
        scope: "session",
        kind: "file",
        role: "transcript",
        path: wirePath ?? this.host.joinPath(entry.sessionDir, "agents", "main", "wire.jsonl"),
        sessionId,
      },
    ];
    return {
      agentType: "kimi-code",
      instanceId: `vscode:${entry.workDir}`,
      hostKind: "vscode-workspace",
      displayName: `Kimi Code · ${workspaceDisplayName(entry.workDir)}`,
      navigation: {
        appBundleId: "com.microsoft.VSCode",
        workspacePath: entry.workDir,
      },
      dataSources,
    };
  }

  async sourceForWithRefresh(sessionId: string, wirePath?: string): Promise<SourceInstance | undefined> {
    const current = this.sourceFor(sessionId, wirePath);
    if (current !== undefined) return current;
    await this.refresh();
    return this.sourceFor(sessionId, wirePath);
  }

  discoveredInstances(): SourceInstance[] {
    const instances = new Map<string, SourceInstance>();
    for (const entry of this.entries.values()) {
      const instance = this.sourceFor(entry.sessionId);
      if (instance !== undefined) instances.set(instance.instanceId, instance);
    }
    return [...instances.values()];
  }

  manualInstance(workspacePath: string): SourceInstance {
    return {
      agentType: "kimi-code",
      instanceId: `vscode:${workspacePath}`,
      hostKind: "vscode-workspace",
      displayName: `Kimi Code · ${workspaceDisplayName(workspacePath)}`,
      navigation: {
        appBundleId: "com.microsoft.VSCode",
        workspacePath,
      },
      dataSources: [{
        scope: "agent",
        kind: "directory",
        role: "session-root",
        path: this.sessionsPath,
      }],
    };
  }
}

function workDirKeyFromPath(path: string): string | undefined {
  return path.split(/[\\/]/).find((segment) => segment.startsWith("wd_"));
}
