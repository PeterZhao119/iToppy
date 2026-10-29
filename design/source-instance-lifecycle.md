# 来源实例、展示归属与生命周期设计

状态：已讨论确认的设计基线。本文取代“每个 Agent 类型固定一只桌宠”的早期定义。

## 1. 核心原则

- **Agent 类型决定身份**：例如 Kimi Code、Claude Code、Cline。
- **来源实例决定桌宠数量**：例如某个 VS Code 工作区或某个终端会话。
- **数据源决定监控对象**：Agent 根目录、Session 文件、数据库和诊断日志可以是不同路径。
- **导航信息决定跳转目标**：激活 App、定位工作区或聚焦终端标签页是独立职责。
- **Conversation/Session 只提供状态事件**：不直接决定桌宠数量，也不强求所有 Agent 对它有一致定义。
- **发现与展示分离**：发现历史数据不等于需要展示历史桌宠。

## 2. 统一来源实例模型

```text
SourceInstance {
  agentType
  instanceId
  hostKind
  displayName
  navigation
  dataSources[]
}
```

### instanceId

`instanceId` 是 iToppy 自己用于归属和去重的标识，不是 macOS 的 App 激活标识，也不是 Session ID。

推荐形式：

```text
IDE 工作区：vscode:/Users/example/workspace/iToppy
CLI 终端：terminal:com.googlecode.iterm2:session-3
```

### navigation

```text
appBundleId          用于激活桌面 App
workspacePath?       IDE 专用，用于定位工作区
terminalSessionId?   CLI 专用，用于定位终端会话
processId?           仅用于存活辅助
windowId?            精确窗口跳转增强
```

PID 不能唯一标识窗口，也不作为长期实例身份。`instanceId` 不直接用于 App 激活；激活使用 `appBundleId`，App 内定位使用工作区或终端会话信息。

### dataSources

```text
DataSource {
  scope: agent | workspace | session | app-log
  kind: directory | file | database
  role: session-root | transcript | diagnostic | state
  path
  sessionId?
}
```

一个实例可以有多个数据源，数据源也可以随新 Session 动态挂载。`instanceId` 和数据源不是一一对应关系，映射必须由各适配器具体确认，不能根据目录名称强行推断。

## 3. 两个参考实例

### Claude Code：iTerm2 中的 CLI

```json
{
  "agentType": "claude-code",
  "instanceId": "terminal:com.googlecode.iterm2:session-3",
  "hostKind": "terminal-session",
  "navigation": {
    "appBundleId": "com.googlecode.iterm2",
    "terminalSessionId": "session-3"
  },
  "dataSources": [
    {
      "scope": "agent",
      "kind": "directory",
      "role": "session-root",
      "path": "~/.claude/projects"
    },
    {
      "scope": "session",
      "kind": "file",
      "role": "transcript",
      "sessionId": "abc-123",
      "path": "~/.claude/projects/demo/abc-123.jsonl"
    }
  ]
}
```

点击后先通过 `appBundleId` 激活 iTerm2，再尝试通过 `terminalSessionId` 聚焦标签页。CLI 的当前工作目录可以展示，但不作为实例身份。

### Kimi Code：VS Code 插件

```json
{
  "agentType": "kimi-code",
  "instanceId": "vscode:/Users/example/workspace/iToppy",
  "hostKind": "vscode-workspace",
  "navigation": {
    "appBundleId": "com.microsoft.VSCode",
    "workspacePath": "/Users/example/workspace/iToppy"
  },
  "dataSources": [
    {
      "scope": "agent",
      "kind": "directory",
      "role": "session-root",
      "path": "~/.kimi-code/sessions"
    },
    {
      "scope": "session",
      "kind": "file",
      "role": "transcript",
      "sessionId": "session_example-...",
      "path": "~/.kimi-code/sessions/wd_itoppy_.../session_example-.../agents/main/wire.jsonl"
    },
    {
      "scope": "app-log",
      "kind": "file",
      "role": "diagnostic",
      "path": "~/Library/Application Support/Code/logs/.../1-Kimi Code.log"
    }
  ]
}
```

控制面板展示：

```text
Kimi Code
类型：VS Code 插件
宿主：Visual Studio Code
数据目录：~/.kimi-code/sessions
状态：已启用
默认形象：DeepSeek
```

桌宠展示为 `Kimi Code · iToppy`，不是 `VS Code · iToppy`。点击后激活 VS Code 并定位 iToppy 工作区。

同一个 VS Code 中多个插件可以分别展示为 `Kimi Code · iToppy`、`Cline · iToppy`、`Roo Code · iToppy`，它们的数据源与状态机互不混用。

## 4. 启动扫描与用户配置

### 启动扫描

首次启动和后续启动时，按适配器声明检查：

- App Bundle ID、插件扩展 ID 和安装标记
- 默认配置/会话目录及版本文件
- 可选的进程信息，用于辅助判断存活

