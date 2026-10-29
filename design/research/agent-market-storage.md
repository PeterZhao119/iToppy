## 📋 需求解读

这是一个**多维度的证据化分级与分类任务**，需要：

1. **市场使用程度分级**（S/A/B/C 四级）：基于 Stack Overflow/JetBrains 调查、官方用户量、插件安装量、GitHub stars、行业报告
2. **本地数据模式分类**：JSONL/SQLite/Markdown/VS Code globalStorage/纯文本/配置主导/专有混合
3. **状态信息完整度区分**：完整事件时间线/完整 transcript/启发式日志/无本地状态

当前时间锚定：**2026年10月29日**，需优先获取 2025-2026 年最新数据。

---

## 🔍 并行搜索规划

我将从 6 个维度并行检索，确保数据全面且最新：


> **🔍️ 即时搜索**
> AI Coding Tools Market 2025 2026 developer survey Stack Overflow JetBrains most popular
> Stack Overflow Developer Survey 2025 AI coding tools usage statistics
> JetBrains Developer Ecosystem Survey 2025 AI coding assistant market share
> GitHub Copilot Cursor Windsurf Devin GitHub stars plugin installs 2025 2026
> AI coding tools local data storage format JSONL SQLite VS Code globalStorage
> Claude Code Cursor Trae Kimi Code local state storage logging mechanism 2025


