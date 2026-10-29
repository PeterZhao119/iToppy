import type { NavigationTarget, SourceInstanceSnapshot, TaskSnapshot } from "../core/agents/model.js";
import { resolveAnimation } from "../core/characters/animation-resolver.js";
import type { CharacterDefinition } from "../core/characters/model.js";
import type {
  CharacterRenderer,
  CharacterRendererFactory,
} from "../core/characters/renderer.js";
import { statusIcon } from "./status-icons.js";

type IdleBehavior = "none" | "walk_left" | "walk_right" | "idle_adjust_skirt" | "idle_tail_cuddle";

export interface OffsetBounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

export interface PetViewOptions {
  onOpenTarget?: (navigation: NavigationTarget) => void;
  onWalkStart?: () => void;
  onMove?: (offsetX: number, offsetY: number) => void;
  onDragStart?: (clientX: number, clientY: number) => void;
  onDragEnd?: () => void;
  getOffsetBounds?: () => OffsetBounds | undefined;
}

export class PetView {
  readonly element: HTMLElement;
  private readonly renderer: CharacterRenderer;
  private readonly canvas: HTMLCanvasElement;
  private readonly bubbleWrap: HTMLElement;
  private readonly nameTag: HTMLElement;
  private readonly stateIcon: HTMLElement;
  private readonly name: HTMLElement;
  private readonly workspaceName: HTMLElement;
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
  private bubbleForced = false;
  private idleBehavior: IdleBehavior = "none";
  private behaviorElapsed = 0;
  private nextBehaviorIn = randomBetween(2, 5);
  private offsetX = 0;
  private offsetY = 0;
  private walkVelocityX = 0;
  private walkVelocityY = 0;
  private walkDuration = 0;
  private draggingActive = false;
  private runningAnimation: string | undefined;
  private runningActivityKey = "";
  private runningElapsed = 0;
  private runningDuration = 0;

