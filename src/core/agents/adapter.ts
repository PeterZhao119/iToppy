import type { AgentReadHost } from "./host.js";
import type {
  AgentDescriptor,
  AgentEvent,
  AgentInstance,
  AgentValidation,
} from "./model.js";

export interface AgentSessionReader {
  readEvents(): Promise<AgentEvent[]>;
}

export interface AgentAdapter {
  readonly descriptor: AgentDescriptor;
  discover(host: AgentReadHost): Promise<AgentInstance[]>;
  validate(rootPath: string, host: AgentReadHost): Promise<AgentValidation>;
  open(instance: AgentInstance, host: AgentReadHost): AgentSessionReader;
}
