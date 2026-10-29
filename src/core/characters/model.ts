export interface CharacterAnchor {
  x: number;
  y: number;
  position: string;
  coordinateSpace: string;
  origin: string;
}

export interface AnimationDefinition {
  spritesheet: string;
  frameCount: number;
  columns: number;
  rows: number;
  fps: number;
  durationSeconds: number;
  loop: boolean;
  frameOrder: "row_major";
}

export interface CharacterDefinition {
  id: string;
  name: string;
  version: string;
  frameWidth: number;
  frameHeight: number;
  anchor: CharacterAnchor;
  fps: number;
  animations: Record<string, AnimationDefinition>;
  stateMap?: Record<string, string>;
}

export interface AnimationRequest {
  state: string;
  activity?: string;
  direction?: "left" | "right";
}

export interface SpriteFrame {
  index: number;
  x: number;
  y: number;
  width: number;
  height: number;
  completed: boolean;
}
