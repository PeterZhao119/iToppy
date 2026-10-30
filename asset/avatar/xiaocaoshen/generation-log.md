# 小草神角色制作记录

## 角色方向

银白短发、树叶发饰单侧马尾、翠绿大眼、精灵耳、金色叶冠、白绿渐变露肩连衣裙（金藤蔓纹）、深绿层叠披风、白花瓣裙摆、金手镯、白花苞鞋。性格：温柔安静的全知之神，从容、好奇、偶尔犯困。参考图为《原神》纳西妲（米哈游版权角色），本包为同人作品，仅限个人非商业使用，公开再分发需复核授权（见 NOTICE.md）。

## 母版

| 内容 | 模型与参数 | 结果 | 费用 |
|---|---|---|---:|
| 初始 Q 版全身绿幕图 | RunningHub 全能图片 G-2 官方版 | `draft/q-full-v1.png`（1664×2512，纯 #00FF00 绿幕） | ¥0.108 |

## 2026-10-30 十组动作

**供应商变更（重要）**：原计划沿用 Kimi 的 Seedance 2.5 流水线，但 `bytedance/seedance-2.5-token/image-to-video` 对该参考图（原神版权角色）触发版权过滤，4 次尝试（含 1 次微噪声母帧规避测试）全部报 `[1519] 输出视频可能涉及版权限制`，失败任务不计费。改用 **Kling 2.5-turbo-std 图生视频**（`kling-v2.5-turbo-std/image-to-video`，仅首帧、duration=5、¥0.18/条、约 2.5 分钟出片），无版权拦截。Kling 无尾帧参数，回环性靠选段保证。提示词全文见 `draft/gen-2026-10-30/prompts.md`（succeeded/failed 提示词按 5 秒时长把"后 2 秒"改为"后 3 秒"）。

源视频为 780×1180@24fps，统一抽帧 `fps=12,scale=-2:683,crop=384:683`（保持宽高比、居中裁宽），每组 61 帧取前 60。抠像沿用 `key.py`（软阈值绿幕抠除 + 去绿边），抠像边缘经验证干净（发丝、披风半透明区无明显破洞或绿边）。下载环节 runninghub.py 默认 300s 超时曾截断 6MB 视频，自制 `gen_kling.py` 封装（断点续传 + 低速重试）；首次 idle 生成因此报废重出（见下表 idle 行）。

| 动作 | 源视频 | 选取段 | 结果与处理 | 费用 |
|---|---|---|---|---:|
| idle 微动待机 | `gen-2026-10-30/idle-source.mp4` | 1–24 | 通过：近乎静态立绘、睁眼、发梢微动。首条 Kling 视频下载超时报废（仅留 `test-kling-idle.mp4` 残片），重出后用第二条（`test-kling-idle2.mp4`） | ¥0.36（2 条） |
| walk_left 左向行走 | `gen-2026-10-30/walk_left-source.mp4` | 31–54 | 通过：0–2 秒步伐过弱，31 帧起腿部交替清晰、身体基本居中；有少量眨眼帧在选段外 | ¥0.18 |
| running.thinking | `gen-2026-10-30/thinking-source.mp4` | 13–36 | 通过：眼神上瞟、歪头思考到浅笑的完整变化；指尖叶子道具未清晰成形，但表情叙事完整可用 | ¥0.18 |
| running.tool_calling | `gen-2026-10-30/tool_calling-source.mp4` | 10–33 | 通过：青绿全息面板稳定完整（半透明面板抠像后无破洞）、右手点触、左手下垂 | ¥0.18 |
| running.searching | `gen-2026-10-30/searching-source.mp4` | 1–48 | **偏离标准（6×4→6×8，48 帧 4 秒）**：耳机"长出→左右看→消失→恢复站立"完整循环约 4 秒，24 帧（2 秒）放不下，按预案取 48 帧；发光藤蔓耳机抠像后无脸部破洞 | ¥0.18 |
| succeeded | `gen-2026-10-30/succeeded-source.mp4`（v2） | 6–29 | v1（`succeeded-a-source.mp4` 保留）完全没有手势动作、只有微笑，弃用；v2 提示词强调"手臂明显抬到肩膀高度"后，6–10 帧右手掌心向上平伸、随后左手扶胸，动作 subtle 但完整 | ¥0.36（2 条） |
| failed | `gen-2026-10-30/failed-source.mp4`（v2） | 6–29 | v1（`failed-a-source.mp4` 保留）无歪头、只有微笑，弃用；v2 头部明显歪向一侧 + 歉意苦笑、随后回正，符合设定 | ¥0.36（2 条） |
| dragging 拖拽 | `gen-2026-10-30/dragging-source.mp4` | 乒乓回环 | 13–30 帧双手托腮保持，直接循环首尾跳变明显，按 Kimi 经验用 f14–f26 正放 + f25–f15 倒放凑 24 帧 | ¥0.18 |
| idle_swing 吊篮（长待机） | `gen-2026-10-30/idle_swing-source.mp4` | 1–60 | 通过：吊篮幻化→坐入摇晃→光点消失回站姿。**修复**：Kling 在吊篮下方烘了软阴影（深绿压在绿幕上），抠像后成灰绿半透明污斑；因 key.py 去绿边会改变绿色分量，须在抠像前用原始 RGB 计算绿色度，追加规则 `y≥580 且 greenness>0.10 → alpha=0`（该带状区仅阴影与纯白/金花苞鞋，鞋绿色度<0.10 不受影响） | ¥0.18 |
| idle_leaf 接落叶（长待机） | `gen-2026-10-30/idle_leaf-source.mp4` | 1–60 | 通过：发光落叶飘落、抬头伸手承接、叶落掌心发光、光点消散回站姿；黄叶绿色度低未被误抠 | ¥0.18 |

