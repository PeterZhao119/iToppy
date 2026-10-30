import type { AgentAdapter, AgentSessionReader } from "../../core/agents/adapter.js";
import type { AgentReadHost } from "../../core/agents/host.js";
import type { AgentEvent, AgentInstance, AgentValidation } from "../../core/agents/model.js";
import { claudeCodeDescriptor } from "./descriptor.js";
import { parseClaudeJsonl } from "./jsonl.js";
import {
  ClaudeSessionIndex,
  claudeSessionIdFromPath,
  findClaudeTranscripts,
  resolveClaudeHome,
} from "./source-index.js";

class ClaudeSessionReader implements AgentSessionReader {
  constructor(
    private readonly instance: AgentInstance,
    private readonly host: AgentReadHost,
  ) {}

  async readEvents(): Promise<AgentEvent[]> {
    const paths = await findClaudeTranscripts(this.instance.rootPath, this.host);
    const batches = await Promise.all(paths.map(async (path) => {
      const content = await this.host.readTextFile(path);
      return parseClaudeJsonl(content, {
        agentType: this.instance.agentType,
        sessionId: claudeSessionIdFromPath(path),
        workspacePath: this.instance.workspacePath,
      });
    }));
    return batches.flat();
  }
}

export class ClaudeCodeAdapter implements AgentAdapter {
  readonly descriptor = claudeCodeDescriptor;

  async discover(host: AgentReadHost): Promise<AgentInstance[]> {
    const homePath = resolveClaudeHome(host);
    const index = new ClaudeSessionIndex(host, homePath);
    await index.refresh();
    return index.discoveredInstances().map((source) => ({
      id: source.instanceId,
      agentType: this.descriptor.id,
      rootPath: index.projectsPath,
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
    const paths = await findClaudeTranscripts(rootPath, host);
    return paths.length > 0
      ? { valid: true }
      : { valid: false, reason: "No Claude Code sessions found in this directory." };
  }

  open(instance: AgentInstance, host: AgentReadHost): AgentSessionReader {
    return new ClaudeSessionReader(instance, host);
  }
}
