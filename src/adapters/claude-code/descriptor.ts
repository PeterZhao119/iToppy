import type { AgentDescriptor } from "../../core/agents/model.js";

export const claudeCodeDescriptor: AgentDescriptor = {
  id: "claude-code",
  displayName: "Claude Code",
  defaultPaths: [".claude/projects"],
  capabilities: {
    failure: true,
    interruption: true,
    latestResponse: true,
    sourceWorkspace: true,
  },
};
