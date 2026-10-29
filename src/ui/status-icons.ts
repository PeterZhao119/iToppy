import type { TaskSnapshot } from "../core/agents/model.js";

const paths: Record<string, string> = {
  idle: '<path d="M19 15a8 8 0 0 1-10-10 7 7 0 1 0 10 10Z"/>',
  "running.generic": '<path d="M20 12a8 8 0 1 1-2.3-5.6"/><path d="M12 7v5l3 2"/><path d="M18 3v4h-4"/>',
  "running.thinking": '<path d="M6 16h11a4 4 0 0 0 .8-7.9A6 6 0 0 0 6.2 7 4.5 4.5 0 0 0 6 16Z"/><path d="M8 16v3m5-3v4m5-4v3"/><path d="M9 11h.01M13 11h.01M16 11h.01"/>',
  "running.tool_calling": '<path d="M14.7 6.3a4 4 0 0 0-5-5L12 3.6 9.6 6 7.3 3.7a4 4 0 0 0 5 5L4 17a2.1 2.1 0 0 0 3 3l7.7-7.7a4 4 0 0 0 5-5L17.4 9.6 15 7.2l2.3-2.3a4 4 0 0 0-2.6 1.4Z"/>',
  "running.searching": '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5M8 10.5h5M10.5 8v5"/>',
  succeeded: '<circle cx="12" cy="12" r="9"/><path d="m8 12 2.5 2.5L16 9"/>',
  failed: '<path d="M12 3 2.5 20h19L12 3Z"/><path d="M12 9v5m0 3h.01"/>',
  succeeded_idle: '<path d="m4 13 2.5 2.5L12 10"/><path d="M20 6a6 6 0 0 1-8 8 7 7 0 0 0 8-8Z"/>',
  failed_idle: '<circle cx="12" cy="12" r="9"/><path d="M12 7v6m0 4h.01"/>',
  dragging: '<path d="M8 12V6a2 2 0 0 1 4 0v5-7a2 2 0 0 1 4 0v7-5a2 2 0 0 1 4 0v8c0 5-3 8-8 8-3 0-5-2-7-5l-2-3a2 2 0 0 1 3-2l2 2"/>',
  degraded: '<path d="M12 3 2.5 20h19L12 3Z"/><path d="M12 9v5m0 3h.01"/>',
};

export function statusIcon(primary: TaskSnapshot | undefined): string {
  const state = primary?.state ?? "idle";
  const key = primary?.monitorHealth === "degraded"
    ? "degraded"
    : state === "running" ? `running.${primary?.activity ?? "generic"}` : state;
  return `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">${paths[key] ?? paths.idle}</svg>`;
}
