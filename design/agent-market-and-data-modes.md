# AI Coding 工具市场级别与数据模式

目的：决定后续适配器优先级，而不是评选产品好坏。市场级别采用公开开发者调查，存储分类采用官方文档和本机实测，未公开的数据不强行排名。

## 1. 市场分级方法

- **S：领导者**：有显著的全球采用率和多来源证据。
- **A：重要参与者**：采用率较高，但低于领导者。
- **B：有明确用户基础**：在开源、区域市场或特定生态中有一定规模。
- **C：小众/待验证/非专用 Coding 产品**：缺少可靠采用率，或普通产品用户量不能直接代表 Coding Agent 使用量。

主要依据：[JetBrains 2026 年 8 月调查](https://blog.jetbrains.com/research/2026/08/ai-coding-agent-adoption-2026/) 和 [Stack Overflow 2026 Developer Survey](https://stackoverflow.blog/2026/10/06/the-results-of-the-2026-developer-survey-are-here/)。

## 2. 市场排序

| 级别 | 工具 | 依据与边界 |
|---|---|---|
| **S** | **Claude Code** | JetBrains 工作采用率 39%；Stack Overflow 受访者中 66% 使用。当前采用证据最强 |
| **S** | **GitHub Copilot（IDE/CLI）** | JetBrains 21%，Stack Overflow 59%；企业部署和认知度仍很强 |
| **A** | **OpenAI Codex** | JetBrains 16%，年内增长约 5 倍，认知度显著提升 |
| **A** | **Cursor** | JetBrains 12%；认知度较高，但采用率较年初下降 |
| **B** | **OpenCode** | JetBrains 7%，开源工具中采用证据较明确 |
| **B** | **Google Antigravity** | JetBrains 6%，认知度增长较快 |
| **B** | **JetBrains AI / Junie** | JetBrains 生态内约 9%，有宿主 IDE 用户基础 |
| **B** | **Gemini CLI** | Google 生态有用户基础，但 CLI 专项采用率未在主要报告中单列 |
| **B** | **Windsurf** | 有较高行业认知度，但缺少同口径采用率，不强行排到 A |
| **B** | **Cline** | VS Code 开源插件用户基础较大，安装量与采用率不是同一指标 |
| **B** | **Roo Code** | Cline 生态分支，有一定用户基础，精确采用率未公开 |
| **B** | **Aider** | 开源 CLI 用户基础和 GitHub 热度较高；采用率不作为硬指标 |
| **B** | **Kimi Code** | 中国 Coding Agent 重要产品，已有实际插件和 CLI 生态；缺少同口径全球采用率 |
| **B** | **Trae** | 字节跳动支持，国内及新兴市场有用户基础 |
| **B** | **Qoder / 通义灵码** | 国内重要 Coding 工具，区域市场证据较强，全球数据不足 |
| **B** | **文心 Comate** | 百度生态和企业用户基础，缺少同口径采用率 |
| **B** | **腾讯 CodeBuddy** | 腾讯生态支持，国内用户基础存在，精确采用率未公开 |
| **B** | **智谱 CodeGeeX** | 国内较早的 Coding 助手之一，插件用户基础存在 |
| **B** | **华为 CodeArts** | 华为云和企业生态支持，个人开发者采用率不清晰 |
| **B** | **Amazon Q Developer** | AWS 生态用户基础，具体 Coding Agent 采用率未公开 |
| **B** | **Tabnine** | 老牌 Coding 助手，企业市场存在，当前 Agent 采用率未公开 |
| **B** | **Augment Code** | 企业开发团队定位，具备一定市场认知 |
| **B** | **Replit Agent** | Replit 平台用户基础较大，但 Agent 专项使用数据未公开 |
| **B** | **Devin** | 自主工程师定位有行业认知度，采用率未公开 |
| **C** | **Continue** | 仍有开源用户基础，但产品归属和独立发展需要单独评估 |
| **C** | **WorkBuddy** | 新产品，公开使用数据不足 |
| **C** | **讯飞 iFlyCode** | 公开采用率不足 |
| **C** | **DeepSeek App** | 普通 AI 助手用户量不能直接视为 Coding Agent 使用量 |
| **C** | **OpenClaw** | 通用 Agent 生态与 Coding Agent 使用量需分开评估 |
| **C** | **OpenHands** | 开源项目有用户基础，但采用率未公开 |
| **C** | **Zed AI** | Zed 编辑器生态，采用率未公开 |
| **C** | **Sourcegraph Cody / Amp** | Sourcegraph 生态，采用率未公开 |
| **C** | **Factory** | 公开采用率不足 |
| **C** | **Warp Agent** | Warp 终端生态，采用率未公开 |
| **C** | **Goose** | 开源工具，采用率未公开 |
| **C** | **Google Jules** | 云端 Agent，公开采用率不足 |
| **C** | **Claude Desktop / ChatGPT App / Kimi App** | 普通产品用户量很大，但不能直接代表 Coding Agent 使用量，不与 Coding 专用产品混排 |

级别 B 不等于“产品能力差”，只表示缺少与 S/A 同口径的大规模采用证据。国内工具应结合区域市场数据，不与普通 App 用户量混淆。

## 3. 存储模式分类

| 数据模式 | 典型工具 | 读取方式 | 适配价值 |
|---|---|---|---|
| **JSONL 追加事件流** | Kimi Code、Claude Code、Codex、GitHub Copilot CLI | 按文件保存偏移，读取新增完整行；处理半行、截断和轮转 | 最适合低占用实时监控 |
| **SQLite / WAL** | OpenCode、Cursor、OpenClaw | 只读连接或 WAL 感知快照，按表和主键/时间戳增量查询 | 适合结构化状态，但需处理锁、WAL 和 schema 版本 |
| **项目级文本/Markdown** | Aider | 项目级 `.aider.chat.history.md` 追加读取 | 实现简单，但结果状态需要额外判断 |
| **VS Code globalStorage 任务文件** | Cline、Roo Code、Copilot IDE 以及部分国内插件 | 按扩展 ID 定位任务目录、JSON、transcript 或宿主数据库 | 适合插件，但格式和版本差异较大 |
| **纯文本诊断日志** | Kimi Code 输出日志、OpenCode 日志、WorkBuddy 日志 | 监听日志追加，识别方法名、错误和诊断事件 | 只能补充，通常不能单独作为任务结果依据 |
| **配置/云端主导** | 普通 App、Jules、Replit Agent、部分云 IDE | 本地只读配置、缓存或同步索引 | 无法保证本地任务状态，不能作为首批精确监控对象 |
| **专有混合或未知格式** | Windsurf、Trae、WorkBuddy、部分国内插件 | 必须实机确认目录和 schema | 未验证前不得承诺支持 |

## 4. 按状态信息完整度分类

| 状态等级 | 数据内容 | 典型工具 | 能否支撑状态机 |
|---|---|---|---|
| **A：结构化事件时间线** | 有提交、活动、正文、完成/取消及时间关系 | Kimi Code、Claude Code、Copilot CLI、OpenClaw | 可直接驱动 running/succeeded/interrupted |
| **B：完整 transcript，结果语义待确认** | 有完整对话和工具活动，但最终结果需解析或验证 | Aider、Gemini CLI、OpenCode、Codex、Cursor、Cline、Roo Code | 可显示活动，成功/失败需样本验证 |
| **C：启发式日志** | 只有方法名、文件活动、诊断或错误片段 | WorkBuddy 日志、部分 IDE 输出日志 | 只能粗略推断，不能假装精确 |
| **D：无本地任务状态** | 本地只有配置或云端数据 | 普通 App、Jules、Replit Agent 等云端产品 | 不适合磁盘状态机 |

## 5. 对开发的实际结论

1. **JSONL 类可复用一套增量读取骨架**，但解析器和版本能力仍由适配器各自实现。
2. **SQLite 类可复用只读/WAL 数据访问层**，但 schema 和状态映射不能通用。
3. **VS Code 插件可复用 globalStorage 发现规则**，不能复用任务格式假设。
4. **诊断日志只作补充证据**，不能因为出现 error 或 streamChat 结束就判断整个任务失败/成功。
5. **适配器优先级应由“市场级别 + 数据可解析性”共同决定**：Claude Code、Copilot CLI、Codex、OpenCode、OpenClaw 比只有配置或未知格式的工具更适合先做。
6. Kimi Code 已完成实测，不应再被列为“专有未知格式”或“只能启发式日志”。

原始市场检索文件：`design/research/agent-market-storage.md`。其中存储部分与官方资料冲突处未采用。
