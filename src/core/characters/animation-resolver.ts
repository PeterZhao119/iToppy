import type { AnimationRequest, CharacterDefinition } from "./model.js";

export function resolveAnimation(
  definition: CharacterDefinition,
  request: AnimationRequest,
): string {
  const candidates = [
    request.direction === undefined ? undefined : `${request.state}_${request.direction}`,
    request.activity === undefined ? undefined : `${request.state}.${request.activity}`,
    request.state,
  ].filter((value): value is string => value !== undefined);

  for (const candidate of candidates) {
    const mapped = definition.stateMap?.[candidate] ?? candidate;
    if (definition.animations[mapped] !== undefined) return mapped;
  }

  const fallback = definition.stateMap?.idle ?? "idle";
  if (definition.animations[fallback] === undefined) {
    throw new Error(`Character '${definition.id}' cannot resolve '${request.state}' or idle.`);
  }
  return fallback;
}
