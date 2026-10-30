import "./native.css";
import { invoke } from "@tauri-apps/api/core";
import { emit, listen } from "@tauri-apps/api/event";
import { getCurrentWindow, PhysicalPosition } from "@tauri-apps/api/window";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import { ClaudeJsonlParser } from "./adapters/claude-code/jsonl.js";
import { ClaudeSessionIndex, claudeSessionIdFromPath } from "./adapters/claude-code/source-index.js";
import {
  CodexAppItemsParser,
  CodexAppThreadIndex,
  codexAppThreadShadowed,
  codexRolloutFeedsSession,
  type CodexAppDbPayload,
} from "./adapters/codex/app-db.js";
import { CodexRolloutParser } from "./adapters/codex/rollout.js";
import { CodexSessionIndex, codexSessionIdFromPath } from "./adapters/codex/source-index.js";
import { KimiSessionIndex } from "./adapters/kimi-code/source-index.js";
import { WireParser } from "./adapters/kimi-code/wire.js";
import type { AgentEvent, NavigationTarget, SourceInstanceSnapshot } from "./core/agents/model.js";
import { SourceInstanceRuntime } from "./core/agents/source-instance-runtime.js";
import { normalizeSettings, type AppSettings } from "./core/settings.js";
import { loadCharacterDefinition } from "./characters/definition-loader.js";
import { SpriteRenderer } from "./characters/sprite-renderer.js";
import { TauriReadHost } from "./platform/tauri-read-host.js";
import { nativeInstanceFromSnapshot } from "./platform/native-contract.js";
import type { InstanceAction, NativeRuntimeState } from "./platform/native-contract.js";
import { PetView, type OffsetBounds } from "./ui/pet-view.js";

interface WireAppend {
  path: string;
  content: string;
}

interface ParserCursor {
  parser: { parse(content: string): AgentEvent[] };
  sourceInstance?: AgentEvent["sourceInstance"];
}

interface AppParserCursor {
  parser: CodexAppItemsParser;
  sourceInstance?: AgentEvent["sourceInstance"];
}

interface NativeDragSession {
  origin: PhysicalPosition;
  startX: number;
  startY: number;
  scale: number;
}

const appElement = document.querySelector<HTMLElement>("#app");
if (appElement === null) throw new Error("Missing #app.");
const app = appElement;
const currentWindow = getCurrentWindow();
const runtime = new SourceInstanceRuntime();
const query = new URLSearchParams(window.location.search);
let assignedInstanceId = query.get("instance");
const isMainWindow = assignedInstanceId === null;
const createdInstances = new Set<string>();
const parsers = new Map<string, ParserCursor>();
const appParsers = new Map<string, AppParserCursor>();
// 已被 rollout 管道喂过有效事件的 codex session（uuid == threads.id）；SQLite 管道对它们闭嘴。
const rolloutFedSessions = new Set<string>();
const settleTimers = new Map<string, ReturnType<typeof setTimeout>>();
let view: PetView | undefined;
let walkOrigin: PhysicalPosition | undefined;
let walkBounds: OffsetBounds | undefined;
let dragSession: NativeDragSession | undefined;
let walkScale = 1;
let lastMoveAt = 0;
let monitorError: string | undefined;
let appSettings: AppSettings;
let positionedInstanceId: string | undefined;
let positionSaveTimer: ReturnType<typeof setTimeout> | undefined;
let nativeStateVersion = 0;

const characterIds = ["deepseek", "claude", "gpt", "doubao", "qq", "kimi"] as const;
type CharacterId = (typeof characterIds)[number];
type LoadedDefinition = Awaited<ReturnType<typeof loadCharacterDefinition>>;
const [home, kimiHome, codexHome, claudeHome, loadedDefinitions, storedSettings, initialNativeState] = await Promise.all([
  invoke<string>("get_home_directory"),
  invoke<string>("get_kimi_home"),
  invoke<string>("get_codex_home"),
  invoke<string>("get_claude_home"),
  Promise.all(characterIds.map((characterId) => loadCharacterDefinition(`/asset/avatar/${characterId}/package/character.json`))),
  invoke<AppSettings>("get_settings"),
  invoke<NativeRuntimeState>("get_native_state"),
]);
const definitions = Object.fromEntries(characterIds.map((characterId, index) => [characterId, loadedDefinitions[index]])) as Record<CharacterId, LoadedDefinition>;
let currentCharacterId: CharacterId = "deepseek";
appSettings = normalizeSettings(storedSettings);
monitorError = initialNativeState.monitorError;
runtime.configure(appSettings);
const host = new TauriReadHost(home, kimiHome, codexHome, claudeHome);
const sessionIndex = new KimiSessionIndex(host, kimiHome);
const codexIndex = new CodexSessionIndex(host, codexHome);
const codexAppIndex = new CodexAppThreadIndex(host, codexHome);
const claudeIndex = new ClaudeSessionIndex(host, claudeHome);

