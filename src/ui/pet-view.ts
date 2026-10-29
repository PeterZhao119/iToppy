import type { SourceInstanceSnapshot, TaskSnapshot } from "../core/agents/model.js";
import { resolveAnimation } from "../core/characters/animation-resolver.js";
import type { CharacterDefinition } from "../core/characters/model.js";
import type {
  CharacterRenderer,
  CharacterRendererFactory,
} from "../core/characters/renderer.js";
import { statusIcon } from "./status-icons.js";

type IdleBehavior = "none" | "walk_left" | "walk_right" | "idle_adjust_skirt" | "idle_tail_cuddle";

export class PetView {
  readonly element: HTMLElement;
  private readonly renderer: CharacterRenderer;
  private readonly canvas: HTMLCanvasElement;
  private readonly bubbleWrap: HTMLElement;
  private readonly nameTag: HTMLElement;
  private readonly stateIcon: HTMLElement;
  private readonly name: HTMLElement;
  private readonly status: HTMLElement;
  private readonly sessions: HTMLElement;
  private readonly health: HTMLElement;
  private readonly bubble: HTMLButtonElement;
  private readonly bubbleText: HTMLElement;
  private readonly resultToggle: HTMLButtonElement;
  private snapshot: SourceInstanceSnapshot;
  private loaded = false;
  private animationKey = "";
  private resultKey = "";
  private bubbleDismissed = false;
  private bubbleExpanded = false;
  private idleBehavior: IdleBehavior = "none";
  private behaviorElapsed = 0;
  private nextBehaviorIn = randomBetween(2, 5);
  private offsetX = 0;
  private walkTarget = 0;

  constructor(
    parent: HTMLElement,
    snapshot: SourceInstanceSnapshot,
    private readonly definition: CharacterDefinition,
    packageUrl: string,
    rendererFactory: CharacterRendererFactory,
  ) {
    this.snapshot = snapshot;
    this.element = document.createElement("article");
    this.element.className = "pet-card";
    this.element.innerHTML = `
      <div class="pet-heading">
        <span></span>
        <button class="result-toggle" type="button" aria-label="展开最新结果"></button>
      </div>
      <div class="pet-stage">
        <div class="pet-nametag">
          <span class="status-icon" data-state-icon></span>
          <span data-name></span>
        </div>
        <canvas aria-label="Q 版桌宠"></canvas>
        <div class="bubble-wrap">
          <button class="response-bubble" type="button"><span data-response></span></button>
          <button class="bubble-close" type="button" aria-label="关闭气泡">×</button>
        </div>
      </div>
      <div class="pet-meta">
        <span data-status></span>
        <span data-sessions></span>
      </div>
      <p class="monitor-health" data-health></p>
    `;
    parent.append(this.element);

    this.nameTag = required(this.element, ".pet-nametag");
    this.stateIcon = required(this.element, "[data-state-icon]");
    this.name = required(this.element, ".pet-nametag [data-name]");
    this.status = required(this.element, "[data-status]");
    this.sessions = required(this.element, "[data-sessions]");
    this.health = required(this.element, "[data-health]");
    this.bubble = required(this.element, ".response-bubble");
    this.bubbleWrap = required(this.element, ".bubble-wrap");
    this.bubbleText = required(this.element, "[data-response]");
    this.resultToggle = required(this.element, ".result-toggle");
    this.canvas = required<HTMLCanvasElement>(this.element, "canvas");
    const bubbleClose = required<HTMLButtonElement>(this.element, ".bubble-close");

    this.resultToggle.addEventListener("click", () => {
      this.bubbleExpanded = !this.bubbleExpanded;
      this.bubbleDismissed = false;
      this.render();
    });
    bubbleClose.addEventListener("click", () => {
      this.bubbleDismissed = true;
      this.bubbleExpanded = false;
      this.render();
    });
    this.bubble.addEventListener("click", () => {
      const workspacePath = this.snapshot.instance.navigation.workspacePath;
      if (workspacePath !== undefined) window.location.href = vscodeWorkspaceUrl(workspacePath);
    });

    this.renderer = rendererFactory(this.canvas);
    void this.renderer.load(definition, packageUrl).then(() => {
      this.loaded = true;
      this.applyAnimation();
    }).catch((error: unknown) => {
      this.health.textContent = error instanceof Error ? error.message : String(error);
    });
    this.render();
  }

  update(snapshot: SourceInstanceSnapshot): void {
    this.snapshot = snapshot;
    this.render();
  }

