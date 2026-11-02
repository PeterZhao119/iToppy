// 内联断言：npx tsx src/adapters/claude-code/source-index.assert.ts
import { sourceKind } from "./source-index.js";

const cases: [string, "vscode" | "app" | "cli"][] = [
  ["sdk-cli", "cli"],
  ["cli", "cli"],
  ["vscode", "vscode"],
  ["vscode-plugin", "vscode"],
  ["some-ide", "vscode"],
  ["desktop", "app"],
  ["claude-desktop", "app"],
  // 同时含 ide/desktop 关键字时必须归 app（desktop 判定优先，对齐 codex 修正）
  ["claude-ide-desktop", "app"],
  ["desktop-vscode", "app"],
];

let failed = 0;
for (const [entrypoint, expected] of cases) {
  const actual = sourceKind(entrypoint);
  if (actual !== expected) {
    failed += 1;
    console.error(`FAIL  ${entrypoint} -> ${actual}, expect ${expected}`);
  } else {
    console.log(`PASS  ${entrypoint} -> ${actual}`);
  }
}
// 未映射的 entrypoint（如 cursor）保守回落 cli，行为在此锚定
if (sourceKind("cursor") !== "cli") {
  failed += 1;
  console.error("FAIL  cursor 应保持 cli 回落");
} else {
  console.log("PASS  cursor -> cli（未映射值回落，待实机后再扩展）");
}

if (failed > 0) process.exit(1);
console.log(`\n${cases.length + 1} passed, 0 failed`);
