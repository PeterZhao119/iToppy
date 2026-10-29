import type { CharacterDefinition } from "./model.js";

export interface CharacterRenderer {
  load(definition: CharacterDefinition, assetBaseUrl: string): Promise<void>;
  play(animationName: string): void;
  update(deltaSeconds: number): void;
  stop(): void;
  destroy(): void;
}

export type CharacterRendererFactory = (canvas: HTMLCanvasElement) => CharacterRenderer;
