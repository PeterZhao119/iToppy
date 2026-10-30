import "./control-panel.css";
import appIconUrl from "../asset/brand/itoppy-icon-1024.png?url";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import type { WalkSpeed } from "./core/agents/model.js";
import {
  defaultAppSettings,
  normalizeSettings,
  type AppSettings,
  type AppSettingsPatch,
  type InstancePreferences,
} from "./core/settings.js";
import type { NativeInstanceState, NativeRuntimeState } from "./platform/native-contract.js";

const appElement = document.querySelector<HTMLElement>("#app");
if (appElement === null) throw new Error("Missing #app.");
const app = appElement;
let settings = defaultAppSettings;
let runtime: NativeRuntimeState = { instances: [], pendingCount: 0, settingsPath: "" };
let message = "";

async function refresh(): Promise<void> {
  const [storedSettings, nativeState] = await Promise.all([
    invoke<AppSettings>("get_settings"),
    invoke<NativeRuntimeState>("get_native_state"),
  ]);
  settings = normalizeSettings(storedSettings);
  runtime = nativeState;
  render();
}

function render(): void {
  const visible = runtime.instances.filter((instance) => instance.displayStatus === "visible");
  const overflow = runtime.instances.filter((instance) => instance.displayStatus === "overflow");
  const candidates = runtime.instances.filter((instance) =>
    instance.displayStatus === "candidate" || instance.displayStatus === "hidden"
  );
  app.innerHTML = `
    <div class="panel-decor" aria-hidden="true">
      <span class="decor-orb orb-one"></span><span class="decor-orb orb-two"></span>
      <span class="decor-bubble bubble-one"></span><span class="decor-bubble bubble-two"></span><span class="decor-bubble bubble-three"></span>
      <img class="header-companion companion-deepseek" src="/asset/brand/deepseek-head.png" alt="" />
      <img class="header-companion companion-claude" src="/asset/brand/claude-head.png" alt="" />
      <svg class="decor-spark spark-one" viewBox="0 0 24 24"><path d="m12 1 2.4 8.6L23 12l-8.6 2.4L12 23l-2.4-8.6L1 12l8.6-2.4Z"/></svg>
      <svg class="decor-spark spark-two" viewBox="0 0 24 24"><path d="m12 1 2.4 8.6L23 12l-8.6 2.4L12 23l-2.4-8.6L1 12l8.6-2.4Z"/></svg>
      <svg class="decor-paw paw-one" viewBox="0 0 64 64"><ellipse cx="32" cy="43" rx="18" ry="14"/><ellipse cx="12" cy="25" rx="7" ry="9" transform="rotate(-25 12 25)"/><ellipse cx="27" cy="15" rx="7" ry="9" transform="rotate(-8 27 15)"/><ellipse cx="43" cy="16" rx="7" ry="9" transform="rotate(12 43 16)"/><ellipse cx="55" cy="29" rx="7" ry="9" transform="rotate(28 55 29)"/></svg>
      <svg class="decor-paw paw-two" viewBox="0 0 64 64"><ellipse cx="32" cy="43" rx="18" ry="14"/><ellipse cx="12" cy="25" rx="7" ry="9" transform="rotate(-25 12 25)"/><ellipse cx="27" cy="15" rx="7" ry="9" transform="rotate(-8 27 15)"/><ellipse cx="43" cy="16" rx="7" ry="9" transform="rotate(12 43 16)"/><ellipse cx="55" cy="29" rx="7" ry="9" transform="rotate(28 55 29)"/></svg>
    </div>
    <header class="panel-header">
      <div class="panel-title">
        <img class="panel-mascot" src="${appIconUrl}" alt="" />
        <div>
          <p class="eyebrow">菜单栏常驻 · 本地运行</p>
          <h1>iToppy 控制面板</h1>
          <p>管理本机 AI Coding 桌宠，不读取或保存密钥与完整会话正文。</p>
        </div>
      </div>
      <div class="panel-actions">
        <button class="primary" data-action="rescan" type="button">重新扫描</button>
        <div class="project-links">
          <span>项目地址</span><button class="link-button" data-action="open-link" data-url="https://github.com/PeterZhao119/iToppy" type="button">https://github.com/PeterZhao119/iToppy</button>
          <span>作者</span><button class="link-button" data-action="open-link" data-url="https://github.com/PeterZhao119" type="button">https://github.com/PeterZhao119</button>
        </div>
      </div>
    </header>
    ${message === "" ? "" : `<p class="notice" role="status">${escapeHtml(message)}</p>`}
    <section class="settings-section">
      <div class="section-heading"><h2>App 默认设置</h2><span>实例设置优先于这些默认值</span></div>
      <div class="settings-grid">
        <label>全局可见上限<input data-setting="visibleLimit" type="number" min="1" max="50" value="${settings.visibleLimit}"></label>
        <label>默认角色<select data-setting="defaultCharacterId">
          <option value="deepseek" ${settings.defaultCharacterId === "deepseek" ? "selected" : ""}>DeepSeek</option>
          <option value="claude" ${settings.defaultCharacterId === "claude" ? "selected" : ""}>Claude</option>
          <option value="gpt" ${settings.defaultCharacterId === "gpt" ? "selected" : ""}>GPT 娘</option>
          <option value="doubao" ${settings.defaultCharacterId === "doubao" ? "selected" : ""}>Doubao 娘</option>
          <option value="qq" ${settings.defaultCharacterId === "qq" ? "selected" : ""}>QQ 娘</option>
          <option value="kimi" ${settings.defaultCharacterId === "kimi" ? "selected" : ""}>Kimi 娘</option>
        </select></label>
        <label>默认游走速度<select data-setting="walkSpeed">${speedOptions(settings.walkSpeed)}</select></label>
        ${checkbox("新任务自动显示", "autoShowNewTasks", settings.autoShowNewTasks)}
        ${checkbox("默认结果气泡", "resultBubbleEnabled", settings.resultBubbleEnabled)}
        ${checkbox("默认启用游走", "walkEnabled", settings.walkEnabled)}
        ${checkbox("默认始终置顶", "alwaysOnTop", settings.alwaysOnTop)}
      </div>
    </section>
    <section class="agent-section">
      <div class="section-heading"><h2>已发现 Agent</h2><span>仅启用已验证适配器</span></div>
      <article class="agent-card">
        <div><strong>Kimi Code</strong><span>VS Code 插件 · 只读 sessions 登记目录</span></div>
        <label class="switch"><input data-agent-enabled="kimi-code" type="checkbox" ${settings.agents["kimi-code"]?.enabled !== false ? "checked" : ""}>启用监控</label>
      </article>
      <article class="agent-card">
        <div><strong>Codex</strong><span>CLI / VS Code / App 共享 rollout · 默认 GPT 娘</span></div>
        <label class="switch"><input data-agent-enabled="codex" type="checkbox" ${settings.agents.codex?.enabled !== false ? "checked" : ""}>启用监控</label>
      </article>
      <article class="agent-card">
        <div><strong>Claude Code</strong><span>CLI / IDE / Desktop Code 共享 JSONL · 默认 Claude 娘</span></div>
        <label class="switch"><input data-agent-enabled="claude-code" type="checkbox" ${settings.agents["claude-code"]?.enabled !== false ? "checked" : ""}>启用监控</label>
      </article>
    </section>
    ${instanceSection("正在显示", visible)}
    ${instanceSection("其他活跃实例", overflow, "超过可见上限的实例仍在监控；提高上限或隐藏其他实例后可显示。")}
    ${instanceSection("已发现 / 已暂停", candidates, "候选实例不会回放历史任务。手动启用会显示空桌宠并等待新事件。")}
    <section class="manual-section">
      <div class="section-heading"><h2>手动添加</h2><span>按 Agent 类型 + 目标工作区目录</span></div>
      <form id="manual-form">
        <select name="agentType" aria-label="Agent 类型"><option value="kimi-code">Kimi Code</option><option value="codex">Codex CLI</option><option value="claude-code">Claude CLI</option></select>
        <input name="workspacePath" type="text" required placeholder="/Users/you/workspace/project" aria-label="目标工作区目录">
        <button class="primary" type="submit">验证并添加</button>
      </form>
    </section>
    <section class="diagnostics">
      <h2>健康诊断与隐私</h2>
      <dl>
        <div><dt>监控状态</dt><dd class="${runtime.monitorError === undefined ? "healthy" : "degraded"}">${escapeHtml(runtime.monitorError ?? "正常 · 仅处理启动后的新增会话记录")}</dd></div>
        <div><dt>待归属事件</dt><dd>${runtime.pendingCount} 条（不会猜测工作区）</dd></div>
        <div><dt>设置文件</dt><dd>${escapeHtml(runtime.settingsPath)}</dd></div>
        <div><dt>系统权限</dt><dd>不申请辅助功能、屏幕录制或完全磁盘访问；按来源打开 VS Code、终端或 App。</dd></div>
      </dl>
    </section>
  `;
}