const options = {
  onOpenTarget: (navigation: NavigationTarget) => {
    void invoke("open_navigation", { navigation }).catch(showError);
  },
  onWalkStart: () => {
    void Promise.all([
      invoke<[number, number]>("get_pet_position"),
      invoke<number>("get_scale_factor"),
      invoke<[number, number, number, number]>("get_pet_bounds"),
    ]).then(([position, scale, bounds]) => {
      walkOrigin = new PhysicalPosition(position[0], position[1]);
      walkScale = scale;
      const originX = position[0] / scale;
      const originY = position[1] / scale;
      walkBounds = {
        minX: bounds[0] / scale - originX,
        maxX: (bounds[0] + bounds[2]) / scale - originX - 220,
        minY: bounds[1] / scale - originY,
        maxY: (bounds[1] + bounds[3]) / scale - originY - 360,
      };
    }).catch(showError);
  },
  onMove: (offsetX: number, offsetY: number) => {
    if (walkOrigin === undefined || walkBounds === undefined) return;
    const now = performance.now();
    if (now - lastMoveAt < 33) return;
    lastMoveAt = now;
    const x = walkOrigin.x + offsetX * walkScale;
    const y = walkOrigin.y + offsetY * walkScale;
    void invoke("set_pet_position", { x, y }).catch(showError);
    schedulePositionSave(x / walkScale, y / walkScale);
  },
  onDragStart: (screenX: number, screenY: number) => {
    walkOrigin = undefined;
    walkBounds = undefined;
    void Promise.all([
      invoke<[number, number]>("get_pet_position"),
      invoke<number>("get_scale_factor"),
    ]).then(([position, scale]) => {
      dragSession = {
        origin: new PhysicalPosition(position[0], position[1]),
        startX: screenX,
        startY: screenY,
        scale,
      };
    }).catch(showError);
  },
  onDragEnd: () => {
    dragSession = undefined;
    void persistPosition();
  },
  getOffsetBounds: () => walkBounds,
};

window.addEventListener("pointermove", (event) => {
  if (dragSession === undefined) return;
  const x = dragSession.origin.x + (event.screenX - dragSession.startX) * dragSession.scale;
  const y = dragSession.origin.y + (event.screenY - dragSession.startY) * dragSession.scale;
  void invoke("set_pet_position", { x, y }).catch(showError);
});

function render(snapshot: SourceInstanceSnapshot): void {
  if (assignedInstanceId === null) assignedInstanceId = snapshot.instance.instanceId;
  if (snapshot.instance.instanceId !== assignedInstanceId) return;
  const characterId = resolveCharacterId(snapshot.settings.characterId);
  if (view !== undefined && currentCharacterId !== characterId) {
    view.destroy();
    view = undefined;
  }
  if (view === undefined) {
    currentCharacterId = characterId;
    view = new PetView(
      app,
      snapshot,
      definitions[characterId],
      `/asset/avatar/${characterId}/package`,
      (canvas) => new SpriteRenderer(canvas),
      options,
    );
  } else {
    view.update(snapshot);
  }
  void invoke("set_pet_always_on_top", {
    alwaysOnTop: snapshot.settings.alwaysOnTop ?? true,
  }).catch(showError);
  if (positionedInstanceId !== snapshot.instance.instanceId) {
    positionedInstanceId = snapshot.instance.instanceId;
    void restorePosition(snapshot.instance.instanceId);
  }
  void currentWindow.show();
}

