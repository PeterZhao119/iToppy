use rusqlite::types::Value as SqlValue;
use rusqlite::{Connection, OpenFlags};
use serde::Serialize;
use serde_json::{json, Map, Value as JsonValue};
use std::collections::HashMap;
use std::fs;
use std::path::{Path, PathBuf};
use std::thread;
use std::time::{Duration, UNIX_EPOCH};
use tauri::{AppHandle, Emitter};

const POLL_INTERVAL: Duration = Duration::from_millis(1500);
const ITEM_BATCH: i64 = 500;

// threads 表全量快照 diff 时跟踪的列（按 updated_at_ms 判断变化）。
const THREAD_COLUMNS: &[&str] = &[
    "id",
    "rollout_path",
    "created_at_ms",
    "updated_at_ms",
    "source",
    "cwd",
    "title",
    "originator",
    "thread_source",
    "archived",
    "agent_nickname",
    "agent_role",
    "agent_path",
    "attached_thread_parent_id",
    "git_branch",
    "model",
];

// thread_turns 表全量快照 diff 时跟踪的列（turn 状态原地更新，不能靠 rowid 游标）。
const TURN_COLUMNS: &[&str] = &[
    "thread_id",
    "turn_id",
    "status",
    "error_json",
    "final_agent_item_id",
    "root_turn_id",
];

#[derive(Clone, Serialize)]
struct WireItem {
    rowid: i64,
    thread_id: String,
    turn_id: String,
    item_type: String,
    item_json: String,
}

#[derive(Clone, Serialize)]
struct WireTurn {
    thread_id: String,
    turn_id: String,
    status: String,
    error_json: Option<String>,
    final_agent_item_id: Option<String>,
}

#[derive(Clone, Serialize)]
struct WireDbUpdate {
    threads: Vec<JsonValue>,
    turns: Vec<WireTurn>,
    items: Vec<WireItem>,
}

#[derive(Default)]
struct PollState {
    state_file: Option<PathBuf>,
    history_file: Option<PathBuf>,
    items_initialized: bool,
    item_cursor: i64,
    threads_seen: HashMap<String, i64>,
    turns_seen: HashMap<(String, String), String>,
}

pub fn start(app: AppHandle) -> Result<(), String> {
    let home = crate::watcher::codex_home()?;
    thread::spawn(move || {
        let mut state = PollState::default();
        loop {
            poll_once(&app, &home, &mut state);
            thread::sleep(POLL_INTERVAL);
        }
    });
    Ok(())
}

fn poll_once(app: &AppHandle, home: &Path, state: &mut PollState) {
    let state_file = latest_versioned_db(home, "state_");
    let history_file = latest_versioned_db(home, "thread_history_");
    if state.state_file != state_file || state.history_file != history_file {
        // 数据库文件版本切换（或首次启动）：重置全部游标，不回放历史。
        *state = PollState {
            state_file: state_file.clone(),
            history_file: history_file.clone(),
            ..PollState::default()
        };
    }

    let Some(history_path) = history_file else {
        return;
    };
    let Ok(connection) = open_readonly(&history_path) else {
        // 文件被占用或尚未创建：本轮静默跳过。
        return;
    };

    if !state.items_initialized {
        state.item_cursor = connection
            .query_row("SELECT COALESCE(MAX(rowid), 0) FROM thread_items", [], |row| {
                row.get(0)
            })
            .unwrap_or(0);
        state.items_initialized = true;
    }

    // 紧凑恢复：rowid 回退说明数据库被重写，重置游标并重新做全量快照。
    let max_rowid: i64 = connection
        .query_row("SELECT COALESCE(MAX(rowid), 0) FROM thread_items", [], |row| row.get(0))
        .unwrap_or(0);
    if max_rowid < state.item_cursor {
        state.item_cursor = max_rowid;
        state.threads_seen.clear();
        state.turns_seen.clear();
    }

    if let Ok(mut statement) = connection.prepare(
        "SELECT rowid, thread_id, turn_id, item_type, item_json \
         FROM thread_items WHERE rowid > ?1 ORDER BY rowid LIMIT ?2",
    ) {
        loop {
            let batch: Vec<WireItem> = statement
                .query_map(rusqlite::params![state.item_cursor, ITEM_BATCH], |row| {
                    Ok(WireItem {
                        rowid: row.get(0)?,
                        thread_id: row.get(1)?,
                        turn_id: row.get(2)?,
                        item_type: row.get(3)?,
                        item_json: row.get(4)?,
                    })
                })
                .map(|rows| rows.flatten().collect())
                .unwrap_or_default();
            if batch.is_empty() {
                break;
            }
            if let Some(last) = batch.last() {
                state.item_cursor = last.rowid;
            }
            let done = batch.len() < ITEM_BATCH as usize;
            let payload = WireDbUpdate { threads: Vec::new(), turns: Vec::new(), items: batch };
            let _ = app.emit("codex-app-db", payload);
            if done {
                break;
            }
        }
    }

    let mut payload = WireDbUpdate { threads: Vec::new(), turns: Vec::new(), items: Vec::new() };
    if let Some(state_path) = state_file {
        if let Ok(connection) = open_readonly(&state_path) {
            payload.threads = diff_threads(&connection, &mut state.threads_seen);
        }
    }
    payload.turns = diff_turns(&connection, &mut state.turns_seen);
    if !payload.threads.is_empty() || !payload.turns.is_empty() {
        let _ = app.emit("codex-app-db", payload);
    }
}

