import type { AgentDescriptor } from "../../core/agents/model.js";

export const kimiCodeDescriptor: AgentDescriptor = {
  id: "kimi-code",
  displayName: "Kimi Code",
  defaultPaths: [
    "Library/Application Support/Code/User/globalStorage/moonshot-ai.kimi-code",
    ".kimi-code/sessions",
  ],
  capabilities: {
    failure: false,
    interruption: true,
    latestResponse: true,
    sourceWorkspace: true,
  },
};
