import { KimiSessionIndex } from "./adapters/kimi-code/source-index.js";
import { NodeKimiWatcher } from "./platform/node-kimi-watcher.js";
import { NodeReadHost } from "./platform/node-read-host.js";

const sessionIndex = new KimiSessionIndex(new NodeReadHost());
const watcher = new NodeKimiWatcher(sessionIndex.sessionsPath, { sessionIndex });
await watcher.start();

const shutdown = async (): Promise<void> => {
  await watcher.close();
  process.exit(0);
};

process.on("SIGINT", () => void shutdown());
process.on("SIGTERM", () => void shutdown());
