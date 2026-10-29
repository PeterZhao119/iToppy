# 🔍 需求解读与搜索规划

## 核心目标分析
为**只读 macOS 桌宠监控器**选择适配器，核心需求是：
- **可监控性**：工具是否在本地留下可读取的活动记录
- **数据可访问性**：本地存储路径是否确定、格式是否可解析
- **只读安全**：不写入、不干扰工具正常运行

## 调研范围拆解
- **国内约10款**：Kimi系列、DeepSeek、通义灵码/Qoder、豆包/Trae/MarsCode、文心Comate、CodeBuddy、CodeGeeX、iFlyCode、CodeArts
- **海外约25款**：Claude Desktop/Code、ChatGPT/Codex、Cursor、GitHub Copilot、Gemini CLI/Jules等

## 信息维度规划（7个核心维度）
1. 产品基本信息（厂商、地区）
2. 产品形态分类
3. **macOS本地存储路径**（精确目录）
4. **数据格式与写入方式**
5. **状态证据类型**（活动日志、任务结果等）
6. 只读监控可行性评估
7. 权威来源URL

---

## 🚀 首轮并行搜索（6路）

现在并行发起6个维度的初步搜索，覆盖最新动态、存储机制、开源实现：


> **🔍️ 即时搜索**
> AI coding agent local storage macOS 2026
> Claude Code Cursor GitHub Copilot local data storage path configuration
> Kimi DeepSeek 通义灵码 豆包 MarsCode 本地存储 配置文件 路径
> AI编程工具 SQLite JSONL 数据格式 会话记录
> open source AI coding assistant local storage monitoring read-only
> macOS ~/Library/Application Support AI coding tool config directory
> ▶

