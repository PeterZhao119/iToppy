import type { WalkSpeed } from "./agents/model.js";

export interface PetPosition {
  x: number;
  y: number;
}

export interface AgentSettings {
  enabled: boolean;
  characterIdOverride?: string;
  walkEnabledOverride?: boolean;
  walkSpeedOverride?: WalkSpeed;
  resultBubbleEnabledOverride?: boolean;
  alwaysOnTopOverride?: boolean;
}

export interface InstancePreferences {
  characterIdOverride?: string;
  walkEnabledOverride?: boolean;
  walkSpeedOverride?: WalkSpeed;
  resultBubbleEnabledOverride?: boolean;
  alwaysOnTopOverride?: boolean;
  visible?: boolean;
  monitoringEnabled?: boolean;
  position?: PetPosition;
}

export interface ManualInstance {
  agentType: "kimi-code" | "codex" | "claude-code";
  workspacePath: string;
}

export interface AppSettings {
  version: 1;
  visibleLimit: number;
  defaultCharacterId: string;
  walkEnabled: boolean;
  walkSpeed: WalkSpeed;
  resultBubbleEnabled: boolean;
  alwaysOnTop: boolean;
  autoShowNewTasks: boolean;
  agents: Record<string, AgentSettings>;
  instances: Record<string, InstancePreferences>;
  manualInstances: ManualInstance[];
}

export interface AppSettingsPatch {
  visibleLimit?: number;
  defaultCharacterId?: string;
  walkEnabled?: boolean;
  walkSpeed?: WalkSpeed;
  resultBubbleEnabled?: boolean;
  alwaysOnTop?: boolean;
  autoShowNewTasks?: boolean;
  agents?: Record<string, AgentSettings>;
}

export const defaultAppSettings: AppSettings = {
  version: 1,
  visibleLimit: 5,
  defaultCharacterId: "deepseek",
  walkEnabled: true,
  walkSpeed: "standard",
  resultBubbleEnabled: true,
  alwaysOnTop: true,
  autoShowNewTasks: true,
  agents: {
    "kimi-code": { enabled: true, characterIdOverride: "kimi" },
    codex: { enabled: true, characterIdOverride: "gpt" },
    "claude-code": { enabled: true, characterIdOverride: "claude" },
  },
  instances: {},
  manualInstances: [],
};

export function normalizeSettings(settings: AppSettings): AppSettings {
  return {
    ...defaultAppSettings,
    ...settings,
    version: 1,
    visibleLimit: Math.min(50, Math.max(1, Math.round(settings.visibleLimit || 5))),
    defaultCharacterId: settings.defaultCharacterId ?? defaultAppSettings.defaultCharacterId,
    walkEnabled: settings.walkEnabled ?? defaultAppSettings.walkEnabled,
    walkSpeed: settings.walkSpeed ?? defaultAppSettings.walkSpeed,
    resultBubbleEnabled: settings.resultBubbleEnabled ?? defaultAppSettings.resultBubbleEnabled,
    alwaysOnTop: settings.alwaysOnTop ?? defaultAppSettings.alwaysOnTop,
    autoShowNewTasks: settings.autoShowNewTasks ?? defaultAppSettings.autoShowNewTasks,
    agents: { ...defaultAppSettings.agents, ...settings.agents },
    instances: settings.instances ?? {},
    manualInstances: settings.manualInstances ?? [],
  };
}
