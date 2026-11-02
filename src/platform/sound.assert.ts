import { mapSoundAssets, playStateSound } from "./sound.js";

function assertEqual(actual: unknown, expected: unknown, message: string): void {
  const actualJson = JSON.stringify(actual);
  const expectedJson = JSON.stringify(expected);
  if (actualJson !== expectedJson) {
    throw new Error(`Assertion failed (${message}): expected ${expectedJson}, got ${actualJson}`);
  }
  console.log(`ok - ${message}`);
}

assertEqual(
  mapSoundAssets("kimi", "succeeded"),
  ["/asset/audio/sfx/_succeeded.m4a", "/asset/audio/characters/kimi/succeeded.mp3"],
  "kimi succeeded 先 sfx 后台词",
);
assertEqual(
  mapSoundAssets("deepseek", "start"),
  ["/asset/audio/sfx/_start.m4a", "/asset/audio/characters/deepseek/start.mp3"],
  "deepseek start 先 sfx 后台词",
);
assertEqual(
  mapSoundAssets("claude", "failed"),
  ["/asset/audio/sfx/_failed.m4a", "/asset/audio/characters/claude/failed.mp3"],
  "claude failed 先 sfx 后台词",
);
assertEqual(
  mapSoundAssets("xiaocaoshen", "succeeded"),
  ["/asset/audio/sfx/_succeeded.m4a"],
  "xiaocaoshen 缺台词只返回 sfx",
);
assertEqual(
  mapSoundAssets(undefined, "start"),
  ["/asset/audio/sfx/_start.m4a"],
  "undefined characterId 只返回 sfx",
);
assertEqual(
  mapSoundAssets("kimi", "interrupted"),
  ["/asset/audio/sfx/_failed.m4a"],
  "interrupted 复用 _failed.m4a 且无台词",
);
playStateSound("kimi", "succeeded", false);
console.log("ok - enabled=false 直接返回不播放");
console.log("sound.assert.ts: all assertions passed");
