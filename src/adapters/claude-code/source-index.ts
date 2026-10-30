import type { AgentReadHost } from "../../core/agents/host.js";
import type { SourceHostKind, SourceInstance } from "../../core/agents/model.js";
import { parseClaudeSessionMetadata, type ClaudeSessionMetadata } from "./jsonl.js";

interface IndexedSession extends ClaudeSessionMetadata {
  transcriptPath: string;
}

export function resolveClaudeHome(host: AgentReadHost): string {
  const configured = host.environmentVariable("CLAUDE_CONFIG_DIR")?.trim();
  if (configured === undefined || configured === "") {
    return host.joinPath(host.homeDirectory(), ".claude");
  }
  if (configured === "~") return host.homeDirectory();
  if (configured.startsWith("~/")) {
    return host.joinPath(host.homeDirectory(), configured.slice(2));
  }
  return configured;
}

export class ClaudeSessionIndex {
  private readonly sessions = new Map<string, IndexedSession>();
  private readonly paths = new Map<string, IndexedSession>();
  readonly projectsPath: string;

  constructor(private readonly host: AgentReadHost, readonly homePath = resolveClaudeHome(host)) {
    this.projectsPath = host.joinPath(homePath, "projects");
  }

  async refresh(): Promise<void> {
    if (!(await this.host.pathExists(this.projectsPath))) return;
    for (const path of await findClaudeTranscripts(this.projectsPath, this.host)) {
      await this.readMetadata(path);
    }
  }

  sourceFor(sessionId: string, transcriptPath?: string): SourceInstance | undefined {
    const metadata = (transcriptPath === undefined ? undefined : this.paths.get(transcriptPath)) ??
      this.sessions.get(sessionId);
    return metadata === undefined ? undefined : this.createSource(metadata);
  }

  async sourceForWithRefresh(sessionId: string, transcriptPath: string): Promise<SourceInstance | undefined> {
    const current = this.sourceFor(sessionId, transcriptPath);
    if (current !== undefined) return current;
    await this.readMetadata(transcriptPath);
    return this.sourceFor(sessionId, transcriptPath);
  }

  discoveredInstances(): SourceInstance[] {
    const instances = new Map<string, SourceInstance>();
    for (const metadata of this.sessions.values()) {
      const instance = this.createSource(metadata);
      instances.set(instance.instanceId, instance);
    }
    return [...instances.values()];
  }

  manualInstance(workspacePath: string): SourceInstance {
    return this.createSource({
      sessionId: "manual",
      cwd: workspacePath,
      entrypoint: "cli",
      transcriptPath: this.projectsPath,
    });
  }

  private async readMetadata(transcriptPath: string): Promise<void> {
    if (this.paths.has(transcriptPath)) return;
    try {
      const content = await this.host.readTextFile(transcriptPath, 65_536);
      const metadata = parseClaudeSessionMetadata(content);
      if (metadata === undefined) return;
      const indexed = { ...metadata, transcriptPath };
      this.sessions.set(metadata.sessionId, indexed);
      this.paths.set(transcriptPath, indexed);
    } catch {
      return;
    }
  }

  private createSource(metadata: IndexedSession): SourceInstance {
    const source = sourceKind(metadata.entrypoint);
    const workspaceName = metadata.cwd.split(/[\\/]/).filter(Boolean).at(-1) ?? metadata.cwd;
    const hostKind: SourceHostKind = source === "vscode"
      ? "vscode-workspace"
      : source === "app" ? "app" : "terminal-session";
    const appBundleId = source === "vscode"
      ? "com.microsoft.VSCode"
      : source === "app" ? "com.anthropic.claudefordesktop" : "com.apple.Terminal";
    const displayName = source === "vscode"
      ? `Claude Code · ${workspaceName}`
      : source === "app" ? `Claude App · ${workspaceName}` : `Claude CLI · ${workspaceName}`;
    return {
      agentType: "claude-code",
      instanceId: `claude-code:${source}:${metadata.cwd}`,
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
          path: this.projectsPath,
        },
        {
          scope: "session",
          kind: "file",
          role: "transcript",
          path: metadata.transcriptPath,
          sessionId: metadata.sessionId,
        },
      ],
    };
  }
}

export async function findClaudeTranscripts(rootPath: string, host: AgentReadHost): Promise<string[]> {
  const results: string[] = [];
  if (!(await host.pathExists(rootPath))) return results;
  for (const project of await host.readDirectory(rootPath)) {
    if (!project.isDirectory) continue;
    for (const entry of await host.readDirectory(project.path)) {
      if (!entry.isDirectory && /^[0-9a-f-]{36}\.jsonl$/i.test(entry.name)) results.push(entry.path);
    }
  }
  return results.sort((a, b) => a.localeCompare(b));
}

export function claudeSessionIdFromPath(path: string): string {
  return (path.split(/[\\/]/).at(-1) ?? path).replace(/\.jsonl$/, "");
}

function sourceKind(entrypoint: string): "vscode" | "app" | "cli" {
  const normalized = entrypoint.toLowerCase();
  if (normalized.includes("vscode") || normalized.includes("ide")) return "vscode";
  if (normalized.includes("desktop")) return "app";
  return "cli";
}
