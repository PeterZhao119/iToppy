import { ExtensionRegistry } from "../registry.js";
import type { CharacterDefinition } from "./model.js";
import type { CharacterRendererFactory } from "./renderer.js";

export class CharacterRegistry {
  readonly definitions = new ExtensionRegistry<CharacterDefinition>();
  readonly renderers = new ExtensionRegistry<CharacterRendererFactory>();

  registerDefinition(definition: CharacterDefinition, options: { override?: boolean } = {}): void {
    this.definitions.register(definition.id, definition, options);
  }

  registerRenderer(
    id: string,
    factory: CharacterRendererFactory,
    options: { override?: boolean } = {},
  ): void {
    this.renderers.register(id, factory, options);
  }
}