function sync(): void {
  if (!isMainWindow) return;
  const allSnapshots = runtime.snapshots(true);
  const snapshots = allSnapshots.filter((snapshot) => snapshot.visible);
  if (assignedInstanceId !== null && !snapshots.some((snapshot) => snapshot.instance.instanceId === assignedInstanceId)) {
    assignedInstanceId = null;
    positionedInstanceId = undefined;
    view?.destroy();
    view = undefined;
    void currentWindow.hide();
  }
  if (assignedInstanceId === null && snapshots[0] !== undefined) {
    assignedInstanceId = snapshots[0].instance.instanceId;
  }
  if (assignedInstanceId !== null) closeSecondaryWindow(assignedInstanceId);
  for (const snapshot of snapshots) {
    const instanceId = snapshot.instance.instanceId;
    if (instanceId !== assignedInstanceId && !createdInstances.has(instanceId)) {
      createdInstances.add(instanceId);
      void createPetWindow(snapshot, createdInstances.size);
    }
  }
  for (const instanceId of [...createdInstances]) {
    if (!snapshots.some((snapshot) => snapshot.instance.instanceId === instanceId)) {
      closeSecondaryWindow(instanceId);
    }
  }
  for (const snapshot of allSnapshots) {
    void emit("pet-snapshot", snapshot);
  }
  const selected = snapshots.find((snapshot) => snapshot.instance.instanceId === assignedInstanceId);
  if (selected !== undefined) render(selected);
  void publishNativeState(allSnapshots);
}

function closeSecondaryWindow(instanceId: string): void {
  if (!createdInstances.delete(instanceId)) return;
  void invoke("close_pet_window", { label: windowLabel(instanceId) }).catch(showError);
}

async function publishNativeState(snapshots: SourceInstanceSnapshot[]): Promise<void> {
  const version = ++nativeStateVersion;
  const instances = snapshots.map(nativeInstanceFromSnapshot);
  try {
    await invoke("update_native_state", {
      instances,
      pendingCount: runtime.pendingCount(),
      monitorError,
    });
  } catch (error) {
    if (version === nativeStateVersion) showError(error);
  }
}

async function rescanInstances(): Promise<void> {
  await Promise.all([sessionIndex.refresh(), codexIndex.refresh(), claudeIndex.refresh(), codexAppIndex.refresh()]);
  for (const instance of sessionIndex.discoveredInstances()) runtime.register(instance);
  for (const instance of codexIndex.discoveredInstances()) runtime.register(instance);
  for (const instance of claudeIndex.discoveredInstances()) runtime.register(instance);
  for (const instance of codexAppIndex.discoveredInstances()) runtime.register(instance);
  for (const manual of appSettings.manualInstances) {
    if (manual.agentType === "codex") runtime.register(codexIndex.manualInstance(manual.workspacePath));
    else if (manual.agentType === "claude-code") runtime.register(claudeIndex.manualInstance(manual.workspacePath));
    else runtime.register(sessionIndex.manualInstance(manual.workspacePath));
  }
  sync();
}

function apply(event: AgentEvent): void {
  const timerKey = `${event.instanceId ?? "pending"}:${event.sessionId}`;
  if (event.type === "task_submitted" || event.type === "task_interrupted") {
    const timer = settleTimers.get(timerKey);
    if (timer !== undefined) clearTimeout(timer);
    settleTimers.delete(timerKey);
  }
  runtime.apply(event);
  if (event.type === "task_succeeded" || event.type === "task_failed") {
    settleTimers.set(timerKey, setTimeout(() => {
      settleTimers.delete(timerKey);
      runtime.apply({ ...event, type: "result_settled", occurredAt: Date.now() });
      sync();
    }, 20_000));
  }
  sync();
}

async function handleKimiAppend(payload: WireAppend): Promise<void> {
  const sessionId = sessionIdFromPath(payload.path);
  const sourceInstance = await sessionIndex.sourceForWithRefresh(sessionId, payload.path);
  if (sourceInstance !== undefined && !runtime.isMonitoring(sourceInstance.instanceId)) return;
  let cursor = parsers.get(payload.path);
  if (cursor === undefined) {
    cursor = {
      parser: new WireParser({
        agentType: "kimi-code",
        sessionId,
        workspacePath: sourceInstance?.navigation.workspacePath,
      }),
      sourceInstance,
    };
    parsers.set(payload.path, cursor);
  }
  applyParsedEvents(payload.content, cursor, sourceInstance);
}

async function handleCodexAppend(payload: WireAppend): Promise<void> {
  const sessionId = codexSessionIdFromPath(payload.path);
  const sourceInstance = await codexIndex.sourceForWithRefresh(sessionId, payload.path);
  if (codexIndex.isSubagent(payload.path)) return;
  if (sourceInstance !== undefined && !runtime.isMonitoring(sourceInstance.instanceId)) return;
  let cursor = parsers.get(payload.path);
  if (cursor === undefined) {
    cursor = {
      parser: new CodexRolloutParser({
        agentType: "codex",
        sessionId,
        workspacePath: sourceInstance?.navigation.workspacePath,
      }),
      sourceInstance,
    };
    parsers.set(payload.path, cursor);
  }
  if (sourceInstance !== undefined) cursor.sourceInstance = sourceInstance;
  const events = cursor.parser.parse(payload.content);
  if (codexRolloutFeedsSession(events)) rolloutFedSessions.add(sessionId);
  applyAgentEvents(events, cursor);
}