function instanceSection(title: string, instances: NativeInstanceState[], hint = ""): string {
  return `
    <section class="instances-section">
      <div class="section-heading"><h2>${title}</h2><span>${instances.length} 个实例</span></div>
      ${hint === "" ? "" : `<p class="section-hint">${hint}</p>`}
      <div class="instance-list">${instances.length === 0 ? '<p class="empty">暂无实例</p>' : instances.map(instanceCard).join("")}</div>
    </section>
  `;
}

function instanceCard(instance: NativeInstanceState): string {
  const id = instance.instance.instanceId;
  const escapedId = escapeHtml(id);
  const workspace = instance.instance.navigation.workspacePath ?? "未识别工作区";
  const preferences = settings.instances[id] ?? {};
  const status = instance.monitoringEnabled
    ? instance.monitorHealth === "degraded" ? "监控降级" : "监控中"
    : "已隐藏并暂停";
  return `
    <article class="instance-card" data-instance="${escapedId}">
      <div class="instance-summary">
        <div class="instance-title">
          <strong>${escapeHtml(instance.instance.displayName)}</strong>
          <span class="status ${instance.monitoringEnabled ? "active" : "paused"}">${status} · ${stateLabel(instance)}</span>
        </div>
        <div class="instance-actions">
          <button data-action="open-latest" ${instance.hasResult && instance.visible ? "" : "disabled"}>打开最新响应并跳转</button>
          <button data-action="open-workspace">${navigationLabel(instance)}</button>
          <button data-action="${instance.monitoringEnabled ? "hide" : "enable"}">${instance.monitoringEnabled ? "隐藏并暂停监控" : "启用显示与监控"}</button>
        </div>
      </div>
      <p class="workspace" title="${escapedId}">${escapeHtml(workspace)}</p>
      ${instance.monitorMessage === undefined ? "" : `<p class="degraded">${escapeHtml(instance.monitorMessage)}</p>`}
      <div class="instance-settings">
        <label>形象覆写<select data-pref="characterIdOverride">
          <option value="" ${preferences.characterIdOverride === undefined ? "selected" : ""}>跟随 App 默认</option>
          <option value="deepseek" ${instance.settings.characterId === "deepseek" && preferences.characterIdOverride !== undefined ? "selected" : ""}>DeepSeek</option>
          <option value="claude" ${instance.settings.characterId === "claude" && preferences.characterIdOverride !== undefined ? "selected" : ""}>Claude</option>
          <option value="gpt" ${instance.settings.characterId === "gpt" && preferences.characterIdOverride !== undefined ? "selected" : ""}>GPT 娘</option>
          <option value="doubao" ${instance.settings.characterId === "doubao" && preferences.characterIdOverride !== undefined ? "selected" : ""}>Doubao 娘</option>
          <option value="qq" ${instance.settings.characterId === "qq" && preferences.characterIdOverride !== undefined ? "selected" : ""}>QQ 娘</option>
          <option value="kimi" ${instance.settings.characterId === "kimi" && preferences.characterIdOverride !== undefined ? "selected" : ""}>Kimi 娘</option>
        </select></label>
        <label>游走速度<select data-pref="walkSpeedOverride">${speedOptions(instance.settings.walkSpeed)}</select></label>
        ${instanceCheckbox(instance, "resultBubbleEnabledOverride", "结果气泡", instance.settings.resultBubbleEnabled)}
        ${instanceCheckbox(instance, "walkEnabledOverride", "启用游走", instance.settings.walkEnabled)}
        ${instanceCheckbox(instance, "alwaysOnTopOverride", "始终置顶", instance.settings.alwaysOnTop)}
      </div>
      <p class="session-count">${instance.sessionCount} 个会话 · ${instance.runningCount} 个运行中</p>
    </article>
  `;
}

