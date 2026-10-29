import type { AgentDescriptor } from "../../core/agents/model.js";

export const codexDescriptor: AgentDescriptor = {
  id: "codex",
  displayName: "Codex",
  defaultPaths: [".codex/sessions"],
  capabilities: {
    failure: true,
    interruption: true,
    latestResponse: true,
    sourceWorkspace: true,
  },
};
