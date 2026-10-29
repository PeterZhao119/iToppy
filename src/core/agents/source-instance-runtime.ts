import type {
  AgentEvent,
  InstanceSettings,
  InstanceSettingsOverride,
  SourceInstance,
  SourceInstanceSnapshot,
} from "./model.js";
import { SessionAggregator } from "./session-aggregator.js";
import {
  defaultAppSettings,
  normalizeSettings,
  type AppSettings,
  type InstancePreferences,
} from "../settings.js";

interface InstanceRecord {
  instance: SourceInstance;
  aggregator: SessionAggregator;
  visible: boolean;
  monitoringEnabled: boolean;
  hasActivity: boolean;
  settingsOverride: InstanceSettingsOverride;
}

export const defaultInstanceSettings: InstanceSettings = {
  characterId: "deepseek",
  walkEnabled: true,
  walkSpeed: "standard",
  resultBubbleEnabled: true,
  alwaysOnTop: true,
};

export class SourceInstanceRuntime {
  private readonly instances = new Map<string, InstanceRecord>();
  private readonly pendingEvents: AgentEvent[] = [];
  private settings: AppSettings;

  constructor(private readonly appDefaults: InstanceSettings = defaultInstanceSettings) {
    this.settings = normalizeSettings({
      ...defaultAppSettings,
      defaultCharacterId: appDefaults.characterId,
      walkEnabled: appDefaults.walkEnabled,
      walkSpeed: appDefaults.walkSpeed,
      resultBubbleEnabled: appDefaults.resultBubbleEnabled,
      alwaysOnTop: appDefaults.alwaysOnTop,
    });
  }

  configure(settings: AppSettings): void {
    this.settings = normalizeSettings(settings);
    for (const record of this.instances.values()) {
      const preferences = this.preferences(record.instance.instanceId);
      record.settingsOverride = settingsOverride(preferences);
      const agentEnabled = this.settings.agents[record.instance.agentType]?.enabled ?? true;
      record.monitoringEnabled = agentEnabled && preferences.monitoringEnabled !== false;
      if (!record.monitoringEnabled || preferences.visible === false) record.visible = false;
      if (record.monitoringEnabled && preferences.visible === true && !record.visible) {
        record.hasActivity = true;
        this.requestVisible(record);
      }
    }
    this.enforceVisibleLimit();
  }

  register(instance: SourceInstance): SourceInstanceSnapshot {
    const record = this.instances.get(instance.instanceId) ?? this.createRecord(instance);
    record.instance = instance;
    const preferences = this.preferences(instance.instanceId);
    record.settingsOverride = settingsOverride(preferences);
    const agentEnabled = this.settings.agents[instance.agentType]?.enabled ?? true;
    record.monitoringEnabled = agentEnabled && preferences.monitoringEnabled !== false;
    if (!record.monitoringEnabled) record.visible = false;
    this.replayPending(record);
    this.enforceVisibleLimit();
    return this.snapshot(record);
  }

  apply(event: AgentEvent): SourceInstanceSnapshot | undefined {
    const instanceId = event.instanceId ?? event.sourceInstance?.instanceId;
    if (instanceId === undefined || event.sourceInstance === undefined) {
      this.rememberPending(event);
      return undefined;
    }

    const record = this.instances.get(instanceId) ?? this.createRecord(event.sourceInstance);
    record.instance = event.sourceInstance;
    if (!record.monitoringEnabled) return this.snapshot(record);

    this.replayPending(record);
    if (event.type === "task_submitted") {
      record.hasActivity = true;
      if (this.settings.autoShowNewTasks) this.requestVisible(record);
    }
    record.aggregator.apply(event, event.occurredAt ?? Date.now());
    return this.snapshot(record);
  }

  hide(instanceId: string): SourceInstanceSnapshot | undefined {
    const record = this.instances.get(instanceId);
    if (record === undefined) return undefined;
    record.visible = false;
    record.monitoringEnabled = false;
    return this.snapshot(record);
  }

  show(instanceId: string): SourceInstanceSnapshot | undefined {
    const record = this.instances.get(instanceId);
    if (record === undefined) return undefined;
    record.hasActivity = true;
    record.monitoringEnabled = true;
    this.requestVisible(record);
    this.enforceVisibleLimit();
    return this.snapshot(record);
  }

  updateSettings(
    instanceId: string,
    override: InstanceSettingsOverride,
  ): SourceInstanceSnapshot | undefined {
    const record = this.instances.get(instanceId);
    if (record === undefined) return undefined;
    record.settingsOverride = { ...record.settingsOverride, ...override };
    return this.snapshot(record);
  }

  snapshots(includeHidden = false): SourceInstanceSnapshot[] {
    return [...this.instances.values()]
      .filter((record) => includeHidden || record.visible)
      .map((record) => this.snapshot(record))
      .sort((a, b) => a.instance.displayName.localeCompare(b.instance.displayName));
  }