  tick(deltaSeconds: number): void {
    if (!this.loaded) return;
    this.updateIdleBehavior(deltaSeconds);
    this.applyAnimation();
    this.renderer.update(deltaSeconds);
  }

  destroy(): void {
    this.renderer.destroy();
    this.element.remove();
  }

  private render(): void {
    const primary = this.snapshot.primary;
    const state = primary?.state ?? "idle";
    const resultPhase = state === "succeeded_idle"
      ? "succeeded"
      : state === "failed_idle" ? "failed" : state;
    const nextResultKey = `${primary?.sessionId ?? ""}:${resultPhase}:${primary?.statusMessage ?? ""}:${primary?.latestResponse ?? ""}`;
    if (nextResultKey !== this.resultKey) {
      this.resultKey = nextResultKey;
      this.bubbleDismissed = false;
      this.bubbleExpanded = false;
    }
    if (!isIdleState(state)) this.stopIdleBehavior();

    this.element.dataset.state = state;
    this.element.dataset.activity = primary?.activity ?? "generic";
    this.name.textContent = this.snapshot.instance.displayName;
    this.name.title = this.snapshot.instance.displayName;
    this.stateIcon.innerHTML = statusIcon(primary);
    this.status.textContent = statusLabel(primary, this.snapshot.runningCount);
    this.sessions.textContent = sessionLabel(this.snapshot.sessionCount, this.snapshot.runningCount);
    this.health.textContent = primary?.monitorHealth === "degraded"
      ? primary.monitorMessage ?? "监控不可用"
      : "";

    const response = bubbleContent(primary);
    const isRunning = state === "running";
    const isResult = ["succeeded", "failed", "succeeded_idle", "failed_idle"].includes(state);
    const isFresh = state === "succeeded" || state === "failed";
    const showBubble = response !== "" && !this.bubbleDismissed && (
      isRunning || (isResult && this.snapshot.settings.resultBubbleEnabled)
    );
    this.element.classList.toggle("has-bubble", showBubble);
    this.bubbleText.textContent = preview(response);
    this.bubble.disabled = this.snapshot.instance.navigation.workspacePath === undefined;
    this.bubble.title = this.bubble.disabled
      ? "未识别工作区，无法跳转"
      : "打开对应 VS Code 工作区";
    this.resultToggle.hidden = !isResult || response === "";
    this.resultToggle.textContent = state.startsWith("succeeded") ? "✓" : "!";
    this.resultToggle.setAttribute("aria-expanded", String(this.bubbleExpanded || isFresh));
    this.applyAnimation();
  }

  private applyAnimation(): void {
    if (!this.loaded) return;
    const primary = this.snapshot.primary;
    const state = primary?.state ?? "idle";
    const activity = primary?.activity;
    const key = `${state}:${activity ?? ""}:${this.idleBehavior}`;
    if (key === this.animationKey) return;
    this.animationKey = key;
    if (this.idleBehavior !== "none") {
      this.renderer.play(this.idleBehavior);
      return;
    }
    this.renderer.play(resolveAnimation(this.definition, { state, activity }));
  }

  private updateIdleBehavior(deltaSeconds: number): void {
    const state = this.snapshot.primary?.state ?? "idle";
    if (!isIdleState(state)) return;
    this.behaviorElapsed += deltaSeconds;

    if (this.idleBehavior === "walk_left" || this.idleBehavior === "walk_right") {
      const remaining = this.walkTarget - this.offsetX;
      const speed = { slow: 35, standard: 55, fast: 85 }[this.snapshot.settings.walkSpeed];
      const step = Math.sign(remaining) * speed * deltaSeconds;
      if (Math.abs(step) >= Math.abs(remaining)) {
        this.offsetX = this.walkTarget;
        this.updatePosition();
        this.finishIdleBehavior();
      } else {
        this.offsetX += step;
        this.updatePosition();
      }
      return;
    }

    if (this.idleBehavior !== "none") {
      const duration = this.definition.animations[this.idleBehavior]?.durationSeconds ?? 5;
      if (this.behaviorElapsed >= duration) this.finishIdleBehavior();
      return;
    }

    if (this.behaviorElapsed >= this.nextBehaviorIn) this.chooseIdleBehavior();
  }

