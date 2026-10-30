# QQ 拟人角色制作记录

## 角色方向

使用原创女孩 + 通用企鹅连帽的设计，不复制 QQ 标志、官方眨眼表情或品牌细节。角色保留黑白企鹅帽、红围巾和橙黄色短靴，性格天真、圆润、略慢半拍。

## 已制作母版

| 内容 | 模型与参数 | 结果 | 费用 |
|---|---|---|---:|
| 初版 Q 版全身图 | RunningHub 全能图片 G-2 官方版，绿幕 | `draft/q-full-green.png` | ¥0.108 |
| 圆润蠢萌版 | 同上，增大脸颊与头套、缩短四肢 | `draft/q-full-chubby-green.png`，用户已审核通过 | ¥0.108 |
| 微动待机 | Seedance 2.5，首尾同图，4 秒、480p、无音频 | `draft/idle-source.mp4` | ¥0.532 |
| 短腿左向行走 | 同上 | `draft/walk-left-source.mp4` | ¥0.532 |
| 正前方工具面板 | 同上，慢半拍单手点击 | `draft/tool-source.mp4` | ¥0.532 |
| 慢半拍思考 | 同上，先愣住再露出恍然表情 | `draft/thinking-source.mp4`、`draft/thinking/preview.mp4` | ¥0.532 |
| 放大镜搜索 | 同上，天真好奇地张望 | `draft/searching-source.mp4`、`draft/searching/preview.mp4` | ¥0.532 |

| 成功庆祝 | 同上，短手小幅举起 | `draft/succeeded-source.mp4`、`draft/succeeded/preview.mp4` | ¥0.532 |
| 失败反应 | 同上，愣住后羞涩低头 | `draft/failed-source.mp4` | ¥0.532 |
| 拖拽前两轮 | 同上，未满足托腮要求，不入包 | 未采用 | ¥1.064 |
| 托腮关键帧 | RunningHub 全能图片 G-2 官方版 | `draft/dragging-pose-green.png` | ¥0.108 |
| 托腮拖拽 | 以独立托腮关键帧制作循环 | `draft/dragging-source.mp4` | ¥0.532 |
| 长待机：整理围巾 | 同上，时长 5 秒 | `draft/idle-scarf-source.mp4`、`draft/idle-scarf/preview.mp4` | ¥0.663 |
| 长待机：扶头套 | 同上，时长 5 秒 | `draft/idle-hood-source.mp4`、`draft/idle-hood/preview.mp4` | ¥0.663 |

累计费用：¥7.502。

## 抽帧与验收

三组均取前 2 秒，按 12fps 抽取 24 帧，统一为 384×683、6 列、底边中心锚点：

- `draft/idle/sheet.png`、`draft/idle/preview.mp4`
- `draft/walk-left/sheet.png`、`draft/walk-left/preview.mp4`
- `draft/tool/sheet.png`、`draft/tool/preview.mp4`

三组均已回读透明预览。企鹅头套保持完整，围巾与双腿没有融合，工具面板位于正前方。行走为左向版本，右向后续由水平镜像生成。

## 后续动作方向

- 思考：歪头愣住，迟一拍后突然露出“我懂了”的表情。
- 搜索：举起略大的放大镜，认真但略显笨拙地张望。
- 成功：短手小幅举起，开心左右晃动，不采用剧烈跳跃。
- 失败：嘴巴微张愣住，随后不好意思地低头笑。
- 拖拽：圆脸微抬、双眼睁大，头套略微后滑但不能脱落。
- 长待机一：低头整理红围巾，动作缓慢且略显笨拙。
- 长待机二：扶一扶 oversized 企鹅头套，随后好奇地东张西望。
