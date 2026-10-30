import type { AgentReadHost } from "../../core/agents/host.js";
import type { SourceHostKind, SourceInstance } from "../../core/agents/model.js";
import {
  isCodexSubagentMetadata,
  parseCodexSessionMetadata,
  type CodexSessionMetadata,
} from "./rollout.js";

interface IndexedSession extends CodexSessionMetadata {
  rolloutPath: string;
}

export function resolveCodexHome(host: AgentReadHost): string {
  const configured = host.environmentVariable("CODEX_HOME")?.trim();
  if (configured === undefined || configured === "") {
    return host.joinPath(host.homeDirectory(), ".codex");
  }
  if (configured === "~") return host.homeDirectory();
  if (configured.startsWith("~/")) {
    return host.joinPath(host.homeDirectory(), configured.slice(2));
  }
  return configured;
}

export class CodexSessionIndex {
  private readonly sessions = new Map<string, IndexedSession>();
  private readonly paths = new Map<string, IndexedSession>();
  readonly sessionsPath: string;

  constructor(private readonly host: AgentReadHost, readonly homePath = resolveCodexHome(host)) {
    this.sessionsPath = host.joinPath(homePath, "sessions");
  }

  async refresh(): Promise<void> {
    if (!(await this.host.pathExists(this.sessionsPath))) return;
    for (const path of await findRolloutFiles(this.sessionsPath, this.host)) {
      await this.readMetadata(path);
    }
  }

  sourceFor(sessionId: string, rolloutPath?: string): SourceInstance | undefined {
    const metadata = (rolloutPath === undefined ? undefined : this.paths.get(rolloutPath)) ??
      this.sessions.get(sessionId);
    return metadata === undefined || isCodexSubagentMetadata(metadata)
      ? undefined
      : this.sourceFrom(metadata);
  }

  async sourceForWithRefresh(sessionId: string, rolloutPath: string): Promise<SourceInstance | undefined> {
    const current = this.sourceFor(sessionId, rolloutPath);
    if (current !== undefined) return current;
    await this.readMetadata(rolloutPath);
    return this.sourceFor(sessionId, rolloutPath);
  }

  isSubagent(rolloutPath: string): boolean {
    const metadata = this.paths.get(rolloutPath);
    return metadata !== undefined && isCodexSubagentMetadata(metadata);
  }

  discoveredInstances(): SourceInstance[] {
    const instances = new Map<string, SourceInstance>();
    for (const metadata of this.sessions.values()) {
      if (isCodexSubagentMetadata(metadata)) continue;
      const instance = this.sourceFrom(metadata);
      instances.set(instance.instanceId, instance);
    }
    return [...instances.values()];
  }

  manualInstance(workspacePath: string): SourceInstance {
    return this.createSource({
      sessionId: "manual",
      cwd: workspacePath,
      source: "cli",
      originator: "codex_cli",
      rolloutPath: this.sessionsPath,
    });
  }

  private async readMetadata(rolloutPath: string): Promise<void> {
    if (this.paths.has(rolloutPath)) return;
    try {
      const content = await this.host.readTextFile(rolloutPath, 65_536);
      const metadata = parseCodexSessionMetadata(content);
      if (metadata === undefined) return;
      const indexed = { ...metadata, rolloutPath };
      this.sessions.set(metadata.sessionId, indexed);
      this.paths.set(rolloutPath, indexed);
    } catch {
      return;
    }
  }

  private sourceFrom(metadata: IndexedSession): SourceInstance {
    return this.createSource(metadata);
  }

  private createSource(metadata: IndexedSession): SourceInstance {
    const source = sourceKind(metadata);
    const workspaceName = metadata.cwd.split(/[\\/]/).filter(Boolean).at(-1) ?? metadata.cwd;
    const hostKind: SourceHostKind = source === "vscode"
      ? "vscode-workspace"
      : source === "app" ? "app" : "terminal-session";
    const appBundleId = source === "vscode"
      ? "com.microsoft.VSCode"
      : source === "app" ? "com.openai.chat" : "com.apple.Terminal";
    const displayName = source === "vscode"
      ? `Codex · ${workspaceName}`
      : source === "app" ? `Codex App · ${workspaceName}` : `Codex CLI · ${workspaceName}`;
    return {
      agentType: "codex",
      // 实例按工作区聚合（与 Codex App SQLite 源共用同一 ID），来源段只影响宿主/导航/名称。
      instanceId: `codex:${metadata.cwd}`,
      hostKind,
      displayName,
      navigation: {
        appBundleId,
        workspacePath: metadata.cwd,
      },
      dataSources: [
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
          path: metadata.rolloutPath,
          sessionId: metadata.sessionId,
        },
      ],
    };
  }
}

export async function findRolloutFiles(rootPath: string, host: AgentReadHost): Promise<string[]> {
  const results: string[] = [];
  const visit = async (path: string, depth: number): Promise<void> => {
    if (depth > 4 || !(await host.pathExists(path))) return;
    for (const entry of await host.readDirectory(path)) {
      if (entry.isDirectory) await visit(entry.path, depth + 1);
      else if (entry.name.startsWith("rollout-") && entry.name.endsWith(".jsonl")) {
        results.push(entry.path);
      }
    }
  };
  await visit(rootPath, 0);
  return results.sort((a, b) => a.localeCompare(b));
}

export function codexSessionIdFromPath(path: string): string {
  const name = path.split(/[\\/]/).at(-1) ?? path;
  return name.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i)?.[0] ??
    name.replace(/^rollout-/, "").replace(/\.jsonl$/, "");
}

export function sourceKind(metadata: CodexSessionMetadata): "vscode" | "app" | "cli" {
  const source = metadata.source.toLowerCase();
  const originator = metadata.originator.toLowerCase();
  // App-server 会被注入 CODEX_INTERNAL_ORIGINATOR_OVERRIDE=codex_vscode，
  // 因此必须先判 app/desktop，再判 vscode，否则 app 会话被误判为 VS Code。
  if (source === "app" || source === "desktop" || originator.includes("desktop")) return "app";
  if (source === "vscode" || originator.includes("vscode")) return "vscode";
  return "cli";
}