  constructor(
    parent: HTMLElement,
    snapshot: SourceInstanceSnapshot,
    private readonly definition: CharacterDefinition,
    packageUrl: string,
    rendererFactory: CharacterRendererFactory,
    private readonly options: PetViewOptions = {},
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
          <span class="nametag-copy">
            <span data-agent-name></span>
            <span data-workspace-name></span>
          </span>
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
    this.name = required(this.element, "[data-agent-name]");
    this.workspaceName = required(this.element, "[data-workspace-name]");
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
      this.bubbleForced = true;
      this.render();
    });
    bubbleClose.addEventListener("click", () => {
      this.bubbleDismissed = true;
      this.bubbleExpanded = false;
      this.bubbleForced = false;
      this.render();
    });
    this.bubble.addEventListener("click", () => this.openTarget());
    if (this.options.onDragStart !== undefined) {
      this.canvas.addEventListener("pointerdown", (event) => {
        if (event.button !== 0) return;
        this.canvas.setPointerCapture(event.pointerId);
        this.draggingActive = true;
        this.stopIdleBehavior();
        this.applyAnimation();
        this.options.onDragStart?.(event.screenX, event.screenY);
        event.preventDefault();
      });
      this.nameTag.addEventListener("pointerdown", (downEvent) => {
        if (downEvent.button !== 0) return;
        let started = false;
        const startX = downEvent.clientX;
        const startY = downEvent.clientY;
        const startDrag = (event: PointerEvent): void => {
          if (started) return;
          started = true;
          this.draggingActive = true;
          this.stopIdleBehavior();
          this.applyAnimation();
          this.options.onDragStart?.(event.screenX, event.screenY);
        };
        const timer = window.setTimeout(() => startDrag(downEvent), 350);
        const move = (event: PointerEvent): void => {
          if (!started && Math.hypot(event.clientX - startX, event.clientY - startY) > 5) {
            window.clearTimeout(timer);
            startDrag(event);
          }
        };
        const finish = (event: PointerEvent, cancelled = false): void => {
          window.clearTimeout(timer);
          window.removeEventListener("pointermove", move);
          window.removeEventListener("pointerup", finish);
          window.removeEventListener("pointercancel", cancel);
          if (started) {
            if (cancelled) {
              this.draggingActive = false;
              this.applyAnimation();
              this.options.onDragEnd?.();
            }
            return;
          }
          if (!cancelled && event.type === "pointerup") this.openTarget();
        };
        const cancel = (event: PointerEvent): void => finish(event, true);
        window.addEventListener("pointermove", move);
        window.addEventListener("pointerup", finish);
        window.addEventListener("pointercancel", cancel);
        downEvent.preventDefault();
      });
      window.addEventListener("pointerup", () => {
        if (!this.draggingActive) return;
        this.draggingActive = false;
        this.applyAnimation();
        this.options.onDragEnd?.();
      });
    }

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

  openLatestResult(): void {
    this.bubbleDismissed = false;
    this.bubbleExpanded = true;
    this.bubbleForced = true;
    this.render();
    this.openTarget();
  }

  private openTarget(): void {
    const navigation = this.snapshot.instance.navigation;
    if (this.options.onOpenTarget !== undefined) {
      this.options.onOpenTarget(navigation);
    } else if (navigation.workspacePath !== undefined) {
      window.location.href = vscodeWorkspaceUrl(navigation.workspacePath);
    }
  }

  tick(deltaSeconds: number): void {
    if (!this.loaded) return;
    this.updateIdleBehavior(deltaSeconds);
    this.updateRunningPerformance(deltaSeconds);
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
      this.bubbleForced = false;
    }
    if (!isIdleState(state)) this.stopIdleBehavior();

    this.element.dataset.state = state;
    this.element.dataset.activity = primary?.activity ?? "generic";
    const [agentName, ...workspaceParts] = this.snapshot.instance.displayName.split(" · ");
    this.name.textContent = agentName ?? this.snapshot.instance.displayName;
    this.workspaceName.textContent = workspaceParts.join(" · ");
    this.nameTag.title = this.snapshot.instance.displayName;
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
      isRunning || (isResult && (this.bubbleForced || this.snapshot.settings.resultBubbleEnabled))
    );
    this.element.classList.toggle("has-bubble", showBubble);
    this.bubbleText.textContent = preview(response);
    this.bubble.disabled = this.options.onOpenTarget === undefined &&
      this.snapshot.instance.navigation.workspacePath === undefined;
    this.bubble.title = this.bubble.disabled ? "未识别跳转目标" : "打开对应应用";
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
    const key = `${state}:${activity ?? ""}:${this.idleBehavior}:${this.draggingActive}:${this.runningAnimation ?? ""}`;
    if (key === this.animationKey) return;
    this.animationKey = key;
    if (this.draggingActive) {
      this.renderer.play("dragging");
      return;
    }
    if (this.idleBehavior !== "none") {
      this.renderer.play(resolveAnimation(this.definition, { state: this.idleBehavior }));
      return;
    }
    if (state === "running" && this.runningAnimation !== undefined) {
      this.renderer.play(this.runningAnimation);
      return;
    }
    this.renderer.play(resolveAnimation(this.definition, { state, activity }));
  }

  private updateRunningPerformance(deltaSeconds: number): void {
    const primary = this.snapshot.primary;
    if (primary?.state !== "running") {
      this.runningAnimation = undefined;
      this.runningActivityKey = "";
      this.runningElapsed = 0;
      return;
    }

    const activityKey = `${primary.sessionId}:${primary.activity}`;
    if (activityKey !== this.runningActivityKey) {
      this.runningActivityKey = activityKey;
      this.runningAnimation = undefined;
      this.runningElapsed = 0;
      this.runningDuration = 0;
    }
    this.runningElapsed += deltaSeconds;
    if (this.runningAnimation === undefined) {
      this.runningAnimation = resolveAnimation(this.definition, {
        state: "running",
        activity: primary.activity,
      });
      this.runningDuration = randomBetween(2, 4);
      return;
    }
    if (this.runningElapsed < this.runningDuration) return;

    const actual = resolveAnimation(this.definition, { state: "running", activity: primary.activity });
    const candidates = [
      actual,
      "running.thinking",
      "running.tool_calling",
      "running.searching",
    ].filter((name, index, values) =>
      name !== this.runningAnimation &&
      this.definition.animations[name] !== undefined &&
      values.indexOf(name) === index
    );
    const weighted = candidates.flatMap((name) => name === actual ? [name, name, name] : [name]);
    if (weighted.length > 0) {
      this.runningAnimation = weighted[Math.floor(Math.random() * weighted.length)] ?? actual;
      this.runningDuration = randomBetween(2.5, 5);
    }
    this.runningElapsed = 0;
  }

  private updateIdleBehavior(deltaSeconds: number): void {
    if (this.draggingActive) return;
    const state = this.snapshot.primary?.state ?? "idle";
    if (!isIdleState(state)) return;
    this.behaviorElapsed += deltaSeconds;

    if (this.idleBehavior === "walk_left" || this.idleBehavior === "walk_right") {
      let deltaX = this.walkVelocityX * deltaSeconds;
      let deltaY = this.walkVelocityY * deltaSeconds;
      const offsetBounds = this.options.getOffsetBounds?.();
      if (offsetBounds !== undefined) {
        if (this.offsetX + deltaX < offsetBounds.minX) {
          this.walkVelocityX = Math.abs(this.walkVelocityX);
          deltaX = offsetBounds.minX - this.offsetX;
        } else if (this.offsetX + deltaX > offsetBounds.maxX) {
          this.walkVelocityX = -Math.abs(this.walkVelocityX);
          deltaX = offsetBounds.maxX - this.offsetX;
        }
        if (this.offsetY + deltaY < offsetBounds.minY) {
          this.walkVelocityY = Math.abs(this.walkVelocityY);
          deltaY = offsetBounds.minY - this.offsetY;
        } else if (this.offsetY + deltaY > offsetBounds.maxY) {
          this.walkVelocityY = -Math.abs(this.walkVelocityY);
          deltaY = offsetBounds.maxY - this.offsetY;
        }
      } else {
        const rect = this.canvas.getBoundingClientRect();
        if (rect.left + deltaX < 8) {
          this.walkVelocityX = Math.abs(this.walkVelocityX);
          deltaX = 8 - rect.left;
        } else if (rect.right + deltaX > window.innerWidth - 8) {
          this.walkVelocityX = -Math.abs(this.walkVelocityX);
          deltaX = window.innerWidth - 8 - rect.right;
        }
        if (rect.top + deltaY < 8) {
          this.walkVelocityY = Math.abs(this.walkVelocityY);
          deltaY = 8 - rect.top;
        } else if (rect.bottom + deltaY > window.innerHeight - 8) {
          this.walkVelocityY = -Math.abs(this.walkVelocityY);
          deltaY = window.innerHeight - 8 - rect.bottom;
        }
      }
      this.offsetX += deltaX;
      this.offsetY += deltaY;
      this.idleBehavior = this.walkVelocityX < 0 ? "walk_left" : "walk_right";
      this.updatePosition();
      if (this.behaviorElapsed >= this.walkDuration) this.finishIdleBehavior();
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
        this.startWalk();
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

  private startWalk(): void {
    if (this.definition.animations.walk_left === undefined || this.definition.animations.walk_right === undefined) {
      this.finishIdleBehavior();
      return;
    }
    const speedRanges = {
      slow: [25, 40],
      standard: [45, 70],
      fast: [70, 105],
    } as const;
    const [minimumSpeed, maximumSpeed] = speedRanges[this.snapshot.settings.walkSpeed];
    const speed = randomBetween(minimumSpeed, maximumSpeed);
    const angle = Math.random() * Math.PI * 2;
    this.walkVelocityX = Math.cos(angle) * speed;
    this.walkVelocityY = Math.sin(angle) * speed;
    this.walkDuration = randomBetween(5, 20);
    if (this.options.onMove !== undefined) {
      this.offsetX = 0;
      this.offsetY = 0;
    }
    this.options.onWalkStart?.();
    this.idleBehavior = this.walkVelocityX < 0 ? "walk_left" : "walk_right";
    this.behaviorElapsed = 0;
  }

  private startSpecialIdle(behavior: "idle_adjust_skirt" | "idle_tail_cuddle"): void {
    resolveAnimation(this.definition, { state: behavior });
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
    if (this.options.onMove !== undefined) {
      this.options.onMove(this.offsetX, this.offsetY);
      return;
    }
    const transform = `translateX(calc(-50% + ${this.offsetX.toFixed(2)}px)) translateY(${this.offsetY.toFixed(2)}px)`;
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
