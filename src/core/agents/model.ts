export type TaskState =
  | "idle"
  | "running"
  | "succeeded"
  | "failed"
  | "succeeded_idle"
  | "failed_idle";

export type RunningActivity = "generic" | "thinking" | "tool_calling" | "searching";
export type MonitorHealth = "healthy" | "degraded";

export interface AgentCapabilities {
  failure: boolean;
  interruption: boolean;
  latestResponse: boolean;
  sourceWorkspace: boolean;
}

export interface AgentDescriptor {
  id: string;
  displayName: string;
  identityIcon?: string;
  defaultPaths: string[];
  capabilities: AgentCapabilities;
}

export interface AgentInstance {
  id: string;
  agentType: string;
  rootPath: string;
  displayName: string;
  source: "auto" | "manual";
  visible: boolean;
  monitoringEnabled: boolean;
  workspacePath?: string;
}

export type SourceHostKind = "vscode-workspace" | "terminal-session" | "app" | "manual";
export type DataSourceScope = "agent" | "workspace" | "session" | "app-log";
export type DataSourceKind = "directory" | "file" | "database";
export type DataSourceRole = "session-root" | "transcript" | "diagnostic" | "state";
export type WalkSpeed = "slow" | "standard" | "fast";

export interface NavigationTarget {
  appBundleId: string;
  workspacePath?: string;
  terminalSessionId?: string;
  processId?: number;
  windowId?: string;
}

export interface DataSource {
  scope: DataSourceScope;
  kind: DataSourceKind;
  role: DataSourceRole;
  path: string;
  sessionId?: string;
}

export interface SourceInstance {
  agentType: string;
  instanceId: string;
  hostKind: SourceHostKind;
  displayName: string;
  navigation: NavigationTarget;
  dataSources: DataSource[];
}

export interface InstanceSettings {
  characterId: string;
  walkEnabled: boolean;
  walkSpeed: WalkSpeed;
  resultBubbleEnabled: boolean;
  alwaysOnTop: boolean;
}

export type InstanceSettingsOverride = Partial<InstanceSettings>;

export interface AgentSource {
  framework: string;
  sessionId: string;
  workspacePath?: string;
  appBundleId?: string;
  processId?: number;
}

export type AgentEventType =
  | "task_submitted"
  | "activity_observed"
  | "response_observed"
  | "task_succeeded"
  | "task_failed"
  | "task_interrupted"
  | "result_settled"
  | "source_updated"
  | "monitor_degraded"
  | "monitor_recovered";

export interface AgentEvent {
  type: AgentEventType;
  agentType: string;
  sessionId: string;
  instanceId?: string;
  sourceInstance?: SourceInstance;
  activity?: RunningActivity;
  response?: string;
  message?: string;
  source?: AgentSource;
  occurredAt?: number;
}

export interface TaskSnapshot {
  sessionId: string;
  state: TaskState;
  activity: RunningActivity;
  statusMessage?: string;
  latestResponse?: string;
  monitorHealth: MonitorHealth;
  monitorMessage?: string;
  source?: AgentSource;
}

export type InstanceDisplayStatus = "candidate" | "visible" | "overflow" | "hidden";

export interface SourceInstanceSnapshot {
  instance: SourceInstance;
  primary?: TaskSnapshot;
  runningCount: number;
  sessionCount: number;
  visible: boolean;
  monitoringEnabled: boolean;
  displayStatus: InstanceDisplayStatus;
  settings: InstanceSettings;
}

export interface AgentValidation {
  valid: boolean;
  reason?: string;
}
