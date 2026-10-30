# Kimi 角色制作记录

## 角色方向

银白长卷发、女仆头饰、黑色蝴蝶结、星月花纹长裙和深色小书。性格为表面乖巧端庄、实际腹黑少女，偶尔带有无声的黑色小幽默。

## 已制作母版

| 内容 | 模型与参数 | 结果 | 费用 |
|---|---|---|---:|
| 初始 Q 版全身图 | RunningHub 全能图片 G-2 官方版，绿幕 | `draft/q-full-green.png` | ¥0.108 |
| 长待机：阅读会笑 | Seedance 2.5，首尾同图，5 秒、480p、无音频 | `draft/idle-read/preview.mp4` | ¥0.648 |
| 长待机：月影转身 | 同上，角色先变暗、阴险笑、再恢复 | `draft/idle-moon/preview.mp4` | ¥0.648 |

## 2026-10-30 补齐八组动作

统一参数：Seedance 2.5 图生视频（`bytedance/seedance-2.5-token/image-to-video`），首帧=尾帧=`draft/q-full-green.png`，480p、4 秒、无音频；提示词全文与参考图逻辑见 `draft/gen-2026-10-30/prompts.md`。每组源视频按 12fps 抽前 2 秒 24 帧（个别组经两段对比后选取），统一 384×683、6 列、底边中心锚点，抠像脚本 `key.py`（软阈值绿幕抠除 + 半透明区去绿边，已在既有 idle-read 帧上对比验证），图集 `sheet.py`、校验 `validate.py`。

| 动作 | 源视频 | 选取段 | 结果与处理 | 费用 |
|---|---|---|---|---:|
| idle 微动待机 | `draft/gen-2026-10-30/idle-source.mp4` | 0–2s | 通过：几乎静止、睁眼、发梢裙摆微动 | ¥0.52 |
| walk_left 左向行走 | `draft/gen-2026-10-30/walk_left-source.mp4` | 2–4s | 通过：0–2s 腿部动作太弱，2–4s 步伐清晰；双手持书、不出框 | ¥0.52 |
| running.thinking | `draft/gen-2026-10-30/thinking-source.mp4` | 0–2s | 通过：低头点书、结尾轻微坏笑 | ¥0.52 |
| running.tool_calling | `draft/gen-2026-10-30/tool_calling-source.mp4` | 2–4s | 通过：0–2s 半透明面板透出绿幕被抠出破洞；2–4s 面板稳定完整、单手指点、另一手持书；面板呈青蓝色全息质感 | ¥0.52 |
| running.searching | `draft/gen-2026-10-30/searching-source.mp4` | 2–4s | 通过：举镜段放大镜为完整正圆且贴近眼睛观察；0–2s 放大镜远离脸部时镜片反射绿幕被抠除出现黑斑，弃用该段 | ¥0.52 |
| succeeded | `draft/gen-2026-10-30/succeeded-source.mp4` | 0–2s | 通过：克制鼓掌两下、满意不夸张；后 2 秒回站姿不入包 | ¥0.52 |
| failed | `draft/gen-2026-10-30/failed-source.mp4` | 0–2s | 通过：先愣住空洞、第 24 帧转为玩味微笑；后 2 秒回站姿不入包 | ¥0.52 |
| dragging | `draft/gen-2026-10-30/dragging-source.mp4` | 0–2s 回环 | 通过：一次生成即成功托腮睁眼；第 14–24 帧为稳定托腮保持，直接循环首尾跳变明显，改用 f11–f23 正放 + f22–f12 倒放的乒乓回环（24 帧） | ¥0.52 |

派生：`walk_right` 为 `walk_left` 水平镜像（逐帧 FLIP_LEFT_RIGHT）；`succeeded_idle` / `failed_idle` 取对应动作第 24 帧（情绪姿态）静态复制 24 帧；`succeeded` / `failed` 设 `loop: false`，其余按 doubao 规范。

## 角色包

`package/` 共 13 组：`character.json`（格式参照 doubao，stateMap：`running.generic→running.tool_calling`、`idle_adjust_skirt→idle_moon`、`idle_tail_cuddle→idle_read`）、`thumbnail.png`（192×342，取自 idle 图集首帧）、`spritesheets/` 13 张 RGBA 图集（2 秒动作 2304×2732 24 帧 6×4，长待机 2304×6830 60 帧 6×10，均 12fps）。

机器校验（`validate.py`）：13 组、帧数=列×行、图集尺寸=384×列/683×行、fps=12、时长匹配、thumbnail 192×342、stateMap 目标存在——全部 PASS。

新增预览：`draft/{idle,walk_left,thinking,tool_calling,searching,succeeded,failed,dragging}/preview.mp4`（12fps、24 帧，H.264 偶数尺寸 pad 到 384×684）。

**累计费用：¥5.564**（此前 ¥1.404 + 本次 8 × ¥0.52 = ¥4.16）。

## 经验记录

- 道具（放大镜、全息面板）离脸时镜片/半透明区会透出绿幕，抠像后出现透明破洞；选取道具贴近角色的片段可规避。
- 行走类动作前 2 秒可能过弱，需对比 0–2s / 2–4s 两段再定循环段。
- 托腮等"抬手"动作 Seedance 2.5 一次通过；若首尾跳变明显，稳定保持段 + 乒乓回环是低成本的循环化方案。
- Seedance 480p/4s 实测 ¥0.52/条，约 1–3 分钟出片。
