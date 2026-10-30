# Doubao 角色制作记录

## 角色方向

黑色短鲍伯头、红色长围巾、黑色短袖、腰带黑裙、黑袜黑鞋。性格为活泼亲切、自然熟，偶尔表现出自己未察觉的社交暴徒感。真人参考图已转为约 3 头身 Q 版，不保留街拍背景、文字或水印。

## 已制作母版

| 内容 | 模型与参数 | 结果 | 费用 |
|---|---|---|---:|
| 挥手 Q 版全身图 | RunningHub 全能图片 G-2 官方版，绿幕 | `draft/q-full-green.png`，用户已审核通过 | ¥0.108 |
| 自然站姿标准帧 | 同上，保持角色，仅调整姿态 | `draft/standard-green.png` | ¥0.108 |
| 微动待机 | Seedance 2.5，首尾同图，4 秒、480p、无音频 | `draft/idle-source.mp4` | ¥0.533 |
| 左向行走 | 同上 | `draft/walk-left-source.mp4` | ¥0.533 |
| 正前方工具面板 | 同上 | `draft/tool-source.mp4` | ¥0.533 |
| 自信思考 | 同上，点下巴后露出有主意的笑容 | `draft/thinking-source.mp4`、`draft/thinking/preview.mp4` | ¥0.533 |
| 放大镜搜索 | 同上，热心左右张望 | `draft/searching-source.mp4`、`draft/searching/preview.mp4` | ¥0.533 |

| 成功庆祝 | 同上，双手高举 | `draft/succeeded-source.mp4`、`draft/succeeded/preview.mp4` | ¥0.533 |
| 失败尴尬笑 | 同上，挠头化解冷场 | `draft/failed-source.mp4`、`draft/failed/preview.mp4` | ¥0.533 |
| 托腮拖拽 | 同上，睁大眼、双手托腮 | `draft/dragging-source.mp4` | ¥0.533 |
| 长待机：整理围巾 | 同上，时长 5 秒 | `draft/idle-scarf-source.mp4`、`draft/idle-scarf/preview.mp4` | ¥0.664 |
| 长待机：对空气聊天 | 同上，时长 5 秒 | `draft/idle-chat-source.mp4`、`draft/idle-chat/preview.mp4` | ¥0.664 |

累计费用：¥5.808。

## 抽帧与验收

三组均取前 2 秒，按 12fps 抽取 24 帧，统一为 384×683、6 列、底边中心锚点：

- `draft/idle/sheet.png`、`draft/idle/preview.mp4`
- `draft/walk-left/sheet.png`、`draft/walk-left/preview.mp4`
- `draft/tool/sheet.png`、`draft/tool/preview.mp4`

检查与修正：

- 待机源视频出现一帧闭眼，已用相邻睁眼帧替换，避免不符合微动 idle 规范。
- 行走源视频的绿色阴影在初次抠图后产生噪点，已加强背景清除并重新打包。
- 三组均已回读 Sprite Sheet 和透明帧预览；围巾、短发和服装结构可接受。
- 行走为左向版本，右向后续由水平镜像生成，避免角色重新生成漂移。

## 后续动作清单

- `running.thinking`：歪头、手指点下巴，自信地产生“绝妙主意”。
- `running.searching`：放大镜张望，热心但略显爱看热闹。
- `succeeded` / `succeeded_idle`：双手高举庆祝，随后双手叉腰满意微笑。
- `failed` / `failed_idle`：挠头尴尬笑，仍以热情化解冷场。
- `dragging`：睁大眼睛、双手托腮，懵懂不知所措。
- 长待机一：整理围巾，越整理越歪，最后满意点头。
- 长待机二：对旁边空气热情招手、自然熟聊天，没人回应也不在意。

待小样评审后再批量制作，避免未确认风格就产生整套成本。