  private chooseIdleBehavior(): void {
    const roll = Math.random();
    if (roll < 0.4) {
      if (this.snapshot.settings.walkEnabled && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        this.startWalk(Math.random() < 0.5 ? -1 : 1);
      } else {
        this.finishIdleBehavior();
      }
    } else if (roll < 0.6) {
      this.startSpecialIdle("idle_adjust_skirt");
    } else if (roll < 0.8) {
      this.startSpecialIdle("idle_tail_cuddle");
    } else {
      this.finishIdleBehavior();
    }
  }

  private startWalk(direction: -1 | 1): void {
    if (this.definition.animations.walk_left === undefined || this.definition.animations.walk_right === undefined) {
      this.finishIdleBehavior();
      return;
    }
    const rect = this.canvas.getBoundingClientRect();
    const center = rect.left + rect.width / 2;
    const distance = window.innerWidth * 0.15;
    const targetCenter = center + direction * distance;
    const minCenter = rect.width / 2 + 8;
    const maxCenter = window.innerWidth - rect.width / 2 - 8;
    const clampedCenter = Math.min(maxCenter, Math.max(minCenter, targetCenter));
    this.walkTarget = this.offsetX + clampedCenter - center;
    if (Math.abs(this.walkTarget - this.offsetX) < 10) {
      this.finishIdleBehavior();
      return;
    }
    this.idleBehavior = direction < 0 ? "walk_left" : "walk_right";
    this.behaviorElapsed = 0;
  }

  private startSpecialIdle(behavior: "idle_adjust_skirt" | "idle_tail_cuddle"): void {
    if (this.definition.animations[behavior] === undefined) {
      this.finishIdleBehavior();
      return;
    }
    this.idleBehavior = behavior;
    this.behaviorElapsed = 0;
  }

  private finishIdleBehavior(): void {
    this.idleBehavior = "none";
    this.behaviorElapsed = 0;
    this.nextBehaviorIn = randomBetween(2.5, 6);
  }

  private stopIdleBehavior(): void {
    this.idleBehavior = "none";
    this.behaviorElapsed = 0;
    this.nextBehaviorIn = randomBetween(2, 5);
  }

  private updatePosition(): void {
    const transform = `translateX(calc(-50% + ${this.offsetX.toFixed(2)}px))`;
    this.canvas.style.transform = transform;
    this.bubbleWrap.style.transform = transform;
    this.nameTag.style.transform = transform;
  }
}

function isIdleState(state: string): boolean {
  return state === "idle" || state === "succeeded_idle" || state === "failed_idle";
}

function randomBetween(minimum: number, maximum: number): number {
  return minimum + Math.random() * (maximum - minimum);
}

function required<T extends Element = HTMLElement>(root: ParentNode, selector: string): T {
  const element = root.querySelector<T>(selector);
  if (element === null) throw new Error(`Missing element '${selector}'.`);
  return element;
}

function statusLabel(primary: TaskSnapshot | undefined, runningCount: number): string {
  if (primary === undefined) return "等待新任务";
  const runningSuffix = runningCount > 1 ? ` · ${runningCount} 个任务` : "";
  switch (primary.state) {
    case "idle": return "待机";
    case "running": {
      const activity = {
        generic: "正在工作",
        thinking: "正在思考",
        tool_calling: "正在调用工具",
        searching: "正在搜索",
      }[primary.activity];
      return `${activity}${runningSuffix}`;
    }
    case "succeeded": return "执行完毕";
    case "failed": return "执行失败";
    case "succeeded_idle": return "执行完毕 · 结果已保留";
    case "failed_idle": return "执行失败 · 结果已保留";
  }
}

function sessionLabel(sessionCount: number, runningCount: number): string {
  if (sessionCount === 0) return "尚无新会话事件";
  const running = runningCount > 0 ? ` · ${runningCount} 运行中` : "";
  return `${sessionCount} 个会话${running}`;
}

function bubbleContent(primary: TaskSnapshot | undefined): string {
  if (primary === undefined) return "";
  if (primary.state === "running") return primary.statusMessage ?? primary.latestResponse ?? "";
  return primary.latestResponse ?? (primary.state.startsWith("failed") ? primary.monitorMessage ?? "" : "");
}

export function preview(text: string): string {
  const normalized = text.replace(/\s+/g, " ").trim();
  const characters = [...normalized];
  return characters.length > 50 ? `${characters.slice(0, 50).join("")}…` : normalized;
}

export function vscodeWorkspaceUrl(workspacePath: string): string {
  const encoded = workspacePath.split("/").map(encodeURIComponent).join("/");
  return `vscode://file${encoded.startsWith("/") ? encoded : `/${encoded}`}`;
}
