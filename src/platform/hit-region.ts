export interface HitRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface SpriteBBoxCache {
  key: string;
  rect: HitRect | undefined;
}

const ALPHA_THRESHOLD = 10;

export function unionRects(rects: HitRect[]): HitRect | undefined {
  if (rects.length === 0) return undefined;
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const rect of rects) {
    minX = Math.min(minX, rect.x);
    minY = Math.min(minY, rect.y);
    maxX = Math.max(maxX, rect.x + rect.w);
    maxY = Math.max(maxY, rect.y + rect.h);
  }
  if (maxX <= minX || maxY <= minY) return undefined;
  return { x: minX, y: minY, w: maxX - minX, h: maxY - minY };
}

export function bboxFromAlpha(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  alphaThreshold = ALPHA_THRESHOLD,
): HitRect | undefined {
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;
  for (let y = 0; y < height; y += 1) {
    const row = y * width;
    for (let x = 0; x < width; x += 1) {
      if ((data[(row + x) * 4 + 3] ?? 0) > alphaThreshold) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX < 0 || maxY < 0) return undefined;
  return { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 };
}

export function resolveSpriteBBox(
  cache: SpriteBBoxCache | undefined,
  key: string,
  data: Uint8ClampedArray,
  width: number,
  height: number,
): SpriteBBoxCache {
  if (cache !== undefined && cache.key === key) return cache;
  const rect = bboxFromAlpha(data, width, height);
  // 动画切换的过渡帧可能整帧透明：保留上一个有效包围盒，避免交互区闪烁。
  if (rect === undefined && cache !== undefined) return cache;
  return { key, rect };
}

export function toRegion(rect: HitRect | undefined): HitRect | undefined {
  if (rect === undefined || rect.w <= 0 || rect.h <= 0) return undefined;
  return {
    x: Math.round(rect.x * 10) / 10,
    y: Math.round(rect.y * 10) / 10,
    w: Math.round(rect.w * 10) / 10,
    h: Math.round(rect.h * 10) / 10,
  };
}

export function rectsEqual(a: HitRect | undefined, b: HitRect | undefined): boolean {
  if (a === undefined || b === undefined) return a === b;
  return a.x === b.x && a.y === b.y && a.w === b.w && a.h === b.h;
}
