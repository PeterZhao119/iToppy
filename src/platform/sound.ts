export type StateSound = "start" | "succeeded" | "failed" | "interrupted";

const SFX_BASE_URL = "/asset/audio/sfx";
const LINE_BASE_URL = "/asset/audio/characters";
const KNOWN_CHARACTERS = new Set(["deepseek", "claude", "gpt", "doubao", "qq", "kimi"]);
const DEFAULT_VOLUME = 0.6;
const INTERRUPTED_VOLUME = 0.3;

export function mapSoundAssets(characterId: string | undefined, state: StateSound): string[] {
  const sfxName = state === "interrupted" ? "failed" : state;
  const urls = [`${SFX_BASE_URL}/_${sfxName}.m4a`];
  if (state !== "interrupted" && characterId !== undefined && KNOWN_CHARACTERS.has(characterId)) {
    urls.push(`${LINE_BASE_URL}/${characterId}/${state}.mp3`);
  }
  return urls;
}

let audio: HTMLAudioElement | undefined;
let queue: string[] = [];

export function playStateSound(
  characterId: string | undefined,
  state: StateSound,
  enabled: boolean,
): void {
  if (!enabled) return;
  queue = mapSoundAssets(characterId, state);
  if (queue.length === 0) return;
  if (typeof Audio === "undefined") return;
  if (audio === undefined) {
    audio = new Audio();
    audio.addEventListener("ended", playNext);
    audio.addEventListener("error", playNext);
  }
  audio.volume = state === "interrupted" ? INTERRUPTED_VOLUME : DEFAULT_VOLUME;
  playNext();
}

function playNext(): void {
  if (audio === undefined) return;
  const url = queue.shift();
  if (url === undefined) return;
  audio.src = url;
  audio.play().catch(() => {
    // 文件缺失或自动播放被拦截：静默兜底，不打断后续播放链。
  });
}
