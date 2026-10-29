import type { AnimationDefinition, CharacterDefinition, SpriteFrame } from "./model.js";

export class SpritePlayer {
  private animation?: AnimationDefinition;
  private definition?: CharacterDefinition;
  private elapsedSeconds = 0;

  play(definition: CharacterDefinition, animation: AnimationDefinition): void {
    this.definition = definition;
    this.animation = animation;
    this.elapsedSeconds = 0;
  }

  update(deltaSeconds: number): SpriteFrame | undefined {
    if (this.animation === undefined || this.definition === undefined) return undefined;

    this.elapsedSeconds += Math.max(0, deltaSeconds);
    const frameCount = this.animation.frameCount;
    const elapsedFrame = Math.floor(this.elapsedSeconds * this.animation.fps);
    const completed = !this.animation.loop && elapsedFrame >= frameCount;
    const index = this.animation.loop
      ? elapsedFrame % frameCount
      : Math.min(elapsedFrame, frameCount - 1);
    const column = index % this.animation.columns;

    return {
      index,
      x: column * this.definition.frameWidth,
      y: Math.floor(index / this.animation.columns) * this.definition.frameHeight,
      width: this.definition.frameWidth,
      height: this.definition.frameHeight,
      completed,
    };
  }
}