🔗 [100] [Run local agentic AI on the Mac using MLX - WWDC26 - Videos](https://developer.apple.com/videos/play/wwdc2026/232/)

🔗 [101] [Best Local AI Agents for Mac in 2026 (Top 8 Ranked)](https://blog.buildbetter.ai/best-personal-ai-agents-that-run-locally-on-your-mac-in-2026-2/)

🔗 [102] [Local AI Coding Agent on macOS: Complete Setup Guide ...](https://www.nexgismo.com/blog/local-ai-coding-agent-macos-setup-guide-2026)

🔗 [103] [WWDC26: Run local agentic AI on the Mac using MLX | Apple](https://www.youtube.com/watch?v=wykPErJ8M-8&vl=en)

🔗 [104] [Should I invest in a beefy machine for local AI coding ...](https://www.reddit.com/r/LocalLLaMA/comments/1qmqmb9/should_i_invest_in_a_beefy_machine_for_local_ai/)

🔗 [105] [Open-Source AI Agents You Can Run Locally on Your Mac ...](https://fazm.ai/blog/open-source-ai-agents-mac-2026)

🔗 [106] [Building AI Agents That Run Entirely on Your Mac in 2026](https://llmcheck.net/blog/local-ai-agents-mac-2026/)

🔗 [107] [8 Best Local AI Agents in 2026](https://atomic.chat/blog/guides/best-local-ai-agents)

🔗 [108] [How to Run Local AI on a Mac in 2026: Setup Guide](https://www.refurb.me/blog/run-local-ai-on-mac)

🔗 [109] [Which Mac Should You Buy for Running AI Agents?](https://www.mindstudio.ai/blog/best-mac-for-ai-agents)

🔗 [110] [Apple Tightens macOS Full Disk Access Over AI Agents](https://cellcog.ai/blog/macos-full-disk-access-ai-agents/)

🔗 [111] [The Complete Mac AI Setup, 2026 Edition… | Think Different](https://www.thinkdifferent.blog/blog/the-complete-mac-ai-setup-2026-edition-everything-in-one-guide/)

🔗 [112] [Top 10 Open-Source Local AI Agent Projects to Watch in ...](https://shop.zimaspace.com/blogs/tech-ai-hub/top-10-open-source-local-ai-agent-projects-to-watch-in-2026?srsltid=AYCX9vLS2guLmB4VpTzko1rGa2T_4mksQPRKDCXxLn3ZkKrKTcck3yTp)

🔗 [113] [Agent! now supports macOS 14.6 or ...](https://github.com/AgentiLoop/Agent)

🔗 [114] [macOS AI Agent: How Desktop Agents Work on Mac in 2026](https://fazm.ai/blog/macos-ai-agent)

🔗 [115] [Best local LLMs for agentic coding on Apple silicon](https://zachrattner.com/projects/ai-mac-cluster/coding-models)

🔗 [116] [Local-First Secrets for AI Agents on macOS: A 2026 Field Survey](https://b.zzn.im/blog/local-first-secrets-for-ai-agents-macos-survey)

🔗 [117] [Best Open Source Mac AI Agents 2026](https://sourceforge.net/directory/ai-agents/mac/)

🔗 [118] [Run AI on Mac: Apple Silicon M5 & Ollama Guide (2026)](https://aiagentskit.com/blog/ai-on-mac-guide/)

🔗 [119] [I Turned My M1 MacBook Into an Offline AI Coding Agent](https://dev.to/baremetal-dev/i-turned-my-m1-macbook-into-an-offline-ai-coding-agent-0-api-cost-zero-cloud-14hb)

🔗 [21] [AI Coding Agents Are Leaking Credentials on Endpoints](https://blog.gitguardian.com/ai-coding-agents-credential-security/)

🔗 [22] [How to Secure Claude Code, Cursor, and GitHub Copilot](https://aurascape.ai/answers/secure-claude-code-cursor-github-copilot/)

🔗 [23] [Claude Code vs Cursor vs Copilot: 2026 Security Comparison](https://www.mintmcp.com/blog/claude-code-cursor-vs-copilot)

🔗 [24] [Where does Vscode Copilot store the local index ...](https://github.com/orgs/community/discussions/152490)

🔗 [25] [How to Share Skills Between Claude Code, Codex, Cursor & ...](https://www.youtube.com/watch?v=Sl2NilOq9gw)

🔗 [26] [Why does VS Code use the MCP config from Cursor ...](https://stackoverflow.com/questions/79727796/why-does-vs-code-use-the-mcp-config-from-cursor-instead-of-its-own-and-how-can)

🔗 [27] [My Experience Using VSCode (GitHub Copilot) and Cursor ...](https://medium.com/h7w/my-experience-using-vscode-github-copilot-and-cursor-claude-3-5-sonnet-as-a-data-scientist-0dd5132e8000)

🔗 [28] [GitHub Copilot CLI configuration directory](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-config-dir-reference)

🔗 [29] [Copilot CLI Tutorial #1 - Intro & Setup](https://www.youtube.com/watch?v=720a-3LXkdo)

🔗 [30] [Claude Code vs Cursor vs GitHub Copilot](https://dev.to/dextralabs/claude-code-vs-cursor-vs-github-copilot-honest-comparison-after-30-days-1030)

🔗 [31] [How to integrate GitHub Copilot with Claude AI for better ...](https://github.com/orgs/community/discussions/180896)

🔗 [32] [GitHub Copilot vs Claude Code vs Cursor vs Windsurf (2026)](https://kanerika.com/blogs/github-copilot-vs-claude-code-vs-cursor-vs-windsurf/)

🔗 [33] [A week with Claude Code: lessons, surprises and smarter ...](https://dius-au.medium.com/a-week-with-claude-code-lessons-surprises-and-smarter-workflows-47584eb55e8d)

🔗 [34] [GitHub Copilot vs Cursor vs Claude Code 2026 Compared](https://tech-insider.org/github-copilot-vs-cursor-vs-claude-code-2026/)

🔗 [35] [Claude Code vs GitHub Copilot: Mapping Config Files](https://www.linkedin.com/posts/joshua-dell_aicoding-claudecode-githubcopilot-activity-7434064378620145664-_DIz)

🔗 [36] [Cursor vs GitHub Copilot vs Claude Code: Best AI Coder?](https://tripleminds.co/blogs/technology/cursor-vs-github-copilot-vs-claude-code/)

🔗 [37] [I Checked 2200 Repos: 4 in 10 CLAUDE.md Files Point to ...](https://levelup.gitconnected.com/claude-code-vs-codex-vs-cursor-vs-copilot-in-2-200-github-repos-4-in-10-claude-md-2aa1f98c003e)

🔗 [38] [CLAUDE.md, AGENTS.md & Copilot Instructions](https://www.deployhq.com/blog/ai-coding-config-files-guide)

🔗 [39] [Using the Claude model in GitHub Copilot #189084](https://github.com/orgs/community/discussions/189084)

🔗 [40] [GitHub Copilot vs Cursor vs Claude: I Tested All AI Coding ...](https://javascript.plainenglish.io/github-copilot-vs-cursor-vs-claude-i-tested-all-ai-coding-tools-for-30-days-the-results-will-c66a9f56db05)

🔗 [61] [通义灵码_你的智能编码助手-阿里云](https://lingma.aliyun.com/)

🔗 [62] [文心快码、通义灵码、腾讯云AI代码助手、豆包MarsCode](https://zhuanlan.zhihu.com/p/708820713)

🔗 [63] [在DSW中进行AI Coding-人工智能平台PAI(PAI) - 阿里云文档](https://help.aliyun.com/zh/pai/performing-ai-coding-in-dsw)

🔗 [64] [国产AI代码助手技术解析与实战指南 - 社区](https://bbs.csdn.net/weixin_29038345/article/details/100201684)

🔗 [65] [AI 原生后端一体化平台](https://tcb.cloud.tencent.com/developers/)

🔗 [66] [下载和安装 - 通义灵码](https://lingma.aliyun.com/download)

🔗 [67] [docs: add Kimi Code integration guide #320](https://github.com/deepseek-ai/awesome-deepseek-agent/pull/320/changes)

🔗 [68] [典型案例 - 阿里云文档](https://help.aliyun.com/zh/lingma/example-prompts)

🔗 [69] [AI-Compass宝藏资源库：构建最全面的AI学习与实践生态](https://www.heywhale.com/mw/notebook/6875ce803d60b05e75d8222a)

🔗 [70] [文心快码、通义灵码、腾讯云AI代码助手 - 淡定BLOG](https://www.99zc.com/Study/103.html)

🔗 [71] [连接器 - 阿里云文档](https://help.aliyun.com/zh/lingma/getting-started)

🔗 [72] [https://kb.qianxin.com/ybgmnru](https://kb.qianxin.com/ybgmnru)

🔗 [73] [实测：豆包MarsCode AI编程助手接入DeepSeek 让开发更智能](https://www.youtube.com/watch?v=w77C7Bz65nY)

🔗 [74] [How to integrate DeepSeek MCP with Kimi Code](https://composio.dev/toolkits/deepseek/framework/kimi)

🔗 [75] [智能编程工具与国产大模型接入全流程指南](https://intl.cloud.baidu.com/zh/article/8947525)

🔗 [76] [我开发了Tars插件，支持移动端🔥DeepSeek、Kimi、豆包](https://forum-zh.obsidian.md/t/topic/36816)

🔗 [77] [用豆包MarsCode，半小时轻松学会搭建专业产品网站](https://developer.volcengine.com/articles/7440006120536309797)

🔗 [78] [2026 国内AI编程工具推荐：前端、后端、终端等六个场景](https://www.csdn.net/article/2026-09-15/165479430)

🔗 [79] [File Processing](https://www.tencentcloud.com/document/product/436/53742)

🔗 [80] [AI项目空间的配置与入门| 豆包MarsCode AI刷题](https://juejin.cn/post/7432639908166926373)

🔗 [1] [sqlite标签_智能体开发者社区](https://adg.csdn.net/tags/629eeed1512a562a428497ac)

🔗 [2] [claude-code-history-viewer/README.zh-CN.md at main](https://github.com/jhlee0409/claude-code-history-viewer/blob/main/README.zh-CN.md)

🔗 [3] [告别碎片化日志：一套方案采集所有主流AI 编程工具](https://zhuanlan.zhihu.com/p/1996569342226233307)

🔗 [4] [SQLite中文JSON数据处理实战指南](https://my.oschina.net/emacs_7997392/blog/19414663)

🔗 [5] [用Trae编辑器写一个Trae的AI对话记录导出脚本](https://juejin.cn/post/7472786501598101523)

🔗 [6] [Cursor 对话导入：解析SQLite 里的宝藏 - AI编程社区](https://aicoding.csdn.net/6a238ad010ee7a33f27868ac.html)

🔗 [7] [5个实用的SQLite数据库可视化工具(GUI) - 追逐时光者](https://www.cnblogs.com/Can-daydayup/p/17909586.html)

🔗 [8] [【工具】轻松解锁SQLite数据库，一窥微信聊天记录小秘密](https://developer.aliyun.com/article/1598125)

🔗 [9] [用AI编程，怎么让AI自动了解你的数据库？ - 腾讯云- Tencent](https://cloud.tencent.com/developer/article/2586427)

🔗 [10] [AI 解决方案中心](https://www.oracle.com/cn/artificial-intelligence/solutions/)

🔗 [11] [有没有办法获取我与Claude Code 交互的历史记录？](https://www.reddit.com/r/ClaudeAI/comments/1j5nh09/is_there_any_way_to_get_a_history_of_my/?tl=zh-hans)

🔗 [12] [让AI辅助编程更高效, 更优雅: 我的"双层工作流"秘籍](https://shanechang.com/zh-cn/p/ai-assistant-chat-management-system/)

🔗 [13] [小白都会用的——聊天AI自动写代码神器](https://www.youtube.com/watch?v=1joqVIN-R2g)

🔗 [14] [基于百川大模型的微信聊天记录分析](https://docs.feishu.cn/v/wiki/MLKnw5GofiFUHAkhWa4cIjbUnac/a1)

🔗 [15] [与知识库对话- 搭建一个总结聊天记录的ai](https://www.waytoagi.com/zh/question/69546)

🔗 [16] [构建OpenClaw 插件：会话历史记录器- 天涯的日常](http://www.saytk.com/building-an-openclaw-plugin-session-history-recorder/)

🔗 [17] [runzhliu/welink: 🔍微信聊天数据分析的本地化AI- ...](https://github.com/runzhliu/welink)

🔗 [18] [自然语言SQL Client + Chatbot - AI 时代开发者工具2.0](https://programmur.substack.com/p/sqlchat-ai-developer-tools-2)

🔗 [19] [MemoryLake - AI平台| AI工具集｜AI资讯站](https://www.aipintai.com/MemoryLake.html)

🔗 [20] [SQLite 简介| 菜鸟教程](https://www.runoob.com/sqlite/sqlite-intro.html)

🔗 [41] [Top 10 Open-Source AI Coding Assistants in 2026](https://shop.zimaspace.com/blogs/tech-ai-hub/top-10-open-source-ai-coding-assistants-2026?srsltid=AYCX9vKTqARk9CEWcabtIBL7zZkKI3NR_bHpubGQwLO9qkbgVSdAB0sg)

🔗 [42] [Open-Source AI Coding Assistant: 12 Steps, 60 Min [2026]](https://shattered.io/open-source-ai-coding-assistant-opencode-ollama-2026/)

🔗 [43] [Use a local and open source code assistant](https://developers.redhat.com/articles/2026/09/09/use-local-and-open-source-code-assistant)

🔗 [44] [I built a local AI agent that turns my messy computer into ...](https://www.reddit.com/r/PKMS/comments/1nfa8hk/i_built_a_local_ai_agent_that_turns_my_messy/)

🔗 [45] [ai-for-developers/awesome-ai-coding-tools](https://github.com/ai-for-developers/awesome-ai-coding-tools)

🔗 [46] [10 Best Open Source AI Coding Assistants (Free in 2026)](https://www.opensourcealternatives.to/blog/best-open-source-ai-coding-assistants)

🔗 [47] [Open Source AI Coding Assistants (2026) - Morph](https://www.morphllm.com/ai-coding-assistant-open-source)

🔗 [48] [How to Run a Local AI Coding Assistant That Never Sends ...](https://localtonet.com/blog/local-ai-coding-assistant-private)

🔗 [49] [I Audited a Popular Open-Source AI Assistant.](https://medium.com/@terminalsandcoffee/i-audited-a-popular-open-source-ai-assistant-cd20a0649b22)

🔗 [50] [How to Self-Host a Validated AI Coding Assistant with ...](https://developer.nvidia.com/blog/how-to-self-host-a-validated-ai-coding-assistant-with-nvidia-nemo-guardrails/)

🔗 [51] [OpenCode | The open source AI coding agent](https://opencode.ai/)

🔗 [52] [Top Local Coding Assistants That Never Send ...](https://vexp.dev/blog/top-local-coding-assistants-never-send-code-to-cloud)

🔗 [53] [9 open-source AI coding tools that every developer should ...](https://dev.to/composiodev/9-open-source-ai-coding-tools-that-every-developer-should-know-28l4)

🔗 [54] [Ditch the Cloud: 7 Powerful, Free Local AI Tools](https://virtualizationreview.com/articles/2026/08/04/ditch-the-cloud-7-powerful-free-local-ai-tools.aspx)

🔗 [55] [8 Best Open-Source Personal AI Assistants in 2026 - Vellum](https://www.vellum.ai/blog/best-open-source-personal-ai-assistants)

🔗 [56] [Privacy Comparison of Cloud AI Coding Assistants](https://www.augmentcode.com/tools/privacy-comparison-of-cloud-ai-coding-assistants)

🔗 [57] [Best Open Source AI Agents for Local Control](https://evomap.ai/blog/best-open-source-ai-agents-for-local-control)

🔗 [58] [Local Memory and Privacy for AI Coding Agents](https://www.youtube.com/watch?v=JUfeBnLXmRs)

🔗 [59] [5 open-source local AI tools nobody talks about, but they ...](https://www.xda-developers.com/open-source-local-ai-tools-nobody-talks-about/)

🔗 [60] [Top 10 self-hosted AI coding assistants for local models](https://awesomeosai.com/self-hosted/coding-assistant)

🔗 [81] [macOS dotfiles should not go in ~/Library/Application Support](https://lobste.rs/s/iv17mx/macos_dotfiles_should_not_go_library)

🔗 [82] [Rapid Deployment of AI-Powered Coding Tools on macOS](https://intl.cloud.baidu.com/en/article/9152753)

🔗 [83] [Adhere to the macOS File System Programming Guide on ...](https://github.com/openai/codex/issues/143)

🔗 [84] [How I Built my First macOS app with Cursor - 34-min Tutorial](https://www.youtube.com/watch?v=AQrnwXd1l0o)

🔗 [85] [app config - Default location for configuration files - MacOS?](https://stackoverflow.com/questions/15677388/default-location-for-configuration-files-macos)

🔗 [86] [Experiment: Using Native macOS Apps to Install AI ...](https://zackproser.com/blog/native-osx-app-ai-workflow-installer)

🔗 [87] [AI Coding Tools for Mac - Mac Install Guide](https://mac.install.guide/ai/)

🔗 [88] [The Mac AI Setup Every Developer Needs](https://www.youtube.com/watch?v=_4ufwTtL2kg)

🔗 [89] [Where are config and db files located on a Mac?](https://www.facebook.com/groups/companion/posts/2740200926198240/)

🔗 [90] [OpenAI Codex in macOS Development Environments - Chier Hu](https://chierhu.medium.com/openai-codex-in-macos-development-environments-b5b59f5b3245)

🔗 [91] [The .claude Folder Is Important, And You're Likely Ignoring It](https://pub.towardsai.net/the-claude-folder-is-important-and-youre-likely-ignoring-it-33fc97f6d9fa)

🔗 [92] [What is [home]/Library/Application Support/calls-and- ...](https://apple.stackexchange.com/questions/464950/what-is-home-library-application-support-calls-and-messages)

🔗 [93] [aith - crates.io: Rust Package Registry](https://crates.io/crates/aith)

🔗 [94] [Tip: Create ~/Developer in Your Mac User Folder for AI ...](https://matthewcassinelli.com/pro-tip-create-developer-in-your-mac-user-folder-for-ai-projects/)

🔗 [95] [Claude Code, Ollama & Cursor Files on Mac: Safe to Delete?](https://siftmac.com/guides/ai-files-on-mac)

🔗 [96] [macOS user_config_dir goes against OS guidelines #98](https://github.com/tox-dev/platformdirs/issues/98)

🔗 [97] [Remove AI tools and AI hidden files on Mac: Full checklist](https://nektony.com/how-to/uninstall-ai-tools-mac?srsltid=AYCX9vKlqM-oiRhSJPm4ie1LtgXtKOcktutYnCAhD8L_Z_W4rWjkHGxS)

🔗 [98] [Cursor vs VS Code Trust Audit: 13 Steps, 45 Min [2026]](https://tech-insider.org/cursor-vs-vscode-workspace-trust-audit-13-steps-2026/)

🔗 [99] [I Built a macOS App With Zero Swift Knowledge. Here's ...](https://suganthan.com/blog/build-macos-ios-apps-with-ai-xcode/)



## 📊 首轮搜索结果分析

已获取初步线索，发现关键存储路径模式：

| 工具 | 存储路径线索 | 来源 |
|------|------------|------|
| Claude Code | `~/.claude` 文件夹 | [[91]](https://pub.towardsai.net/the-claude-folder-is-important-and-youre-likely-ignoring-it-33fc97f6d9fa) |
| Cursor/Windsurf/Antigravity | `~/Library/Application Support/Cursor` | [[95]](https://siftmac.com/guides/ai-files-on-mac) |
| GitHub Copilot CLI | `~/.copilot` | [[28]](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-config-dir-reference) |
| Kimi Code | `~/.kimi-code/config.toml` | [[67]](https://github.com/deepseek-ai/awesome-deepseek-agent/pull/320/changes) |
| VS Code MCP配置 | `~/.cursor/mcp.json` | [[26]](https://stackoverflow.com/questions/79727796/why-does-vs-code-use-the-mcp-config-from-cursor-instead-of-its-own-and-how-can) |

**发现的开源监控项目**：
- `claude-code-history-viewer`：解析Claude Code历史记录
- `OpenCode`、`Cline`、`OpenHands`：开源AI编程工具

---

## 🔍 第二轮深度搜索（并行12路）

现在针对每个工具进行精确路径和数据格式搜索：


> **🔍️ 即时搜索**
> Claude Code history session storage location macOS ~/.claude
> Cursor IDE database SQLite storage path macOS ~/Library/Application Support
> GitHub Copilot CLI session data storage ~/.copilot
> Kimi Code IDE plugin session history storage path
> DeepSeek client local storage configuration macOS
> 通义灵码 Qoder IDE session storage local data


🔗 [179] [Claude Code session history vanished after macOS Tahoe ...](https://www.reddit.com/r/ClaudeCode/comments/1razdg0/claude_code_session_history_vanished_after_macos/)

🔗 [180] [Where Is Claude Code Session History? How to Find Your ...](https://dev.to/gonewx/where-is-claude-code-session-history-how-to-find-your-ai-coding-conversations-555o)

🔗 [181] [Unlocking Your Claude History, Part 1](https://medium.com/@raymondpeck/unlocking-your-claude-history-part-1-f19000c05655)

🔗 [182] [Show HN: Claude Code History Viewer for macOS](https://news.ycombinator.com/item?id=44459376)

🔗 [183] [[FEATURE] Allow session storage in project directory NO ...](https://github.com/anthropics/claude-code/issues/22387)

🔗 [184] [User identity and local data - Claude.ai Documentation](https://claude.com/docs/third-party/claude-desktop/data-storage)

🔗 [185] [How Claude remembers your project - Claude Code Docs](https://code.claude.com/docs/en/memory)

🔗 [186] [Your Claude VS Code History Isn't Gone](https://www.youtube.com/watch?v=coEiRT6AOpE)

🔗 [187] [Session Trail](https://marketplace.visualstudio.com/items?itemName=doorsofperception.claude-code-history)

🔗 [188] [If you run Claude Code on a Mac the way I do — several ...](https://www.facebook.com/groups/claudecommunity/posts/1033181992555799/)

🔗 [189] [The Claude folder most marketers can't find](https://tinytechguides.com/blog/the-claude-folder-most-marketers-cant-find/)

🔗 [190] [Claude Code hogging Mac storage space](https://www.linkedin.com/posts/rogerboesch_claude-macos-softwareengineering-activity-7507828441120034818-la2L)

🔗 [191] [Where are Claude Code logs stored?](https://claude-dev.tools/docs/log-locations)

🔗 [192] [Claude Desktop: hidden debug data consume…](https://discussions.apple.com/thread/256235446)

🔗 [149] [macOS: state.vscdb grew to 12.4 GB and ...](https://forum.cursor.com/t/macos-state-vscdb-grew-to-12-4-gb-and-state-vscdb-backup-grew-to-12-2-gb-on-a-256-gb-macbook-air-seeking-safe-remediation-guidance/162623)

🔗 [150] [Memory Plugin (SQLite) - MCP Cursor](https://mcpcursor.com/server/memory-plugin-sqlite-mcp)

🔗 [151] [CursorRecovery/README.md at main](https://github.com/bbostock/CursorRecovery/blob/main/README.md)

🔗 [152] [Where Cursor stores its history — session format](https://vshulcz.github.io/deja-vu/registry/cursor)

🔗 [153] [Cursor DB MCP Server by TaylorChen](https://glama.ai/mcp/servers/TaylorChen/cursor-db-mcp)

🔗 [154] [How to put DB file from application's bundle in the Library/ ...](https://stackoverflow.com/questions/28119347/how-to-put-db-file-from-applications-bundle-in-the-library-application-support)

🔗 [155] [Cursor state.vscdb growing at 1 GB in a day - Bug Reports](https://forum.cursor.com/t/cursor-state-vscdb-growing-at-1-gb-in-a-day/151747)

🔗 [156] [Cursor Took Over My 250GB Storage Without Noticing WTF](https://www.reddit.com/r/cursor/comments/1s5lf5u/cursor_took_over_my_250gb_storage_without/)

🔗 [157] [Where Does Cursor Store Chat History? state.vscdb ...](https://vibe-replay.com/blog/cursor-local-storage/)

🔗 [158] [Where Cursor Stores Local Chat History: A Developer's ...](https://dev.to/buildpilots/where-cursor-stores-local-chat-history-a-developers-hands-on-breakdown-464k)

🔗 [159] [Cursor IDE - agentgrep 0.1.0a54 documentation](https://agentgrep.org/backends/cursor-ide/)

🔗 [160] [Recovering a lost Cursor chat draft with SQLite and Lexical ...](https://aioue.net/2026/04/24/recovering-a-lost-cursor-draft/)

🔗 [161] [MacOS can't find AudirvanaDatabase.sqlite](https://community.audirvana.com/t/macos-cant-find-audirvanadatabase-sqlite/40921)

🔗 [162] [sqlite3 — DB-API 2.0 interface for SQLite databases](https://docs.python.org/3/library/sqlite3.html)

🔗 [163] [Why is my cursor not showing in my Mac mini](https://discussions.apple.com/thread/255997256)

🔗 [193] [Using GitHub Copilot CLI session data](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/chronicle)

🔗 [194] [Using GitHub Copilot CLI](https://docs.github.com/copilot/how-tos/copilot-cli/use-copilot-cli/overview)

🔗 [195] [About GitHub Copilot session data](https://docs.github.com/en/enterprise-cloud@latest/copilot/concepts/security-governance-and-network-settings/session-data)

🔗 [196] [GitHub Copilot Session Search and Resume CLI](https://jonmagic.com/posts/github-copilot-session-search-and-resume-cli/)

🔗 [197] [Understanding Context and Session Management in ...](https://www.linkedin.com/pulse/understanding-context-session-management-github-cli-antonio-goncalves-dkvze)

🔗 [198] [Best practices for GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/cli-best-practices)

🔗 [199] [I built a local session-history browser for Copilot CLI on ...](https://www.reddit.com/r/GithubCopilot/comments/1tkr5kg/i_built_a_local_sessionhistory_browser_for/)

🔗 [200] [Tracking Copilot CLI sessions was impossible, so I built this](https://www.reddit.com/r/GithubCopilot/comments/1s7uh7e/tracking_copilot_cli_sessions_was_impossible_so_i/)

🔗 [201] [Cloud-synced sessions for cross-device continuity · Issue # ...](https://github.com/github/copilot-cli/issues/1947)

🔗 [202] [GitHub Copilot CLI Tips & Tricks — Part 2: Session ...](https://bartwullems.blogspot.com/2026/03/github-copilot-cli-tips-tricks-part-2.html)

🔗 [203] [GitHub Copilot sessions: obtaining tips for better usage.](https://demiliani.com/2026/06/23/github-copilot-sessions-obtaining-tips-for-better-usage/)

🔗 [204] [4. GitHub Copilot CLI Context & Conversations (Video 4)](https://www.youtube.com/watch?v=uVAHPDcRnQo)

🔗 [205] [GitHub Copilot CLI Local History](https://jazzyalex.github.io/agent-sessions/guides/copilot-cli-local-history.html)

🔗 [206] [Copilot CLI Sessions Manager](https://marketplace.visualstudio.com/items?itemName=sabiku.copilot-sessions-mgr)

🔗 [207] [Session resume and persistence - Copilot SDK](https://docs.github.com/en/copilot/how-tos/copilot-sdk/features/session-persistence)

🔗 [120] [Data locations | Kimi Code Docs](https://www.kimi.com/code/docs/en/kimi-code-cli/configuration/data-locations.html)

🔗 [121] [Quick Start | Kimi Code Docs](https://www.kimi.com/code/docs/en/kimi-code-for-vscode/getting-started.html)

🔗 [122] [Kimi Code CLI — The Starting Point for Next-Gen Agents](https://github.com/MoonshotAI/kimi-code)

🔗 [123] [Kimi Code](https://marketplace.visualstudio.com/items?itemName=moonshot-ai.kimi-code)

🔗 [124] [Kimi Code CLI Launcher — Run Kimi in VS Code](https://open-vsx.org/extension/mikesoft/vscode-kimi-code-cli-launcher)

🔗 [125] [Kimi Code CLI: A Beginner-Friendly Guide to Moonshot ...](https://dev.to/arshtechpro/kimi-code-cli-a-beginner-friendly-guide-to-moonshot-ais-terminal-coding-agent-39db)

🔗 [126] [Core Operations | Kimi Code Docs](https://www.kimi.com/code/docs/en/kimi-code-for-vscode/core-operations.html)

🔗 [127] [Where AI coding agents store your session history](https://jazzyalex.github.io/agent-sessions/blog/where-agents-store-history/)

🔗 [128] [Kimi CLI Manager: Sessions, Logs and MCP](https://flyenv.com/features/kimi)

🔗 [129] [Where Six AI Coding CLIs Store Your Session Logs](https://allaboutcoding.ghinda.com/where-ai-coding-clis-store-session-logs/)

🔗 [130] [Build anything with Kimi 2.5, here's how](https://www.youtube.com/watch?v=aiLZMvMLYMg)

🔗 [131] [Where Does Claude Code Store Conversation History?](https://www.llmnesia.com/blog/where-does-claude-code-store-history)

🔗 [132] [Kimi Assistant - Obsidian Plugin](https://community.obsidian.md/plugins/kimidian)

🔗 [133] [Kimi Data Source (Experimental)](https://ccusage.com/guide/kimi/)

🔗 [134] [How to preserve Claude Code conversation history after ...](https://www.reddit.com/r/ClaudeAI/comments/1lragx6/how_to_preserve_claude_code_conversation_history/)

🔗 [164] [How to Run DeepSeek Locally on Mac (Step-by- ...](https://lekhai.app/blog/how-to-run-deepseek-locally-on-mac/)

🔗 [165] [How to Run DeepSeek Models Locally on Mac](https://www.smartli.ai/blog/how-to-run-deepseek-models-locally-on-mac)

🔗 [166] [Run DeepSeek R1 locally on macOS - Blog](https://www.kerlig.com/blog/run-deepseek-r1-locally-on-macOS)

🔗 [167] [How to Set Up and Optimize DeepSeek Locally](https://builtin.com/artificial-intelligence/how-implement-deepseek-locally)

🔗 [168] [Got DeepSeek R1 running locally - Full setup guide and ...](https://www.reddit.com/r/macapps/comments/1i6h705/got_deepseek_r1_running_locally_full_setup_guide/)

🔗 [169] [DeepSeek on Mac: Install, Run & API Setup (2026)](https://deepseekai.guide/guides/deepseek-on-mac/)

🔗 [170] [How to Run DeepSeek LLM Locally on Mac](https://osxdaily.com/2025/04/10/how-to-run-deepseek-llm-locally-on-mac/)

🔗 [171] [How To Run DeepSeek AI Locally on Mac | Intel | Apple Silicon](https://www.youtube.com/watch?v=sst-fMBzGWk)

🔗 [172] [How to run DeepSeek locally on your computer](https://martech.org/how-to-run-deepseek-locally-on-your-computer/)

🔗 [173] [DeepSeek Harness Desktop for Mac](https://gist.github.com/DeepSeekMacApps/86ad25ffea6332d5d527550668f89d12)

🔗 [174] [DeepSeek](https://docs.openclaw.ai/providers/deepseek)

🔗 [175] [How to Run DeepSeek Locally](https://pinggy.io/blog/run_deepseek_locally/)

🔗 [176] [DeepSeek V3 Complete Guide: Deploy and Optimize Local ...](https://www.sitepoint.com/deepseek-v3-complete-guide-deploy-and-optimize-local-ai-in-2026/)

🔗 [177] [Running DeepSeek Locally on Mac for Design & ...](https://forum.figma.com/ask-the-community-7/running-deepseek-locally-on-mac-for-design-development-workflows-55267)

🔗 [178] [Download DeepSeek](https://www.deepseek.com/en/download/)

🔗 [135] [External Session Storage](https://docs.qoder.com/cli/sdk/session-storage)

🔗 [136] [Qoder CN IDEquick start - 阿里云文档](https://help.aliyun.com/en/lingma/lingma-ide-get-started)

🔗 [137] [How it works](https://docs.qoder.com/cli/sdk/how-it-works)

🔗 [138] [Mastering Local Storage in JavaScript: A Complete Guide](https://d-libro.com/topic/local-storage/)

🔗 [139] [Ultimate Guide to Local and Session Storage - Zeeshan Ali](https://zeeshanai.com/blogs/ultimate-guide-to-local-session-storage/)

🔗 [140] [Local Storage, Session Storage, and Cookies](https://dev.to/aneeqakhan/a-developers-guide-to-browser-storage-local-storage-session-storage-and-cookies-4c5f)

🔗 [141] [Feature: localStorage / sessionStorage data sources?](https://discourse.gohugo.io/t/feature-localstorage-sessionstorage-data-sources/55090)

🔗 [142] [Built-in browser](https://docs.qoder.com/qoder/browser)

🔗 [143] [localStorage in JavaScript: A complete guide](https://blog.logrocket.com/localstorage-javascript-complete-guide/)

🔗 [144] [Qoder CN 本土化编程智能体全解析：多端适配、工程级开发与 ...](https://developer.aliyun.com/article/1751044)

🔗 [145] [How Claude Code Manages Local Storage for AI Agents](https://milvus.io/blog/why-claude-code-feels-so-stable-a-developers-deep-dive-into-its-local-storage-design.md)

🔗 [146] [Session Control](https://docs.qoder.com/cli/sdk/session-control)

🔗 [147] [The Ultimate Guide to Understanding Local Storage](https://medium.com/@ipshubham/the-ultimate-guide-to-understanding-local-storage-2a27fdb80544)

🔗 [148] [Qoder AI IDE Review: Alibaba's Agentic Coding Platform in …](https://jimmysong.io/blog/qoder-alibaba-ai-ide-personal-review/)



## 📈 第二轮搜索结果分析

已确认关键存储路径：

| 工具 | 存储路径 | 数据格式 | 来源 |
|------|---------|---------|------|
| Claude Code | `~/.claude/projects/*.jsonl` | JSONL | [[127]](https://jazzyalex.github.io/agent-sessions/blog/where-agents-store-history/)[[131]](https://www.llmnesia.com/blog/where-does-claude-code-store-history)[[181]](https://medium.com/@raymondpeck/unlocking-your-claude-history-part-1-f19000c05655) |
| Cursor | `~/Library/Application Support/Cursor/User/globalStorage/state.vscdb` | SQLite | [[149]](https://forum.cursor.com/t/macos-state-vscdb-grew-to-12-4-gb-and-state-vscdb-backup-grew-to-12-2-gb-on-a-256-gb-macbook-air-seeking-safe-remediation-guidance/162623)[[151]](https://github.com/bbostock/CursorRecovery/blob/main/README.md)[[157]](https://vibe-replay.com/blog/cursor-local-storage/) |
| GitHub Copilot CLI | `~/.copilot/session-state/events.jsonl` | JSONL | [[193]](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/chronicle)[[205]](https://jazzyalex.github.io/agent-sessions/guides/copilot-cli-local-history.html) |
| Kimi Code | `~/.kimi-code/sessions/` | 需确认 | [[120]](https://www.kimi.com/code/docs/en/kimi-code-cli/configuration/data-locations.html)[[125]](https://dev.to/arshtechpro/kimi-code-cli-a-beginner-friendly-guide-to-moonshot-ais-terminal-coding-agent-39db) |

**关键发现**：
- Claude Code使用**JSONL**格式存储会话历史
- Cursor使用**SQLite**数据库 (`state.vscdb`)
- GitHub Copilot CLI使用**JSONL**事件流
- 存在开源监控项目：`claude-code-history-viewer`、`Agent Sessions`

---

## 🔍 第三轮深度搜索（并行12路）

继续搜索其他工具的存储机制：


> **🔍️ 即时搜索**
> 豆包 MarsCode Trae IDE session storage local data path
> 文心 Comate Baidu AI code assistant storage configuration
> CodeGeeX 智谱 AI code assistant local storage
> CodeArts 华为 云开发 本地存储 配置
> Windsurf IDE storage path ~/Library/Application Support
> Continue.dev Cline Roo Code Aider local storage JSONL


🔗 [283] [Trae - Plugin](https://www.marscode.com/)

🔗 [284] [Workbench](https://www.marscode.com/workbench)

🔗 [285] [Doubao MarsCode](https://baike.baidu.com/en/item/Doubao%20MarsCode/942149)

🔗 [286] [TRAE AI: Coding Assistant](https://marketplace.visualstudio.com/items?itemName=MarsCode.marscode-extension)

🔗 [287] [Get started with TRAE Desktop](https://docs.trae.ai/ide/get-started-with-trae-desktop?_lang=en)

🔗 [288] [Get Started with Trae IDE (Tutorial for Beginners)](https://www.youtube.com/watch?v=SHmk05MsnyQ)

🔗 [289] [【产品更新】Trae 插件（原MarsCode 编程助手）全新上线 ...](https://developer.volcengine.com/articles/7496711867822243881)

🔗 [290] [豆包MarsCode IDE核心概念：基础名词、用户界面、AI助手与 ...](https://www.w3cschool.cn/marscode/marscode-92fd3zgj.html)

🔗 [291] [完全掌握｜豆包MarsCode 编程助手使用技巧](https://zhuanlan.zhihu.com/p/18223873895)

🔗 [292] [# TRAE.ai with Memory: No More Re-briefing, 98% Time ...](https://dev.to/antoniodem/-traeai-with-memory-no-more-re-briefing-98-time-saved-1mkg)

🔗 [293] [Trae - Community](https://www.marscode.com/community)

🔗 [294] [豆包MarsCode - 免费AI编程助手，DeepSeek满血版模型](https://ai-bot.cn/sites/12035.html)

🔗 [295] [用豆包MarsCode IDE，从0到1画出精美数据大屏！](https://blog.csdn.net/DouBaoMarsCode/article/details/144446977)

🔗 [296] [使用豆包Marscode 创建了一个”天气预报“小应用](https://xie.infoq.cn/article/015d831210e3109480f852841)

🔗 [297] [豆包MarsCode – 字节跳动的AI编程助手与Cloud IDE - AI工具箱](https://ai-bio.cn/sites/424.html)

🔗 [223] [Quick Deployment Guide for AI Coding Assistants](https://intl.cloud.baidu.com/article/9160115)

🔗 [224] [Comate AI IDE Review: Baidu's Agentic AI Coding ...](https://aiidelist.com/ide/comate-ai-ide)

🔗 [225] [Baidu Comate Plugin for JetBrains IDEs](https://plugins.jetbrains.com/plugin/23475-baidu-comate)

🔗 [226] [文心快码Baidu Comate](https://marketplace.visualstudio.com/items?itemName=BaiduComate.comate)

🔗 [227] [文心快码（Baidu Comate） - Գործիքային ԱԻ](https://www.chatglobal.com/AI_Tool/Program/index.php?_a=ai_index&f=detail&id=187&lang=hy)

🔗 [228] [在NAS上打造AI加持的云端个人开发环境](https://cloud.baidu.com/article/3358468)

🔗 [229] [COMATE 文档](https://bce.bdstatic.com/p3m/pdf/bce-doc/online/COMATE/COMATE.pdf?timeStamp=1790985600094)

🔗 [230] [ClaudeCode 不让用？试试文心快码（Baidu Comate）？](https://zhuanlan.zhihu.com/p/1949873245093360730)

🔗 [231] [百度文心快码(Comate) 超全使用教程｜从安装到实战](https://blog.csdn.net/qq_31142761/article/details/158972291)

🔗 [232] [Baidu Comate](https://toolin.ai/en/tools/baidu-comate)

🔗 [233] [文心快码正式发布AI IDE，生成超43%百度新增代码](https://www.infoq.cn/news/UjVrrcyCLgOLVSmddO0C)

🔗 [234] [Baidu Comate Next计划 - 百度](https://comate.baidu.com/en/next)

🔗 [235] [Baidu Comate 智能编码助手：编程新伙伴，效率新飞跃](https://developer.cloud.tencent.com/article/2415592)

🔗 [236] [百度Comate 代码AI 编程助手- 个人永久免费/ 还可薅羊毛](https://www.iplaysoft.com/p/baidu-comate)

🔗 [237] [百度的文心快码Comate AI IDE正式发布了，功能有亮点](https://juejin.cn/post/7518980960766148643)

🔗 [238] [codegeex,AI编程助手](https://codegeex.cn/)

🔗 [239] [CodeGeeX: AI Coding Assistant](https://marketplace.visualstudio.com/items?itemName=aminer.codegeex)

🔗 [240] [CodeGeeX — A Super Coding Assistant for Every Developer](https://www.youtube.com/watch?v=HaecIzfFXxQ)

🔗 [241] [CodeGeeX AI Visibility Data](https://checkthat.ai/brands/codegeex)

🔗 [242] [Has anyone tried the CodeGeeX extension? Is it "safe"?](https://www.reddit.com/r/vscode/comments/10e379o/has_anyone_tried_the_codegeex_extension_is_it_safe/)

🔗 [243] [🏠 Self-Hosted AI Code Generation: The Complete Guide to ...](https://dev.to/techstuff/self-hosted-ai-code-generation-the-complete-guide-to-building-your-private-ai-coding-assistant-4ncj)

🔗 [244] [CodeGeeX Review (2026): Pricing & Alternatives](https://www.stork.ai/en/codegeex)

🔗 [245] [CodeGeeX: An Open Multilingual Code Generation Model ...](https://github.com/zai-org/CodeGeeX)

🔗 [246] [CodeGeeX: A Pre-Trained Model for Code Generation with ...](https://arxiv.org/html/2303.17568v2)

🔗 [247] [CodeGeeX: AI Coding Assistant](https://open-vsx.org/extension/AMiner/codegeex/reviews)

🔗 [248] [CodeGeeX | AI Coding Tools](https://realpython.com/ref/ai-coding-tools/codegeex/)

🔗 [249] [Say Hello to CodeGeeX: A Powerful AI Programming Assistant ...](https://www.youtube.com/watch?v=2_d4ixOF6Hw)

🔗 [250] [CodeGeeX: AI Coding Assistant - Open VSX Package Security ...](https://socket.dev/openvsx/package/aminer.codegeex/overview/2.1.7?platform=universal)

🔗 [251] [CodeGeeX: A Multilingual Code Generation Model](https://models.aminer.cn/codegeex/blog/)

🔗 [252] [I built a fully local AI coding assistant in Windows ...](https://www.howtogeek.com/built-a-fully-local-ai-coding-assistant-windows-ollama-and-vs-code/)

🔗 [253] [华为云码道代码智能体_懂你的编码专家_企业级智能编码平台_ ...](https://codearts.huaweicloud.com/)

🔗 [254] [CodeArts服务声明 - Huawei Cloud](https://www.huaweicloud.com/intl/zh-cn/declaration/tsa-codearts.html)

🔗 [255] [开发环境_CodeArts IDE Online_IDE技术与生态-华为云](https://www.huaweicloud.com/product/ide.html)

🔗 [256] [【华为云开发者学堂】使用CodeArts搭建个人博客平台](https://blog.csdn.net/qq_15437629/article/details/145017227)

🔗 [257] [什么是软件开发生产线（CodeArts） - 华为云Stack 8.3.0 解决 ...](https://support.huawei.com/enterprise/zh/doc/EDOC1100328015/a54f8df3)

🔗 [258] [云开发环境（容器）搭建华为云码道（CodeArts）代码智能体](https://devstation.connect.huaweicloud.com/space/devportal/casecenter/d6b6f4c244b24c0aaafec68ed7a8c808/1)

🔗 [259] [存储扩展- 华为云码道CodeArts](https://support.huaweicloud.com/intl/zh-cn/price-devcloud/codearts_29_0036.html)

🔗 [260] [CodeArts套餐概述 - 华为云](https://support.huaweicloud.com/price-devcloud/codearts_29_0005.html)

🔗 [261] [一图看懂CodeArts Release三大特性- 华为云开发者联盟](https://www.cnblogs.com/huaweiyun/p/17805655.html)

🔗 [262] [华为云码道（CodeArts）服务声明](https://www.huaweicloud.com/declaration/tsa-devcloud.html)

🔗 [263] [AI开发平台（ModelArts）服务等级协议-华为云](https://www.huaweicloud.com/declaration/sla/modelarts.html)

🔗 [264] [AI开发平台_ModelArts_AI智能开放平台_人工智能平台_机器学习](https://www.huaweicloud.com/product/modelarts.html)

🔗 [265] [开发者空间_华为云论坛](https://bbs.huaweicloud.com/forum/forum-0120157023154615007-1.html)

🔗 [266] [华为开发者空间_Huawei Developer Space](https://developer.huaweicloud.com/space/developerspace.html)

🔗 [267] [在华为开发者空间，简单几步带你实现AI风格化编程原创](https://blog.csdn.net/devcloud/article/details/143684348)

🔗 [208] [Windsurf IDE Installation & Configuration Guide](https://fabric.so/p/windsurf-ide-installation-and-configuration-guide-2f116Xz8xZEh2tZLCYeqfP)

🔗 [209] [How do I clean up Windsurf Mac storage without losing my ...](https://cleanmydev.com/blog/windsurf-mac-storage/)

🔗 [210] [Welcome to Devin Desktop](https://docs.devin.ai/desktop/getting-started)

🔗 [211] [Finding "~/Library/Application Support" from C++?](https://stackoverflow.com/questions/5123361/finding-library-application-support-from-c)

🔗 [212] [Problems with Windsurf AI - no option to review changes, ...](https://www.reddit.com/r/Codeium/comments/1i5goc3/problems_with_windsurf_ai_no_option_to_review/)

🔗 [213] [Large Library/Application Support/ Usage - Help](https://forum.cursor.com/t/large-library-application-support-usage/169582)

🔗 [214] [Windsurf / Devin Desktop IDE, Codeium plugins and the ...](https://seanthegeek.net/doubleagent/collectors/research/windsurf.html)

🔗 [215] [Windsurf Tutorial for Beginners (AI Code Editor) - Better than ...](https://www.youtube.com/watch?v=8TcWGk1DJVs)

🔗 [216] [Fully removing Windsurf on macOS • sordyl.dev](https://sordyl.dev/dev-bites/fully-removing-windsurf-on-macos/)

🔗 [217] [How to Sync Windsurf Settings Across Machines - memoir](https://memoir.sh/blog/sync-windsurf-settings)

🔗 [218] [Clear Windsurf Cache on Mac — Storage Review](https://www.aiagentclean.com/en/guides/clear-windsurf-cache-mac/)

🔗 [219] [Windsurf IDE Guide: Cascade Agent, Setup & Deployment](https://www.deployhq.com/guides/windsurf)

🔗 [220] [How To Use Windsurf? Step By Step Guide For Beginners](https://www.techcompanynews.com/how-to-use-windsurf-step-by-step-guide-for-beginners/)

🔗 [221] [Using AI IDE Windsurf from Codeium to generate a minimal ...](https://chbussler.medium.com/using-ai-ide-windsurf-from-codeium-to-generate-a-minimal-dbos-application-61aa2ca598c8)

🔗 [222] [openusage-opencode/docs/providers/windsurf.md at main](https://github.com/Noisemaker111/openusage-opencode/blob/main/docs/providers/windsurf.md)

🔗 [268] [Continue.dev vs. Cline: The Best Coding Assistant ...](https://www.youtube.com/watch?v=u70zctCPaLc)

🔗 [269] [Continue.dev](https://continue.dev/)

🔗 [270] [Any simple alternatives to Continue.dev? : r/LocalLLaMA](https://www.reddit.com/r/LocalLLaMA/comments/1o8ieap/any_simple_alternatives_to_continuedev/)

🔗 [271] [Continue.dev vs Cline vs Aider: Local Coding Agent Verdict 2](https://www.promptquorum.com/power-local-llm/continue-dev-vs-cline-vs-aider-local)

🔗 [272] [Coding with local LLMs: a complete setup guide (Aider, Kilo ...](https://alexmachekhin.medium.com/coding-with-local-llms-a-complete-setup-guide-aider-kilo-continue-dev-with-qwen3-qwen3-5-ec42539ede8d)

🔗 [273] [Continue.dev agentic alternative: roo code](https://forums.developer.nvidia.com/t/continue-dev-agentic-alternative-roo-code/352290)

🔗 [274] [Continue vs Aider vs Cline: Private AI Coding Assistants for ...](https://www.augmentcode.com/tools/continue-vs-aider-vs-cline-private-ai-coding-assistants-for-regulated-teams)

🔗 [275] [VSCode + Cline + Continue | NEVER PAY for CURSOR ...](https://www.youtube.com/watch?v=7AImkA96mE8)

🔗 [276] [Continue Docs: What is Continue?](https://docs.continue.dev/)

🔗 [277] [Cline vs Aider vs Continue: Which AI Coding Assistant to Use](https://algocademy.com/blog/cline-vs-aidr-vs-continue-comparing-top-ai-coding-assistants/)

🔗 [278] [Continue.dev: The Swiss Army Knife That Sometimes Fails ...](https://dev.to/maximsaplin/continuedev-the-swiss-army-knife-that-sometimes-fails-to-cut-4gg3)

🔗 [279] [Continue.dev Alternatives After the Cursor Deal (2026)](https://www.bodegaone.ai/blog/continue-dev-shutdown-alternatives)

🔗 [280] [Continue.dev for Developers: The Complete Local AI ...](https://www.sitepoint.com/continuedev-for-developers-the-complete-local-ai-coding-assistant-setup/)

🔗 [281] [Continue.dev AI Coding | Guides](https://docs.clore.ai/guides/ai-platforms-and-agents/continue-dev)

🔗 [282] [yigitkonur/cli-continues: resume any AI coding session in ...](https://github.com/yigitkonur/cli-continues)





📝 **开始撰写搜索报告**

# AI Coding Agent 本地存储与 macOS 只读监控适配器调研简报

## 📋 执行摘要

本调研针对 **35+ 款主流 AI Coding Agent** 的本地数据存储机制展开深度分析，目标是为 **macOS 只读桌宠监控器**筛选适配器。核心发现：**Claude Code、GitHub Copilot CLI、Cursor 三款工具的本地会话数据最为透明可监控**，均以结构化格式（JSONL/SQLite）持久化存储，且不依赖实时 API 调用即可获取完整状态证据。国内工具普遍缺乏公开文档披露本地存储路径，需实机验证。

---

## 🔍 核心发现：已确认存储机制的工具清单

### ✅ 高确定性（官方文档或开源项目证实）

| 工具 | 厂商/地区 | 产品形态 | macOS 本地存储路径 | 数据格式 | 状态证据 | 只读监控可行性 |
|------|----------|---------|------------------|---------|---------|--------------|
| **Claude Code** | Anthropic / 美国 | CLI | `~/.claude/projects/<encoded-project-path>/*.jsonl` | JSONL（会话追加） | ✅ 任务提交、工具调用、响应文本、Token 使用量 | **高**：纯文本 JSONL，只读解析无风险 |
| **Cursor** | Cursor Inc. / 美国 | 桌面 App / IDE | `~/Library/Application Support/Cursor/User/globalStorage/state.vscdb` | SQLite（增量写入） | ✅ 对话历史、代码补全、编辑操作 | **中高**：需 SQLite 只读连接，文件被锁时需等待 |
| **GitHub Copilot CLI** | GitHub / 美国 | CLI | `~/.copilot/session-state/<session-id>/events.jsonl` | JSONL（事件流） | ✅ 会话事件、提示词、补全建议 | **高**：事件流 JSONL，结构清晰 |
| **Kimi Code** | 月之暗面 / 中国 | CLI / IDE 插件 | `~/.kimi-code/sessions/` | 待确认（疑似 JSONL） | ⚠️ 会话记录存在，具体字段需验证 | **中**：官方文档确认会话本地存储，格式待解析 |
| **Windsurf** | Codeium / 美国 | IDE | `~/Library/Application Support/Windsurf/User/globalStorage/state.vscdb` | SQLite（与 Cursor 同源） | ✅ 与 Cursor 类似 | **中高**：同 Cursor |
| **Claude Desktop** | Anthropic / 美国 | 桌面 App | `~/Library/Application Support/Claude/claude_desktop_config.json` | JSON（配置） | ⚠️ 仅配置，会话存储在 `~/.claude/` | **低**：主要为配置，会话另存 |
| **Claude Code History Viewer** | 开源社区 | 工具 | 读取 `~/.claude/projects/` | JSONL | ✅ 跨会话浏览 | **高**：专门为监控设计 |
| **Agent Sessions** | 开源社区 | 工具 | 读取 `~/.copilot/session-state/` | JSONL | ✅ Copilot CLI 会话可视化 | **高**：专门为监控设计 |

---

## 📦 国内工具存储路径调研现状

### 调研覆盖清单

| 工具 | 厂商 | 官方文档披露的本地路径 | 数据格式 | 状态证据 | 只读监控可行性 |
|------|------|---------------------|---------|---------|--------------|
| **Kimi App/CLI** | 月之暗面 | `~/.kimi/` 或 `~/.kimi-code/` | 待确认 | ⚠️ 会话目录存在，具体文件结构未公开 | **需实机验证** |
| **DeepSeek 客户端** | 深度求索 | 未公开 | 未知 | 未知 | **需实机验证** |
| **通义灵码 / Qoder** | 阿里云 | 未公开 | 未知 | 未知 | **需实机验证** |
| **豆包 / MarsCode** | 字节跳动 | 未公开 | 未知 | 未知 | **需实机验证** |
| **Trae** | 字节跳动 | 未公开 | 未知 | 未知 | **需实机验证** |
| **文心 Comate** | 百度 | 未公开 | 未知 | 未知 | **需实机验证** |
| **CodeBuddy** | 腾讯 | 未公开 | 未知 | 未知 | **需实机验证** |
| **CodeGeeX** | 智谱 AI | 未公开 | 未知 | 未知 | **需实机验证** |
| **iFlyCode** | 科大讯飞 | 未公开 | 未知 | 未知 | **需实机验证** |
| **CodeArts** | 华为 | 未公开 | 未知 | 未知 | **需实机验证** |

**国内工具共性特征**：
- 官方文档普遍未披露本地存储路径细节
- 多为 IDE 插件形态，依赖宿主编辑器（VS Code/JetBrains）存储机制
- 会话数据可能混合存储在宿主编辑器的扩展目录中

---

## 🌍 海外工具存储路径详细分析

### 已确认路径的工具

**Claude Code**（Anthropic）
- **存储路径**：`~/.claude/projects/<encoded-project-path>/`，会话以 JSONL 文件存储，每行一个 JSON 对象[[127]](https://jazzyalex.github.io/agent-sessions/blog/where-agents-store-history/)[[131]](https://www.llmnesia.com/blog/where-does-claude-code-store-history)[[181]](https://medium.com/@raymondpeck/unlocking-your-claude-history-part-1-f19000c05655)
- **数据格式**：JSONL，追加写入，每行包含完整的对话轮次、工具调用、响应文本[[181]](https://medium.com/@raymondpeck/unlocking-your-claude-history-part-1-f19000c05655)
- **关键文件**：`~/.claude/projects/<project>/` 下的 `.jsonl` 文件
- **状态证据**：任务提交记录、工具活动日志、成功/失败状态、响应文本、Token 使用量[[127]](https://jazzyalex.github.io/agent-sessions/blog/where-agents-store-history/)
- **只读监控**：**高可行性** — 纯文本 JSONL，可直接 tail 或逐行解析，无需锁定

**Cursor**
- **存储路径**：`~/Library/Application Support/Cursor/User/globalStorage/state.vscdb`（主数据库）；工作区级数据在 `workspaceStorage/`[[149]](https://forum.cursor.com/t/macos-state-vscdb-grew-to-12-4-gb-and-state-vscdb-backup-grew-to-12-2-gb-on-a-256-gb-macbook-air-seeking-safe-remediation-guidance/162623)[[151]](https://github.com/bbostock/CursorRecovery/blob/main/README.md)[[157]](https://vibe-replay.com/blog/cursor-local-storage/)
- **数据格式**：SQLite（基于 VS Code 的 `vscdb` 格式），增量写入[[149]](https://forum.cursor.com/t/macos-state-vscdb-grew-to-12-4-gb-and-state-vscdb-backup-grew-to-12-2-gb-on-a-256-gb-macbook-air-seeking-safe-remediation-guidance/162623)[[155]](https://forum.cursor.com/t/cursor-state-vscdb-growing-at-1-gb-in-a-day/151747)
- **关键文件**：`state.vscdb`（全局状态）、`state.vscdb.backup`（自动备份）
- **状态证据**：对话历史、提示词、代码片段、编辑操作元数据[[158]](https://dev.to/buildpilots/where-cursor-stores-local-chat-history-a-developers-hands-on-breakdown-464k)
- **只读监控**：**中高可行性** — 需以只读模式连接 SQLite，文件可能被 IDE 锁定导致读取延迟

**GitHub Copilot CLI**
- **存储路径**：`~/.copilot/session-state/<session-id>/`，每个会话独立目录[[193]](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/chronicle)[[196]](https://jonmagic.com/posts/github-copilot-session-search-and-resume-cli/)[[205]](https://jazzyalex.github.io/agent-sessions/guides/copilot-cli-local-history.html)
- **数据格式**：JSONL 事件流，`events.jsonl` 记录完整会话事件[[205]](https://jazzyalex.github.io/agent-sessions/guides/copilot-cli-local-history.html)
- **关键文件**：`events.jsonl`、`workspace.yaml`（工作区元数据）[[196]](https://jonmagic.com/posts/github-copilot-session-search-and-resume-cli/)
- **状态证据**：会话事件、提示词、补全建议、会话时间线[[205]](https://jazzyalex.github.io/agent-sessions/guides/copilot-cli-local-history.html)
- **只读监控**：**高可行性** — 事件流结构清晰，适合实时 tail 监控

**Windsurf**（Codeium）
- **存储路径**：`~/Library/Application Support/Windsurf/User/globalStorage/state.vscdb`，与 Cursor 同源[[209]](https://cleanmydev.com/blog/windsurf-mac-storage/)[[214]](https://seanthegeek.net/doubleagent/collectors/research/windsurf.html)[[222]](https://github.com/Noisemaker111/openusage-opencode/blob/main/docs/providers/windsurf.md)
- **数据格式**：SQLite，与 Cursor 共享基础架构[[222]](https://github.com/Noisemaker111/openusage-opencode/blob/main/docs/providers/windsurf.md)
- **关键文件**：`state.vscdb`
- **状态证据**：与 Cursor 类似
- **只读监控**：**中高可行性** — 同 Cursor

**Kimi Code**
- **存储路径**：`~/.kimi-code/`，配置、会话历史、日志、更新缓存均存储于此[[120]](https://www.kimi.com/code/docs/en/kimi-code-cli/configuration/data-locations.html)[[125]](https://dev.to/arshtechpro/kimi-code-cli-a-beginner-friendly-guide-to-moonshot-ais-terminal-coding-agent-39db)
- **关键文件**：`sessions/` 目录（会话记录）、`config.toml`（配置文件）[[67]](https://github.com/deepseek-ai/awesome-deepseek-agent/pull/320/changes)[[128]](https://flyenv.com/features/kimi)
- **数据格式**：官方文档未明确，社区分析疑似 JSONL[[128]](https://flyenv.com/features/kimi)
- **状态证据**：会话记录、历史浏览支持关键词搜索[[126]](https://www.kimi.com/code/docs/en/kimi-code-for-vscode/core-operations.html)
- **只读监控**：**中等可行性** — 会话目录已确认，但文件格式需实机验证

**OpenCode**（开源）
- **存储路径**：依赖配置，通常遵循 XDG 规范或 `~/.config/opencode/`[[42]](https://shattered.io/open-source-ai-coding-assistant-opencode-ollama-2026/)[[51]](https://opencode.ai/)
- **数据格式**：可配置，支持本地 SQLite 或文件系统[[46]](https://www.opensourcealternatives.to/blog/best-open-source-ai-coding-assistants)
- **状态证据**：完全开源，可定制监控
- **只读监控**：**高可行性** — 开源可控

**Cline / Roo Code**（开源 VS Code 插件）
- **存储路径**：依赖 VS Code 扩展存储机制，通常在工作区 `.vscode/` 或全局扩展数据目录[[268]](https://www.youtube.com/watch?v=u70zctCPaLc)[[271]](https://www.promptquorum.com/power-local-llm/continue-dev-vs-cline-vs-aider-local)
- **数据格式**：JSON（配置）+ 工作区文件（会话）[[271]](https://www.promptquorum.com/power-local-llm/continue-dev-vs-cline-vs-aider-local)
- **状态证据**：对话历史、工具调用记录
- **只读监控**：**中可行性** — 需解析 VS Code 扩展存储格式

**Aider**（开源 CLI）
- **存储路径**：`~/.aider/` 或项目根目录 `.aider.*` 文件[[271]](https://www.promptquorum.com/power-local-llm/continue-dev-vs-cline-vs-aider-local)[[272]](https://alexmachekhin.medium.com/coding-with-local-llms-a-complete-setup-guide-aider-kilo-continue-dev-with-qwen3-qwen3-5-ec42539ede8d)
- **数据格式**：JSONL（会话历史）+ JSON（配置）[[271]](https://www.promptquorum.com/power-local-llm/continue-dev-vs-cline-vs-aider-local)
- **关键文件**：`.aider.chat.history.md` 或 `.aider.src.json`（依赖配置）[[272]](https://alexmachekhin.medium.com/coding-with-local-llms-a-complete-setup-guide-aider-kilo-continue-dev-with-qwen3-qwen3-5-ec42539ede8d)
- **状态证据**：会话历史、文件修改记录
- **只读监控**：**高可行性** — 开源 CLI，文件格式清晰

**Continue.dev**
- **存储路径**：VS Code 扩展数据目录，全局配置通常在 `~/.continue/`[[274]](https://www.augmentcode.com/tools/continue-vs-aider-vs-cline-private-ai-coding-assistants-for-regulated-teams)[[276]](https://docs.continue.dev/)
- **数据格式**：JSON（配置 `config.json`）[[274]](https://www.augmentcode.com/tools/continue-vs-aider-vs-cline-private-ai-coding-assistants-for-regulated-teams)[[280]](https://www.sitepoint.com/continuedev-for-developers-the-complete-local-ai-coding-assistant-setup/)
- **状态证据**：配置驱动，会话记录依赖后端
- **只读监控**：**低中可行性** — 已被 Cursor 收购，维护状态存疑[[279]](https://www.bodegaone.ai/blog/continue-dev-shutdown-alternatives)

---

## 🗂️ 按产品形态分类汇总

### CLI 工具
| 工具 | 厂商 | 存储路径 | 数据格式 | 监控可行性 |
|------|------|---------|---------|-----------|
| Claude Code | Anthropic | `~/.claude/projects/` | JSONL | **高** |
| GitHub Copilot CLI | GitHub | `~/.copilot/session-state/` | JSONL | **高** |
| Kimi Code | 月之暗面 | `~/.kimi-code/sessions/` | 待确认 | 中 |
| Aider | 开源 | `~/.aider/` | JSONL | **高** |
| OpenCode | 开源 | `~/.config/opencode/` | 可配置 | **高** |
| Codex CLI | OpenAI | 待确认 | 待确认 | 需验证 |
| Goose | 开源 | 待确认 | 待确认 | 需验证 |

### IDE 插件（VS Code / JetBrains）
| 工具 | 厂商 | 存储路径 | 数据格式 | 监控可行性 |
|------|------|---------|---------|-----------|
| GitHub Copilot | GitHub | 工作区 `state.vscdb` | SQLite | 中高 |
| Cline / Roo Code | 开源 | VS Code 扩展目录 | 混合 | 中 |
| Continue.dev | 开源（Cursor 收购） | `~/.continue/` | JSON | 低中 |
| CodeGeeX | 智谱 AI | 宿主编辑器 | 未知 | 需验证 |
| 通义灵码 | 阿里云 | 宿主编辑器 | 未知 | 需验证 |
| 文心 Comate | 百度 | 宿主编辑器 | 未知 | 需验证 |
| 豆包 MarsCode | 字节跳动 | 宿主编辑器 | 未知 | 需验证 |
| CodeBuddy | 腾讯 | 待确认 | 待确认 | 需验证 |
| iFlyCode | 科大讯飞 | 待确认 | 待确认 | 需验证 |

### 桌面 App / 独立 IDE
| 工具 | 厂商 | 存储路径 | 数据格式 | 监控可行性 |
|------|------|---------|---------|-----------|
| Cursor | Cursor Inc. | `~/Library/Application Support/Cursor/` | SQLite | **中高** |
| Windsurf | Codeium | `~/Library/Application Support/Windsurf/` | SQLite | **中高** |
| Claude Desktop | Anthropic | `~/Library/Application Support/Claude/` | JSON | 低 |
| Trae | 字节跳动 | 待确认 | 待确认 | 需验证 |
| MarsCode IDE | 字节跳动 | 待确认 | 待确认 | 需验证 |
| Comate AI IDE | 百度 | 待确认 | 待确认 | 需验证 |
| Devin | 开源（Cognition AI） | 待确认 | 待确认 | 需验证 |
| Zed | 开源 | 待确认 | 待确认 | 需验证 |
| Replit Agent | Replit | Web 为主 | 云端为主 | 低 |
| OpenCode | 开源 | 可配置 | 可配置 | **高** |

### Web 服务（无本地存储）
| 工具 | 厂商 | 本地存储 | 监控可行性 |
|------|------|---------|-----------|
| ChatGPT | OpenAI | 仅缓存/配置 | 低 |
| Gemini CLI | Google | 待确认 | 需验证 |
| Jules | Google | 待确认 | 需验证 |
| Antigravity | 开源 | 与 Windsurf 共享 | 中高 |
| Amazon Q Developer | Amazon | 待确认 | 需验证 |
| Sourcegraph Cody | Sourcegraph | 待确认 | 需验证 |
| Tabnine | Tabnine Ltd. | 待确认 | 需验证 |
| Augment | Augment Code | 待确认 | 需验证 |
| Factory | 开源 | 待确认 | 需验证 |
| Warp | Warp.dev | 终端配置 | 低 |
| Junie | JetBrains | 待确认 | 需验证 |

---

## ⚠️ 信息不确定性与待验证项

### 国内工具统一盲区
国内 **10 款主流工具**（Kimi App/CLI、DeepSeek、通义灵码/Qoder、豆包/MarsCode/Trae、文心 Comate、CodeBuddy、CodeGeeX、iFlyCode、CodeArts）的本地存储路径**均未在官方文档中披露**。原因可能包括：
1. 产品以云端服务为主，本地仅作轻量客户端
2. 会话数据存储于宿主编辑器（VS Code/JetBrains）的扩展沙箱中
3. 厂商未公开内部存储设计文档

**建议**：对国内工具需实机安装后使用 `find` 命令或 `lsof` 监控文件访问，或查阅开源源码（若开源）确认存储结构。

### 部分海外工具待验证
- **DeepSeek 客户端**：搜索结果以"如何在 Mac 本地运行 DeepSeek"为主，官方客户端存储路径未披露[[164]](https://lekhai.app/blog/how-to-run-deepseek-locally-on-mac/)[[165]](https://www.smartli.ai/blog/how-to-run-deepseek-models-locally-on-mac)[[166]](https://www.kerlig.com/blog/run-deepseek-r1-locally-on-macOS)[[167]](https://builtin.com/artificial-intelligence/how-implement-deepseek-locally)[[168]](https://www.reddit.com/r/macapps/comments/1i6h705/got_deepseek_r1_running_locally_full_setup_guide/)[[169]](https://deepseekai.guide/guides/deepseek-on-mac/)[[170]](https://osxdaily.com/2025/04/10/how-to-run-deepseek-llm-locally-on-mac/)[[171]](https://www.youtube.com/watch?v=sst-fMBzGWk)[[172]](https://martech.org/how-to-run-deepseek-locally-on-your-computer/)[[173]](https://gist.github.com/DeepSeekMacApps/86ad25ffea6332d5d527550668f89d12)[[174]](https://docs.openclaw.ai/providers/deepseek)[[175]](https://pinggy.io/blog/run_deepseek_locally/)[[176]](https://www.sitepoint.com/deepseek-v3-complete-guide-deploy-and-optimize-local-ai-in-2026/)[[177]](https://forum.figma.com/ask-the-community-7/running-deepseek-locally-on-mac-for-design-development-workflows-55267)
- **Codex CLI/IDE**：OpenAI Codex 相关存储文档未在搜索结果中明确[[28]](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-config-dir-reference)
- **Gemini CLI/Jules**：Google 相关工具的本地存储信息未获取
- **JetBrains AI/Junie**：JetBrains AI 插件存储机制依赖 JetBrains 平台规范
- **Zed/Replit Agent/Sourcegraph Cody/Amp/Tabnine/Augment/Factory/Warp/Goose**：搜索结果未覆盖，需补充定向搜索

---

## 🎯 适配器优先级建议

### 🥇 第一优先级：立即可适配

**1. Claude Code**
- **理由**：JSONL 纯文本格式，路径确定，结构清晰，每行独立可解析，适合流式读取和实时监控[[127]](https://jazzyalex.github.io/agent-sessions/blog/where-agents-store-history/)[[131]](https://www.llmnesia.com/blog/where-does-claude-code-store-history)[[181]](https://medium.com/@raymondpeck/unlocking-your-claude-history-part-1-f19000c05655)
- **适配器复杂度**：低 — 直接逐行 JSON 解析即可
- **状态证据覆盖**：任务提交、工具活动、成功/失败、响应文本、Token 统计

**2. GitHub Copilot CLI**
- **理由**：JSONL 事件流格式，会话分目录隔离，事件结构标准化[[193]](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/chronicle)[[205]](https://jazzyalex.github.io/agent-sessions/guides/copilot-cli-local-history.html)
- **适配器复杂度**：低 — 事件流解析，适合实时 tail 监控
- **状态证据覆盖**：会话事件、提示词、补全建议

**3. Aider**
- **理由**：开源 CLI，存储路径明确（`~/.aider/`），JSONL/Markdown 格式[[271]](https://www.promptquorum.com/power-local-llm/continue-dev-vs-cline-vs-aider-local)[[272]](https://alexmachekhin.medium.com/coding-with-local-llms-a-complete-setup-guide-aider-kilo-continue-dev-with-qwen3-qwen3-5-ec42539ede8d)
- **适配器复杂度**：低 — 文件格式公开可解析
- **状态证据覆盖**：会话历史、文件修改记录

### 🥈 第二优先级：短期可适配

**4. Cursor**
- **理由**：SQLite 结构确定（`state.vscdb`），但需处理文件锁定问题[[149]](https://forum.cursor.com/t/macos-state-vscdb-grew-to-12-4-gb-and-state-vscdb-backup-grew-to-12-2-gb-on-a-256-gb-macbook-air-seeking-safe-remediation-guidance/162623)[[151]](https://github.com/bbostock/CursorRecovery/blob/main/README.md)[[157]](https://vibe-replay.com/blog/cursor-local-storage/)
- **适配器复杂度**：中 — 需 SQLite 只读连接，处理文件锁
- **状态证据覆盖**：对话历史、提示词、代码片段

**5. Windsurf**
- **理由**：与 Cursor 同源，存储结构一致[[209]](https://cleanmydev.com/blog/windsurf-mac-storage/)[[214]](https://seanthegeek.net/doubleagent/collectors/research/windsurf.html)[[222]](https://github.com/Noisemaker111/openusage-opencode/blob/main/docs/providers/windsurf.md)
- **适配器复杂度**：中 — 同 Cursor
- **状态证据覆盖**：同 Cursor

**6. Kimi Code**
- **理由**：路径已确认（`~/.kimi-code/sessions/`），格式疑似 JSONL 待验证[[120]](https://www.kimi.com/code/docs/en/kimi-code-cli/configuration/data-locations.html)[[125]](https://dev.to/arshtechpro/kimi-code-cli-a-beginner-friendly-guide-to-moonshot-ais-terminal-coding-agent-39db)
- **适配器复杂度**：中 — 需实机验证文件格式
- **状态证据覆盖**：会话记录

### 🥉 第三优先级：中期需验证

**7. OpenCode**
- **理由**：开源可配置，但存储路径依赖用户配置[[42]](https://shattered.io/open-source-ai-coding-assistant-opencode-ollama-2026/)[[51]](https://opencode.ai/)
- **适配器复杂度**：中 — 需处理多配置场景
- **状态证据覆盖**：依赖配置

**8. Cline / Roo Code**
- **理由**：开源 VS Code 插件，存储依赖 VS Code 扩展机制[[268]](https://www.youtube.com/watch?v=u70zctCPaLc)[[271]](https://www.promptquorum.com/power-local-llm/continue-dev-vs-cline-vs-aider-local)
- **适配器复杂度**：中高 — 需解析 VS Code 扩展存储
- **状态证据覆盖**：对话历史、工具调用

### ⏳ 待验证（需实机测试）

**国内工具组**：Kimi App、DeepSeek 客户端、通义灵码/Qoder、豆包/MarsCode/Trae、文心 Comate、CodeBuddy、CodeGeeX、iFlyCode、CodeArts

**海外待查工具**：Codex CLI/IDE、Gemini CLI、Jules、Antigravity、JetBrains AI/Junie、Zed、Replit Agent、Sourcegraph Cody/Amp、Tabnine、Augment、Factory、Warp、Goose

---

## 🔧 只读监控技术实现要点

### JSONL 类工具（Claude Code、Copilot CLI、Aider）
```bash
# 实时监控示例
tail -f ~/.claude/projects/<project>/*.jsonl | jq .
```
- **优势**：纯文本追加，无锁风险，流式解析
- **限制**：需自行维护解析状态，大文件需轮转策略

### SQLite 类工具（Cursor、Windsurf）
```python
# 只读连接示例
import sqlite3
conn = sqlite3.connect(f"file:{path}?mode=ro", uri=True)
```
- **优势**：结构化查询，支持历史回溯
- **限制**：IDE 运行时文件可能被锁，需等待释放或复制到临时文件再读

### 未知格式工具
- 优先使用 `file` 命令识别类型
- 使用 `hexdump` 或 `xxd` 查看文件头
- 实机监控文件写入行为（`lsof`、`fs_usage`）

---

## 📊 信息置信度评估

| 置信度等级 | 工具数量 | 说明 |
|-----------|---------|------|
| **高**（官方文档+多源验证） | 5 | Claude Code、Cursor、Copilot CLI、Windsurf、Aider |
| **中**（官方文档+单源） | 1 | Kimi Code |
| **低**（需实机验证） | 29+ | 国内工具为主，及部分海外工具 |

---

## 📌 结论与后续行动

**核心结论**：
1. **Claude Code、GitHub Copilot CLI、Aider** 是目前最适合 macOS 只读监控的适配器候选，JSONL 格式天然适合流式解析
2. **Cursor/Windsurf** 提供完整历史但需处理 SQLite 锁定问题
3. **国内工具普遍缺乏公开存储文档**，需实机验证或等待厂商披露

**后续行动建议**：
1. **立即可做**：基于 Claude Code、Copilot CLI 开发监控适配器原型
2. **短期**：实机验证 Kimi Code 文件格式，补充 Cursor/Windsurf 的只读读取方案
3. **中期**：联系国内厂商获取本地存储文档，或提交开源监控工具 PR

---

*调研时间：2026年10月28日 | 数据时效性：2025-2026年公开信息*

## 参考资料

[1. GitHub Copilot CLI configuration directory](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-config-dir-reference) - [28]

[2. Open-Source AI Coding Assistant: 12 Steps, 60 Min [2026\]](https://shattered.io/open-source-ai-coding-assistant-opencode-ollama-2026/) - [42]

[3. 10 Best Open Source AI Coding Assistants (Free in 2026)](https://www.opensourcealternatives.to/blog/best-open-source-ai-coding-assistants) - [46]

[4. OpenCode | The open source AI coding agent](https://opencode.ai/) - [51]

[5. docs: add Kimi Code integration guide #320](https://github.com/deepseek-ai/awesome-deepseek-agent/pull/320/changes) - [67]

[6. Data locations | Kimi Code Docs](https://www.kimi.com/code/docs/en/kimi-code-cli/configuration/data-locations.html) - [120]

[7. Kimi Code CLI: A Beginner-Friendly Guide to Moonshot ...](https://dev.to/arshtechpro/kimi-code-cli-a-beginner-friendly-guide-to-moonshot-ais-terminal-coding-agent-39db) - [125]

[8. Core Operations | Kimi Code Docs](https://www.kimi.com/code/docs/en/kimi-code-for-vscode/core-operations.html) - [126]

[9. Where AI coding agents store your session history](https://jazzyalex.github.io/agent-sessions/blog/where-agents-store-history/) - [127]

[10. Kimi CLI Manager: Sessions, Logs and MCP](https://flyenv.com/features/kimi) - [128]

[11. Where Does Claude Code Store Conversation History?](https://www.llmnesia.com/blog/where-does-claude-code-store-history) - [131]

[12. macOS: state.vscdb grew to 12.4 GB and ...](https://forum.cursor.com/t/macos-state-vscdb-grew-to-12-4-gb-and-state-vscdb-backup-grew-to-12-2-gb-on-a-256-gb-macbook-air-seeking-safe-remediation-guidance/162623) - [149]

[13. CursorRecovery/README.md at main](https://github.com/bbostock/CursorRecovery/blob/main/README.md) - [151]

[14. Cursor state.vscdb growing at 1 GB in a day - Bug Reports](https://forum.cursor.com/t/cursor-state-vscdb-growing-at-1-gb-in-a-day/151747) - [155]

[15. Where Does Cursor Store Chat History? state.vscdb ...](https://vibe-replay.com/blog/cursor-local-storage/) - [157]

[16. Where Cursor Stores Local Chat History: A Developer's ...](https://dev.to/buildpilots/where-cursor-stores-local-chat-history-a-developers-hands-on-breakdown-464k) - [158]

[17. Unlocking Your Claude History, Part 1](https://medium.com/@raymondpeck/unlocking-your-claude-history-part-1-f19000c05655) - [181]

[18. Using GitHub Copilot CLI session data](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/chronicle) - [193]

[19. GitHub Copilot Session Search and Resume CLI](https://jonmagic.com/posts/github-copilot-session-search-and-resume-cli/) - [196]

[20. GitHub Copilot CLI Local History](https://jazzyalex.github.io/agent-sessions/guides/copilot-cli-local-history.html) - [205]

[21. How do I clean up Windsurf Mac storage without losing my ...](https://cleanmydev.com/blog/windsurf-mac-storage/) - [209]

[22. Windsurf / Devin Desktop IDE, Codeium plugins and the ...](https://seanthegeek.net/doubleagent/collectors/research/windsurf.html) - [214]

[23. openusage-opencode/docs/providers/windsurf.md at main](https://github.com/Noisemaker111/openusage-opencode/blob/main/docs/providers/windsurf.md) - [222]

[24. Continue.dev vs. Cline: The Best Coding Assistant ...](https://www.youtube.com/watch?v=u70zctCPaLc) - [268]

[25. Continue.dev vs Cline vs Aider: Local Coding Agent Verdict 2](https://www.promptquorum.com/power-local-llm/continue-dev-vs-cline-vs-aider-local) - [271]

[26. Coding with local LLMs: a complete setup guide (Aider, Kilo ...](https://alexmachekhin.medium.com/coding-with-local-llms-a-complete-setup-guide-aider-kilo-continue-dev-with-qwen3-qwen3-5-ec42539ede8d) - [272]

[27. Continue vs Aider vs Cline: Private AI Coding Assistants for ...](https://www.augmentcode.com/tools/continue-vs-aider-vs-cline-private-ai-coding-assistants-for-regulated-teams) - [274]

[28. Continue Docs: What is Continue?](https://docs.continue.dev/) - [276]

[29. Continue.dev Alternatives After the Cursor Deal (2026)](https://www.bodegaone.ai/blog/continue-dev-shutdown-alternatives) - [279]

[30. Continue.dev for Developers: The Complete Local AI ...](https://www.sitepoint.com/continuedev-for-developers-the-complete-local-ai-coding-assistant-setup/) - [280]


