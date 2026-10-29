import { AgentRegistry } from "./core/agents/registry.js";
import { CharacterRegistry } from "./core/characters/registry.js";
import { KimiCodeAdapter } from "./adapters/kimi-code/index.js";
import { SpriteRenderer } from "./characters/sprite-renderer.js";

export function createDefaultAgentRegistry(): AgentRegistry {
  const registry = new AgentRegistry();
  registry.registerAdapter(new KimiCodeAdapter());
  return registry;
}

export function createDefaultCharacterRegistry(): CharacterRegistry {
  const registry = new CharacterRegistry();
  registry.registerRenderer("sprite", (canvas) => new SpriteRenderer(canvas));
  return registry;
}

export { AgentRegistry } from "./core/agents/registry.js";
export { CharacterRegistry } from "./core/characters/registry.js";
export { ExtensionRegistry } from "./core/registry.js";
export { reduceTaskSnapshot, initialTaskSnapshot } from "./core/agents/state-machine.js";
export { SessionAggregator } from "./core/agents/session-aggregator.js";
export {
  SourceInstanceRuntime,
  defaultInstanceSettings,
} from "./core/agents/source-instance-runtime.js";
export { resolveAnimation } from "./core/characters/animation-resolver.js";
export { SpritePlayer } from "./core/characters/sprite-player.js";
export { SpriteRenderer } from "./characters/sprite-renderer.js";
export { loadCharacterDefinition } from "./characters/definition-loader.js";
export { KimiCodeAdapter, parseWire, workspaceDirectoryId } from "./adapters/kimi-code/index.js";
export type * from "./core/agents/model.js";
export type * from "./core/agents/adapter.js";
export type * from "./core/agents/host.js";
export type * from "./core/characters/model.js";
export type * from "./core/characters/renderer.js";
