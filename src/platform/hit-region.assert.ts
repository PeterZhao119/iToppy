import {
  bboxFromAlpha,
  rectsEqual,
  resolveSpriteBBox,
  toRegion,
  unionRects,
  type SpriteBBoxCache,
} from "./hit-region.js";

function assertEqual(actual: unknown, expected: unknown, message: string): void {
  const actualJson = JSON.stringify(actual);
  const expectedJson = JSON.stringify(expected);
  if (actualJson !== expectedJson) {
    throw new Error(`Assertion failed (${message}): expected ${expectedJson}, got ${actualJson}`);
  }
  console.log(`ok - ${message}`);
}

// 并集计算：sprite bbox + 名字牌 + 气泡
assertEqual(
  unionRects([
    { x: 60, y: 175, w: 104, h: 185 },
    { x: 30, y: 128, w: 120, h: 34 },
    { x: 6, y: 60, w: 208, h: 80 },
  ]),
  { x: 6, y: 60, w: 208, h: 300 },
  "sprite+nametag+bubble 并集取最大外接矩形",
);
assertEqual(
  unionRects([{ x: 10, y: 10, w: 0, h: 0 }]),
  undefined,
  "零尺寸矩形列表返回 undefined",
);
assertEqual(unionRects([]), undefined, "空列表返回 undefined");

// sprite bbox：alpha > 10 的像素包围盒
function rgbaPixels(width: number, height: number, opaque: Array<[number, number]>): Uint8ClampedArray {
  const data = new Uint8ClampedArray(width * height * 4);
  for (const [x, y] of opaque) {
    const offset = (y * width + x) * 4;
    data[offset] = 255;
    data[offset + 1] = 255;
    data[offset + 2] = 255;
    data[offset + 3] = 255;
  }
  return data;
}
assertEqual(
  bboxFromAlpha(rgbaPixels(4, 3, [[1, 1], [3, 2]]), 4, 3),
  { x: 1, y: 1, w: 3, h: 2 },
  "bbox 覆盖所有不透明像素（含边缘）",
);
assertEqual(
  bboxFromAlpha(rgbaPixels(4, 3, [[0, 0]]), 4, 3, 10),
  { x: 0, y: 0, w: 1, h: 1 },
  "单像素 bbox",
);
{
  const lowAlpha = new Uint8ClampedArray(4 * 3 * 4);
  lowAlpha[3] = 10;
  assertEqual(bboxFromAlpha(lowAlpha, 4, 3), undefined, "alpha<=10 视为透明");
}
assertEqual(
  bboxFromAlpha(new Uint8ClampedArray(4 * 3 * 4), 4, 3),
  undefined,
  "全透明帧返回 undefined",
);

// bbox 缓存语义：仅动画 key 变化才重算；全透明过渡帧退回上一缓存
{
  const frameA = rgbaPixels(4, 3, [[1, 1], [2, 2]]);
  const frameTransition = new Uint8ClampedArray(4 * 3 * 4);
  const frameB = rgbaPixels(4, 3, [[0, 0], [3, 2]]);
  let cache: SpriteBBoxCache | undefined;
  cache = resolveSpriteBBox(cache, "idle:none", frameA, 4, 3);
  assertEqual(cache.rect, { x: 1, y: 1, w: 2, h: 2 }, "首次计算 bbox");
  const sameKey = resolveSpriteBBox(cache, "idle:none", frameB, 4, 3);
  assertEqual(sameKey, cache, "key 未变直接复用缓存（即使像素变了）");
  cache = resolveSpriteBBox(cache, "dragging:", frameTransition, 4, 3);
  assertEqual(
    cache,
    { key: "idle:none", rect: { x: 1, y: 1, w: 2, h: 2 } },
    "全透明过渡帧保留上一缓存的 key 与 rect",
  );
  cache = resolveSpriteBBox(cache, "running:thinking", frameB, 4, 3);
  assertEqual(cache.rect, { x: 0, y: 0, w: 4, h: 3 }, "新动画 key 重算 bbox");
  const initialEmpty = resolveSpriteBBox(undefined, "boot", frameTransition, 4, 3);
  assertEqual(initialEmpty, { key: "boot", rect: undefined }, "无缓存且全透明时 rect 为 undefined");
}

// Region 序列化
assertEqual(
  toRegion({ x: 60.04, y: 175.06, w: 104, h: 185 }),
  { x: 60, y: 175.1, w: 104, h: 185 },
  "toRegion 保留一位小数",
);
assertEqual(toRegion(undefined), undefined, "undefined 原样透传");
assertEqual(toRegion({ x: 0, y: 0, w: 0, h: 10 }), undefined, "零宽矩形拒绝上报");

// 上报去重
assertEqual(rectsEqual({ x: 1, y: 2, w: 3, h: 4 }, { x: 1, y: 2, w: 3, h: 4 }), true, "相同矩形相等");
assertEqual(rectsEqual(undefined, undefined), true, "双 undefined 相等");
assertEqual(rectsEqual(undefined, { x: 0, y: 0, w: 1, h: 1 }), false, "undefined 与矩形不等");

console.log("hit-region.assert.ts: all assertions passed");
