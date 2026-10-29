import type {
  AgentEvent,
  InstanceSettings,
  InstanceSettingsOverride,
  SourceInstance,
  SourceInstanceSnapshot,
} from "./model.js";
import { SessionAggregator } from "./session-aggregator.js";

interface InstanceRecord {
  instance: SourceInstance;
  aggregator: SessionAggregator;
  visible: boolean;
  monitoringEnabled: boolean;
  settingsOverride: InstanceSettingsOverride;
}

export const defaultInstanceSettings: InstanceSettings = {
  characterId: "deepseek",
  walkEnabled: true,
  walkSpeed: "standard",
  resultBubbleEnabled: true,
};

export class SourceInstanceRuntime {
  private readonly instances = new Map<string, InstanceRecord>();
  private readonly pendingEvents: AgentEvent[] = [];

  constructor(private readonly appDefaults: InstanceSettings = defaultInstanceSettings) {}

  apply(event: AgentEvent): SourceInstanceSnapshot | undefined {
    const instanceId = event.instanceId ?? event.sourceInstance?.instanceId;
    if (instanceId === undefined || event.sourceInstance === undefined) {
      this.rememberPending(event);
      return undefined;
    }

    const record = this.instances.get(instanceId) ?? this.createRecord(event.sourceInstance);
    if (!record.monitoringEnabled) return this.snapshot(record);

    this.replayPending(record);
    if (event.type === "task_submitted") record.visible = true;
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
    record.visible = true;
    record.monitoringEnabled = true;
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

  private createRecord(instance: SourceInstance): InstanceRecord {
    const record: InstanceRecord = {
      instance,
      aggregator: new SessionAggregator(),
      visible: false,
      monitoringEnabled: true,
      settingsOverride: {},
    };
    this.instances.set(instance.instanceId, record);
    return record;
  }

  private snapshot(record: InstanceRecord): SourceInstanceSnapshot {
    return {
      instance: record.instance,
      primary: record.aggregator.primary(),
      runningCount: record.aggregator.runningCount(),
      sessionCount: record.aggregator.sessionCount(),
      visible: record.visible,
      monitoringEnabled: record.monitoringEnabled,
      settings: { ...this.appDefaults, ...record.settingsOverride },
    };
  }

  private rememberPending(event: AgentEvent): void {
    this.pendingEvents.push(event);
    if (this.pendingEvents.length > 100) this.pendingEvents.shift();
  }

  private replayPending(record: InstanceRecord): void {
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
      if (pending.type === "task_submitted") record.visible = true;
      record.aggregator.apply(pending, pending.occurredAt ?? Date.now());
    }
  }
}
