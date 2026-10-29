use notify::{Config, Event, RecommendedWatcher, RecursiveMode, Watcher};
use serde::Serialize;
use std::collections::HashMap;
use std::fs::{self, File};
use std::io::{Read, Seek, SeekFrom};
use std::path::{Path, PathBuf};
use std::sync::mpsc;
use std::thread;
use std::time::{Duration, Instant};
use tauri::{AppHandle, Emitter};

#[derive(Clone, Serialize)]
struct WireAppend {
    path: String,
    content: String,
}

#[derive(Default)]
struct Cursor {
    offset: u64,
    remainder: String,
}

pub fn kimi_home() -> Result<PathBuf, String> {
    if let Some(path) = std::env::var_os("KIMI_CODE_HOME") {
        if !path.is_empty() {
            return Ok(PathBuf::from(path));
        }
    }
    dirs::home_dir()
        .map(|home| home.join(".kimi-code"))
        .ok_or_else(|| "Unable to resolve the home directory.".to_string())
}

pub fn codex_home() -> Result<PathBuf, String> {
    if let Some(path) = std::env::var_os("CODEX_HOME") {
        if !path.is_empty() {
            return Ok(PathBuf::from(path));
        }
    }
    dirs::home_dir()
        .map(|home| home.join(".codex"))
        .ok_or_else(|| "Unable to resolve the home directory.".to_string())
}

#[derive(Clone, Copy)]
enum MonitorKind {
    Kimi,
    Codex,
}

pub fn start(app: AppHandle) -> Result<(), String> {
    start_monitor(app, MonitorKind::Kimi)
}

pub fn start_codex(app: AppHandle) -> Result<(), String> {
    start_monitor(app, MonitorKind::Codex)
}

fn start_monitor(app: AppHandle, kind: MonitorKind) -> Result<(), String> {
    let sessions = match kind {
        MonitorKind::Kimi => kimi_home()?.join("sessions"),
        MonitorKind::Codex => codex_home()?.join("sessions"),
    };
    if !sessions.is_dir() {
        return Err(format!("Agent sessions directory does not exist: {}", sessions.display()));
    }
    let (append_event, error_event) = match kind {
        MonitorKind::Kimi => ("kimi-wire", "kimi-monitor-error"),
        MonitorKind::Codex => ("codex-rollout", "codex-monitor-error"),
    };

    let mut cursors = HashMap::new();
    for path in scan_log_files(&sessions, 0, kind) {
        if let Ok(metadata) = fs::metadata(&path) {
            cursors.insert(path, Cursor { offset: metadata.len(), remainder: String::new() });
        }
    }

    let (tx, rx) = mpsc::channel::<notify::Result<Event>>();
    let mut watcher = RecommendedWatcher::new(
        move |event| {
            let _ = tx.send(event);
        },
        Config::default(),
    )
    .map_err(|error| error.to_string())?;
    watcher
        .watch(&sessions, RecursiveMode::Recursive)
        .map_err(|error| error.to_string())?;

    thread::spawn(move || {
        let mut pending: HashMap<PathBuf, Instant> = HashMap::new();
        loop {
            match rx.recv_timeout(Duration::from_millis(50)) {
                Ok(Ok(event)) => {
                    for path in event.paths {
                        if is_monitored_file(&path, kind) {
                            pending.insert(path, Instant::now());
                        }
                    }
                }
                Ok(Err(error)) => {
                    let _ = app.emit(error_event, error.to_string());
                }
                Err(mpsc::RecvTimeoutError::Timeout) => {}
                Err(mpsc::RecvTimeoutError::Disconnected) => break,
            }

            let now = Instant::now();
            let due: Vec<PathBuf> = pending
                .iter()
                .filter(|(_, changed_at)| now.duration_since(**changed_at) >= Duration::from_millis(120))
                .map(|(path, _)| path.clone())
                .collect();
            for path in due {
                pending.remove(&path);
                if let Err(error) = read_appended(&app, &path, &mut cursors, append_event) {
                    let _ = app.emit(error_event, error);
                }
            }
        }
        drop(watcher);
    });

    Ok(())
}

fn read_appended(
    app: &AppHandle,
    path: &Path,
    cursors: &mut HashMap<PathBuf, Cursor>,
    event_name: &str,
) -> Result<(), String> {
    let length = fs::metadata(path)
        .map_err(|error| error.to_string())?
        .len();
    let cursor = cursors.entry(path.to_path_buf()).or_default();
    if length < cursor.offset {
        *cursor = Cursor::default();
    }
    if length == cursor.offset {
        return Ok(());
    }

    let mut file = File::open(path).map_err(|error| error.to_string())?;
    file.seek(SeekFrom::Start(cursor.offset))
        .map_err(|error| error.to_string())?;
    let mut bytes = Vec::new();
    file.take(length - cursor.offset)
        .read_to_end(&mut bytes)
        .map_err(|error| error.to_string())?;
    cursor.offset = length;

    let combined = format!("{}{}", cursor.remainder, String::from_utf8_lossy(&bytes));
    let mut parts = combined.split('\n').collect::<Vec<_>>();
    cursor.remainder = parts.pop().unwrap_or_default().to_string();
    let content = parts.join("\n");
    if content.trim().is_empty() {
        return Ok(());
    }

    app.emit(
        event_name,
        WireAppend {
            path: path.to_string_lossy().to_string(),
            content,
        },
    )
    .map_err(|error| error.to_string())
}

fn scan_log_files(root: &Path, depth: usize, kind: MonitorKind) -> Vec<PathBuf> {
    if depth > 6 {
        return Vec::new();
    }
    let mut results = Vec::new();
    let Ok(entries) = fs::read_dir(root) else {
        return results;
    };
    for entry in entries.flatten() {
        let path = entry.path();
        if path.is_dir() {
            results.extend(scan_log_files(&path, depth + 1, kind));
        } else if is_monitored_file(&path, kind) {
            results.push(path);
        }
    }
    results
}

fn is_monitored_file(path: &Path, kind: MonitorKind) -> bool {
    let Some(name) = path.file_name().and_then(|name| name.to_str()) else {
        return false;
    };
    match kind {
        MonitorKind::Kimi => name == "wire.jsonl",
        MonitorKind::Codex => name.starts_with("rollout-") && name.ends_with(".jsonl"),
    }
}
