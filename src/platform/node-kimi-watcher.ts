import { watch, type FSWatcher } from "node:fs";
import { open, stat } from "node:fs/promises";
import { join } from "node:path";
import type { AgentEvent, SourceInstance } from "../core/agents/model.js";
import { KimiSessionIndex } from "../adapters/kimi-code/source-index.js";
import { WireParser } from "../adapters/kimi-code/wire.js";
import { NodeReadHost } from "./node-read-host.js";

interface FileCursor {
  offset: number;
  remainder: string;
  parser: WireParser;
  sessionId: string;
  sourceInstance?: SourceInstance;
}

interface NodeKimiWatcherOptions {
  sessionIndex?: KimiSessionIndex;
  onEvent?: (event: AgentEvent) => void;
  onError?: (error: unknown) => void;
}

export class NodeKimiWatcher {
  private readonly cursors = new Map<string, FileCursor>();
  private readonly timers = new Map<string, NodeJS.Timeout>();
  private readonly sessionIndex: KimiSessionIndex;
  private watcher?: FSWatcher;
  private queue: Promise<void> = Promise.resolve();

  constructor(
    private readonly sessionsPath: string,
    private readonly options: NodeKimiWatcherOptions = {},
  ) {
    this.sessionIndex = options.sessionIndex ?? new KimiSessionIndex(new NodeReadHost());
  }

  async start(): Promise<void> {
    await this.sessionIndex.refresh();
    for (const path of await this.findWireFiles(this.sessionsPath)) {
      const size = (await stat(path)).size;
      const sessionId = sessionIdFromPath(path);
      this.cursors.set(
        path,
        this.createCursor(path, size, this.sessionIndex.sourceFor(sessionId, path)),
      );
    }

    this.watcher = watch(this.sessionsPath, { recursive: true }, (_event, filename) => {
      if (filename === null) return;
      const relative = filename.toString();
      if (!relative.endsWith("wire.jsonl")) return;
      this.schedule(join(this.sessionsPath, relative));
    });

    if (this.options.onEvent === undefined) {
      console.log(`[watching] ${this.sessionsPath}`);
      console.log(`[ready] ${this.cursors.size} existing Wire files skipped; waiting for new events.`);
    }
  }

  async close(): Promise<void> {
    this.watcher?.close();
    for (const timer of this.timers.values()) clearTimeout(timer);
    this.timers.clear();
    await this.queue;
  }

  private createCursor(
    path: string,
    offset: number,
    sourceInstance?: SourceInstance,
  ): FileCursor {
    const sessionId = sessionIdFromPath(path);
    return {
      offset,
      remainder: "",
      sessionId,
      sourceInstance,
      parser: new WireParser({
        agentType: "kimi-code",
        sessionId,
        workspacePath: sourceInstance?.navigation.workspacePath,
      }),
    };
  }

  private async findWireFiles(root: string): Promise<string[]> {
    const { readdir } = await import("node:fs/promises");
    const results: string[] = [];
    const visit = async (path: string, depth: number): Promise<void> => {
      if (depth > 6) return;
      for (const entry of await readdir(path, { withFileTypes: true })) {
        const entryPath = join(path, entry.name);
        if (entry.isDirectory()) {
          await visit(entryPath, depth + 1);
        } else if (entry.name === "wire.jsonl") {
          results.push(entryPath);
        }
      }
    };
    await visit(root, 0);
    return results;
  }

  private schedule(path: string): void {
    const existing = this.timers.get(path);
    if (existing !== undefined) clearTimeout(existing);
    this.timers.set(
      path,
      setTimeout(() => {
        this.timers.delete(path);
        this.queue = this.queue.then(() => this.readAppended(path)).catch((error: unknown) => {
          if (this.options.onError !== undefined) this.options.onError(error);
          else console.error(`[monitor_degraded] ${errorMessage(error)}`);
        });
      }, 120),
    );
  }

  private async readAppended(path: string): Promise<void> {
    const size = (await stat(path)).size;
    let cursor = this.cursors.get(path);
    if (cursor === undefined || size < cursor.offset) {
      const sessionId = sessionIdFromPath(path);
      const sourceInstance = await this.sessionIndex.sourceForWithRefresh(sessionId, path);
      cursor = this.createCursor(path, 0, sourceInstance);
      this.cursors.set(path, cursor);
    }
    if (cursor.sourceInstance === undefined) {
      cursor.sourceInstance = await this.sessionIndex.sourceForWithRefresh(cursor.sessionId, path);
    }
    if (size === cursor.offset) return;

    const length = size - cursor.offset;
    const buffer = Buffer.alloc(length);
    const file = await open(path, "r");
    try {
      await file.read(buffer, 0, length, cursor.offset);
    } finally {
      await file.close();
    }
    cursor.offset = size;

    const lines = (cursor.remainder + buffer.toString("utf8")).split(/\r?\n/);
    cursor.remainder = lines.pop() ?? "";
    const complete = lines.join("\n");
    if (complete.trim() === "") return;

    for (const event of cursor.parser.parse(complete)) {
      this.emit(event, cursor.sourceInstance);
    }
  }

  private emit(event: AgentEvent, sourceInstance?: SourceInstance): void {
    const workspacePath = sourceInstance?.navigation.workspacePath;
    const enriched: AgentEvent = {
      ...event,
      instanceId: sourceInstance?.instanceId,
      sourceInstance,
      occurredAt: Date.now(),
      source: event.source === undefined ? undefined : {
        ...event.source,
        workspacePath,
        appBundleId: sourceInstance?.navigation.appBundleId,
      },
    };
    if (this.options.onEvent !== undefined) this.options.onEvent(enriched);
    else printEvent(enriched);
  }
}

function sessionIdFromPath(path: string): string {
  const segments = path.split("/");
  return segments.find((segment) => segment.startsWith("session_")) ?? segments.at(-2) ?? path;
}

function printEvent(event: AgentEvent): void {
  const activity = event.activity === undefined ? "" : ` activity=${event.activity}`;
  const response = event.response === undefined
    ? ""
    : ` response=${JSON.stringify(preview(event.response))}`;
  const message = event.message === undefined ? "" : ` message=${JSON.stringify(event.message)}`;
  const instance = event.sourceInstance === undefined ? "" : ` instance=${event.sourceInstance.displayName}`;
  console.log(`${new Date().toISOString()} ${event.type} session=${event.sessionId}${instance}${activity}${response}${message}`);
}

function preview(text: string): string {
  const normalized = text.replace(/\s+/g, " ").trim();
  const characters = [...normalized];
  return characters.length > 50 ? `${characters.slice(0, 50).join("")}…` : normalized;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