async function handleClaudeAppend(payload: WireAppend): Promise<void> {
  const sessionId = claudeSessionIdFromPath(payload.path);
  const sourceInstance = await claudeIndex.sourceForWithRefresh(sessionId, payload.path);
  if (sourceInstance !== undefined && !runtime.isMonitoring(sourceInstance.instanceId)) return;
  let cursor = parsers.get(payload.path);
  if (cursor === undefined) {
    cursor = {
      parser: new ClaudeJsonlParser({
        agentType: "claude-code",
        sessionId,
        workspacePath: sourceInstance?.navigation.workspacePath,
      }),
      sourceInstance,
    };
    parsers.set(payload.path, cursor);
  }
  applyParsedEvents(payload.content, cursor, sourceInstance);
}

function applyParsedEvents(
  content: string,
  cursor: ParserCursor,
  sourceInstance: AgentEvent["sourceInstance"],
): void {
  if (sourceInstance !== undefined) cursor.sourceInstance = sourceInstance;
  applyAgentEvents(cursor.parser.parse(content), cursor);
}

function applyAgentEvents(
  events: AgentEvent[],
  cursor: { sourceInstance?: AgentEvent["sourceInstance"] },
): void {
  for (const event of events) {
    apply({
      ...event,
      instanceId: cursor.sourceInstance?.instanceId,
      sourceInstance: cursor.sourceInstance,
      occurredAt: Date.now(),
      source: event.source === undefined ? undefined : {
        ...event.source,
        workspacePath: cursor.sourceInstance?.navigation.workspacePath,
        appBundleId: cursor.sourceInstance?.navigation.appBundleId,
      },
    });
  }
}

function appParserFor(threadId: string): AppParserCursor {
  let cursor = appParsers.get(threadId);
  if (cursor === undefined) {
    const sourceInstance = codexAppIndex.sourceFor(threadId);
    cursor = {
      parser: new CodexAppItemsParser({
        agentType: "codex",
        sessionId: threadId,
        workspacePath: sourceInstance?.navigation.workspacePath,
      }),
      sourceInstance,
    };
    appParsers.set(threadId, cursor);
  }
  const sourceInstance = codexAppIndex.sourceFor(threadId);
  if (sourceInstance !== undefined) cursor.sourceInstance = sourceInstance;
  return cursor;
}

function handleCodexAppDb(payload: CodexAppDbPayload): void {
  const changedThreads = codexAppIndex.applyThreads(payload.threads);
  for (const threadId of changedThreads) {
    const instance = codexAppIndex.sourceFor(threadId);
    if (instance !== undefined) runtime.register(instance);
  }
  for (const item of payload.items) {
    // 同一会话已被 rollout 管道喂过（本机 app-server 双写形态）：SQLite 管道跳过事件转发，
    // 2026.2.6「rollout 只有 meta」形态下该 thread 不在 Set 中，SQLite 管道自然接管。
    if (codexAppThreadShadowed(rolloutFedSessions, item.thread_id)) continue;
    const cursor = appParserFor(item.thread_id);
    applyAgentEvents(cursor.parser.parseItem(item), cursor);
  }
  for (const turn of payload.turns) {
    if (codexAppThreadShadowed(rolloutFedSessions, turn.thread_id)) continue;
    const cursor = appParserFor(turn.thread_id);
    applyAgentEvents(cursor.parser.parseTurn(turn), cursor);
  }
}

app.addEventListener("contextmenu", (event) => {
  event.preventDefault();
  if (assignedInstanceId !== null) {
    void invoke("show_pet_context_menu", { instanceId: assignedInstanceId }).catch(showError);
  }
});

