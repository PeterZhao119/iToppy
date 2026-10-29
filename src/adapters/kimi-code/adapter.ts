import type { AgentAdapter, AgentSessionReader } from "../../core/agents/adapter.js";
import type { AgentReadHost } from "../../core/agents/host.js";
import type {
  AgentEvent,
  AgentInstance,
  AgentValidation,
} from "../../core/agents/model.js";
import { kimiCodeDescriptor } from "./descriptor.js";
import {
  KimiSessionIndex,
  resolveKimiCodeHome,
  workspaceDisplayName,
} from "./source-index.js";
import { parseWire } from "./wire.js";

class KimiSessionReader implements AgentSessionReader {
  constructor(
    private readonly instance: AgentInstance,
    private readonly host: AgentReadHost,
  ) {}

  async readEvents(): Promise<AgentEvent[]> {
    const wireFiles = await findWireFiles(this.instance.rootPath, this.host);
    const batches = await Promise.all(
      wireFiles.map(async ({ path, sessionId }) => {
        const content = await this.host.readTextFile(path);
        return parseWire(content, {
          agentType: this.instance.agentType,
          sessionId,
          workspacePath: this.instance.workspacePath,
        });
      }),
    );
    return batches.flat();
  }
}

async function directories(path: string, host: AgentReadHost) {
  if (!(await host.pathExists(path))) return [];
  return (await host.readDirectory(path)).filter((entry) => entry.isDirectory);
}

async function findWireFiles(
  rootPath: string,
  host: AgentReadHost,
): Promise<Array<{ path: string; sessionId: string }>> {
  const results: Array<{ path: string; sessionId: string }> = [];
  const visit = async (path: string, depth: number): Promise<void> => {
    if (depth > 6) return;
    const wirePath = host.joinPath(path, "wire.jsonl");
    if (await host.pathExists(wirePath)) {
      const segments = wirePath.split("/");
      const sessionId = segments.find((segment) => segment.startsWith("session_")) ??
        segments.at(-2) ?? path;
      results.push({ path: wirePath, sessionId });
    }
    for (const entry of await directories(path, host)) {
      await visit(entry.path, depth + 1);
    }
  };
  await visit(rootPath, 0);
  return results.sort((a, b) => a.path.localeCompare(b.path));
}

export class KimiCodeAdapter implements AgentAdapter {
  readonly descriptor = kimiCodeDescriptor;

  async discover(host: AgentReadHost): Promise<AgentInstance[]> {
    const homePath = resolveKimiCodeHome(host);
    const index = new KimiSessionIndex(host, homePath);
    await index.refresh();
    const sessionsPath = index.sessionsPath;
    if (!(await host.pathExists(sessionsPath))) return [];

    const instances: AgentInstance[] = [];
    for (const workspace of await directories(sessionsPath, host)) {
      const wireFiles = await findWireFiles(workspace.path, host);
      if (wireFiles.length === 0) continue;
      const sourceInstance = wireFiles
        .map(({ path, sessionId }) => index.sourceFor(sessionId, path))
        .find((source) => source !== undefined);
      const workspacePath = sourceInstance?.navigation.workspacePath;
      instances.push({
        id: sourceInstance?.instanceId ?? `${this.descriptor.id}:${workspace.name}`,
        agentType: this.descriptor.id,
        rootPath: workspace.path,
        displayName: workspacePath === undefined
          ? this.descriptor.displayName
          : `${this.descriptor.displayName} · ${workspaceDisplayName(workspacePath)}`,
        source: "auto",
        visible: false,
        monitoringEnabled: true,
        workspacePath,
      });
    }

    if (instances.length === 0) {
      instances.push({
        id: `${this.descriptor.id}:default`,
        agentType: this.descriptor.id,
        rootPath: sessionsPath,
        displayName: this.descriptor.displayName,
        source: "auto",
        visible: false,
        monitoringEnabled: true,
      });
    }
    return instances;
  }

  async validate(rootPath: string, host: AgentReadHost): Promise<AgentValidation> {
    if (!(await host.pathExists(rootPath))) {
      return { valid: false, reason: "Directory does not exist." };
    }
    const wireFiles = await findWireFiles(rootPath, host);
    return wireFiles.length > 0
      ? { valid: true }
      : { valid: false, reason: "No Kimi Wire sessions found in this directory." };
  }

  open(instance: AgentInstance, host: AgentReadHost): AgentSessionReader {
    return new KimiSessionReader(instance, host);
  }
}

export function workspaceDirectoryId(workspacePath: string, host: AgentReadHost): string {
  return host.md5(workspacePath);
}