function checkbox(label: string, key: string, checked: boolean): string {
  return `<label class="check-label"><input data-setting="${key}" type="checkbox" ${checked ? "checked" : ""}>${label}</label>`;
}

function instanceCheckbox(instance: NativeInstanceState, key: string, label: string, checked: boolean): string {
  return `<label class="check-label"><input data-pref="${key}" type="checkbox" ${checked ? "checked" : ""}>${label}</label>`;
}

function speedOptions(selected: WalkSpeed): string {
  return ([
    ["slow", "慢速"],
    ["standard", "标准"],
    ["fast", "快速"],
  ] as const).map(([value, label]) => `<option value="${value}" ${value === selected ? "selected" : ""}>${label}</option>`).join("");
}

function stateLabel(instance: NativeInstanceState): string {
  switch (instance.primaryState) {
    case "running": return "运行中";
    case "succeeded":
    case "succeeded_idle": return "执行完毕";
    case "failed":
    case "failed_idle": return "执行失败";
    default: return instance.displayStatus === "overflow" ? "活跃但超出上限" : "等待新任务";
  }
}

function navigationLabel(instance: NativeInstanceState): string {
  switch (instance.instance.hostKind) {
    case "vscode-workspace": return "定位 VS Code";
    case "terminal-session": return "打开终端";
    case "app": return "打开 App";
    default: return "打开来源";
  }
}