不扫描全盘，不根据历史 Session 创建桌宠。用户也可以在控制面板手动触发重新扫描，或按“Agent 类型 + 目标目录”手动添加。

### App 配置

```text
AgentAppConfig {
  agentType
  enabled
  defaultCharacterId
  autoShowPolicy
}
```

### 实例配置

```text
PetInstanceConfig {
  instanceId
  characterIdOverride?
  walkEnabledOverride?
  walkSpeedOverride?
  resultBubbleEnabledOverride?
  visible?
  monitoringEnabled?
}
```

游走开关、游走速度和结果气泡与形象一样，先取实例覆写，再取 App 默认值。

形象解析顺序：

```text
实例覆写 → App 默认形象 → 全局默认形象
```

重新扫描不得覆盖这些选择。新 App 加入列表，已有 App 去重，找不到的 App 标记不可用而不是删除配置。

## 5. 显示与隐藏生命周期

不要仅因 App 启动或新文件出现就立即创建桌宠，采用任务驱动：

```text
发现 App / 数据源
→ 登记为候选，不显示

出现新的 task_submitted
→ 确认 instanceId
→ 检查用户是否启用及数量上限
→ 自动创建桌宠

任务完成
→ 展示 succeeded / failed
→ 进入 succeeded_idle / failed_idle
→ 保留结果、桌宠和气泡，直到用户关闭或新任务到来

再次出现新任务
→ 收起旧结果并进入 running
```

桌宠不因结果保留时间到期而自动隐藏。只有用户明确执行“隐藏并暂停监控”才隐藏实例、暂停其事件处理并保留配置；从控制面板重新启用后恢复。共享文件监听器可以为其他活跃实例继续运行，但被隐藏实例的事件不得更新状态或触发提醒。

### 限制与保护

- 全局和每类 Agent 的可见数量上限均由用户配置。
- 超限实例进入“其他活跃实例”列表，不继续铺满桌面。
- 只有确认 `instanceId` 才能自动创建，映射不清时进入待分配队列。
- 新桌宠不抢焦点，在空闲位置出现。
- 做事件去重和最短展示时间，防止状态闪烁。
- 应用启动不回填历史桌宠，只处理启动后的新事件。
- 自动策略可配置为新任务自动显示或完全手动，不提供结果到期自动隐藏。

## 6. 实例内多 Conversation 聚合

同一来源实例内可以有多个 Conversation，聚合规则为：

1. 有运行中的 Conversation 时，主状态保持 running，并显示运行数量。
2. 由最近有变动的运行中 Conversation 驱动子动作。
3. 某个 Conversation 完成、但另一个仍在运行时，完成结果保留在列表或标记中，不抢占 running 主状态。
4. 没有运行中的 Conversation 时，由最近有变动的已完成 Conversation 展示结果和气泡。
5. 同优先级下选择最近有变动的 Conversation。

这对应“每个来源实例一个 `SessionAggregator`”，而不是“每个 Agent 类型一个聚合器”。

## 7. 来源识别与降级

实例映射无法完全统一：

- IDE 插件可通过 `session_index.jsonl`、工作区路径和 VS Code 工作区记录关联。
- 新 Session 的索引行可能晚于 Wire 写入；同一 `workDirKey` 可复用索引中已经验证的工作区映射，避免新任务滞留在待归属队列，但未知 `workDirKey` 不得靠名称猜测。
- CLI 可通过终端 App、终端会话、TTY 或环境信息关联。
- 某些数据源可能被多个客户端共享，不能仅凭路径判断来源。
- 无法确认归属时，进入待分配队列或提示用户指定，不随机创建新实例，也不把同一 Session 错误复制到多个客户端。

`window<N>` 日志编号不等于工作区；PID 只用于存活判断；`windowId` 只作为精确跳转增强。

## 8. 对现有实现的影响

- `AgentAdapter` 继续负责发现、目录验证和事件解释。
- 新增来源实例注册表，统一管理 `instanceId`、导航和数据源。
- `SessionAggregator` 按来源实例创建，不按 Agent 类型全局唯一创建。
- 新增展示生命周期管理器，负责候选、自动显示、结果保留、手动隐藏与恢复、数量上限和待分配队列。
- 角色注册表继续独立，形象通过 App 默认与实例覆写解析，不与适配器绑定。
- 游走开关、游走速度和结果气泡采用“App 默认值 → 实例覆写”，右键菜单只修改当前实例。

## 9. 当前默认产品行为

- 启动扫描只列 App，不直接展示历史桌宠。
- 用户选择启用的 App 和默认形象。
- 新任务触发自动展示，数量上限可配置。
- 结果降低提醒强度后仍保留桌宠，不自动隐藏。
- 手动隐藏同时暂停该实例监控，重新启用后恢复。
- IDE 以工作区区分实例，CLI 以终端会话区分实例；具体映射由适配器验证并允许覆写。