fn open_readonly(path: &Path) -> Result<Connection, rusqlite::Error> {
    let flags = OpenFlags::SQLITE_OPEN_READ_ONLY | OpenFlags::SQLITE_OPEN_NO_MUTEX;
    let connection = Connection::open_with_flags(path, flags)?;
    let _ = connection.busy_timeout(Duration::from_millis(500));
    Ok(connection)
}

fn latest_versioned_db(home: &Path, prefix: &str) -> Option<PathBuf> {
    let mut best: Option<(u64, u64, PathBuf)> = None;
    for entry in fs::read_dir(home).ok()?.flatten() {
        let path = entry.path();
        let name = entry.file_name().to_string_lossy().to_string();
        let Some(version) = parse_versioned_name(&name, prefix) else {
            continue;
        };
        let mtime = fs::metadata(&path)
            .ok()
            .and_then(|metadata| metadata.modified().ok())
            .and_then(|modified| modified.duration_since(UNIX_EPOCH).ok())
            .map(|duration| duration.as_millis() as u64)
            .unwrap_or(0);
        let better = best
            .as_ref()
            .map(|current| (current.0, current.1) < (version, mtime))
            .unwrap_or(true);
        if better {
            best = Some((version, mtime, path));
        }
    }
    best.map(|(_, _, path)| path)
}

fn parse_versioned_name(name: &str, prefix: &str) -> Option<u64> {
    let stem = name.strip_prefix(prefix)?.strip_suffix(".sqlite")?;
    stem.parse::<u64>().ok()
}

fn diff_threads(connection: &Connection, seen: &mut HashMap<String, i64>) -> Vec<JsonValue> {
    let Ok(mut statement) = connection.prepare(&select_columns("threads", THREAD_COLUMNS)) else {
        return Vec::new();
    };
    let column_names: Vec<String> = statement
        .column_names()
        .iter()
        .map(|name| (*name).to_string())
        .collect();
    let rows = statement
        .query_map([], |row| {
            let mut record = Map::new();
            for (index, name) in column_names.iter().enumerate() {
                let value: SqlValue = row.get(index)?;
                record.insert(name.clone(), sql_value_to_json(value));
            }
            Ok(record)
        })
        .map(|rows| rows.flatten().collect::<Vec<Map<_, _>>>())
        .unwrap_or_default();
    let mut changed = Vec::new();
    for record in rows {
        let id = record.get("id").and_then(JsonValue::as_str).unwrap_or_default().to_string();
        let updated = record.get("updated_at_ms").and_then(JsonValue::as_i64).unwrap_or(0);
        let changed_row = match seen.insert(id, updated) {
            Some(previous) => previous != updated,
            None => true,
        };
        if changed_row {
            changed.push(JsonValue::Object(record));
        }
    }
    changed
}

fn diff_turns(connection: &Connection, seen: &mut HashMap<(String, String), String>) -> Vec<WireTurn> {
    let Ok(mut statement) = connection.prepare(&select_columns("thread_turns", TURN_COLUMNS))
    else {
        return Vec::new();
    };
    let rows = statement
        .query_map([], |row| {
            Ok((
                row.get::<_, String>(0)?,
                row.get::<_, String>(1)?,
                row.get::<_, String>(2)?,
                row.get::<_, Option<String>>(3)?,
                row.get::<_, Option<String>>(4)?,
            ))
        })
        .map(|rows| rows.flatten().collect::<Vec<_>>())
        .unwrap_or_default();
    let mut changed = Vec::new();
    for (thread_id, turn_id, status, error_json, final_agent_item_id) in rows {
        let key = (thread_id.clone(), turn_id.clone());
        let changed_row = match seen.insert(key, status.clone()) {
            Some(previous) => previous != status,
            None => true,
        };
        if changed_row {
            changed.push(WireTurn { thread_id, turn_id, status, error_json, final_agent_item_id });
        }
    }
    changed
}

fn select_columns(table: &str, columns: &[&str]) -> String {
    format!("SELECT {} FROM {}", columns.join(", "), table)
}

fn sql_value_to_json(value: SqlValue) -> JsonValue {
    match value {
        SqlValue::Null => JsonValue::Null,
        SqlValue::Integer(number) => json!(number),
        SqlValue::Real(number) => json!(number),
        SqlValue::Text(text) => JsonValue::String(text),
        SqlValue::Blob(bytes) => JsonValue::String(String::from_utf8_lossy(&bytes).to_string()),
    }
}
