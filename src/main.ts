import "./style.css";
import type { SourceInstanceSnapshot } from "./core/agents/model.js";
import type { CharacterDefinition } from "./core/characters/model.js";
import type { CharacterRenderer } from "./core/characters/renderer.js";
import {
  createDefaultCharacterRegistry,
  loadCharacterDefinition,
  resolveAnimation,
} from "./index.js";
import { PetView } from "./ui/pet-view.js";

interface LivePayload {
  instances: SourceInstanceSnapshot[];
  pendingCount: number;
  monitorError?: string;
}

const app = document.querySelector<HTMLDivElement>("#app");
if (app === null) throw new Error("Missing #app.");

app.innerHTML = `
  <main>
    <header>
      <div>
        <h1>iToppy 实时桌宠原型</h1>
        <p>只处理启动后的新 Kimi Code 事件 · 数据仅在本机传递</p>
      </div>
      <span class="connection" id="connection">正在加载角色包…</span>
    </header>
    <section class="pet-grid" id="pets" aria-live="polite"></section>
    <div class="empty" id="empty">等待新的 Kimi Code 任务。历史会话不会自动显示。</div>
    <details class="inspector">
      <summary>角色动作检查</summary>
      <div class="inspector-body">
        <canvas id="inspector-pet" aria-label="角色动作检查"></canvas>
        <p class="inspector-status" id="inspector-status"></p>
        <div class="controls" id="controls"></div>
      </div>
    </details>
  </main>
`;

const animationNames: Array<[string, string]> = [
  ["idle", "微动待机"],
  ["walk_left", "向左行走"],
  ["walk_right", "向右行走"],
  ["running.thinking", "思考"],
  ["running.tool_calling", "工具调用"],
  ["running.searching", "搜索"],
  ["succeeded", "成功"],
  ["failed", "失败"],
  ["succeeded_idle", "成功待机"],
  ["failed_idle", "失败待机"],
  ["dragging", "托腮拖拽"],
  ["idle_adjust_skirt", "整理裙子"],
  ["idle_tail_cuddle", "抱尾贴脸"],
];

async function start(): Promise<void> {
  const registry = createDefaultCharacterRegistry();
  const requestedCharacter = new URLSearchParams(window.location.search).get("character");
  const characterId = requestedCharacter === "claude" || requestedCharacter === "gpt"
    ? requestedCharacter
    : "deepseek";
  const packageUrl = `/asset/avatar/${characterId}/package`;
  const definition = await loadCharacterDefinition(`${packageUrl}/character.json`);
  registry.registerDefinition(definition);
  const rendererFactory = registry.renderers.get("sprite");
  const petsContainer = required<HTMLElement>("#pets");
  const empty = required<HTMLElement>("#empty");
  const connection = required<HTMLElement>("#connection");
  const views = new Map<string, PetView>();
  const inspector = await createInspector(definition, packageUrl, rendererFactory);

  const sync = (payload: LivePayload): void => {
    const activeIds = new Set<string>();
    for (const snapshot of payload.instances) {
      const id = snapshot.instance.instanceId;
      activeIds.add(id);
      let view = views.get(id);
      if (view === undefined) {
        view = new PetView(petsContainer, snapshot, definition, packageUrl, rendererFactory);
        views.set(id, view);
      } else {
        view.update(snapshot);
      }
    }
    for (const [id, view] of views) {
      if (activeIds.has(id)) continue;
      view.destroy();
      views.delete(id);
    }
    empty.hidden = payload.instances.length > 0;
    const pending = payload.pendingCount > 0 ? ` · ${payload.pendingCount} 条事件待归属` : "";
    connection.textContent = payload.monitorError === undefined
      ? `实时监控已连接${pending}`
      : `监控降级：${payload.monitorError}`;
    connection.dataset.error = String(payload.monitorError !== undefined);
  };

  const events = new EventSource("/__itoppy/events");
  events.addEventListener("snapshots", (message) => {
    sync(JSON.parse((message as MessageEvent<string>).data) as LivePayload);
  });
  events.onopen = () => {
    connection.textContent = "实时监控已连接";
    connection.dataset.error = "false";
  };
  events.onerror = () => {
    connection.textContent = "连接中断，正在重连…";
    connection.dataset.error = "true";
  };
  window.addEventListener("beforeunload", () => events.close());

  let previousTime = performance.now();
  const animate = (time: number): void => {
    const deltaSeconds = Math.min((time - previousTime) / 1000, 0.1);
    previousTime = time;
    for (const view of views.values()) view.tick(deltaSeconds);
    inspector.update(deltaSeconds);
    requestAnimationFrame(animate);
  };
  requestAnimationFrame(animate);
}

async function createInspector(
  definition: CharacterDefinition,
  packageUrl: string,
  rendererFactory: (canvas: HTMLCanvasElement) => CharacterRenderer,
): Promise<CharacterRenderer> {
  const renderer = rendererFactory(required<HTMLCanvasElement>("#inspector-pet"));
  await renderer.load(definition, packageUrl);
  const status = required<HTMLElement>("#inspector-status");
  const controls = required<HTMLElement>("#controls");
  for (const [name, label] of animationNames) {
    const button = document.createElement("button");
    button.textContent = label;
    button.addEventListener("click", () => {
      renderer.play(resolveAnimation(definition, { state: name }));
      status.textContent = `${definition.name} · ${label}`;
    });
    controls.append(button);
  }
  renderer.play("idle");
  status.textContent = `${definition.name} · 微动待机`;
  return renderer;
}

function required<T extends Element>(selector: string): T {
  const element = document.querySelector<T>(selector);
  if (element === null) throw new Error(`Missing element '${selector}'.`);
  return element;
}

start().catch((error: unknown) => {
  const connection = document.querySelector<HTMLElement>("#connection");
  if (connection !== null) {
    connection.textContent = error instanceof Error ? error.message : String(error);
    connection.dataset.error = "true";
  }
});