await listen<WireAppend>("kimi-wire", (event) => {
  if (isMainWindow) void handleKimiAppend(event.payload).catch(showError);
});
await listen<WireAppend>("codex-rollout", (event) => {
  if (isMainWindow) void handleCodexAppend(event.payload).catch(showError);
});
await listen<CodexAppDbPayload>("codex-app-db", (event) => {
  if (isMainWindow) handleCodexAppDb(event.payload);
});
await listen<WireAppend>("claude-jsonl", (event) => {
  if (isMainWindow) void handleClaudeAppend(event.payload).catch(showError);
});
await listen<string>("kimi-monitor-error", (event) => {
  monitorError = event.payload;
  showError(event.payload);
  sync();
});
await listen<string>("codex-monitor-error", (event) => {
  monitorError = event.payload;
  showError(event.payload);
  sync();
});
await listen<string>("claude-monitor-error", (event) => {
  monitorError = event.payload;
  showError(event.payload);
  sync();
});
await listen<AppSettings>("settings-changed", (event) => {
  appSettings = normalizeSettings(event.payload);
  if (isMainWindow) {
    runtime.configure(appSettings);
    void rescanInstances().catch(showError);
  }
});
await listen<SourceInstanceSnapshot>("pet-snapshot", (event) => {
  if (isMainWindow || event.payload.instance.instanceId !== assignedInstanceId) return;
  if (event.payload.visible) render(event.payload);
  else void currentWindow.hide();
});
await listen<InstanceAction>("instance-action", (event) => {
  if (event.payload.instanceId === assignedInstanceId && event.payload.action === "open-latest") {
    view?.openLatestResult();
  }
});
await listen("request-rescan", () => {
  if (isMainWindow) void rescanInstances().catch(showError);
});
await listen<string>("pet-ready", (event) => {
  if (!isMainWindow) return;
  const snapshot = runtime.snapshots(true).find((item) => item.instance.instanceId === event.payload);
  if (snapshot !== undefined) void emit("pet-snapshot", snapshot);
});

if (isMainWindow) await rescanInstances();
else if (assignedInstanceId !== null) await emit("pet-ready", assignedInstanceId);

let previousTime = performance.now();
const animate = (time: number): void => {
  const deltaSeconds = Math.min((time - previousTime) / 1000, 0.1);
  previousTime = time;
  view?.tick(deltaSeconds);
  requestAnimationFrame(animate);
};
requestAnimationFrame(animate);

async function createPetWindow(snapshot: SourceInstanceSnapshot, index: number): Promise<void> {
  const instanceId = snapshot.instance.instanceId;
  const position = appSettings.instances[instanceId]?.position;
  new WebviewWindow(windowLabel(instanceId), {
    url: `native.html?instance=${encodeURIComponent(instanceId)}`,
    title: "",
    width: 220,
    height: 360,
    x: position?.x ?? 120 + index * 40,
    y: position?.y ?? 120 + index * 30,
    transparent: true,
    decorations: false,
    alwaysOnTop: snapshot.settings.alwaysOnTop,
    visibleOnAllWorkspaces: true,
    visible: false,
    resizable: false,
    shadow: false,
    skipTaskbar: true,
    focus: false,
    acceptFirstMouse: true,
  });
}

async function restorePosition(instanceId: string): Promise<void> {
  const position = appSettings.instances[instanceId]?.position;
  if (position === undefined) return;
  const scale = await invoke<number>("get_scale_factor");
  await invoke("set_pet_position", { x: position.x * scale, y: position.y * scale });
}

async function persistPosition(): Promise<void> {
  if (assignedInstanceId === null) return;
  const instanceId = assignedInstanceId;
  const [position, scale] = await Promise.all([
    invoke<[number, number]>("get_pet_position"),
    invoke<number>("get_scale_factor"),
  ]);
  await invoke("save_pet_position", {
    instanceId,
    x: position[0] / scale,
    y: position[1] / scale,
  });
}

function schedulePositionSave(x: number, y: number): void {
  if (positionSaveTimer !== undefined) clearTimeout(positionSaveTimer);
  positionSaveTimer = setTimeout(() => {
    if (assignedInstanceId !== null) {
      void invoke("save_pet_position", { instanceId: assignedInstanceId, x, y }).catch(showError);
    }
  }, 500);
}

function resolveCharacterId(value: string): CharacterId {
  return characterIds.includes(value as CharacterId) ? value as CharacterId : "deepseek";
}

function windowLabel(instanceId: string): string {
  let hash = 0;
  for (const character of instanceId) hash = (hash * 31 + (character.codePointAt(0) ?? 0)) | 0;
  return `pet-${(hash >>> 0).toString(16)}`;
}

function sessionIdFromPath(path: string): string {
  const segments = path.split("/");
  return segments.find((segment) => segment.startsWith("session_")) ?? segments.at(-2) ?? path;
}

function showError(error: unknown): void {
  const element = document.querySelector<HTMLElement>("#native-health");
  if (element !== null) element.textContent = error instanceof Error ? error.message : String(error);
}