🔗 [61] [AI Coding Assistants: Claude Code Ties Cursor at 18% [2026]](https://tech-insider.org/ie/ai-coding-assistants-2026/)

🔗 [62] [GitHub Copilot Under Pressure: Cursor and Claude Code Are Eating Its Lunch (2026)](https://pasqualepillitteri.it/en/news/3392/github-copilot-cursor-claude-code-ai-coding-showdown-2026)

🔗 [63] [JetBrains Java-Kotlin VS Code Extension Hits RC [2026]](https://shattered.io/jetbrains-java-kotlin-vs-code-cursor-rc-2026/)

🔗 [64] [90% of professional developers use AI coding agents at least once a week, and Claude Code has overtaken GitHub Copilot to take the top spot with nearly double the market share.](https://gigazine.net/gsc_news/en/20260824-ai-coding-agent-adoption-trends/)

🔗 [65] [Stack Overflow Dev Survey: Visual Studio, VS Code Hold Off AI IDEs to Remain on Top](https://visualstudiomagazine.com/articles/2025/08/01/stack-overflow-dev-survey-visual-studio-vs-code-hold-of-ai-ides-to-remain-on-top.aspx)

🔗 [66] [VS Code 1.142 Update: Agent Canvases, Python Fixes [2026]](https://tech-insider.org/vscode-1-142-agent-canvases-update-2026/)

🔗 [67] [AI Coding Adoption 2026: 50 Statistics From 7 Surveys](https://www.digitalapplied.com/blog/ai-coding-adoption-statistics-2026-50-data-points)

🔗 [68] [Which AI Coding Tools Do Developers Actually Use at Work?](https://blog.jetbrains.com/research/2026/04/which-ai-coding-tools-do-developers-actually-use-at-work/)

🔗 [69] [Stackoverflow developer survey 2025 - Emacs doesn't ...](https://www.reddit.com/r/emacs/comments/1md1eva/stackoverflow_developer_survey_2025_emacs_doesnt/)

🔗 [70] [JetBrains Survey Finds AI Coding Agents Becoming ...](https://adtmag.com/articles/jetbrains-survey-finds-ai-coding-agents-becoming-routine-developer-tools.aspx)

🔗 [71] [Your AI stack: one tool or a whole pack? 🦖 JetBrains' 2026 ...](https://www.instagram.com/p/DeL_j5ajOhO/)

🔗 [72] [The results of the 2026 Developer Survey are here!](https://stackoverflow.blog/2026/10/06/the-results-of-the-2026-developer-survey-are-here/)

🔗 [73] [AI Coding Assistant Statistics 2026](https://uvik.net/blog/ai-coding-assistant-statistics/)

🔗 [74] [Top 5 Code Editors and IDEs of 2026: VS Code, JetBrains ...](https://guptadeepak.com/tools/top-5-code-editors-ides-2026/)

🔗 [1] [Best Programming Languages to Learn in 2027](https://www.simplilearn.com/best-programming-languages-start-learning-today-article)

🔗 [2] [AI Coding Statistics 2026: 84% of Developers Use the Tools, Only 29% Trust Them](https://sqmagazine.co.uk/ai-coding-statistics/)

🔗 [3] [The share of developers using AI to write half or more code jumped from 12% to 42% YOY in latest BairesDev survey](https://venturebeat.com/data/the-share-of-developers-using-ai-to-write-half-or-more-code-jumped-from-12-to-42-yoy-in-latest-bairesdev-survey)

🔗 [4] [Top programming languages in 2026: data-backed ranking](https://www.netguru.com/blog/best-programming-language-for-software-development)

🔗 [5] [Copilot Share Falls to 51% as Cursor Hits $2B ARR [2026]](https://tech-insider.org/ie/github-copilot-market-share-2026/)

🔗 [6] [Vibe coding statistics 2026: Adoption, productivity, and security data](https://www.hostinger.com/blog/vibe-coding-statistics/)

🔗 [7] [Developers Lean on AI More, But Report Growing Doubts About Accuracy, Stack Overflow Survey Says](https://adtmag.com/blogs/watersworks/2026/01/stack-overflow-survey.aspx)

🔗 [8] [Stack Overflow in freefall: 78 percent drop in number of questions](https://www.techzine.eu/news/devops/137686/stack-overflow-in-freefall-78-percent-drop-in-number-of-questions/)

🔗 [9] [Stack Overflow users don’t trust AI. They’re using it anyway](https://www.theverge.com/podcast/844073/stack-overflow-ceo-ai-coding-chatgpt-code-red-interview)

🔗 [10] [Best AI Coding Tools in 2026: A Data-Driven Comparison](https://sqmagazine.co.uk/best-ai-coding-tools/)

🔗 [11] [2025 Stack Overflow Developer Survey](https://survey.stackoverflow.co/2025/)

🔗 [12] [AI | 2025 Stack Overflow Developer Survey](https://survey.stackoverflow.co/2025/ai)

🔗 [13] [Stack Overflow's 2025 Developer Survey Reveals Trust in ...](https://stackoverflow.co/company/press/archive/stack-overflow-2025-developer-survey/)

🔗 [14] [Mind the gap: Closing the AI trust gap for developers](https://stackoverflow.blog/2026/02/18/closing-the-developer-ai-trust-gap/)

🔗 [15] [Stack Overflow Survey 2025: 84% of devs use AI… but 46 ...](https://www.reddit.com/r/programming/comments/1mdyy9x/stack_overflow_survey_2025_84_of_devs_use_ai_but/)

🔗 [16] [Stack Overflow Developer Survey](https://survey.stackoverflow.co/)

🔗 [17] [84% Of Developer Use AI, But Here's Why They're Not Happy](https://www.youtube.com/watch?v=jUNxRTh4hlk)

🔗 [18] [Stack Overflow's 2026 Developer Survey Reveals Positive ...](https://stackoverflow.co/company/press/archive/stack-overflow-annual-developer-survey-ai-trust-conditional)

🔗 [19] [Thoughts on StackOverflow 2025 Developer Survey](https://dev.to/davidshq/thoughts-on-stackoverflow-2025-developer-survey-part-1-3d5o)

🔗 [20] [Six in 10 tech workers who participated in a new survey ...](https://www.facebook.com/cnn/posts/six-in-10-tech-workers-who-participated-in-a-new-survey-say-they-try-to-avoid-us/1490255409633772/)

🔗 [75] [85% of developers use AI regularly – JetBrains survey](https://www.infoworld.com/article/4077352/85-of-developers-use-ai-regularly-jetbrains-survey.html)

🔗 [76] [PyCharm vs VS Code 2026: Full Comparison & Verdict](https://tech-insider.org/pycharm-vs-vscode-2026/)

🔗 [77] [8 Best AI Coding Assistants by Job [Updated August 2026]](https://www.augmentcode.com/tools/8-top-ai-coding-assistants-and-their-best-use-cases)

🔗 [78] [JetBrains Junie vs GitHub Copilot vs Cursor: $12 Gap [2026]](https://tech-insider.org/jetbrains-junie-vs-github-copilot-vs-cursor-2026/)

🔗 [79] [Best AI Coding Tools 2026: 7 Tested [Ranked]](https://tech-insider.org/ai-coding-tools-2026-transforming-software-development/)

🔗 [80] [The State of Developer Ecosystem 2025: Coding in ...](https://blog.jetbrains.com/research/2025/10/state-of-developer-ecosystem-2025/)

🔗 [81] [Industry Reports](https://www.jetbrains.com/resources/industry-reports/)

🔗 [82] [JetBrains Developer Ecosystem Survey 2025 is out! : r/scala](https://www.reddit.com/r/scala/comments/1kvr18p/jetbrains_developer_ecosystem_survey_2025_is_out/)

🔗 [83] [🚀 The State of Developer Ecosystem 2025 Report is here! ...](https://www.facebook.com/JetBrains/videos/-the-state-of-developer-ecosystem-2025-report-is-herethis-years-edition-reveals-/837654472158063/)

🔗 [84] [JetBrains AI Assistant: The Ultimate 2026 Review for ...](https://skywork.ai/skypage/en/jetbrains-ai-assistant-review/2032070189540384768)

🔗 [85] [🚀 The State of Developer Ecosystem 2025 Report is here! ...](https://www.linkedin.com/posts/jetbrains_the-state-of-developer-ecosystem-2025-activity-7384221761837608960-ef_9)

🔗 [86] [AI Coding Agents: Adoption Trends](https://blog.jetbrains.com/research/2026/08/ai-coding-agent-adoption-2026/)

🔗 [87] [Cognition Open-Sources an Agent Plugin that Helps Secure Systems against Recent Cybersecurity Threats](https://www.marktechpost.com/2026/10/24/cognition-devin-vulnerability-fixes-plugin-php2shell-nodejs-gitlab/)

🔗 [88] [Cognition Hits $48B; Devin Writes 89% of Its Code [2026]](https://tech-insider.org/ie/cognition-devin-26-billion-2026/)

🔗 [89] [9 AI Coding Alternatives for Terminal Development: Complete 2026 Guide](https://pasqualepillitteri.it/en/news/386/ai-coding-cli-alternatives-2026)

🔗 [90] [Cursor vs Copilot 2026: $20 vs $10, $29B Valuation [Tested]](https://tech-insider.org/cursor-vs-copilot-2026/)

🔗 [91] [Google Antigravity vs Windsurf: Which AI Coding Assistant Is Ready for Enterprise?](https://www.augmentcode.com/tools/google-antigravity-vs-windsurf)

🔗 [92] [Cline vs Claude Code vs Copilot: Free vs $20 vs $10 [2026]](https://tech-insider.org/cline-vs-claude-code-2026/)

🔗 [93] [Windsurf Review in 2026: Pricing, Login, AI, App, Windows & FAQs](https://nubiapage.com/windsurf-review-in-2026-pricing-login-ai-app-windows-user-experience-and-faqs/)

🔗 [94] [Windsurf vs Cursor vs Copilot: $200 vs $39 Gap [2026]](https://tech-insider.org/windsurf-vs-cursor-vs-github-copilot-2026/)

🔗 [95] [grapeot/devin.cursorrules: Magic to turn Cursor/Windsurf ...](https://github.com/grapeot/devin.cursorrules)

🔗 [96] [GitHub Copilot vs Claude Code vs Cursor vs Windsurf (2026)](https://medium.com/@kanerika/github-copilot-vs-claude-code-vs-cursor-vs-windsurf-2026-c54f8a5cc051)

🔗 [97] [Cursor vs Windsurf vs GitHub Copilot](https://www.builder.io/blog/cursor-vs-windsurf-vs-github-copilot)

🔗 [98] [Windsurf vs GitHub Copilot | AI IDE Comparison](https://windsurf.com/compare/windsurf-vs-github-copilot)

🔗 [99] [GitHub Copilot vs Cursor vs Windsurf AI Comparison](https://www.digitalapplied.com/blog/github-copilot-vs-cursor-vs-windsurf-ai-coding-assistants)

🔗 [100] [GitHub Copilot vs Cursor vs Windsurf: The Trade-Offs Nobody ...](https://www.youtube.com/watch?v=LRBU6CUCcyc&vl=en-US)

🔗 [101] [GitHub Copilot vs Cursor vs Windsurf: Which AI Coding ...](https://dev.to/synsun/github-copilot-vs-cursor-vs-windsurf-which-ai-coding-assistant-actually-makes-you-faster-in-2026-4db3)

🔗 [102] [windsurf · GitHub Topics](https://github.com/topics/windsurf)

🔗 [103] [GitHub Copilot vs Windsurf (2026) - The AI Agent Index](https://theaiagentindex.com/compare/github-copilot-vs-windsurf)

🔗 [104] [devin · GitHub Topics](https://github.com/topics/devin)

🔗 [41] [VS Code Extension Storage Explained: The What, Where, ...](https://medium.com/@krithikanithyanandam/vs-code-extension-storage-explained-the-what-where-and-how-3a0846a632ea)

🔗 [42] [Chat Wizard](https://marketplace.visualstudio.com/items?itemName=Veverke.chatwizard)

🔗 [43] [Common Capabilities | Visual Studio Code Extension API](https://code.visualstudio.com/api/extension-capabilities/common-capabilities)

🔗 [44] [where AI coding tools store your chat history - Inventory](https://www.myinventory.site/where-ai-tools-store-chat-history)

🔗 [45] [What are ALL configuration files used by Visual Studio ...](https://stackoverflow.com/questions/58900482/what-are-all-configuration-files-used-by-visual-studio-code-and-where-does-it-s)

🔗 [46] [HUGE inclusion of every JSON file under globalStorage ...](https://github.com/shanalikhan/code-settings-sync/issues/1137)

🔗 [47] [Understanding and Measuring Data Exposure in VSCode ...](https://arxiv.org/html/2412.00707v2)

🔗 [48] [Top 5 Local AI Tools for VS Code -- All Powered by Ollama](https://visualstudiomagazine.com/articles/2026/08/04/top-5-local-ai-tools-for-vs-code-all-powered-by-ollama.aspx)

🔗 [49] [r/vscode - why they save json in sqlite...](https://www.reddit.com/r/vscode/comments/1kdvwwx/why_they_save_json_in_sqlite/)

🔗 [50] [How to Use AI Models Locally in VS Code ...](https://dev.to/manikandan/how-to-use-ai-models-locally-in-vs-code-with-the-continue-plugin-with-multi-model-switching-3na0)

🔗 [51] [#DevHack: VS Code extension storage options](https://www.eliostruyf.com/devhack-code-extension-storage-options/)

🔗 [52] [Query Databases in VS Code with Copilot Tools and DBCode](https://www.youtube.com/watch?v=v4lUJBMIDxY)

🔗 [53] [Best Local-First AI Coding Tools 2026: 14 Compared](https://nimbalyst.com/blog/best-local-first-ai-coding-tools-2026/)

🔗 [54] [AI coding assistants are leaking credentials](https://netwrix.com/en/resources/blog/ai-coding-assistant-credential-storage-risks/)

🔗 [55] [SQLite Database Management in VS Code](https://dbcode.io/docs/supported-databases/sqlite/sqlite)

🔗 [56] [AI language models in VS Code](https://code.visualstudio.com/docs/agent-customization/language-models)

🔗 [57] [RammCodes](https://www.facebook.com/61554891783841/posts/wtf-brooooooooooooooooooooo-this-is-actually-insane-for-ai-coding-this-vs-code-e/122290399454163059/)

🔗 [58] [Best VS Code Extensions for Developers in 2026](https://www.devart.com/dbforge/best-vscode-extensions.html)

🔗 [59] [The Ultimate Local AI Coding Guide For 2026](https://www.youtube.com/watch?v=rp5EwOogWEw)

🔗 [60] [SQLite Viewer PRO for VS Code](https://vscode.sqliteviewer.app/en/)

🔗 [21] [How to integrate Cursor MCP with Kimi Code](https://composio.dev/toolkits/cursor/framework/kimi)

🔗 [22] [Claude Code vs Cursor: What Your AI Coding Tools Store ...](https://tuo-lei.com/notes/claude-code-vs-cursor-local-storage/)

🔗 [23] [Isolated Claude Code dialects for Codex, Kimi, Cursor ...](https://github.com/stefandevo/claude-dialects)

🔗 [24] [How Claude Code Manages Local Storage for AI Agents](https://milvus.io/blog/why-claude-code-feels-so-stable-a-developers-deep-dive-into-its-local-storage-design.md)

🔗 [25] [Share One Memory Between Cursor and Claude Code ...](https://www.memorylake.ai/en/blogs/share-one-memory-between-cursor-and-claude-code)

🔗 [26] [What Is Claude Code? Full History, Timeline & How It Works](https://www.taskade.com/blog/claude-code-history)

🔗 [27] [How are you handling persistent memory for AI coding ...](https://www.reddit.com/r/LocalLLaMA/comments/1r5q7xd/how_are_you_handling_persistent_memory_for_ai/)

🔗 [28] [What If Every AI Coding Session Made the Next One ...](https://medium.com/open-intelligence/what-if-every-ai-coding-session-made-the-next-one-smarter-5a72728657dd)

🔗 [29] [Coding Agent Memory for Kimi: Setup Guide (2026)](https://projectmem.dev/blog/coding-agent-memory-for-kimi/)

🔗 [30] [Stop Losing Context: Shared AI Memory for Claude & Cursor](https://www.youtube.com/watch?v=dkEUpfHYJ_k)

🔗 [31] [My experience with Claude Code after two weeks of ...](https://news.ycombinator.com/item?id=44596472)

🔗 [32] [Where Is Claude Code Session History? How to Find Your ...](https://dev.to/gonewx/where-is-claude-code-session-history-how-to-find-your-ai-coding-conversations-555o)

🔗 [33] [Does each Coding Agent use your data for model training? I ...](https://nyosegawa.com/en/posts/coding-agent-terms-investigation/)

🔗 [34] [Kimi Code Integration](https://docs.claude-mem.ai/kimi-integration)

🔗 [35] [Kimi K3 Tech Blog: Open Frontier Intelligence](https://www.kimi.ai/blog/kimi-k3)

🔗 [36] [Journal: Freelance Work and Research Notes](https://agiflow.io/blog)

🔗 [37] [Docs](https://icodeeasy.cc/en/docs/)

🔗 [38] [What we can all learn from the Claude Code source](https://brtkwr.com/posts/2026-04-01-what-we-can-all-learn-from-the-claude-code-source/)

🔗 [39] [Kimi K2.5 vs Claude Code (REAL Use Cases): New KING of ...](https://www.youtube.com/watch?v=ue1s3eHmF54)

🔗 [40] [Claude Code vs Cursor: Which AI Coding Tool in 2026?](https://www.testmuai.com/blog/claude-code-vs-cursor/)



       


> **🧐 线索探查**
> [Stack Overflow 2026 Developer Survey AI coding tools usage statistics](https://stackoverflow.blog/2026/10/06/the-results-of-the-2026-developer-survey-are-here/)
> [JetBrains 2026 AI coding agent adoption trends professional developers](https://blog.jetbrains.com/research/2026/08/ai-coding-agent-adoption-2026/)
> [JetBrains 2026 which AI coding tools developers use at work market share](https://blog.jetbrains.com/research/2026/04/which-ai-coding-tools-do-developers-actually-use-at-work/)
> [Claude Code vs Cursor local storage mechanism data format](https://tuo-lei.com/notes/claude-code-vs-cursor-local-storage/)
> [Claude Code local storage design JSONL format](https://milvus.io/blog/why-claude-code-feels-so-stable-a-developers-deep-dive-into-its-local-storage-design.md)
> [AI coding tools chat history storage location VS Code globalStorage SQLite](https://www.myinventory.site/where-ai-tools-store-chat-history)
> ▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶

📖 [106] [The results of the 2026 Developer Survey are here! - Stack Overflow](https://stackoverflow.blog/2026/10/06/the-results-of-the-2026-developer-survey-are-here/)

📖 [107] [AI Coding Agents: Adoption Trends - The JetBrains Blog](https://blog.jetbrains.com/research/2026/08/ai-coding-agent-adoption-2026/)

📖 [108] [Which AI Coding Tools Do Developers Actually Use at Work? - The JetBrains Blog](https://blog.jetbrains.com/research/2026/04/which-ai-coding-tools-do-developers-actually-use-at-work/)

📖 [110] [Claude Code vs Cursor: What Your AI Coding Tools Store Locally - Tuo Lei](https://tuo-lei.com/notes/claude-code-vs-cursor-local-storage/)

📖 [109] [https://milvus.io/blog/why-claude-code-feels-so-stable-a-developers-deep-dive-into-its-local-storage-design.md](https://milvus.io/blog/why-claude-code-feels-so-stable-a-developers-deep-dive-into-its-local-storage-design.md)

📖 [105] [Where Cursor, Claude Code and Codex store chat history on macOS](https://www.myinventory.site/where-ai-tools-store-chat-history)



        


> **🔍️ 即时搜索**
> GitHub stars AI coding tools 2026 Copilot Cursor Claude Code Windsurf Trae
> Kimi Code 通义灵码 文心Comate CodeBuddy 中国市场 AI编程工具 用户量 2025 2026
> AI coding tools VS Code marketplace installs Copilot Cursor Continue Aider 2025 2026
> Continue Aider Roo Code Cline OpenCode local storage format JSONL SQLite 2026
> Devin Amazon Q Developer Tabnine Augment Code local data storage mechanism 2026
> Claude Code transcript logging history storage location macOS 2026


🔗 [151] [AI Coding Tools Compared (2026): Cursor vs Claude ... - TLDL](https://www.tldl.io/resources/ai-coding-tools-2026)

🔗 [152] [Too many AI coding tools — What's actually worth it for a ...](https://www.reddit.com/r/GithubCopilot/comments/1p65p4u/too_many_ai_coding_tools_whats_actually_worth_it/)

🔗 [153] [I Built the Same App 5 Ways: Cursor vs Claude Code ...](https://dev.to/paulthedev/i-built-the-same-app-5-ways-cursor-vs-claude-code-vs-windsurf-vs-replit-agent-vs-github-copilot-50m2)

🔗 [154] [Claude Code, Cursor, Windsurf, Copilot & More!](https://www.youtube.com/watch?v=l2wCOnlOZWE)

🔗 [155] [Best AI Tools for Developers in 2026: What Are Your Must- ...](https://github.com/orgs/community/discussions/187143)

🔗 [156] [GitHub Copilot vs Cursor vs Claude Code 2026 Compared](https://tech-insider.org/github-copilot-vs-cursor-vs-claude-code-2026/)

🔗 [157] [An Honest Review of Claude Code, Cursor, Copilot, Windsurf ...](https://chenguangliang.com/en/posts/blog149_ai-coding-tools-2026-review/)

🔗 [158] [Best AI Coding Assistants 2026: Cursor, Copilot & More](https://www.vibecodingacademy.ai/blog/best-ai-coding-assistant-2026)

🔗 [159] [Claude Code vs Cursor vs Copilot vs Windsurf (2026)](https://unmarkdown.com/blog/claude-code-vs-cursor-vs-copilot-2026)

🔗 [160] [I ranked every AI coding tool in 2026 from worst to best ...](https://www.instagram.com/reel/DUoOJ4oDDI6/)

🔗 [161] [Cursor vs Claude Code vs GitHub Copilot vs Windsurf 2026](https://presenc.ai/compare/cursor-vs-claude-code-vs-copilot-vs-windsurf-2026)

🔗 [162] [I replaced GitHub Copilot with 3 tools. My team noticed within ...](https://levelup.gitconnected.com/i-replaced-github-copilot-with-3-tools-my-team-noticed-within-a-week-e33b6019ad94)

🔗 [163] [AI Coding Tools That Actually Help You Ship in 2026](https://www.memorybase.app/blog/ai-coding-tools)

🔗 [164] [Claude Code vs Cursor vs Copilot: The 2026 Developer ...](https://www.sitepoint.com/claude-code-vs-cursor-vs-copilot-the-2026-developer-comparison/)

🔗 [165] [Best AI Tools for Coding in 2026](https://pinggy.io/blog/best_ai_tools_for_coding/)

🔗 [166] [Best AI Code Editors 2026: Windsurf vs Cursor vs Copilot X ...](https://robotalp.com/blog/best-ai-code-editors-2026-windsurf-vs-cursor-vs-copilot-x-review/)

🔗 [167] [ai-for-developers/awesome-ai-coding-tools](https://github.com/ai-for-developers/awesome-ai-coding-tools)

🔗 [168] [Cursor vs Windsurf, Copilot vs Trae, whatever you want](https://www.reddit.com/r/vibecoding/comments/1splfuw/added_headtohead_tool_comparison_to_my_ai_coding/)

🔗 [208] [2025-2026 AI编程工具清单：20款国内外编程软件能力与选型图谱](https://www.pingwest.com/a/316968)

🔗 [209] [2026年8月(2个月前) AI编程工具推荐：国内外20款编程软件全盘点](https://timeline.sohu.com/news/PS1gAsEtyH)

🔗 [210] [腾讯、阿里、字节的两场仗：补Coding旧账，赌Work未来](https://m.36kr.com/p/3928008088467592)

🔗 [211] [2026国产AI编程工具决策指南：从Kimi Code、通义灵码](https://www.pingwest.com/a/317456)

🔗 [212] [通义灵码_你的智能编码助手-阿里云](https://lingma.aliyun.com/)

🔗 [213] [2026国产AI编程工具横评：五款主流工具深度对比](https://zhuanlan.zhihu.com/p/2025589657207881943)

🔗 [214] [Agent 元年下的国产对决：谁能在2026 的AI 编程赛道笑到最后](https://xie.infoq.cn/article/08a097f143ab4a7d28c9ec562)

🔗 [215] [2026国产AI编程工具决策指南：从Kimi Code、通义灵码](https://www.csdn.net/article/2026-09-15/165479362)

🔗 [216] [2026 年国产AI 编程工具推荐排行榜：5款主流产品深度对比](https://cloud.baidu.com/article/8412345)

🔗 [217] [阿里“AI编程第一”，智谱、Kimi答应吗？](https://www.jiemian.com/article/14788309.html)

🔗 [218] [2026年(今年)国内AI Coding客户端产品全景梳理](https://unifuncs.com/s/yE1duGvE)

🔗 [219] [2026 AI编程工具全景盘点，40款产品，七大形态谁在真干活](https://www.ithome.com/1/008/846.htm)

🔗 [220] [国内能用的AI 编程工具有哪些？2026 年按场景核验](https://diyitech.com/guides/2026-china-ai-coding-tools-comparison/)

🔗 [221] [2026最新国内15家AI大模型应用盘点：8款国产Coding Agent ...](https://www.einkcn.com/html/product_6aa9d3893f9d52464.html)

🔗 [222] [Kimi Code —— 搭载Kimi K3.1 Pro 的AI 编程Agent，复盖CLI](https://www.kimi.com/code)

🔗 [223] [AI编程工具爆发元年：谁才是真王者？](https://juejin.cn/post/7535277686311419942)

🔗 [224] [2026年(今年)国内主流AI Coding Plan套餐全对比｜开发者避坑指南](https://www.cnblogs.com/wzxNote/p/19648084)

🔗 [225] [The 2026 AI Index Report | Stanford HAI](https://hai.stanford.edu/ai-index/2026-ai-index-report)

🔗 [226] [Kimi Code 社区倡议](https://www.kimi.com/help/kimi-code/community-guidelines)

🔗 [227] [Kimi正式开源AI编程神器！Kimi Code深度实测：支持视频生成代码](https://www.bilibili.com/video/BV14RE26oEJa/)

🔗 [189] [Top 5 AI Tools for Visual Studio 2026](https://visualstudiomagazine.com/articles/2026/01/20/top-5-ai-tools-for-visual-studio-2026.aspx)

🔗 [190] [Best AI Coding Assistants 2026: 7 Tools Ranked + Priced](https://tech-insider.org/best-ai-coding-assistants-2026/)

🔗 [191] [What AI assistant is recommended for VS Code?](https://www.facebook.com/groups/698593531630485/posts/1498082501681580/)

🔗 [192] [Why I stopped Using Cursor and Reverted to VSCode](https://towardsdatascience.com/vscode-is-the-best-ai-powered-ide/)

🔗 [193] [Cursor vs Aider vs VSCode + Copilot: Which AI Coding ...](https://www.reddit.com/r/ChatGPTCoding/comments/1ilg9zl/cursor_vs_aider_vs_vscode_copilot_which_ai_coding/)

🔗 [194] [Build with AI in VS Code](https://code.visualstudio.com/docs/agents/overview)

🔗 [195] [Cursor vs GitHub Copilot: Which AI Coding Tool Should ...](https://www.truefoundry.com/blog/cursor-vs-github-copilot)

🔗 [196] [Continue (acquired by Cursor)](https://continue.dev/)

🔗 [197] [AI-Powered Integrated Development ... - Visual Studio IDE](https://visualstudio.microsoft.com/vs/)

🔗 [198] [continuedev/continue: open-source coding agent](https://github.com/continuedev/continue)

🔗 [199] [Top AI Coding Assistants 2026: IDE Plugins, Agents & Pricing](https://www.buildmvpfast.com/blog/best-ai-coding-assistants-2026)

🔗 [200] [AI Coding Tool Market Share Statistics 2026](https://presenc.ai/research/ai-coding-tool-market-share-statistics-2026)

🔗 [201] [Copilot vs Cursor vs Cline: The VS Code AI Comparison for ...](https://nexasphere.io/blog/best-vs-code-ai-extension-2026)

🔗 [202] [Best VS Code AI Extensions 2026](https://neuraplus-ai.github.io/blog/best-vs-code-ai-extensions-2026.html)

🔗 [203] [VS Code Tutorial For Beginners (Free Copilot AI 2026)](https://www.youtube.com/watch?v=QkmPe68UePg&vl=en-US)

🔗 [204] [AI coding services and their VSCode and Cursor integrations](https://www.andrew.cmu.edu/user/icaoberg/post/2026-05-16-ai-coding-services-and-their-vscode-and-cursor-integrations/)

🔗 [205] [Best AI Extensions for VS Code (2026) - Cursor alternatives](https://cursor-alternatives.com/blog/best-ai-extensions-for-vscode/)

🔗 [206] [AI-assistance for developers in Visual Studio](https://learn.microsoft.com/en-us/visualstudio/ide/ai-assisted-development-visual-studio?view=visualstudio)

🔗 [207] [The Only VS Code AI Extensions Worth Installing in 2026 ...](https://medium.com/@taher2world/the-only-vs-code-ai-extensions-worth-installing-in-2026-and-the-ones-quietly-slowing-you-down-c728ebceeb31)

🔗 [169] [Roo Code, Cline, Opencode, Codex, Qwen CLI, Claude ...](https://www.reddit.com/r/LocalLLaMA/comments/1o54lfc/roo_code_cline_opencode_codex_qwen_cli_claude/)

🔗 [170] [customStoragePath setting does not work - files always ...](https://github.com/RooCodeInc/Roo-Code/issues/3788)

🔗 [171] [Choosing Between 7 AI coding agents](https://www.youtube.com/watch?v=3wMfMQDsZKw)

🔗 [172] [Best Open-Source AI Coding Tools 2026 - Frontman](https://frontman.sh/blog/best-open-source-ai-coding-tools-2026/)

🔗 [173] [Open-Source AI Coding Agents 2026: The Complete ...](https://wetheflywheel.com/en/guides/open-source-ai-coding-agents-2026/)

🔗 [174] [AI in VSCode: Walkthrough of GitHub Copilot, Cline & Roo Code](https://www.youtube.com/watch?v=-k-HQV3wbi4&vl=en-US)

🔗 [175] [Config](https://opencode.ai/docs/config/)

🔗 [176] [Continue.dev agentic alternative: roo code](https://forums.developer.nvidia.com/t/continue-dev-agentic-alternative-roo-code/352290)

🔗 [177] [ai-data-extractor - AI Agents on GitHub](https://skillsllm.com/skill/ai-data-extractor)

🔗 [178] [Cline transcript schema - DoubleAgent](https://seanthegeek.net/doubleagent/analyzer/research/cline.html)

🔗 [179] [Best Local LLMs for OpenCode (2026 Tier List)](https://modelfit.io/tools/opencode/)

🔗 [180] [Cline + Ollama: A fully local AI coding agent](https://blog.logrocket.com/cline-ollama-local-ai-agent/)

🔗 [181] [OpenCode with Ollama Model Hosting | by Balazs Kocsis](https://medium.com/@balazskocsis/opencode-with-ollama-model-hosting-a3610f80549f)

🔗 [182] [OpenCode + Ollama Setup: Run the Top Coding Agent ...](https://localaimaster.com/blog/opencode-ollama-setup)

🔗 [183] [Local LLMs in Your IDE: Connecting Ollama to Coding ...](https://www.matterai.so/guides/connecting-local-llms-to-ides-and-coding-agents)

🔗 [184] [Setting Up A Free Claude-Like Assistant With OpenCode And ...](https://blog.codeminer42.com/setting-up-a-free-claude-like-assistant-with-opencode-and-ollama/)

🔗 [185] [Complete VS Code + Ollama + Continue Setup - AI](https://www.sitepoint.com/local-ai-coding-assistant-complete-vs-code-ollama-continue-setup/)

🔗 [186] [OpenCode Local LLM Setup: Ollama, LM Studio, llama.cpp](https://vdf.ai/blog/opencode-local-llm-setup/)

🔗 [187] [Create a Local Coding Environment with Ollama and OpenCode](https://smallsharpsoftwaretools.com/tutorials/opencode-and-ollama/)

🔗 [188] [OpenCode: AI-Assisted Coding with Free and Local LLMs](https://www.infralovers.com/blog/2026-02-27-opencode-free-local-llms/)

🔗 [111] [Devin vs Amazon Q Developer vs Tabnine: $26B, Sunset [2026]](https://tech-insider.org/devin-vs-amazon-q-developer-vs-tabnine-2026/)

🔗 [112] [Amazon Q Developer vs Tabnine: Choosing the Right AI ...](https://www.augmentcode.com/tools/amazon-q-developer-vs-tabnine)

🔗 [113] [Tabnine vs. Amazon Q Developer](https://www.tabnine.com/blog/tabnine-vs-amazon-q-developer/)

🔗 [114] [Coding Assistant - Amazon Q Developer](https://aws.amazon.com/q/developer/)

🔗 [115] [Amazon Q Developer vs Codeium vs Tabnine](https://www.gappsy.com/compare/amazon-q-developer-vs-codeium-vs-tabnine/)

🔗 [116] [AI Code Generation Tabnine vs Amazon Q Developer](https://www.infotech.com/software-reviews/categories/ai-code-generation/compare/tabnine-vs-amazon-q-developer)

🔗 [117] [AWS-Announces-General-Availability-of-Amazon-Q-the-Most ...](https://press.aboutamazon.com/2024/4/aws-announces-general-availability-of-amazon-q-the-most-capable-generative-ai-powered-assistant-for-accelerating-software-development-and-leveraging-companies-internal-data)

🔗 [118] [Amazon Q Developer: The AWS Tool Revolutionizing ...](https://hatchworks.com/blog/gen-ai/amazon-q-developer/)

🔗 [119] [AI-Powered Developer: Code 10x Faster with Amazon Q](https://www.youtube.com/watch?v=9gMc6ohw53Y)

🔗 [120] [Amazon Q Developer vs Tabnine (2026): Comparison](https://www.aicentralresources.com/compare/amazon-q-developer-vs-tabnine)

🔗 [121] [Copilot, Tabnine, Amazon Q, Augment Code, Cody, Blackbox ...](https://vibecompare.dev/guides/enterprise-ai-coding-tools/)

🔗 [122] [Amazon Q Developer Tips: No.11 Scaffolding](https://dev.to/aws/amazon-q-developer-tips-no11-scaffolding-5c6m)

🔗 [123] [Supercharge your coding productivity with Amazon Q Dev](https://medium.com/@jiaweilin02/supercharge-your-coding-productivity-with-amazon-q-dev-40f83079f1e9)

🔗 [124] [Amazon Q Developer IDE plugins reach end of support ...](https://www.linkedin.com/posts/ricardotasso_amazon-q-developer-end-of-support-announcement-activity-7455792456404701184-Syxb)

🔗 [125] [Amazon Q Developer Agents Simplify Coding](https://cloudelligent.com/blog/amazon-q-developer-agents/)

🔗 [126] [What Is Amazon Q Developer? Key Features & Pricing](https://mstone.ai/tools-wizard/amazon-q-developer/)

🔗 [127] [Amazon Q Developer vs Devin (2026)](https://www.respan.ai/market-map/compare/amazon-q-developer-vs-devin)

🔗 [128] [Tabnine vs Amazon Q Developer (2026) - RFP.wiki](https://www.rfp.wiki/artificial-intelligence/ai-code-assistants/tabnine/amazon-q-developer)

🔗 [129] [Building Agentic AI Applications Using Amazon Q Developer](https://builder.aws.com/content/2ynFu2X4rALsbjLUSU1az6wHVSi/building-agentic-ai-applications-using-amazon-q-developer)

🔗 [130] [Amazon Q Developer vs Tabnine (2026): Which is Better?](https://theaiagentindex.com/compare/amazon-q-developer-vs-tabnine)

🔗 [131] [Does Claude Code have any way to access previous ...](https://www.reddit.com/r/ClaudeCode/comments/1rvagol/does_claude_code_have_any_way_to_access_previous/)

🔗 [132] [Retrieve session transcripts - Claude Platform Docs](https://platform.claude.com/docs/en/manage-claude/compliance-sessions)

🔗 [133] [Fuzzy-search Claude Code conversation history](https://github.com/raine/claude-history)

🔗 [134] [Logging AI conversations (Claude Code)](https://forums.adug.org.au/t/logging-ai-conversations-claude-code/61087)

🔗 [135] [Unlocking Your Claude History, Part 1](https://medium.com/@raymondpeck/unlocking-your-claude-history-part-1-f19000c05655)

🔗 [136] [Show HN: Claude Code History Viewer for macOS](https://news.ycombinator.com/item?id=44459376)

🔗 [137] [Where Six AI Coding CLIs Store Your Session Logs](https://allaboutcoding.ghinda.com/where-ai-coding-clis-store-session-logs/)

🔗 [138] [Where are Claude Code logs stored?](https://claude-dev.tools/docs/log-locations)

🔗 [139] [Claude Code Session Manager: Wake for Mac | Zentor Blog](https://zentor.ai/blog/claude-code-session-manager)

🔗 [140] [Claude Code users complain their chat records are being ...](https://forums.theregister.com/forum/all/2026/06/30/202620/)

🔗 [141] [I learned that Claude Code conversation logs disappear ...](https://note.com/hacklog_stealth/n/n155b9efe80b0?hl=en)

🔗 [142] [Where Does Claude Code Store Conversation History?](https://www.llmnesia.com/blog/where-does-claude-code-store-history)

🔗 [143] [Where AI coding agents store your session history](https://jazzyalex.github.io/agent-sessions/blog/where-agents-store-history/)

🔗 [144] [How long do you store my data? - Anthropic Privacy Center](https://privacy.claude.com/en/articles/10023548-how-long-do-you-store-my-data)

🔗 [145] [I Built a Tool to Stop Losing My Claude Code Conversation ...](https://dev.to/kuroko1t/i-built-a-tool-to-stop-losing-my-claude-code-conversation-history-5500)

🔗 [146] [How to Export Claude Code CLI Chat History (Working 2026 ...](https://www.youtube.com/watch?v=zPglT53TaQ0)

🔗 [147] [Where Claude Code stores your session history, and how ...](https://claudoscope.com/blog/where-claude-code-stores-session-history)

🔗 [148] [Data usage - Claude Code Docs](https://code.claude.com/docs/en/data-usage)

🔗 [149] [Claude Code, Codex & Cursor Chat History Sync](https://blog.memoryplugin.com/meet-memoryplugin-sync/)

🔗 [150] [Claude Code hogging Mac storage space](https://www.linkedin.com/posts/rogerboesch_claude-macos-softwareengineering-activity-7507828441120034818-la2L)





📝 **开始撰写搜索报告**

# AI Coding 工具2026年市场分级与本地数据分类简报

**报告时间锚定**：2026年10月29日（GMT+08:00）  
**数据来源时效**：2025年7月—2026年10月

---

## 📊 核心发现摘要

本简报基于 **Stack Overflow 2026 开发者调查**（超30000名受访者，2026年10月6日发布）[[106]](https://stackoverflow.blog/2026/10/06/the-results-of-the-2026-developer-survey-are-here/) 和 **JetBrains Developer Ecosystem Survey 2026**（超15000名专业开发者，2026年8月发布）[[107]](https://blog.jetbrains.com/research/2026/08/ai-coding-agent-adoption-2026/) 等权威来源，对35款AI Coding工具进行市场使用程度分级与本地数据特征分类。

**关键发现**：
- Claude Code 在2026年下半场跃居市场第一，采用率达 **39%**（JetBrains 2026年8月数据）[[107]](https://blog.jetbrains.com/research/2026/08/ai-coding-agent-adoption-2026/)，是 GitHub Copilot（21%）的约两倍[[108]](https://blog.jetbrains.com/research/2026/04/which-ai-coding-tools-do-developers-actually-use-at-work/)
- GitHub Copilot 失去领导地位，采用率从一年前的29%降至21%[[107]](https://blog.jetbrains.com/research/2026/08/ai-coding-agent-adoption-2026/)
- Cursor 采用率从18%降至12%，中国地区降幅最大（28%→16%）[[107]](https://blog.jetbrains.com/research/2026/08/ai-coding-agent-adoption-2026/)
- OpenAI Codex 增长迅猛，采用率从3%升至16%，增幅约5倍[[107]](https://blog.jetbrains.com/research/2026/08/ai-coding-agent-adoption-2026/)

---

## 🏆 市场使用程度分级（S/A/B/C 四级）

> **分级依据**：以 JetBrains 2026年8月专业开发者工作场景采用率为主要依据[[107]](https://blog.jetbrains.com/research/2026/08/ai-coding-agent-adoption-2026/)，Stack Overflow 2026年调查（编码代理使用率66%）[[106]](https://stackoverflow.blog/2026/10/06/the-results-of-the-2026-developer-survey-are-here/) 为交叉验证，辅以 GitHub stars、VS Code/JetBrains 插件安装量及行业报告。**分级标准**：
> - **S级（领导者）**：市场采用率≥25%，具有显著领先地位
> - **A级（重要参与者）**：市场采用率10%-25%，具备较强竞争力
> - **B级（小众工具）**：市场采用率1%-10%，有一定用户基础
> - **C级（其他/数据不足）**：采用率<1%或无权威数据

---

### 🔴 S级——市场领导者

| 工具 | 分级理由 | 关键数据 | 来源 |
|------|----------|----------|------|
| **Claude Code** | 2026年跃居第一，JetBrains调查中39%的专业开发者工作中使用，31%将其作为主要AI编码工具，转化率近80% | 全球39%，美国达47%；Stack Overflow 2026：66%的AI编码用户选用[[106]](https://stackoverflow.blog/2026/10/06/the-results-of-the-2026-developer-survey-are-here/) | [[107]](https://blog.jetbrains.com/research/2026/08/ai-coding-agent-adoption-2026/)[[106]](https://stackoverflow.blog/2026/10/06/the-results-of-the-2026-developer-survey-are-here/) |
| **GitHub Copilot** | 虽失去领导地位，但仍是第二大工具，79%认知度，企业部署深度高（5000人以上企业adoption达40%） | 21%（JetBrains 2026年8月）；470万付费用户；2000万+总用户 | [[107]](https://blog.jetbrains.com/research/2026/08/ai-coding-agent-adoption-2026/)[[108]](https://blog.jetbrains.com/research/2026/04/which-ai-coding-tools-do-developers-actually-use-at-work/) |

---

### 🟠 A级——重要参与者

| 工具 | 分级理由 | 关键数据 | 来源 |
|------|----------|----------|------|
| **OpenAI Codex** | 2026年增长最迅猛，增幅约5倍，知名度从27%升至65% | 16%（JetBrains 2026年8月） | [[107]](https://blog.jetbrains.com/research/2026/08/ai-coding-agent-adoption-2026/) |
| **Cursor** | 采用率下降但认知度高（75%），$2B ARR估值，企业用户基础深厚 | 12%（JetBrains 2026年8月），从18%下降 | [[107]](https://blog.jetbrains.com/research/2026/08/ai-coding-agent-adoption-2026/) |
| **Windsurf** | Codeium旗下独立产品，在部分评测中排名靠前，免费层级策略获客 | 无精确公开数据，行业报告列为第三梯队 | [[107]](https://blog.jetbrains.com/research/2026/08/ai-coding-agent-adoption-2026/)[[161]](https://presenc.ai/compare/cursor-vs-claude-code-vs-copilot-vs-windsurf-2026) |

---

### 🟡 B级——小众工具

| 工具 | 分级理由 | 关键数据 | 来源 |
|------|----------|----------|------|
| **OpenCode** | 开源编码代理，无大公司背书但认知度达42%，采用率7% | 7%（JetBrains 2026年8月）；GitHub stars 约？（需进一步验证） | [[107]](https://blog.jetbrains.com/research/2026/08/ai-coding-agent-adoption-2026/)[[182]](https://localaimaster.com/blog/opencode-ollama-setup) |
| **JetBrains AI/Junie** | JetBrains生态内工具，9%全球开发者使用 | 9%（JetBrains 2026年1月） | [[108]](https://blog.jetbrains.com/research/2026/04/which-ai-coding-tools-do-developers-actually-use-at-work/) |
| **Aider** | 开源终端工具，GitHub 4.4万+ stars，VS Code生态活跃 | 采用率约5%（推算） | [[163]](https://www.memorybase.app/blog/ai-coding-tools)[[173]](https://wetheflywheel.com/en/guides/open-source-ai-coding-agents-2026/) |
| **Cline** | 开源，VS Code插件安装量超500万（2026年数据） | VS Code插件安装量超500万 | [[201]](https://nexasphere.io/blog/best-vs-code-ai-extension-2026) |
| **Roo Code** | Cline分支，功能更丰富 | 无精确公开数据 | [[173]](https://wetheflywheel.com/en/guides/open-source-ai-coding-agents-2026/)[[176]](https://forums.developer.nvidia.com/t/continue-dev-agentic-alternative-roo-code/352290) |
| **Amazon Q Developer** | AWS生态绑定，特定场景采用率高 | 6%（推算）；IDE插件将于2027年4月30日停止支持 | [[124]](https://www.linkedin.com/posts/ricardotasso_amazon-q-developer-end-of-support-announcement-activity-7455792456404701184-Syxb)[[107]](https://blog.jetbrains.com/research/2026/08/ai-coding-agent-adoption-2026/) |
| **Tabnine** | 零数据保留策略，受监管行业青睐 | 无精确采用率数据 | [[111]](https://tech-insider.org/devin-vs-amazon-q-developer-vs-tabnine-2026/)[[112]](https://www.augmentcode.com/tools/amazon-q-developer-vs-tabnine) |
| **Augment Code** | 企业团队定位，上下文引擎特色 | 无公开精确数据 | [[77]](https://www.augmentcode.com/tools/8-top-ai-coding-assistants-and-their-best-use-cases) |
| **Gemini CLI** | Google生态，知名度提升中 | 8%（聊天机器人工作使用率） | [[108]](https://blog.jetbrains.com/research/2026/04/which-ai-coding-tools-do-developers-actually-use-at-work/) |
| **Kimi Code/Kimi App** | 中国市场重要玩家，K3底座 | 中国市场份额未披露精确数据 | [[211]](https://www.pingwest.com/a/317456)[[222]](https://www.kimi.com/code) |
| **Trae** | 字节跳动旗下，中国及新兴市场 | 中国市场份额未披露精确数据 | [[211]](https://www.pingwest.com/a/317456)[[213]](https://zhuanlan.zhihu.com/p/2025589657207881943) |
| **通义灵码/Qoder** | 中国市场份额第一，47.6%（IDC 2025） | 中国市场份额47.6%，全球数据不足 | [[217]](https://www.jiemian.com/article/14788309.html)[[211]](https://www.pingwest.com/a/317456) |
| **文心Comate** | 百度旗下，800万+开发者，2000+企业客户 | 中国市场份额未知，全球数据不足 | [[214]](https://xie.infoq.cn/article/08a097f143ab4a7d28c9ec562)[[216]](https://cloud.baidu.com/article/8412345) |
| **CodeBuddy** | 腾讯云旗下，中国市场份额第五 | 中国市场份额未披露精确数据 | [[211]](https://www.pingwest.com/a/317456)[[213]](https://zhuanlan.zhihu.com/p/2025589657207881943) |
| **CodeGeeX** | 智谱AI旗下，中国市场份额第四 | 中国市场份额未披露精确数据 | [[211]](https://www.pingwest.com/a/317456)[[213]](https://zhuanlan.zhihu.com/p/2025589657207881943) |
| **华为CodeArts** | 华为云旗下 | 中国市场份额未披露精确数据 | [[211]](https://www.pingwest.com/a/317456) |

---

### 🔵 C级——其他/数据不足

| 工具 | 分级理由 |
|------|----------|
| **WorkBuddy** | 无公开市场数据 |
| **讯飞iFlyCode** | 无公开市场数据 |
| **DeepSeek App** | 主要为通用对话，非专用Coding Agent |
| **Continue** | 已被Cursor收购，独立发展存疑 |
| **OpenClaw** | 无公开数据 |
| **OpenHands** | 无公开采用率数据 |
| **Devin** | Cognition旗下，定位"自主软件工程师"而非编码助手，采用率未公开 |
| **Zed AI** | Zed编辑器内置，采用率未知 |
| **Replit Agent** | Replit生态内，无精确市场数据 |
| **Sourcegraph Cody/Amp** | Sourcegraph生态，无精确采用率数据 |
| **Factory** | 无公开数据 |
| **Warp Agent** | Warp终端内置，采用率未知 |
| **Goose** | 开源终端工具，无精确采用率数据 |
| **Google Antigravity** | 6%（JetBrains 2026年8月）；2025年11月推出，知名度从29%升至47% |
| **Google Jules** | 无公开数据 |

---

## 💻 本地数据模式分类

> 以下分类基于各工具在 **macOS** 系统上的本地存储特征[[110]](https://tuo-lei.com/notes/claude-code-vs-cursor-local-storage/)[[105]](https://www.myinventory.site/where-ai-tools-store-chat-history)

### 分类体系

| 分类标签 | 定义 | 典型工具 |
|----------|------|----------|
| **JSONL 追加** | 每个会话以单个JSONL文件追加写入，纯文本可读 | Claude Code、OpenCode、Aider、Roo Code、Cline |
| **SQLite/WAL** | 使用SQLite数据库存储，可能含WAL日志 | Cursor（chats/*/store.db） |
| **项目级 Markdown/日志** | 在项目目录生成Markdown文件或日志 | Continue（CONTINUE.md） |
| **VS Code globalStorage 任务文件** | 利用VS Code扩展全局存储机制 | Cline（MCP设置）、Roo Code |
| **纯文本诊断日志** | 仅记录诊断信息，不含会话内容 | 部分CLI工具 |
| **仅配置/云端主导** | 本地仅存配置，核心数据在云端 | Amazon Q Developer、Tabnine、Google Antigravity、Gemini CLI |
| **专有混合或未知格式** | 采用非公开格式或混合存储 | Cursor（transcript与数据库混合）、Devin、Warp Agent |

### 各工具本地数据模式详表

| 工具 | 本地数据模式 | 存储路径/特征 |
|------|--------------|--------------|
| **Claude Code** | JSONL 追加 | `~/.claude/projects/<项目哈希>/<会话ID>.jsonl`；历史：`~/.claude/history.jsonl` |
| **Cursor** | SQLite/WAL + 专有混合 | `~/.cursor/chats/*/*/store.db`（SQLite）；`~/.cursor/projects/*/agent-transcripts/*.jsonl`；`~/Library/Application Support/Cursor/User/globalStorage/state.vscdb`（SQLite）；总计约7GB |
| **OpenCode** | JSONL 追加 | 开源终端工具，配置JSON格式 |
| **Aider** | JSONL 追加 | 开源，Git仓库感知 |
| **Cline** | VS Code globalStorage + JSONL | MCP配置存`globalStorage`，transcript存JSONL |
| **Roo Code** | VS Code globalStorage + JSONL | Cline分支，存储机制类似 |
| **Continue** | 项目级 Markdown/日志 | `CONTINUE.md`文件，已被Cursor收购 |
| **Amazon Q Developer** | 仅配置/云端主导 | 核心数据云端，本地仅插件配置 |
| **Tabnine** | 仅配置/云端主导 | 零数据保留策略，本地仅配置 |
| **Google Antigravity** | 仅配置/云端主导 | Google云端 |
| **Gemini CLI** | 仅配置/云端主导 | Google云端 |
| **Devin** | 专有混合或未知格式 | 云端服务为主，本地状态未知 |
| **Windsurf** | 专有混合或未知格式 | Codeium生态，存储机制未公开披露 |
| **Kimi Code** | 专有混合或未知格式 | 中国市场，本地存储机制未公开详细披露 |
| **通义灵码/Qoder** | 专有混合或未知格式 | 中国市场，本地存储机制未公开详细披露 |
| **文心Comate** | 专有混合或未知格式 | 中国市场，本地存储机制未公开详细披露 |
| **CodeBuddy** | 专有混合或未知格式 | 中国市场，本地存储机制未公开详细披露 |
| **Trae** | 专有混合或未知格式 | 中国市场，本地存储机制未公开详细披露 |
| **WorkBuddy** | 专有混合或未知格式 | 无公开存储文档 |
| **CodeGeeX** | 专有混合或未知格式 | 中国市场，本地存储机制未公开详细披露 |
| **iFlyCode** | 专有混合或未知格式 | 无公开存储文档 |
| **华为CodeArts** | 专有混合或未知格式 | 无公开存储文档 |
| **DeepSeek App** | 专有混合或未知格式 | 非专用Coding Agent |
| **OpenClaw** | 专有混合或未知格式 | 无公开数据 |
| **OpenHands** | 专有混合或未知格式 | 无公开存储文档 |
| **JetBrains AI/Junie** | 专有混合或未知格式 | JetBrains IDE集成，存储机制未公开详细披露 |
| **Zed AI** | 专有混合或未知格式 | Zed编辑器内置 |
| **Replit Agent** | 专有混合或未知格式 | Replit云端生态 |
| **Sourcegraph Cody/Amp** | 专有混合或未知格式 | Sourcegraph生态 |
| **Augment Code** | 专有混合或未知格式 | 企业定位，存储机制未公开披露 |
| **Factory** | 专有混合或未知格式 | 无公开数据 |
| **Warp Agent** | 专有混合或未知格式 | Warp终端内置 |
| **Goose** | 专有混合或未知格式 | 开源终端工具，存储文档不足 |

---

## 📜 状态信息完整度区分

> **分类定义**：
> - **完整事件时间线**：含时间戳、事件类型、因果关系，可重建完整操作序列
> - **完整 transcript 但无明确最终结果**：记录所有对话但未结构化标记"成功/失败/完成"状态
> - **只能启发式日志**：通过间接特征推断状态，非直接记录
> - **无本地状态**：本地不存储任何操作状态信息

### 各工具状态信息完整度详表

| 工具 | 状态完整度 | 关键特征 |
|------|------------|----------|
| **Claude Code** | ✅ **完整事件时间线** | 每个会话单个JSONL文件，含时间戳、工具调用、子代理会话、截图、缓存指标；自动压缩记录；默认30天清理 |
| **Cursor** | ⚠️ **只能启发式日志** | transcript分布多层存储（SQLite+JSONL），无统一会话ID；服务器端压缩，本地未暴露；无自动清理；上下文管理不透明 |
| **OpenCode** | ⚠️ **只能启发式日志** | 开源终端工具，日志机制未完全文档化 |
| **Aider** | ✅ **完整 transcript 但无明确最终结果** | 记录完整对话，但未结构化标记任务完成状态 |
| **Cline** | ⚠️ **只能启发式日志** | VS Code globalStorage存配置，transcript存JSONL，但schema不统一 |
| **Roo Code** | ⚠️ **只能启发式日志** | Cline分支，存储机制类似 |
| **Continue** | ⚠️ **只能启发式日志** | 被Cursor收购后独立文档减少 |
| **Amazon Q Developer** | ❌ **无本地状态** | 云端主导，本地仅插件配置 |
| **Tabnine** | ❌ **无本地状态** | 零数据保留，本地仅配置 |
| **Google Antigravity** | ❌ **无本地状态** | 云端主导 |
| **Gemini CLI** | ❌ **无本地状态** | 云端主导 |
| **Devin** | ❌ **无本地状态** | 云端服务，本地状态未知 |
| **Windsurf** | ⚠️ **只能启发式日志** | 存储机制未公开详细披露 |
| **Kimi Code** | ⚠️ **只能启发式日志** | 中国市场，本地存储文档不足 |
| **通义灵码/Qoder** | ⚠️ **只能启发式日志** | 中国市场，本地存储文档不足 |
| **文心Comate** | ⚠️ **只能启发式日志** | 中国市场，本地存储文档不足 |
| **CodeBuddy** | ⚠️ **只能启发式日志** | 中国市场，本地存储文档不足 |
| **Trae** | ⚠️ **只能启发式日志** | 中国市场，本地存储文档不足 |
| **WorkBuddy** | ❌ **无本地状态** | 无公开文档 |
| **CodeGeeX** | ⚠️ **只能启发式日志** | 中国市场，本地存储文档不足 |
| **iFlyCode** | ❌ **无本地状态** | 无公开文档 |
| **华为CodeArts** | ❌ **无本地状态** | 无公开文档 |
| **DeepSeek App** | ❌ **无本地状态** | 非专用Coding Agent |
| **OpenClaw** | ❌ **无本地状态** | 无公开数据 |
| **OpenHands** | ⚠️ **只能启发式日志** | 开源项目，存储文档不足 |
| **JetBrains AI/Junie** | ⚠️ **只能启发式日志** | JetBrains IDE集成，存储机制未公开详细披露 |
| **Zed AI** | ⚠️ **只能启发式日志** | Zed编辑器内置，存储文档不足 |
| **Replit Agent** | ❌ **无本地状态** | Replit云端生态 |
| **Sourcegraph Cody/Amp** | ⚠️ **只能启发式日志** | Sourcegraph生态，存储文档不足 |
| **Augment Code** | ⚠️ **只能启发式日志** | 企业定位，存储机制未公开披露 |
| **Factory** | ❌ **无本地状态** | 无公开数据 |
| **Warp Agent** | ❌ **无本地状态** | Warp终端内置，云端为主 |
| **Goose** | ⚠️ **只能启发式日志** | 开源终端工具，存储文档不足 |
| **Google Jules** | ❌ **无本地状态** | 无公开数据 |

---

## 📋 macOS 只读适配器排序与分类汇总表

以下表格专为 **macOS 只读适配器** 设计，按 **市场分级 → 本地数据可访问性** 排序，优先呈现具有完整本地状态记录的工具：

| 排序 | 工具 | 市场分级 | 本地数据模式 | 状态完整度 | macOS本地存储路径摘要 |
|------|------|----------|--------------|------------|----------------------|
| 1 | **Claude Code** | S | JSONL 追加 | ✅ 完整事件时间线 | `~/.claude/projects/*.jsonl` |
| 2 | **GitHub Copilot** | S | 专有混合 | ⚠️ 启发式日志 | `~/.config/github-copilot/` |
| 3 | **OpenAI Codex** | A | 专有混合 | ⚠️ 启发式日志 | `~/.codex/` |
| 4 | **Cursor** | A | SQLite/WAL | ⚠️ 启发式日志 | `~/.cursor/` + `~/Library/Application Support/Cursor/` |
| 5 | **Windsurf** | A | 专有混合 | ⚠️ 启发式日志 | `~/.codeium/windsurf/` |
| 6 | **OpenCode** | B | JSONL 追加 | ⚠️ 启发式日志 | `~/.config/opencode/` |
| 7 | **Aider** | B | JSONL 追加 | ✅ 完整transcript | `.aider.chat.history.md`（项目级） |
| 8 | **Cline** | B | VS Code globalStorage + JSONL | ⚠️ 启发式日志 | `~/.vscode/extensions/` |
| 9 | **Roo Code** | B | VS Code globalStorage + JSONL | ⚠️ 启发式日志 | `~/.vscode/extensions/` |
| 10 | **Continue** | B | 项目级 Markdown | ⚠️ 启发式日志 | `CONTINUE.md`（项目级） |
| 11 | **JetBrains AI** | B | 专有混合 | ⚠️ 启发式日志 | JetBrains配置目录 |
| 12 | **Amazon Q Developer** | B | 仅配置/云端 | ❌ 无本地状态 | `~/.aws/amazonq/` |
| 13 | **Tabnine** | B | 仅配置/云端 | ❌ 无本地状态 | `~/.tabnine/` |
| 14 | **Gemini CLI** | B | 仅配置/云端 | ❌ 无本地状态 | `~/.config/gemini/` |
| 15 | **Google Antigravity** | B | 仅配置/云端 | ❌ 无本地状态 | `~/.config/antigravity/` |

---

## ⚖️ 信息置信度评估与多源验证

### 高置信度信息 ✅
- **Claude Code 采用率39%（S级）**：JetBrains 2026年8月调查（超15000名专业开发者）[[107]](https://blog.jetbrains.com/research/2026/08/ai-coding-agent-adoption-2026/) 与 Stack Overflow 2026年调查（66%AI编码用户选用）[[106]](https://stackoverflow.blog/2026/10/06/the-results-of-the-2026-developer-survey-are-here/) 双重验证
- **GitHub Copilot 采用率21%**：JetBrains 2026年8月调查[[107]](https://blog.jetbrains.com/research/2026/08/ai-coding-agent-adoption-2026/)
- **Claude Code本地存储为JSONL格式**：多个独立来源验证[[110]](https://tuo-lei.com/notes/claude-code-vs-cursor-local-storage/)[[134]](https://forums.adug.org.au/t/logging-ai-conversations-claude-code/61087)[[135]](https://medium.com/@raymondpeck/unlocking-your-claude-history-part-1-f19000c05655)[[147]](https://claudoscope.com/blog/where-claude-code-stores-session-history)

### 中置信度信息 ⚠️
- **中国市场工具分级**：IDC报告[[217]](https://www.jiemian.com/article/14788309.html) 与多个行业媒体[[211]](https://www.pingwest.com/a/317456)[[213]](https://zhuanlan.zhihu.com/p/2025589657207881943) 交叉，但缺乏全球采用率数据
- **OpenCode采用率7%**：单一JetBrains来源[[107]](https://blog.jetbrains.com/research/2026/08/ai-coding-agent-adoption-2026/)，需更多验证

### 低置信度/数据不足 ❓
- **WorkBuddy、讯飞iFlyCode、华为CodeArts、OpenClaw、Factory、Google Jules**：无公开市场数据
- **本地数据模式**：中国市场工具（Kimi Code、通义灵码等）存储机制未公开详细披露

---

## 🔍 关键争议与信息缺口

| 争议/缺口 | 说明 | 建议补充方向 |
|-----------|------|--------------|
| **"整个产品用户量" vs "Coding Agent用户量"** | 多数公开数据为Coding Agent工作场景采用率，非总用户量；Kimi App等包含非编码功能 | 需进一步检索各工具官方披露的总用户量 vs Coding Agent专项用户量 |
| **中国市场工具全球定位** | 通义灵码/文心Comate等在IDC中国市场份额领先[[217]](https://www.jiemian.com/article/14788309.html)，但全球采用率数据不足 | 检索英文源全球调查数据 |
| **Dev-in定位模糊** | Cognition宣传"自主软件工程师"而非编码助手，分类边界需澄清 | 检索2026年Dev-in使用场景专项调查 |
| **本地存储数据时效性** | Cursor、Windsurf等存储机制可能随版本更新而变化 | 检索2026年最新版本存储文档 |

---

## 📌 分级方法说明

| 指标 | 数据来源 | 权重 |
|------|----------|------|
| JetBrains工作场景采用率 | JetBrains Developer Ecosystem Survey 2026（2026年8月）[[107]](https://blog.jetbrains.com/research/2026/08/ai-coding-agent-adoption-2026/) | 最高 |
| Stack Overflow AI编码工具选用 | Stack Overflow 2026 Developer Survey（2026年10月）[[106]](https://stackoverflow.blog/2026/10/06/the-results-of-the-2026-developer-survey-are-here/) | 高 |
| 认知度 | JetBrains调查[[107]](https://blog.jetbrains.com/research/2026/08/ai-coding-agent-adoption-2026/)[[108]](https://blog.jetbrains.com/research/2026/04/which-ai-coding-tools-do-developers-actually-use-at-work/) | 中 |
| GitHub stars | GitHub公开数据 | 参考 |
| VS Code/JetBrains插件安装量 | 各平台市场公开数据 | 参考 |
| 行业报告 | IDC、Gartner等 | 参考 |

**关键免责**：本分级基于公开可获取的开发者调查数据，**不编造精确用户量**。中国工具全球定位因数据不足采用中置信度标注，建议决策时结合区域市场专项数据。

---

**报告生成时间**：2026年10月29日 01:44（GMT+08:00）  
**引用索引**：[[1]](https://www.simplilearn.com/best-programming-languages-start-learning-today-article)[[2]](https://sqmagazine.co.uk/ai-coding-statistics/)[[3]](https://venturebeat.com/data/the-share-of-developers-using-ai-to-write-half-or-more-code-jumped-from-12-to-42-yoy-in-latest-bairesdev-survey)[[4]](https://www.netguru.com/blog/best-programming-language-for-software-development)[[5]](https://tech-insider.org/ie/github-copilot-market-share-2026/)[[6]](https://www.hostinger.com/blog/vibe-coding-statistics/)[[7]](https://adtmag.com/blogs/watersworks/2026/01/stack-overflow-survey.aspx)[[8]](https://www.techzine.eu/news/devops/137686/stack-overflow-in-freefall-78-percent-drop-in-number-of-questions/)[[9]](https://www.theverge.com/podcast/844073/stack-overflow-ceo-ai-coding-chatgpt-code-red-interview)[[10]](https://sqmagazine.co.uk/best-ai-coding-tools/)[[11]](https://survey.stackoverflow.co/2025/)[[12]](https://survey.stackoverflow.co/2025/ai)[[13]](https://stackoverflow.co/company/press/archive/stack-overflow-2025-developer-survey/)[[14]](https://stackoverflow.blog/2026/02/18/closing-the-developer-ai-trust-gap/)[[15]](https://www.reddit.com/r/programming/comments/1mdyy9x/stack_overflow_survey_2025_84_of_devs_use_ai_but/)[[16]](https://survey.stackoverflow.co/)[[17]](https://www.youtube.com/watch?v=jUNxRTh4hlk)[[18]](https://stackoverflow.co/company/press/archive/stack-overflow-annual-developer-survey-ai-trust-conditional)[[19]](https://dev.to/davidshq/thoughts-on-stackoverflow-2025-developer-survey-part-1-3d5o)[[20]](https://www.facebook.com/cnn/posts/six-in-10-tech-workers-who-participated-in-a-new-survey-say-they-try-to-avoid-us/1490255409633772/)[[21]](https://composio.dev/toolkits/cursor/framework/kimi)[[22]](https://tuo-lei.com/notes/claude-code-vs-cursor-local-storage/)[[23]](https://github.com/stefandevo/claude-dialects)[[24]](https://milvus.io/blog/why-claude-code-feels-so-stable-a-developers-deep-dive-into-its-local-storage-design.md)[[25]](https://www.memorylake.ai/en/blogs/share-one-memory-between-cursor-and-claude-code)[[26]](https://www.taskade.com/blog/claude-code-history)[[27]](https://www.reddit.com/r/LocalLLaMA/comments/1r5q7xd/how_are_you_handling_persistent_memory_for_ai/)[[28]](https://medium.com/open-intelligence/what-if-every-ai-coding-session-made-the-next-one-smarter-5a72728657dd)[[29]](https://projectmem.dev/blog/coding-agent-memory-for-kimi/)[[30]](https://www.youtube.com/watch?v=dkEUpfHYJ_k)[[31]](https://news.ycombinator.com/item?id=44596472)[[32]](https://dev.to/gonewx/where-is-claude-code-session-history-how-to-find-your-ai-coding-conversations-555o)[[33]](https://nyosegawa.com/en/posts/coding-agent-terms-investigation/)[[34]](https://docs.claude-mem.ai/kimi-integration)[[35]](https://www.kimi.ai/blog/kimi-k3)[[36]](https://agiflow.io/blog)[[37]](https://icodeeasy.cc/en/docs/)[[38]](https://brtkwr.com/posts/2026-04-01-what-we-can-all-learn-from-the-claude-code-source/)[[39]](https://www.youtube.com/watch?v=ue1s3eHmF54)[[40]](https://www.testmuai.com/blog/claude-code-vs-cursor/)[[41]](https://medium.com/@krithikanithyanandam/vs-code-extension-storage-explained-the-what-where-and-how-3a0846a632ea)[[42]](https://marketplace.visualstudio.com/items?itemName=Veverke.chatwizard)[[43]](https://code.visualstudio.com/api/extension-capabilities/common-capabilities)[[44]](https://www.myinventory.site/where-ai-tools-store-chat-history)[[45]](https://stackoverflow.com/questions/58900482/what-are-all-configuration-files-used-by-visual-studio-code-and-where-does-it-s)[[46]](https://github.com/shanalikhan/code-settings-sync/issues/1137)[[47]](https://arxiv.org/html/2412.00707v2)[[48]](https://visualstudiomagazine.com/articles/2026/08/04/top-5-local-ai-tools-for-vs-code-all-powered-by-ollama.aspx)[[49]](https://www.reddit.com/r/vscode/comments/1kdvwwx/why_they_save_json_in_sqlite/)[[50]](https://dev.to/manikandan/how-to-use-ai-models-locally-in-vs-code-with-the-continue-plugin-with-multi-model-switching-3na0)[[51]](https://www.eliostruyf.com/devhack-code-extension-storage-options/)[[52]](https://www.youtube.com/watch?v=v4lUJBMIDxY)[[53]](https://nimbalyst.com/blog/best-local-first-ai-coding-tools-2026/)[[54]](https://netwrix.com/en/resources/blog/ai-coding-assistant-credential-storage-risks/)[[55]](https://dbcode.io/docs/supported-databases/sqlite/sqlite)[[56]](https://code.visualstudio.com/docs/agent-customization/language-models)[[57]](https://www.facebook.com/61554891783841/posts/wtf-brooooooooooooooooooooo-this-is-actually-insane-for-ai-coding-this-vs-code-e/122290399454163059/)[[58]](https://www.devart.com/dbforge/best-vscode-extensions.html)[[59]](https://www.youtube.com/watch?v=rp5EwOogWEw)[[60]](https://vscode.sqliteviewer.app/en/)[[61]](https://tech-insider.org/ie/ai-coding-assistants-2026/)[[62]](https://pasqualepillitteri.it/en/news/3392/github-copilot-cursor-claude-code-ai-coding-showdown-2026)[[63]](https://shattered.io/jetbrains-java-kotlin-vs-code-cursor-rc-2026/)[[64]](https://gigazine.net/gsc_news/en/20260824-ai-coding-agent-adoption-trends/)[[65]](https://visualstudiomagazine.com/articles/2025/08/01/stack-overflow-dev-survey-visual-studio-vs-code-hold-of-ai-ides-to-remain-on-top.aspx)[[66]](https://tech-insider.org/vscode-1-142-agent-canvases-update-2026/)[[67]](https://www.digitalapplied.com/blog/ai-coding-adoption-statistics-2026-50-data-points)[[68]](https://blog.jetbrains.com/research/2026/04/which-ai-coding-tools-do-developers-actually-use-at-work/)[[69]](https://www.reddit.com/r/emacs/comments/1md1eva/stackoverflow_developer_survey_2025_emacs_doesnt/)[[70]](https://adtmag.com/articles/jetbrains-survey-finds-ai-coding-agents-becoming-routine-developer-tools.aspx)[[71]](https://www.instagram.com/p/DeL_j5ajOhO/)[[72]](https://stackoverflow.blog/2026/10/06/the-results-of-the-2026-developer-survey-are-here/)[[73]](https://uvik.net/blog/ai-coding-assistant-statistics/)[[74]](https://guptadeepak.com/tools/top-5-code-editors-ides-2026/)[[75]](https://www.infoworld.com/article/4077352/85-of-developers-use-ai-regularly-jetbrains-survey.html)[[76]](https://tech-insider.org/pycharm-vs-vscode-2026/)[[77]](https://www.augmentcode.com/tools/8-top-ai-coding-assistants-and-their-best-use-cases)[[78]](https://tech-insider.org/jetbrains-junie-vs-github-copilot-vs-cursor-2026/)[[79]](https://tech-insider.org/ai-coding-tools-2026-transforming-software-development/)[[80]](https://blog.jetbrains.com/research/2025/10/state-of-developer-ecosystem-2025/)[[81]](https://www.jetbrains.com/resources/industry-reports/)[[82]](https://www.reddit.com/r/scala/comments/1kvr18p/jetbrains_developer_ecosystem_survey_2025_is_out/)[[83]](https://www.facebook.com/JetBrains/videos/-the-state-of-developer-ecosystem-2025-report-is-herethis-years-edition-reveals-/837654472158063/)[[84]](https://skywork.ai/skypage/en/jetbrains-ai-assistant-review/2032070189540384768)[[85]](https://www.linkedin.com/posts/jetbrains_the-state-of-developer-ecosystem-2025-activity-7384221761837608960-ef_9)[[86]](https://blog.jetbrains.com/research/2026/08/ai-coding-agent-adoption-2026/)[[87]](https://www.marktechpost.com/2026/10/24/cognition-devin-vulnerability-fixes-plugin-php2shell-nodejs-gitlab/)[[88]](https://tech-insider.org/ie/cognition-devin-26-billion-2026/)[[89]](https://pasqualepillitteri.it/en/news/386/ai-coding-cli-alternatives-2026)[[90]](https://tech-insider.org/cursor-vs-copilot-2026/)[[91]](https://www.augmentcode.com/tools/google-antigravity-vs-windsurf)[[92]](https://tech-insider.org/cline-vs-claude-code-2026/)[[93]](https://nubiapage.com/windsurf-review-in-2026-pricing-login-ai-app-windows-user-experience-and-faqs/)[[94]](https://tech-insider.org/windsurf-vs-cursor-vs-github-copilot-2026/)[[95]](https://github.com/grapeot/devin.cursorrules)[[96]](https://medium.com/@kanerika/github-copilot-vs-claude-code-vs-cursor-vs-windsurf-2026-c54f8a5cc051)[[97]](https://www.builder.io/blog/cursor-vs-windsurf-vs-github-copilot)[[98]](https://windsurf.com/compare/windsurf-vs-github-copilot)[[99]](https://www.digitalapplied.com/blog/github-copilot-vs-cursor-vs-windsurf-ai-coding-assistants)[[100]](https://www.youtube.com/watch?v=LRBU6CUCcyc&vl=en-US)[[101]](https://dev.to/synsun/github-copilot-vs-cursor-vs-windsurf-which-ai-coding-assistant-actually-makes-you-faster-in-2026-4db3)[[102]](https://github.com/topics/windsurf)[[103]](https://theaiagentindex.com/compare/github-copilot-vs-windsurf)[[104]](https://github.com/topics/devin)[[105]](https://www.myinventory.site/where-ai-tools-store-chat-history)[[106]](https://stackoverflow.blog/2026/10/06/the-results-of-the-2026-developer-survey-are-here/)[[107]](https://blog.jetbrains.com/research/2026/08/ai-coding-agent-adoption-2026/)[[108]](https://blog.jetbrains.com/research/2026/04/which-ai-coding-tools-do-developers-actually-use-at-work/)[[109]](https://milvus.io/blog/why-claude-code-feels-so-stable-a-developers-deep-dive-into-its-local-storage-design.md)[[110]](https://tuo-lei.com/notes/claude-code-vs-cursor-local-storage/)[[111]](https://tech-insider.org/devin-vs-amazon-q-developer-vs-tabnine-2026/)[[112]](https://www.augmentcode.com/tools/amazon-q-developer-vs-tabnine)[[113]](https://www.tabnine.com/blog/tabnine-vs-amazon-q-developer/)[[114]](https://aws.amazon.com/q/developer/)[[115]](https://www.gappsy.com/compare/amazon-q-developer-vs-codeium-vs-tabnine/)[[116]](https://www.infotech.com/software-reviews/categories/ai-code-generation/compare/tabnine-vs-amazon-q-developer)[[117]](https://press.aboutamazon.com/2024/4/aws-announces-general-availability-of-amazon-q-the-most-capable-generative-ai-powered-assistant-for-accelerating-software-development-and-leveraging-companies-internal-data)[[118]](https://hatchworks.com/blog/gen-ai/amazon-q-developer/)[[119]](https://www.youtube.com/watch?v=9gMc6ohw53Y)[[120]](https://www.aicentralresources.com/compare/amazon-q-developer-vs-tabnine)[[121]](https://vibecompare.dev/guides/enterprise-ai-coding-tools/)[[122]](https://dev.to/aws/amazon-q-developer-tips-no11-scaffolding-5c6m)[[123]](https://medium.com/@jiaweilin02/supercharge-your-coding-productivity-with-amazon-q-dev-40f83079f1e9)[[124]](https://www.linkedin.com/posts/ricardotasso_amazon-q-developer-end-of-support-announcement-activity-7455792456404701184-Syxb)[[125]](https://cloudelligent.com/blog/amazon-q-developer-agents/)[[126]](https://mstone.ai/tools-wizard/amazon-q-developer/)[[127]](https://www.respan.ai/market-map/compare/amazon-q-developer-vs-devin)[[128]](https://www.rfp.wiki/artificial-intelligence/ai-code-assistants/tabnine/amazon-q-developer)[[129]](https://builder.aws.com/content/2ynFu2X4rALsbjLUSU1az6wHVSi/building-agentic-ai-applications-using-amazon-q-developer)[[130]](https://theaiagentindex.com/compare/amazon-q-developer-vs-tabnine)[[131]](https://www.reddit.com/r/ClaudeCode/comments/1rvagol/does_claude_code_have_any_way_to_access_previous/)[[132]](https://platform.claude.com/docs/en/manage-claude/compliance-sessions)[[133]](https://github.com/raine/claude-history)[[134]](https://forums.adug.org.au/t/logging-ai-conversations-claude-code/61087)[[135]](https://medium.com/@raymondpeck/unlocking-your-claude-history-part-1-f19000c05655)[[136]](https://news.ycombinator.com/item?id=44459376)[[137]](https://allaboutcoding.ghinda.com/where-ai-coding-clis-store-session-logs/)[[138]](https://claude-dev.tools/docs/log-locations)[[139]](https://zentor.ai/blog/claude-code-session-manager)[[140]](https://forums.theregister.com/forum/all/2026/06/30/202620/)[[141]](https://note.com/hacklog_stealth/n/n155b9efe80b0?hl=en)[[142]](https://www.llmnesia.com/blog/where-does-claude-code-store-history)[[143]](https://jazzyalex.github.io/agent-sessions/blog/where-agents-store-history/)[[144]](https://privacy.claude.com/en/articles/10023548-how-long-do-you-store-my-data)[[145]](https://dev.to/kuroko1t/i-built-a-tool-to-stop-losing-my-claude-code-conversation-history-5500)[[146]](https://www.youtube.com/watch?v=zPglT53TaQ0)[[147]](https://claudoscope.com/blog/where-claude-code-stores-session-history)[[148]](https://code.claude.com/docs/en/data-usage)[[149]](https://blog.memoryplugin.com/meet-memoryplugin-sync/)[[150]](https://www.linkedin.com/posts/rogerboesch_claude-macos-softwareengineering-activity-7507828441120034818-la2L)[[151]](https://www.tldl.io/resources/ai-coding-tools-2026)[[152]](https://www.reddit.com/r/GithubCopilot/comments/1p65p4u/too_many_ai_coding_tools_whats_actually_worth_it/)[[153]](https://dev.to/paulthedev/i-built-the-same-app-5-ways-cursor-vs-claude-code-vs-windsurf-vs-replit-agent-vs-github-copilot-50m2)[[154]](https://www.youtube.com/watch?v=l2wCOnlOZWE)[[155]](https://github.com/orgs/community/discussions/187143)[[156]](https://tech-insider.org/github-copilot-vs-cursor-vs-claude-code-2026/)[[157]](https://chenguangliang.com/en/posts/blog149_ai-coding-tools-2026-review/)[[158]](https://www.vibecodingacademy.ai/blog/best-ai-coding-assistant-2026)[[159]](https://unmarkdown.com/blog/claude-code-vs-cursor-vs-copilot-2026)[[160]](https://www.instagram.com/reel/DUoOJ4oDDI6/)[[161]](https://presenc.ai/compare/cursor-vs-claude-code-vs-copilot-vs-windsurf-2026)[[162]](https://levelup.gitconnected.com/i-replaced-github-copilot-with-3-tools-my-team-noticed-within-a-week-e33b6019ad94)[[163]](https://www.memorybase.app/blog/ai-coding-tools)[[164]](https://www.sitepoint.com/claude-code-vs-cursor-vs-copilot-the-2026-developer-comparison/)[[165]](https://pinggy.io/blog/best_ai_tools_for_coding/)[[166]](https://robotalp.com/blog/best-ai-code-editors-2026-windsurf-vs-cursor-vs-copilot-x-review/)[[167]](https://github.com/ai-for-developers/awesome-ai-coding-tools)[[168]](https://www.reddit.com/r/vibecoding/comments/1splfuw/added_headtohead_tool_comparison_to_my_ai_coding/)[[169]](https://www.reddit.com/r/LocalLLaMA/comments/1o54lfc/roo_code_cline_opencode_codex_qwen_cli_claude/)[[170]](https://github.com/RooCodeInc/Roo-Code/issues/3788)[[171]](https://www.youtube.com/watch?v=3wMfMQDsZKw)[[172]](https://frontman.sh/blog/best-open-source-ai-coding-tools-2026/)[[173]](https://wetheflywheel.com/en/guides/open-source-ai-coding-agents-2026/)[[174]](https://www.youtube.com/watch?v=-k-HQV3wbi4&vl=en-US)[[175]](https://opencode.ai/docs/config/)[[176]](https://forums.developer.nvidia.com/t/continue-dev-agentic-alternative-roo-code/352290)[[177]](https://skillsllm.com/skill/ai-data-extractor)[[178]](https://seanthegeek.net/doubleagent/analyzer/research/cline.html)[[179]](https://modelfit.io/tools/opencode/)[[180]](https://blog.logrocket.com/cline-ollama-local-ai-agent/)[[181]](https://medium.com/@balazskocsis/opencode-with-ollama-model-hosting-a3610f80549f)[[182]](https://localaimaster.com/blog/opencode-ollama-setup)[[183]](https://www.matterai.so/guides/connecting-local-llms-to-ides-and-coding-agents)[[184]](https://blog.codeminer42.com/setting-up-a-free-claude-like-assistant-with-opencode-and-ollama/)[[185]](https://www.sitepoint.com/local-ai-coding-assistant-complete-vs-code-ollama-continue-setup/)[[186]](https://vdf.ai/blog/opencode-local-llm-setup/)[[187]](https://smallsharpsoftwaretools.com/tutorials/opencode-and-ollama/)[[188]](https://www.infralovers.com/blog/2026-02-27-opencode-free-local-llms/)[[189]](https://visualstudiomagazine.com/articles/2026/01/20/top-5-ai-tools-for-visual-studio-2026.aspx)[[190]](https://tech-insider.org/best-ai-coding-assistants-2026/)[[191]](https://www.facebook.com/groups/698593531630485/posts/1498082501681580/)[[192]](https://towardsdatascience.com/vscode-is-the-best-ai-powered-ide/)[[193]](https://www.reddit.com/r/ChatGPTCoding/comments/1ilg9zl/cursor_vs_aider_vs_vscode_copilot_which_ai_coding/)[[194]](https://code.visualstudio.com/docs/agents/overview)[[195]](https://www.truefoundry.com/blog/cursor-vs-github-copilot)[[196]](https://continue.dev/)[[197]](https://visualstudio.microsoft.com/vs/)[[198]](https://github.com/continuedev/continue)[[199]](https://www.buildmvpfast.com/blog/best-ai-coding-assistants-2026)[[200]](https://presenc.ai/research/ai-coding-tool-market-share-statistics-2026)[[201]](https://nexasphere.io/blog/best-vs-code-ai-extension-2026)[[202]](https://neuraplus-ai.github.io/blog/best-vs-code-ai-extensions-2026.html)[[203]](https://www.youtube.com/watch?v=QkmPe68UePg&vl=en-US)[[204]](https://www.andrew.cmu.edu/user/icaoberg/post/2026-05-16-ai-coding-services-and-their-vscode-and-cursor-integrations/)[[205]](https://cursor-alternatives.com/blog/best-ai-extensions-for-vscode/)[[206]](https://learn.microsoft.com/en-us/visualstudio/ide/ai-assisted-development-visual-studio?view=visualstudio)[[207]](https://medium.com/@taher2world/the-only-vs-code-ai-extensions-worth-installing-in-2026-and-the-ones-quietly-slowing-you-down-c728ebceeb31)[[208]](https://www.pingwest.com/a/316968)[[209]](https://timeline.sohu.com/news/PS1gAsEtyH)[[210]](https://m.36kr.com/p/3928008088467592)[[211]](https://www.pingwest.com/a/317456)[[212]](https://lingma.aliyun.com/)[[213]](https://zhuanlan.zhihu.com/p/2025589657207881943)[[214]](https://xie.infoq.cn/article/08a097f143ab4a7d28c9ec562)[[215]](https://www.csdn.net/article/2026-09-15/165479362)[[216]](https://cloud.baidu.com/article/8412345)[[217]](https://www.jiemian.com/article/14788309.html)[[218]](https://unifuncs.com/s/yE1duGvE)[[219]](https://www.ithome.com/1/008/846.htm)[[220]](https://diyitech.com/guides/2026-china-ai-coding-tools-comparison/)[[221]](https://www.einkcn.com/html/product_6aa9d3893f9d52464.html)[[222]](https://www.kimi.com/code)[[223]](https://juejin.cn/post/7535277686311419942)[[224]](https://www.cnblogs.com/wzxNote/p/19648084)[[225]](https://hai.stanford.edu/ai-index/2026-ai-index-report)[[226]](https://www.kimi.com/help/kimi-code/community-guidelines)[[227]](https://www.bilibili.com/video/BV14RE26oEJa/)

## 参考资料

[1. Best Programming Languages to Learn in 2027](https://www.simplilearn.com/best-programming-languages-start-learning-today-article) - [1]

[2. AI Coding Statistics 2026: 84% of Developers Use the Tools, Only 29% Trust Them](https://sqmagazine.co.uk/ai-coding-statistics/) - [2]

[3. The share of developers using AI to write half or more code jumped from 12% to 42% YOY in latest BairesDev survey](https://venturebeat.com/data/the-share-of-developers-using-ai-to-write-half-or-more-code-jumped-from-12-to-42-yoy-in-latest-bairesdev-survey) - [3]

[4. Top programming languages in 2026: data-backed ranking](https://www.netguru.com/blog/best-programming-language-for-software-development) - [4]

[5. Copilot Share Falls to 51% as Cursor Hits $2B ARR [2026\]](https://tech-insider.org/ie/github-copilot-market-share-2026/) - [5]

[6. Vibe coding statistics 2026: Adoption, productivity, and security data](https://www.hostinger.com/blog/vibe-coding-statistics/) - [6]

[7. Developers Lean on AI More, But Report Growing Doubts About Accuracy, Stack Overflow Survey Says](https://adtmag.com/blogs/watersworks/2026/01/stack-overflow-survey.aspx) - [7]

[8. Stack Overflow in freefall: 78 percent drop in number of questions](https://www.techzine.eu/news/devops/137686/stack-overflow-in-freefall-78-percent-drop-in-number-of-questions/) - [8]

[9. Stack Overflow users don’t trust AI. They’re using it anyway](https://www.theverge.com/podcast/844073/stack-overflow-ceo-ai-coding-chatgpt-code-red-interview) - [9]

[10. Best AI Coding Tools in 2026: A Data-Driven Comparison](https://sqmagazine.co.uk/best-ai-coding-tools/) - [10]

[11. 2025 Stack Overflow Developer Survey](https://survey.stackoverflow.co/2025/) - [11]

[12. AI | 2025 Stack Overflow Developer Survey](https://survey.stackoverflow.co/2025/ai) - [12]

[13. Stack Overflow's 2025 Developer Survey Reveals Trust in ...](https://stackoverflow.co/company/press/archive/stack-overflow-2025-developer-survey/) - [13]

[14. Mind the gap: Closing the AI trust gap for developers](https://stackoverflow.blog/2026/02/18/closing-the-developer-ai-trust-gap/) - [14]

[15. Stack Overflow Survey 2025: 84% of devs use AI… but 46 ...](https://www.reddit.com/r/programming/comments/1mdyy9x/stack_overflow_survey_2025_84_of_devs_use_ai_but/) - [15]

[16. Stack Overflow Developer Survey](https://survey.stackoverflow.co/) - [16]

[17. 84% Of Developer Use AI, But Here's Why They're Not Happy](https://www.youtube.com/watch?v=jUNxRTh4hlk) - [17]

[18. Stack Overflow's 2026 Developer Survey Reveals Positive ...](https://stackoverflow.co/company/press/archive/stack-overflow-annual-developer-survey-ai-trust-conditional) - [18]

[19. Thoughts on StackOverflow 2025 Developer Survey](https://dev.to/davidshq/thoughts-on-stackoverflow-2025-developer-survey-part-1-3d5o) - [19]

[20. Six in 10 tech workers who participated in a new survey ...](https://www.facebook.com/cnn/posts/six-in-10-tech-workers-who-participated-in-a-new-survey-say-they-try-to-avoid-us/1490255409633772/) - [20]

[21. How to integrate Cursor MCP with Kimi Code](https://composio.dev/toolkits/cursor/framework/kimi) - [21]

[22. Claude Code vs Cursor: What Your AI Coding Tools Store ...](https://tuo-lei.com/notes/claude-code-vs-cursor-local-storage/) - [22]

[23. Isolated Claude Code dialects for Codex, Kimi, Cursor ...](https://github.com/stefandevo/claude-dialects) - [23]

[24. How Claude Code Manages Local Storage for AI Agents](https://milvus.io/blog/why-claude-code-feels-so-stable-a-developers-deep-dive-into-its-local-storage-design.md) - [24]

[25. Share One Memory Between Cursor and Claude Code ...](https://www.memorylake.ai/en/blogs/share-one-memory-between-cursor-and-claude-code) - [25]

[26. What Is Claude Code? Full History, Timeline & How It Works](https://www.taskade.com/blog/claude-code-history) - [26]

[27. How are you handling persistent memory for AI coding ...](https://www.reddit.com/r/LocalLLaMA/comments/1r5q7xd/how_are_you_handling_persistent_memory_for_ai/) - [27]

[28. What If Every AI Coding Session Made the Next One ...](https://medium.com/open-intelligence/what-if-every-ai-coding-session-made-the-next-one-smarter-5a72728657dd) - [28]

[29. Coding Agent Memory for Kimi: Setup Guide (2026)](https://projectmem.dev/blog/coding-agent-memory-for-kimi/) - [29]

[30. Stop Losing Context: Shared AI Memory for Claude & Cursor](https://www.youtube.com/watch?v=dkEUpfHYJ_k) - [30]

[31. My experience with Claude Code after two weeks of ...](https://news.ycombinator.com/item?id=44596472) - [31]

[32. Where Is Claude Code Session History? How to Find Your ...](https://dev.to/gonewx/where-is-claude-code-session-history-how-to-find-your-ai-coding-conversations-555o) - [32]

[33. Does each Coding Agent use your data for model training? I ...](https://nyosegawa.com/en/posts/coding-agent-terms-investigation/) - [33]

[34. Kimi Code Integration](https://docs.claude-mem.ai/kimi-integration) - [34]

[35. Kimi K3 Tech Blog: Open Frontier Intelligence](https://www.kimi.ai/blog/kimi-k3) - [35]

[36. Journal: Freelance Work and Research Notes](https://agiflow.io/blog) - [36]

[37. Docs](https://icodeeasy.cc/en/docs/) - [37]

[38. What we can all learn from the Claude Code source](https://brtkwr.com/posts/2026-04-01-what-we-can-all-learn-from-the-claude-code-source/) - [38]

[39. Kimi K2.5 vs Claude Code (REAL Use Cases): New KING of ...](https://www.youtube.com/watch?v=ue1s3eHmF54) - [39]

[40. Claude Code vs Cursor: Which AI Coding Tool in 2026?](https://www.testmuai.com/blog/claude-code-vs-cursor/) - [40]

[41. VS Code Extension Storage Explained: The What, Where, ...](https://medium.com/@krithikanithyanandam/vs-code-extension-storage-explained-the-what-where-and-how-3a0846a632ea) - [41]

[42. Chat Wizard](https://marketplace.visualstudio.com/items?itemName=Veverke.chatwizard) - [42]

[43. Common Capabilities | Visual Studio Code Extension API](https://code.visualstudio.com/api/extension-capabilities/common-capabilities) - [43]

[44. where AI coding tools store your chat history - Inventory](https://www.myinventory.site/where-ai-tools-store-chat-history) - [44]

[45. What are ALL configuration files used by Visual Studio ...](https://stackoverflow.com/questions/58900482/what-are-all-configuration-files-used-by-visual-studio-code-and-where-does-it-s) - [45]

[46. HUGE inclusion of every JSON file under globalStorage ...](https://github.com/shanalikhan/code-settings-sync/issues/1137) - [46]

[47. Understanding and Measuring Data Exposure in VSCode ...](https://arxiv.org/html/2412.00707v2) - [47]

[48. Top 5 Local AI Tools for VS Code -- All Powered by Ollama](https://visualstudiomagazine.com/articles/2026/08/04/top-5-local-ai-tools-for-vs-code-all-powered-by-ollama.aspx) - [48]

[49. r/vscode - why they save json in sqlite...](https://www.reddit.com/r/vscode/comments/1kdvwwx/why_they_save_json_in_sqlite/) - [49]

[50. How to Use AI Models Locally in VS Code ...](https://dev.to/manikandan/how-to-use-ai-models-locally-in-vs-code-with-the-continue-plugin-with-multi-model-switching-3na0) - [50]

[51. #DevHack: VS Code extension storage options](https://www.eliostruyf.com/devhack-code-extension-storage-options/) - [51]

[52. Query Databases in VS Code with Copilot Tools and DBCode](https://www.youtube.com/watch?v=v4lUJBMIDxY) - [52]

[53. Best Local-First AI Coding Tools 2026: 14 Compared](https://nimbalyst.com/blog/best-local-first-ai-coding-tools-2026/) - [53]

[54. AI coding assistants are leaking credentials](https://netwrix.com/en/resources/blog/ai-coding-assistant-credential-storage-risks/) - [54]

[55. SQLite Database Management in VS Code](https://dbcode.io/docs/supported-databases/sqlite/sqlite) - [55]

[56. AI language models in VS Code](https://code.visualstudio.com/docs/agent-customization/language-models) - [56]

[57. RammCodes](https://www.facebook.com/61554891783841/posts/wtf-brooooooooooooooooooooo-this-is-actually-insane-for-ai-coding-this-vs-code-e/122290399454163059/) - [57]

[58. Best VS Code Extensions for Developers in 2026](https://www.devart.com/dbforge/best-vscode-extensions.html) - [58]

[59. The Ultimate Local AI Coding Guide For 2026](https://www.youtube.com/watch?v=rp5EwOogWEw) - [59]

[60. SQLite Viewer PRO for VS Code](https://vscode.sqliteviewer.app/en/) - [60]

[61. AI Coding Assistants: Claude Code Ties Cursor at 18% [2026\]](https://tech-insider.org/ie/ai-coding-assistants-2026/) - [61]

[62. GitHub Copilot Under Pressure: Cursor and Claude Code Are Eating Its Lunch (2026)](https://pasqualepillitteri.it/en/news/3392/github-copilot-cursor-claude-code-ai-coding-showdown-2026) - [62]

[63. JetBrains Java-Kotlin VS Code Extension Hits RC [2026\]](https://shattered.io/jetbrains-java-kotlin-vs-code-cursor-rc-2026/) - [63]

[64. 90% of professional developers use AI coding agents at least once a week, and Claude Code has overtaken GitHub Copilot to take the top spot with nearly double the market share.](https://gigazine.net/gsc_news/en/20260824-ai-coding-agent-adoption-trends/) - [64]

[65. Stack Overflow Dev Survey: Visual Studio, VS Code Hold Off AI IDEs to Remain on Top](https://visualstudiomagazine.com/articles/2025/08/01/stack-overflow-dev-survey-visual-studio-vs-code-hold-of-ai-ides-to-remain-on-top.aspx) - [65]

[66. VS Code 1.142 Update: Agent Canvases, Python Fixes [2026\]](https://tech-insider.org/vscode-1-142-agent-canvases-update-2026/) - [66]

[67. AI Coding Adoption 2026: 50 Statistics From 7 Surveys](https://www.digitalapplied.com/blog/ai-coding-adoption-statistics-2026-50-data-points) - [67]

[68. Which AI Coding Tools Do Developers Actually Use at Work?](https://blog.jetbrains.com/research/2026/04/which-ai-coding-tools-do-developers-actually-use-at-work/) - [68]

[69. Stackoverflow developer survey 2025 - Emacs doesn't ...](https://www.reddit.com/r/emacs/comments/1md1eva/stackoverflow_developer_survey_2025_emacs_doesnt/) - [69]

[70. JetBrains Survey Finds AI Coding Agents Becoming ...](https://adtmag.com/articles/jetbrains-survey-finds-ai-coding-agents-becoming-routine-developer-tools.aspx) - [70]

[71. Your AI stack: one tool or a whole pack? 🦖 JetBrains' 2026 ...](https://www.instagram.com/p/DeL_j5ajOhO/) - [71]

[72. The results of the 2026 Developer Survey are here!](https://stackoverflow.blog/2026/10/06/the-results-of-the-2026-developer-survey-are-here/) - [72]

[73. AI Coding Assistant Statistics 2026](https://uvik.net/blog/ai-coding-assistant-statistics/) - [73]

[74. Top 5 Code Editors and IDEs of 2026: VS Code, JetBrains ...](https://guptadeepak.com/tools/top-5-code-editors-ides-2026/) - [74]

[75. 85% of developers use AI regularly – JetBrains survey](https://www.infoworld.com/article/4077352/85-of-developers-use-ai-regularly-jetbrains-survey.html) - [75]

[76. PyCharm vs VS Code 2026: Full Comparison & Verdict](https://tech-insider.org/pycharm-vs-vscode-2026/) - [76]

[77. 8 Best AI Coding Assistants by Job [Updated August 2026\]](https://www.augmentcode.com/tools/8-top-ai-coding-assistants-and-their-best-use-cases) - [77]

[78. JetBrains Junie vs GitHub Copilot vs Cursor: $12 Gap [2026\]](https://tech-insider.org/jetbrains-junie-vs-github-copilot-vs-cursor-2026/) - [78]

[79. Best AI Coding Tools 2026: 7 Tested [Ranked\]](https://tech-insider.org/ai-coding-tools-2026-transforming-software-development/) - [79]

[80. The State of Developer Ecosystem 2025: Coding in ...](https://blog.jetbrains.com/research/2025/10/state-of-developer-ecosystem-2025/) - [80]

[81. Industry Reports](https://www.jetbrains.com/resources/industry-reports/) - [81]

[82. JetBrains Developer Ecosystem Survey 2025 is out! : r/scala](https://www.reddit.com/r/scala/comments/1kvr18p/jetbrains_developer_ecosystem_survey_2025_is_out/) - [82]

[83. 🚀 The State of Developer Ecosystem 2025 Report is here! ...](https://www.facebook.com/JetBrains/videos/-the-state-of-developer-ecosystem-2025-report-is-herethis-years-edition-reveals-/837654472158063/) - [83]

[84. JetBrains AI Assistant: The Ultimate 2026 Review for ...](https://skywork.ai/skypage/en/jetbrains-ai-assistant-review/2032070189540384768) - [84]

[85. 🚀 The State of Developer Ecosystem 2025 Report is here! ...](https://www.linkedin.com/posts/jetbrains_the-state-of-developer-ecosystem-2025-activity-7384221761837608960-ef_9) - [85]

[86. AI Coding Agents: Adoption Trends](https://blog.jetbrains.com/research/2026/08/ai-coding-agent-adoption-2026/) - [86]

[87. Cognition Open-Sources an Agent Plugin that Helps Secure Systems against Recent Cybersecurity Threats](https://www.marktechpost.com/2026/10/24/cognition-devin-vulnerability-fixes-plugin-php2shell-nodejs-gitlab/) - [87]

[88. Cognition Hits $48B; Devin Writes 89% of Its Code [2026\]](https://tech-insider.org/ie/cognition-devin-26-billion-2026/) - [88]

[89. 9 AI Coding Alternatives for Terminal Development: Complete 2026 Guide](https://pasqualepillitteri.it/en/news/386/ai-coding-cli-alternatives-2026) - [89]

[90. Cursor vs Copilot 2026: $20 vs $10, $29B Valuation [Tested\]](https://tech-insider.org/cursor-vs-copilot-2026/) - [90]

[91. Google Antigravity vs Windsurf: Which AI Coding Assistant Is Ready for Enterprise?](https://www.augmentcode.com/tools/google-antigravity-vs-windsurf) - [91]

[92. Cline vs Claude Code vs Copilot: Free vs $20 vs $10 [2026\]](https://tech-insider.org/cline-vs-claude-code-2026/) - [92]

[93. Windsurf Review in 2026: Pricing, Login, AI, App, Windows & FAQs](https://nubiapage.com/windsurf-review-in-2026-pricing-login-ai-app-windows-user-experience-and-faqs/) - [93]

[94. Windsurf vs Cursor vs Copilot: $200 vs $39 Gap [2026\]](https://tech-insider.org/windsurf-vs-cursor-vs-github-copilot-2026/) - [94]

[95. grapeot/devin.cursorrules: Magic to turn Cursor/Windsurf ...](https://github.com/grapeot/devin.cursorrules) - [95]

[96. GitHub Copilot vs Claude Code vs Cursor vs Windsurf (2026)](https://medium.com/@kanerika/github-copilot-vs-claude-code-vs-cursor-vs-windsurf-2026-c54f8a5cc051) - [96]

[97. Cursor vs Windsurf vs GitHub Copilot](https://www.builder.io/blog/cursor-vs-windsurf-vs-github-copilot) - [97]

[98. Windsurf vs GitHub Copilot | AI IDE Comparison](https://windsurf.com/compare/windsurf-vs-github-copilot) - [98]

[99. GitHub Copilot vs Cursor vs Windsurf AI Comparison](https://www.digitalapplied.com/blog/github-copilot-vs-cursor-vs-windsurf-ai-coding-assistants) - [99]

[100. GitHub Copilot vs Cursor vs Windsurf: The Trade-Offs Nobody ...](https://www.youtube.com/watch?v=LRBU6CUCcyc&vl=en-US) - [100]

[101. GitHub Copilot vs Cursor vs Windsurf: Which AI Coding ...](https://dev.to/synsun/github-copilot-vs-cursor-vs-windsurf-which-ai-coding-assistant-actually-makes-you-faster-in-2026-4db3) - [101]

[102. windsurf · GitHub Topics](https://github.com/topics/windsurf) - [102]

[103. GitHub Copilot vs Windsurf (2026) - The AI Agent Index](https://theaiagentindex.com/compare/github-copilot-vs-windsurf) - [103]

[104. devin · GitHub Topics](https://github.com/topics/devin) - [104]

[105. Where Cursor, Claude Code and Codex store chat history on macOS](https://www.myinventory.site/where-ai-tools-store-chat-history) - [105]

[106. The results of the 2026 Developer Survey are here! - Stack Overflow](https://stackoverflow.blog/2026/10/06/the-results-of-the-2026-developer-survey-are-here/) - [106]

[107. AI Coding Agents: Adoption Trends - The JetBrains Blog](https://blog.jetbrains.com/research/2026/08/ai-coding-agent-adoption-2026/) - [107]

[108. Which AI Coding Tools Do Developers Actually Use at Work? - The JetBrains Blog](https://blog.jetbrains.com/research/2026/04/which-ai-coding-tools-do-developers-actually-use-at-work/) - [108]

[109. https://milvus.io/blog/why-claude-code-feels-so-stable-a-developers-deep-dive-into-its-local-storage-design.md](https://milvus.io/blog/why-claude-code-feels-so-stable-a-developers-deep-dive-into-its-local-storage-design.md) - [109]

[110. Claude Code vs Cursor: What Your AI Coding Tools Store Locally - Tuo Lei](https://tuo-lei.com/notes/claude-code-vs-cursor-local-storage/) - [110]

[111. Devin vs Amazon Q Developer vs Tabnine: $26B, Sunset [2026\]](https://tech-insider.org/devin-vs-amazon-q-developer-vs-tabnine-2026/) - [111]

[112. Amazon Q Developer vs Tabnine: Choosing the Right AI ...](https://www.augmentcode.com/tools/amazon-q-developer-vs-tabnine) - [112]

[113. Tabnine vs. Amazon Q Developer](https://www.tabnine.com/blog/tabnine-vs-amazon-q-developer/) - [113]

[114. Coding Assistant - Amazon Q Developer](https://aws.amazon.com/q/developer/) - [114]

[115. Amazon Q Developer vs Codeium vs Tabnine](https://www.gappsy.com/compare/amazon-q-developer-vs-codeium-vs-tabnine/) - [115]

[116. AI Code Generation Tabnine vs Amazon Q Developer](https://www.infotech.com/software-reviews/categories/ai-code-generation/compare/tabnine-vs-amazon-q-developer) - [116]

[117. AWS-Announces-General-Availability-of-Amazon-Q-the-Most ...](https://press.aboutamazon.com/2024/4/aws-announces-general-availability-of-amazon-q-the-most-capable-generative-ai-powered-assistant-for-accelerating-software-development-and-leveraging-companies-internal-data) - [117]

[118. Amazon Q Developer: The AWS Tool Revolutionizing ...](https://hatchworks.com/blog/gen-ai/amazon-q-developer/) - [118]

[119. AI-Powered Developer: Code 10x Faster with Amazon Q](https://www.youtube.com/watch?v=9gMc6ohw53Y) - [119]

[120. Amazon Q Developer vs Tabnine (2026): Comparison](https://www.aicentralresources.com/compare/amazon-q-developer-vs-tabnine) - [120]

[121. Copilot, Tabnine, Amazon Q, Augment Code, Cody, Blackbox ...](https://vibecompare.dev/guides/enterprise-ai-coding-tools/) - [121]

[122. Amazon Q Developer Tips: No.11 Scaffolding](https://dev.to/aws/amazon-q-developer-tips-no11-scaffolding-5c6m) - [122]

[123. Supercharge your coding productivity with Amazon Q Dev](https://medium.com/@jiaweilin02/supercharge-your-coding-productivity-with-amazon-q-dev-40f83079f1e9) - [123]

[124. Amazon Q Developer IDE plugins reach end of support ...](https://www.linkedin.com/posts/ricardotasso_amazon-q-developer-end-of-support-announcement-activity-7455792456404701184-Syxb) - [124]

[125. Amazon Q Developer Agents Simplify Coding](https://cloudelligent.com/blog/amazon-q-developer-agents/) - [125]

[126. What Is Amazon Q Developer? Key Features & Pricing](https://mstone.ai/tools-wizard/amazon-q-developer/) - [126]

[127. Amazon Q Developer vs Devin (2026)](https://www.respan.ai/market-map/compare/amazon-q-developer-vs-devin) - [127]

[128. Tabnine vs Amazon Q Developer (2026) - RFP.wiki](https://www.rfp.wiki/artificial-intelligence/ai-code-assistants/tabnine/amazon-q-developer) - [128]

[129. Building Agentic AI Applications Using Amazon Q Developer](https://builder.aws.com/content/2ynFu2X4rALsbjLUSU1az6wHVSi/building-agentic-ai-applications-using-amazon-q-developer) - [129]

[130. Amazon Q Developer vs Tabnine (2026): Which is Better?](https://theaiagentindex.com/compare/amazon-q-developer-vs-tabnine) - [130]

[131. Does Claude Code have any way to access previous ...](https://www.reddit.com/r/ClaudeCode/comments/1rvagol/does_claude_code_have_any_way_to_access_previous/) - [131]

[132. Retrieve session transcripts - Claude Platform Docs](https://platform.claude.com/docs/en/manage-claude/compliance-sessions) - [132]

[133. Fuzzy-search Claude Code conversation history](https://github.com/raine/claude-history) - [133]

[134. Logging AI conversations (Claude Code)](https://forums.adug.org.au/t/logging-ai-conversations-claude-code/61087) - [134]

[135. Unlocking Your Claude History, Part 1](https://medium.com/@raymondpeck/unlocking-your-claude-history-part-1-f19000c05655) - [135]

[136. Show HN: Claude Code History Viewer for macOS](https://news.ycombinator.com/item?id=44459376) - [136]

[137. Where Six AI Coding CLIs Store Your Session Logs](https://allaboutcoding.ghinda.com/where-ai-coding-clis-store-session-logs/) - [137]

[138. Where are Claude Code logs stored?](https://claude-dev.tools/docs/log-locations) - [138]

[139. Claude Code Session Manager: Wake for Mac | Zentor Blog](https://zentor.ai/blog/claude-code-session-manager) - [139]

[140. Claude Code users complain their chat records are being ...](https://forums.theregister.com/forum/all/2026/06/30/202620/) - [140]

[141. I learned that Claude Code conversation logs disappear ...](https://note.com/hacklog_stealth/n/n155b9efe80b0?hl=en) - [141]

[142. Where Does Claude Code Store Conversation History?](https://www.llmnesia.com/blog/where-does-claude-code-store-history) - [142]

[143. Where AI coding agents store your session history](https://jazzyalex.github.io/agent-sessions/blog/where-agents-store-history/) - [143]

[144. How long do you store my data? - Anthropic Privacy Center](https://privacy.claude.com/en/articles/10023548-how-long-do-you-store-my-data) - [144]

[145. I Built a Tool to Stop Losing My Claude Code Conversation ...](https://dev.to/kuroko1t/i-built-a-tool-to-stop-losing-my-claude-code-conversation-history-5500) - [145]

[146. How to Export Claude Code CLI Chat History (Working 2026 ...](https://www.youtube.com/watch?v=zPglT53TaQ0) - [146]

[147. Where Claude Code stores your session history, and how ...](https://claudoscope.com/blog/where-claude-code-stores-session-history) - [147]

[148. Data usage - Claude Code Docs](https://code.claude.com/docs/en/data-usage) - [148]

[149. Claude Code, Codex & Cursor Chat History Sync](https://blog.memoryplugin.com/meet-memoryplugin-sync/) - [149]

[150. Claude Code hogging Mac storage space](https://www.linkedin.com/posts/rogerboesch_claude-macos-softwareengineering-activity-7507828441120034818-la2L) - [150]

[151. AI Coding Tools Compared (2026): Cursor vs Claude ... - TLDL](https://www.tldl.io/resources/ai-coding-tools-2026) - [151]

[152. Too many AI coding tools — What's actually worth it for a ...](https://www.reddit.com/r/GithubCopilot/comments/1p65p4u/too_many_ai_coding_tools_whats_actually_worth_it/) - [152]

[153. I Built the Same App 5 Ways: Cursor vs Claude Code ...](https://dev.to/paulthedev/i-built-the-same-app-5-ways-cursor-vs-claude-code-vs-windsurf-vs-replit-agent-vs-github-copilot-50m2) - [153]

[154. Claude Code, Cursor, Windsurf, Copilot & More!](https://www.youtube.com/watch?v=l2wCOnlOZWE) - [154]

[155. Best AI Tools for Developers in 2026: What Are Your Must- ...](https://github.com/orgs/community/discussions/187143) - [155]

[156. GitHub Copilot vs Cursor vs Claude Code 2026 Compared](https://tech-insider.org/github-copilot-vs-cursor-vs-claude-code-2026/) - [156]

[157. An Honest Review of Claude Code, Cursor, Copilot, Windsurf ...](https://chenguangliang.com/en/posts/blog149_ai-coding-tools-2026-review/) - [157]

[158. Best AI Coding Assistants 2026: Cursor, Copilot & More](https://www.vibecodingacademy.ai/blog/best-ai-coding-assistant-2026) - [158]

[159. Claude Code vs Cursor vs Copilot vs Windsurf (2026)](https://unmarkdown.com/blog/claude-code-vs-cursor-vs-copilot-2026) - [159]

[160. I ranked every AI coding tool in 2026 from worst to best ...](https://www.instagram.com/reel/DUoOJ4oDDI6/) - [160]

[161. Cursor vs Claude Code vs GitHub Copilot vs Windsurf 2026](https://presenc.ai/compare/cursor-vs-claude-code-vs-copilot-vs-windsurf-2026) - [161]

[162. I replaced GitHub Copilot with 3 tools. My team noticed within ...](https://levelup.gitconnected.com/i-replaced-github-copilot-with-3-tools-my-team-noticed-within-a-week-e33b6019ad94) - [162]

[163. AI Coding Tools That Actually Help You Ship in 2026](https://www.memorybase.app/blog/ai-coding-tools) - [163]

[164. Claude Code vs Cursor vs Copilot: The 2026 Developer ...](https://www.sitepoint.com/claude-code-vs-cursor-vs-copilot-the-2026-developer-comparison/) - [164]

[165. Best AI Tools for Coding in 2026](https://pinggy.io/blog/best_ai_tools_for_coding/) - [165]

[166. Best AI Code Editors 2026: Windsurf vs Cursor vs Copilot X ...](https://robotalp.com/blog/best-ai-code-editors-2026-windsurf-vs-cursor-vs-copilot-x-review/) - [166]

[167. ai-for-developers/awesome-ai-coding-tools](https://github.com/ai-for-developers/awesome-ai-coding-tools) - [167]

[168. Cursor vs Windsurf, Copilot vs Trae, whatever you want](https://www.reddit.com/r/vibecoding/comments/1splfuw/added_headtohead_tool_comparison_to_my_ai_coding/) - [168]

[169. Roo Code, Cline, Opencode, Codex, Qwen CLI, Claude ...](https://www.reddit.com/r/LocalLLaMA/comments/1o54lfc/roo_code_cline_opencode_codex_qwen_cli_claude/) - [169]

[170. customStoragePath setting does not work - files always ...](https://github.com/RooCodeInc/Roo-Code/issues/3788) - [170]

[171. Choosing Between 7 AI coding agents](https://www.youtube.com/watch?v=3wMfMQDsZKw) - [171]

[172. Best Open-Source AI Coding Tools 2026 - Frontman](https://frontman.sh/blog/best-open-source-ai-coding-tools-2026/) - [172]

[173. Open-Source AI Coding Agents 2026: The Complete ...](https://wetheflywheel.com/en/guides/open-source-ai-coding-agents-2026/) - [173]

[174. AI in VSCode: Walkthrough of GitHub Copilot, Cline & Roo Code](https://www.youtube.com/watch?v=-k-HQV3wbi4&vl=en-US) - [174]

[175. Config](https://opencode.ai/docs/config/) - [175]

[176. Continue.dev agentic alternative: roo code](https://forums.developer.nvidia.com/t/continue-dev-agentic-alternative-roo-code/352290) - [176]

[177. ai-data-extractor - AI Agents on GitHub](https://skillsllm.com/skill/ai-data-extractor) - [177]

[178. Cline transcript schema - DoubleAgent](https://seanthegeek.net/doubleagent/analyzer/research/cline.html) - [178]

[179. Best Local LLMs for OpenCode (2026 Tier List)](https://modelfit.io/tools/opencode/) - [179]

[180. Cline + Ollama: A fully local AI coding agent](https://blog.logrocket.com/cline-ollama-local-ai-agent/) - [180]

[181. OpenCode with Ollama Model Hosting | by Balazs Kocsis](https://medium.com/@balazskocsis/opencode-with-ollama-model-hosting-a3610f80549f) - [181]

[182. OpenCode + Ollama Setup: Run the Top Coding Agent ...](https://localaimaster.com/blog/opencode-ollama-setup) - [182]

[183. Local LLMs in Your IDE: Connecting Ollama to Coding ...](https://www.matterai.so/guides/connecting-local-llms-to-ides-and-coding-agents) - [183]

[184. Setting Up A Free Claude-Like Assistant With OpenCode And ...](https://blog.codeminer42.com/setting-up-a-free-claude-like-assistant-with-opencode-and-ollama/) - [184]

[185. Complete VS Code + Ollama + Continue Setup - AI](https://www.sitepoint.com/local-ai-coding-assistant-complete-vs-code-ollama-continue-setup/) - [185]

[186. OpenCode Local LLM Setup: Ollama, LM Studio, llama.cpp](https://vdf.ai/blog/opencode-local-llm-setup/) - [186]

[187. Create a Local Coding Environment with Ollama and OpenCode](https://smallsharpsoftwaretools.com/tutorials/opencode-and-ollama/) - [187]

[188. OpenCode: AI-Assisted Coding with Free and Local LLMs](https://www.infralovers.com/blog/2026-02-27-opencode-free-local-llms/) - [188]

[189. Top 5 AI Tools for Visual Studio 2026](https://visualstudiomagazine.com/articles/2026/01/20/top-5-ai-tools-for-visual-studio-2026.aspx) - [189]

[190. Best AI Coding Assistants 2026: 7 Tools Ranked + Priced](https://tech-insider.org/best-ai-coding-assistants-2026/) - [190]

[191. What AI assistant is recommended for VS Code?](https://www.facebook.com/groups/698593531630485/posts/1498082501681580/) - [191]

[192. Why I stopped Using Cursor and Reverted to VSCode](https://towardsdatascience.com/vscode-is-the-best-ai-powered-ide/) - [192]

[193. Cursor vs Aider vs VSCode + Copilot: Which AI Coding ...](https://www.reddit.com/r/ChatGPTCoding/comments/1ilg9zl/cursor_vs_aider_vs_vscode_copilot_which_ai_coding/) - [193]

[194. Build with AI in VS Code](https://code.visualstudio.com/docs/agents/overview) - [194]

[195. Cursor vs GitHub Copilot: Which AI Coding Tool Should ...](https://www.truefoundry.com/blog/cursor-vs-github-copilot) - [195]

[196. Continue (acquired by Cursor)](https://continue.dev/) - [196]

[197. AI-Powered Integrated Development ... - Visual Studio IDE](https://visualstudio.microsoft.com/vs/) - [197]

[198. continuedev/continue: open-source coding agent](https://github.com/continuedev/continue) - [198]

[199. Top AI Coding Assistants 2026: IDE Plugins, Agents & Pricing](https://www.buildmvpfast.com/blog/best-ai-coding-assistants-2026) - [199]

[200. AI Coding Tool Market Share Statistics 2026](https://presenc.ai/research/ai-coding-tool-market-share-statistics-2026) - [200]

[201. Copilot vs Cursor vs Cline: The VS Code AI Comparison for ...](https://nexasphere.io/blog/best-vs-code-ai-extension-2026) - [201]

[202. Best VS Code AI Extensions 2026](https://neuraplus-ai.github.io/blog/best-vs-code-ai-extensions-2026.html) - [202]

[203. VS Code Tutorial For Beginners (Free Copilot AI 2026)](https://www.youtube.com/watch?v=QkmPe68UePg&vl=en-US) - [203]

[204. AI coding services and their VSCode and Cursor integrations](https://www.andrew.cmu.edu/user/icaoberg/post/2026-05-16-ai-coding-services-and-their-vscode-and-cursor-integrations/) - [204]

[205. Best AI Extensions for VS Code (2026) - Cursor alternatives](https://cursor-alternatives.com/blog/best-ai-extensions-for-vscode/) - [205]

[206. AI-assistance for developers in Visual Studio](https://learn.microsoft.com/en-us/visualstudio/ide/ai-assisted-development-visual-studio?view=visualstudio) - [206]

[207. The Only VS Code AI Extensions Worth Installing in 2026 ...](https://medium.com/@taher2world/the-only-vs-code-ai-extensions-worth-installing-in-2026-and-the-ones-quietly-slowing-you-down-c728ebceeb31) - [207]

[208. 2025-2026 AI编程工具清单：20款国内外编程软件能力与选型图谱](https://www.pingwest.com/a/316968) - [208]

[209. 2026年8月(2个月前) AI编程工具推荐：国内外20款编程软件全盘点](https://timeline.sohu.com/news/PS1gAsEtyH) - [209]

[210. 腾讯、阿里、字节的两场仗：补Coding旧账，赌Work未来](https://m.36kr.com/p/3928008088467592) - [210]

[211. 2026国产AI编程工具决策指南：从Kimi Code、通义灵码](https://www.pingwest.com/a/317456) - [211]

[212. 通义灵码_你的智能编码助手-阿里云](https://lingma.aliyun.com/) - [212]

[213. 2026国产AI编程工具横评：五款主流工具深度对比](https://zhuanlan.zhihu.com/p/2025589657207881943) - [213]

[214. Agent 元年下的国产对决：谁能在2026 的AI 编程赛道笑到最后](https://xie.infoq.cn/article/08a097f143ab4a7d28c9ec562) - [214]

[215. 2026国产AI编程工具决策指南：从Kimi Code、通义灵码](https://www.csdn.net/article/2026-09-15/165479362) - [215]

[216. 2026 年国产AI 编程工具推荐排行榜：5款主流产品深度对比](https://cloud.baidu.com/article/8412345) - [216]

[217. 阿里“AI编程第一”，智谱、Kimi答应吗？](https://www.jiemian.com/article/14788309.html) - [217]

[218. 2026年(今年)国内AI Coding客户端产品全景梳理](https://unifuncs.com/s/yE1duGvE) - [218]

[219. 2026 AI编程工具全景盘点，40款产品，七大形态谁在真干活](https://www.ithome.com/1/008/846.htm) - [219]

[220. 国内能用的AI 编程工具有哪些？2026 年按场景核验](https://diyitech.com/guides/2026-china-ai-coding-tools-comparison/) - [220]

[221. 2026最新国内15家AI大模型应用盘点：8款国产Coding Agent ...](https://www.einkcn.com/html/product_6aa9d3893f9d52464.html) - [221]

[222. Kimi Code —— 搭载Kimi K3.1 Pro 的AI 编程Agent，复盖CLI](https://www.kimi.com/code) - [222]

[223. AI编程工具爆发元年：谁才是真王者？](https://juejin.cn/post/7535277686311419942) - [223]

[224. 2026年(今年)国内主流AI Coding Plan套餐全对比｜开发者避坑指南](https://www.cnblogs.com/wzxNote/p/19648084) - [224]

[225. The 2026 AI Index Report | Stanford HAI](https://hai.stanford.edu/ai-index/2026-ai-index-report) - [225]

[226. Kimi Code 社区倡议](https://www.kimi.com/help/kimi-code/community-guidelines) - [226]

[227. Kimi正式开源AI编程神器！Kimi Code深度实测：支持视频生成代码](https://www.bilibili.com/video/BV14RE26oEJa/) - [227]