app.addEventListener("change", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLInputElement || target instanceof HTMLSelectElement)) return;
  if (target.dataset.setting !== undefined) {
    const key = target.dataset.setting as keyof AppSettingsPatch;
    const value = target instanceof HTMLInputElement && target.type === "checkbox"
      ? target.checked
      : target instanceof HTMLInputElement && target.type === "number"
        ? Number(target.value)
        : target.value;
    void updateApp({ [key]: value });
    return;
  }
  if (target.dataset.agentEnabled !== undefined && target instanceof HTMLInputElement) {
    const agentType = target.dataset.agentEnabled;
    void updateApp({
      agents: {
        ...settings.agents,
        [agentType]: { ...settings.agents[agentType], enabled: target.checked },
      },
    });
    return;
  }
  if (target.dataset.pref !== undefined) {
    const card = target.closest<HTMLElement>("[data-instance]");
    if (card === null) return;
    const key = target.dataset.pref as keyof InstancePreferences;
    const value = target instanceof HTMLInputElement && target.type === "checkbox" ? target.checked : target.value;
    const preferences = { ...settings.instances[card.dataset.instance ?? ""] };
    if (key === "characterIdOverride" && value === "") delete preferences.characterIdOverride;
    else Object.assign(preferences, { [key]: value });
    void updateInstance(card.dataset.instance ?? "", preferences);
  }
});

app.addEventListener("click", (event) => {
  const button = (event.target as HTMLElement).closest<HTMLButtonElement>("button[data-action]");
  if (button === null) return;
  const action = button.dataset.action;
  if (action === "rescan") {
    void rescan();
    return;
  }
  if (action === "open-link") {
    const url = button.dataset.url;
    if (url !== undefined) void invoke("open_external", { url }).catch(showMessage);
    return;
  }
  const card = button.closest<HTMLElement>("[data-instance]");
  const instanceId = card?.dataset.instance;
  if (instanceId === undefined) return;
  if (action === "open-latest") {
    void invoke("request_instance_action", { instanceId, action }).catch(showMessage);
  } else if (action === "open-workspace") {
    const navigation = runtime.instances.find((instance) => instance.instance.instanceId === instanceId)
      ?.instance.navigation;
    if (navigation !== undefined) void invoke("open_navigation", { navigation }).catch(showMessage);
  } else if (action === "hide" || action === "enable") {
    const enabled = action === "enable";
    void updateInstance(instanceId, {
      ...settings.instances[instanceId],
      visible: enabled,
      monitoringEnabled: enabled,
    });
  }
});

app.addEventListener("submit", (event) => {
  if (!(event.target instanceof HTMLFormElement) || event.target.id !== "manual-form") return;
  event.preventDefault();
  const data = new FormData(event.target);
  void invoke<AppSettings>("add_manual_instance", {
    agentType: String(data.get("agentType")),
    workspacePath: String(data.get("workspacePath") ?? "").trim(),
  }).then(async (updated) => {
    settings = normalizeSettings(updated);
    await invoke("request_rescan");
    message = "工作区已添加，等待该工作区的新任务。";
    window.setTimeout(() => void refresh().catch(showMessage), 400);
  }).catch(showMessage);
});

async function updateApp(patch: AppSettingsPatch): Promise<void> {
  try {
    settings = normalizeSettings(await invoke<AppSettings>("update_app_settings", { patch }));
    render();
  } catch (error) {
    showMessage(error);
  }
}

async function updateInstance(instanceId: string, preferences: InstancePreferences): Promise<void> {
  try {
    settings = normalizeSettings(await invoke<AppSettings>("update_instance_settings", { instanceId, preferences }));
    window.setTimeout(() => void refresh().catch(showMessage), 80);
  } catch (error) {
    showMessage(error);
  }
}

async function rescan(): Promise<void> {
  try {
    await invoke("request_rescan");
    message = "已请求重新扫描；保留所有实例覆写与手动目录。";
    window.setTimeout(() => void refresh().catch(showMessage), 400);
  } catch (error) {
    showMessage(error);
  }
}

function showMessage(error: unknown): void {
  message = error instanceof Error ? error.message : String(error);
  render();
}

function showFatal(error: unknown): void {
  const detail = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
  app.innerHTML = `
    <header class="panel-header"><h1>iToppy 控制面板</h1></header>
    <p class="notice" role="alert">初始化失败：${escapeHtml(detail)}</p>
  `;
}

function escapeHtml(value: unknown): string {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character] ?? character);
}

app.innerHTML = '<p class="notice" role="status">正在加载控制面板…</p>';
window.addEventListener("error", (event) => showFatal(event.error ?? event.message));
window.addEventListener("unhandledrejection", (event) => showFatal(event.reason));

await listen<AppSettings>("settings-changed", (event) => {
  settings = normalizeSettings(event.payload);
  window.setTimeout(() => void refresh().catch(showMessage), 80);
});
try {
  await refresh();
} catch (error) {
  showFatal(error);
}
