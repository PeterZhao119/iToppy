import type {
  AnimationDefinition,
  CharacterDefinition,
} from "../core/characters/model.js";

interface RawAnimation {
  spritesheet: string;
  frame_count: number;
  columns: number;
  rows: number;
  fps: number;
  duration_seconds: number;
  loop: boolean;
  frame_order: "row_major";
}

interface RawCharacter {
  id: string;
  name: string;
  version: string;
  frame_width: number;
  frame_height: number;
  anchor: CharacterDefinition["anchor"];
  fps: number;
  animations: Record<string, RawAnimation>;
  stateMap?: Record<string, string>;
}

export async function loadCharacterDefinition(url: string): Promise<CharacterDefinition> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Unable to load character definition '${url}'.`);
  const raw = (await response.json()) as RawCharacter;
  const animations = Object.fromEntries(
    Object.entries(raw.animations).map(([name, animation]): [string, AnimationDefinition] => [
      name,
      {
        spritesheet: animation.spritesheet,
        frameCount: animation.frame_count,
        columns: animation.columns,
        rows: animation.rows,
        fps: animation.fps,
        durationSeconds: animation.duration_seconds,
        loop: animation.loop,
        frameOrder: animation.frame_order,
      },
    ]),
  );

  return {
    id: raw.id,
    name: raw.name,
    version: raw.version,
    frameWidth: raw.frame_width,
    frameHeight: raw.frame_height,
    anchor: raw.anchor,
    fps: raw.fps,
    animations,
    stateMap: raw.stateMap,
  };
}