  pendingCount(): number {
    return this.pendingEvents.length;
  }

  isMonitoring(instanceId: string): boolean {
    return this.instances.get(instanceId)?.monitoringEnabled ?? true;
  }

  private createRecord(instance: SourceInstance): InstanceRecord {
    const preferences = this.preferences(instance.instanceId);
    const agentEnabled = this.settings.agents[instance.agentType]?.enabled ?? true;
    const record: InstanceRecord = {
      instance,
      aggregator: new SessionAggregator(),
      visible: false,
      monitoringEnabled: agentEnabled && preferences.monitoringEnabled !== false,
      hasActivity: false,
      settingsOverride: settingsOverride(preferences),
    };
    this.instances.set(instance.instanceId, record);
    return record;
  }

  private requestVisible(record: InstanceRecord): void {
    if (!record.monitoringEnabled) return;
    if (record.visible) return;
    const visibleCount = [...this.instances.values()].filter((item) => item.visible).length;
    record.visible = visibleCount < this.settings.visibleLimit;
  }

  private enforceVisibleLimit(): void {
    let remaining = this.settings.visibleLimit;
    for (const record of this.instances.values()) {
      if (!record.visible) continue;
      if (remaining > 0 && record.monitoringEnabled) remaining -= 1;
      else record.visible = false;
    }
  }

  private preferences(instanceId: string): InstancePreferences {
    return this.settings.instances[instanceId] ?? {};
  }

  private snapshot(record: InstanceRecord): SourceInstanceSnapshot {
    const agent = this.settings.agents[record.instance.agentType];
    const agentDefaults: InstanceSettingsOverride = {
      characterId: agent?.characterIdOverride,
      walkEnabled: agent?.walkEnabledOverride,
      walkSpeed: agent?.walkSpeedOverride,
      resultBubbleEnabled: agent?.resultBubbleEnabledOverride,
      alwaysOnTop: agent?.alwaysOnTopOverride,
    };
    const definedAgentDefaults = Object.fromEntries(
      Object.entries(agentDefaults).filter(([, value]) => value !== undefined && value !== null),
    ) as InstanceSettingsOverride;
    const displayStatus = record.visible
      ? "visible"
      : !record.monitoringEnabled
        ? "hidden"
        : record.hasActivity ? "overflow" : "candidate";
    return {
      instance: record.instance,
      primary: record.aggregator.primary(),
      runningCount: record.aggregator.runningCount(),
      sessionCount: record.aggregator.sessionCount(),
      visible: record.visible,
      monitoringEnabled: record.monitoringEnabled,
      displayStatus,
      settings: {
        ...this.appDefaults,
        characterId: this.settings.defaultCharacterId,
        walkEnabled: this.settings.walkEnabled,
        walkSpeed: this.settings.walkSpeed,
        resultBubbleEnabled: this.settings.resultBubbleEnabled,
        alwaysOnTop: this.settings.alwaysOnTop,
        ...definedAgentDefaults,
        ...record.settingsOverride,
      },
    };
  }

  private rememberPending(event: AgentEvent): void {
    this.pendingEvents.push(event);
    if (this.pendingEvents.length > 100) this.pendingEvents.shift();
  }

  private replayPending(record: InstanceRecord): void {
    if (!record.monitoringEnabled) return;
    const replay = this.pendingEvents.filter((pending) =>
      pending.instanceId === record.instance.instanceId ||
      pending.sourceInstance?.instanceId === record.instance.instanceId ||
      record.instance.dataSources.some((source) => source.sessionId === pending.sessionId)
    );
    if (replay.length === 0) return;

    for (let index = this.pendingEvents.length - 1; index >= 0; index -= 1) {
      const pending = this.pendingEvents[index];
      if (pending !== undefined && replay.includes(pending)) this.pendingEvents.splice(index, 1);
    }
    for (const pending of replay) {
      if (pending.type === "task_submitted") {
        record.hasActivity = true;
        if (this.settings.autoShowNewTasks) this.requestVisible(record);
      }
      record.aggregator.apply(pending, pending.occurredAt ?? Date.now());
    }
  }
}

function settingsOverride(preferences: InstancePreferences): InstanceSettingsOverride {
  return Object.fromEntries(Object.entries({
    characterId: preferences.characterIdOverride,
    walkEnabled: preferences.walkEnabledOverride,
    walkSpeed: preferences.walkSpeedOverride,
    resultBubbleEnabled: preferences.resultBubbleEnabledOverride,
    alwaysOnTop: preferences.alwaysOnTopOverride,
  }).filter(([, value]) => value !== undefined && value !== null)) as InstanceSettingsOverride;
}
