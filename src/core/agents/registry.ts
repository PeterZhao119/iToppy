import { ExtensionRegistry } from "../registry.js";
import type { AgentAdapter } from "./adapter.js";

export class AgentRegistry extends ExtensionRegistry<AgentAdapter> {
  registerAdapter(adapter: AgentAdapter, options: { override?: boolean } = {}): void {
    this.register(adapter.descriptor.id, adapter, options);
  }
}
