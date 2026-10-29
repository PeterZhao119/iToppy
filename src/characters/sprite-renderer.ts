import type { CharacterDefinition } from "../core/characters/model.js";
import type { CharacterRenderer } from "../core/characters/renderer.js";
import { SpritePlayer } from "../core/characters/sprite-player.js";

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Unable to load character asset '${url}'.`));
    image.src = url;
  });
}

export class SpriteRenderer implements CharacterRenderer {
  private readonly player = new SpritePlayer();
  private readonly images = new Map<string, HTMLImageElement>();
  private definition?: CharacterDefinition;
  private currentAnimation?: string;

  constructor(private readonly canvas: HTMLCanvasElement) {}

  async load(definition: CharacterDefinition, assetBaseUrl: string): Promise<void> {
    this.definition = definition;
    this.canvas.width = definition.frameWidth;
    this.canvas.height = definition.frameHeight;
    this.images.clear();

    const paths = new Set(
      Object.values(definition.animations).map((animation) => animation.spritesheet),
    );
    await Promise.all(
      [...paths].map(async (path) => {
        const url = `${assetBaseUrl.replace(/\/$/, "")}/${path}`;
        this.images.set(path, await loadImage(url));
      }),
    );
  }

  play(animationName: string): void {
    if (this.definition === undefined) throw new Error("Character has not been loaded.");
    const animation = this.definition.animations[animationName];
    if (animation === undefined) {
      throw new Error(`Animation '${animationName}' is not defined for '${this.definition.id}'.`);
    }
    this.currentAnimation = animationName;
    this.player.play(this.definition, animation);
    this.update(0);
  }

  update(deltaSeconds: number): void {
    if (this.definition === undefined || this.currentAnimation === undefined) return;
    const animation = this.definition.animations[this.currentAnimation];
    if (animation === undefined) return;
    const image = this.images.get(animation.spritesheet);
    const frame = this.player.update(deltaSeconds);
    const context = this.canvas.getContext("2d");
    if (context === null || image === undefined || frame === undefined) return;

    context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    context.drawImage(
      image,
      frame.x,
      frame.y,
      frame.width,
      frame.height,
      0,
      0,
      this.definition.frameWidth,
      this.definition.frameHeight,
    );
  }

  stop(): void {
    this.currentAnimation = undefined;
    this.canvas.getContext("2d")?.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  destroy(): void {
    this.stop();
    this.images.clear();
    this.definition = undefined;
  }
}