派生（与 Kimi 一致）：`walk_right` 为 `walk_left` 逐帧水平镜像；`succeeded_idle`/`failed_idle` 取对应动作第 24 帧静态复制 24 帧；`succeeded`/`failed` 设 `loop:false`；`thumbnail.png` 192×342 取自 idle 图集首帧。

## 角色包

`package/` 共 13 组：`character.json`（id=xiaocaoshen，name=小草神·布耶尔；stateMap：`running.generic→running.tool_calling`、`idle_adjust_skirt→idle_swing`、`idle_tail_cuddle→idle_leaf`）、`thumbnail.png`、`spritesheets/` 13 张 RGBA 图集（短动作 2304×2732 24 帧 6×4，searching 2304×5464 48 帧 6×8，长待机 2304×6830 60 帧 6×10，均 12fps，锚点底边中心 192,683）。

机器校验（`gen-2026-10-30/validate.py`）：13 组、帧数=列×行、图集尺寸、RGBA、fps=12、时长匹配、thumbnail 192×342、stateMap 目标存在——全部 PASS。

预览：`draft/gen-2026-10-30/<动作>/preview.mp4`（13 个，12fps，H.264，384×684）。源视频、-raw 全帧、-sel 选段、审查拼图（review-*/zoom-*.png）均保留；失败版本 `succeeded-a-*`、`failed-a-*` 未删。

**累计费用：¥2.448**（母帧 ¥0.108 + Kling 13 条 × ¥0.18 = ¥2.34；Seedance 4 次版权拦截失败不计费；余额 63.3559→61.0159 核实一致）。

## 经验记录

- Seedance（字节系）对知名版权角色图生视频有识别级过滤（哈希微噪声无法绕过），同人角色素材优先选 Kling 等过滤较宽的供应商；其单条价格（¥0.18/5s）反而低于 Seedance（¥0.52/4s）。
- runninghub.py 下载 6MB 视频可能超 300s 截断且任务 ID 随管道输出丢失，长视频务必用带断点续传的封装并记录 Task ID。
- Kling 输出 780×1180 竖屏，应 `scale=-2:683,crop=384:683` 保持比例居中裁切，不要直接 `scale=384:683`（会横向拉伸约 15%）。
- Kling 无尾帧约束，"回到站姿收尾"类提示词的首尾一致性需逐组目检；行走类前 2 秒普遍偏弱，优先中段。
- RGBA contact sheet 直接 resize 会在半透明边缘产生深色幻影，审查抠像质量必须看全尺寸单帧，不能只看拼图。
- Kling 偶尔无视复杂手势提示词（succeeded v1），对策是拆短句、用"手臂明显抬到肩膀高度"等体量词强调；重出成本仅 ¥0.18，值得迭代。
- Kling 会在绿幕上烘软阴影（idle_swing），抠像后用原始 RGB 的绿色度做带状区域清理可无损去除。
