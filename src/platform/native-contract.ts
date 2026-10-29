import type {
  InstanceDisplayStatus,
  InstanceSettings,
  MonitorHealth,
  SourceInstance,
  SourceInstanceSnapshot,
  TaskState,
} from "../core/agents/model.js";

export interface NativeInstanceState {
  instance: SourceInstance;
  primaryState?: TaskState;
  hasResult: boolean;
  runningCount: number;
  sessionCount: number;
  visible: boolean;
  monitoringEnabled: boolean;
  displayStatus: InstanceDisplayStatus;
  settings: InstanceSettings;
  monitorHealth?: MonitorHealth;
  monitorMessage?: string;
}

export interface NativeRuntimeState {
  instances: NativeInstanceState[];
  pendingCount: number;
  monitorError?: string;
  settingsPath: string;
}

export interface InstanceAction {
  instanceId: string;
  action: "open-latest" | "rescan";
}

export function nativeInstanceFromSnapshot(snapshot: SourceInstanceSnapshot): NativeInstanceState {
  return {
    instance: snapshot.instance,
    primaryState: snapshot.primary?.state,
    hasResult: ["succeeded", "failed", "succeeded_idle", "failed_idle"].includes(snapshot.primary?.state ?? ""),
    runningCount: snapshot.runningCount,
    sessionCount: snapshot.sessionCount,
    visible: snapshot.visible ?? false,
    monitoringEnabled: snapshot.monitoringEnabled ?? false,
    displayStatus: snapshot.displayStatus ?? (snapshot.visible ? "visible" : "hidden"),
    settings: {
      characterId: snapshot.settings.characterId ?? "deepseek",
      walkEnabled: snapshot.settings.walkEnabled ?? true,
      walkSpeed: snapshot.settings.walkSpeed ?? "standard",
      resultBubbleEnabled: snapshot.settings.resultBubbleEnabled ?? true,
      alwaysOnTop: snapshot.settings.alwaysOnTop ?? true,
    },
    monitorHealth: snapshot.primary?.monitorHealth,
    monitorMessage: snapshot.primary?.monitorMessage,
  };
}
