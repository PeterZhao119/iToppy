import type { AgentAdapter, AgentSessionReader } from "../../core/agents/adapter.js";
import type { AgentReadHost } from "../../core/agents/host.js";
import type { AgentEvent, AgentInstance, AgentValidation } from "../../core/agents/model.js";
import { codexDescriptor } from "./descriptor.js";
import { parseCodexRollout } from "./rollout.js";
import {
  CodexSessionIndex,
  codexSessionIdFromPath,
  findRolloutFiles,
  resolveCodexHome,
} from "./source-index.js";

class CodexSessionReader implements AgentSessionReader {
  constructor(
    private readonly instance: AgentInstance,
    private readonly host: AgentReadHost,
  ) {}

  async readEvents(): Promise<AgentEvent[]> {
    const paths = await findRolloutFiles(this.instance.rootPath, this.host);
    const batches = await Promise.all(paths.map(async (path) => {
      const content = await this.host.readTextFile(path);
      return parseCodexRollout(content, {
        agentType: this.instance.agentType,
        sessionId: codexSessionIdFromPath(path),
        workspacePath: this.instance.workspacePath,
      });
    }));
    return batches.flat();
  }
}

export class CodexAdapter implements AgentAdapter {
  readonly descriptor = codexDescriptor;

  async discover(host: AgentReadHost): Promise<AgentInstance[]> {
    const homePath = resolveCodexHome(host);
    const index = new CodexSessionIndex(host, homePath);
    await index.refresh();
    return index.discoveredInstances().map((source) => ({
      id: source.instanceId,
      agentType: this.descriptor.id,
      rootPath: index.sessionsPath,
      displayName: source.displayName,
      source: "auto",
      visible: false,
      monitoringEnabled: true,
      workspacePath: source.navigation.workspacePath,
    }));
  }

  async validate(rootPath: string, host: AgentReadHost): Promise<AgentValidation> {
    if (!(await host.pathExists(rootPath))) {
      return { valid: false, reason: "Directory does not exist." };
    }
    const paths = await findRolloutFiles(rootPath, host);
    return paths.length > 0
      ? { valid: true }
      : { valid: false, reason: "No Codex rollout sessions found in this directory." };
  }

  open(instance: AgentInstance, host: AgentReadHost): AgentSessionReader {
    return new CodexSessionReader(instance, host);
  }
}
