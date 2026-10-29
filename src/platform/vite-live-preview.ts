import type { IncomingMessage, ServerResponse } from "node:http";
import type { Plugin } from "vite";
import type { AgentEvent } from "../core/agents/model.js";
import { SourceInstanceRuntime } from "../core/agents/source-instance-runtime.js";
import { KimiSessionIndex } from "../adapters/kimi-code/source-index.js";
import { NodeKimiWatcher } from "./node-kimi-watcher.js";
import { NodeReadHost } from "./node-read-host.js";

const resultSettleDelayMs = 20_000;

interface MiddlewareServer {
  middlewares: {
    use: (
      handler: (request: IncomingMessage, response: ServerResponse, next: () => void) => void,
    ) => void;
  };
  httpServer: {
    on: (event: "close", listener: () => void) => void;
  } | null;
}

export function createLivePreviewPlugin(): Plugin {
  const runtime = new SourceInstanceRuntime();
  const clients = new Set<ServerResponse>();
  const settleTimers = new Map<string, NodeJS.Timeout>();
  const host = new NodeReadHost();
  const sessionIndex = new KimiSessionIndex(host);
  let monitorError: string | undefined;
  let heartbeat: NodeJS.Timeout | undefined;
  let watcher: NodeKimiWatcher | undefined;
  let started = false;

  const payload = (): string => JSON.stringify({
    instances: runtime.snapshots(),
    pendingCount: runtime.pendingCount(),
    monitorError,
  });

  const send = (response: ServerResponse): void => {
    response.write(`event: snapshots\ndata: ${payload()}\n\n`);
  };

  const broadcast = (): void => {
    for (const client of clients) send(client);
  };

  const apply = (event: AgentEvent): void => {
    const timerKey = `${event.instanceId ?? "pending"}:${event.sessionId}`;
    if (event.type === "task_submitted" || event.type === "task_interrupted") {
      const timer = settleTimers.get(timerKey);
      if (timer !== undefined) clearTimeout(timer);
      settleTimers.delete(timerKey);
    }
    runtime.apply(event);

    if (event.type === "task_succeeded" || event.type === "task_failed") {
      const previous = settleTimers.get(timerKey);
      if (previous !== undefined) clearTimeout(previous);
      settleTimers.set(timerKey, setTimeout(() => {
        settleTimers.delete(timerKey);
        runtime.apply({
          type: "result_settled",
          agentType: event.agentType,
          sessionId: event.sessionId,
          instanceId: event.instanceId,
          sourceInstance: event.sourceInstance,
          source: event.source,
          occurredAt: Date.now(),
        });
        broadcast();
      }, resultSettleDelayMs));
    }
    broadcast();
  };

  const attach = async (server: MiddlewareServer): Promise<void> => {
    server.middlewares.use((request, response, next) => {
      if (request.url !== "/__itoppy/events") {
        next();
        return;
      }
      response.writeHead(200, {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      });
      response.write(": connected\n\n");
      clients.add(response);
      send(response);
      request.on("close", () => clients.delete(response));
    });

    if (!started) {
      started = true;
      watcher = new NodeKimiWatcher(sessionIndex.sessionsPath, {
        sessionIndex,
        onEvent: apply,
        onError: (error) => {
          monitorError = errorMessage(error);
          broadcast();
        },
      });
      try {
        await watcher.start();
      } catch (error) {
        monitorError = errorMessage(error);
        console.error(`[iToppy] ${monitorError}`);
      }
      heartbeat = setInterval(() => {
        for (const client of clients) client.write(": keepalive\n\n");
      }, 25_000);
    }

    server.httpServer?.on("close", () => {
      for (const client of clients) client.end();
      clients.clear();
      if (heartbeat !== undefined) clearInterval(heartbeat);
      for (const timer of settleTimers.values()) clearTimeout(timer);
      settleTimers.clear();
      void watcher?.close();
    });
  };

  return {
    name: "itoppy-live-preview",
    async configureServer(server) {
      await attach(server);
    },
    async configurePreviewServer(server) {
      await attach(server);
    },
  };
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
