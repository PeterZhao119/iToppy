mod menu;
mod settings;
mod watcher;

use menu::NativeInstanceState;
use serde::Serialize;
use settings::{AppSettings, AppSettingsPatch, InstancePreferences, ManualInstance, PetPosition};
use std::collections::HashMap;
use std::io::Read;
use std::path::PathBuf;
use std::process::Command;
use std::sync::Mutex;
use tauri::{AppHandle, Emitter, Manager, State, WebviewWindow};

pub struct NativeState {
    inner: Mutex<NativeStateData>,
}

struct NativeStateData {
    settings: AppSettings,
    settings_path: PathBuf,
    instances: HashMap<String, NativeInstanceState>,
    pending_count: usize,
    monitor_error: Option<String>,
}

impl NativeState {
    fn lock(&self) -> std::sync::LockResult<std::sync::MutexGuard<'_, NativeStateData>> {
        self.inner.lock()
    }
}

impl Default for NativeState {
    fn default() -> Self {
        Self {
            inner: Mutex::new(NativeStateData {
                settings: AppSettings::default(),
                settings_path: PathBuf::new(),
                instances: HashMap::new(),
                pending_count: 0,
                monitor_error: None,
            }),
        }
    }
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct DirectoryEntry {
    name: String,
    path: String,
    is_directory: bool,
}

#[tauri::command]
fn get_home_directory() -> Result<String, String> {
    dirs::home_dir()
        .map(|path| path.to_string_lossy().to_string())
        .ok_or_else(|| "Unable to resolve the home directory.".to_string())
}

#[tauri::command]
fn get_kimi_home() -> Result<String, String> {
    watcher::kimi_home().map(|path| path.to_string_lossy().to_string())
}

#[tauri::command]
fn get_codex_home() -> Result<String, String> {
    watcher::codex_home().map(|path| path.to_string_lossy().to_string())
}

#[tauri::command]
fn get_claude_home() -> Result<String, String> {
    watcher::claude_home().map(|path| path.to_string_lossy().to_string())
}

#[tauri::command]
fn path_exists(path: String) -> bool {
    std::path::Path::new(&path).exists()
}

#[tauri::command]
fn read_text_file(path: String, max_bytes: Option<usize>) -> Result<String, String> {
    let Some(max_bytes) = max_bytes else {
        return std::fs::read_to_string(path).map_err(|error| error.to_string());
    };
    let file = std::fs::File::open(path).map_err(|error| error.to_string())?;
    let mut bytes = Vec::new();
    file.take(max_bytes as u64)
        .read_to_end(&mut bytes)
        .map_err(|error| error.to_string())?;
    Ok(String::from_utf8_lossy(&bytes).to_string())
}

#[tauri::command]
fn read_directory(path: String) -> Result<Vec<DirectoryEntry>, String> {
    let entries = std::fs::read_dir(path).map_err(|error| error.to_string())?;
    let mut results = Vec::new();
    for entry in entries {
        let entry = entry.map_err(|error| error.to_string())?;
        let path = entry.path();
        results.push(DirectoryEntry {
            name: entry.file_name().to_string_lossy().to_string(),
            path: path.to_string_lossy().to_string(),
            is_directory: path.is_dir(),
        });
    }
    Ok(results)
}

#[tauri::command]
fn read_kimi_index() -> Result<String, String> {
    let path = watcher::kimi_home()?.join("session_index.jsonl");
    match std::fs::read_to_string(path) {
        Ok(content) => Ok(content),
        Err(error) if error.kind() == std::io::ErrorKind::NotFound => Ok(String::new()),
        Err(error) => Err(error.to_string()),
    }
}

#[tauri::command]
fn open_target(target: String) -> Result<(), String> {
    if !target.starts_with("vscode://") {
        return Err("Only VS Code targets are supported.".to_string());
    }
    Command::new("open")
        .arg(target)
        .spawn()
        .map(|_| ())
        .map_err(|error| error.to_string())
}

#[tauri::command]
fn open_navigation(navigation: menu::NavigationTarget) -> Result<(), String> {
    let mut command = Command::new("open");
    command.arg("-b").arg(navigation.app_bundle_id);
    if let Some(workspace_path) = navigation.workspace_path {
        command.arg(workspace_path);
    }
    command
        .spawn()
        .map(|_| ())
        .map_err(|error| error.to_string())
}

#[tauri::command]
fn open_external(url: String) -> Result<(), String> {
    if !url.starts_with("https://github.com/") {
        return Err("Only HTTPS GitHub links are supported.".to_string());
    }
    Command::new("open")
        .arg(url)
        .spawn()
        .map(|_| ())
        .map_err(|error| error.to_string())
}

#[tauri::command]
fn get_settings(state: State<'_, NativeState>) -> AppSettings {
    state
        .lock()
        .unwrap_or_else(|error| error.into_inner())
        .settings
        .clone()
}

#[tauri::command]
fn get_native_state(state: State<'_, NativeState>) -> menu::NativeRuntimeState {
    menu::runtime_state(&state)
}

#[tauri::command]
fn update_app_settings(
    app: AppHandle,
    state: State<'_, NativeState>,
    patch: AppSettingsPatch,
) -> Result<AppSettings, String> {
    let (settings, path) = {
        let mut guard = state.lock().unwrap_or_else(|error| error.into_inner());
        let settings = &mut guard.settings;
        if let Some(value) = patch.visible_limit {
            settings.visible_limit = value;
        }
        if let Some(value) = patch.default_character_id {
            settings.default_character_id = value;
        }
        if let Some(value) = patch.walk_enabled {
            settings.walk_enabled = value;
        }
        if let Some(value) = patch.walk_speed {
            settings.walk_speed = value;
        }
        if let Some(value) = patch.result_bubble_enabled {
            settings.result_bubble_enabled = value;
        }
        if let Some(value) = patch.always_on_top {
            settings.always_on_top = value;
        }
        if let Some(value) = patch.auto_show_new_tasks {
            settings.auto_show_new_tasks = value;
        }
        if let Some(value) = patch.agents {
            settings.agents = value;
        }
        settings.normalize();
        (settings.clone(), guard.settings_path.clone())
    };
    settings::save(&path, &settings)?;
    let _ = app.emit("settings-changed", &settings);
    let _ = menu::rebuild_tray(&app);
    Ok(settings)
}

#[tauri::command]
fn update_instance_settings(
    app: AppHandle,
    state: State<'_, NativeState>,
    instance_id: String,
    preferences: InstancePreferences,
) -> Result<AppSettings, String> {
    let (settings, path) = {
        let mut guard = state.lock().unwrap_or_else(|error| error.into_inner());
        guard.settings.instances.insert(instance_id, preferences);
        (guard.settings.clone(), guard.settings_path.clone())
    };
    settings::save(&path, &settings)?;
    let _ = app.emit("settings-changed", &settings);
    let _ = menu::rebuild_tray(&app);
    Ok(settings)
}

#[tauri::command]
fn add_manual_instance(
    app: AppHandle,
    state: State<'_, NativeState>,
    agent_type: String,
    workspace_path: String,
) -> Result<AppSettings, String> {
    if !matches!(agent_type.as_str(), "kimi-code" | "codex" | "claude-code") {
        return Err("Only Kimi Code, Codex and Claude Code are supported in this version.".to_string());
    }
    let path = std::path::Path::new(&workspace_path);
    if !path.is_dir() {
        return Err("目标目录不存在或不是目录。".to_string());
    }
    let canonical = std::fs::canonicalize(path).map_err(|error| error.to_string())?;
    std::fs::read_dir(&canonical).map_err(|error| format!("目录不可读：{error}"))?;
    let workspace_path = canonical.to_string_lossy().to_string();
    let (settings, settings_path) = {
        let mut guard = state.lock().unwrap_or_else(|error| error.into_inner());
        if !guard.settings.manual_instances.iter().any(|instance| {
            instance.agent_type == agent_type && instance.workspace_path == workspace_path
        }) {
            guard.settings.manual_instances.push(ManualInstance {
                agent_type,
                workspace_path,
            });
        }
        (guard.settings.clone(), guard.settings_path.clone())
    };
    settings::save(&settings_path, &settings)?;
    let _ = app.emit("settings-changed", &settings);
    Ok(settings)
}

#[tauri::command]
fn update_native_state(
    app: AppHandle,
    state: State<'_, NativeState>,
    instances: Vec<NativeInstanceState>,
    pending_count: usize,
    monitor_error: Option<String>,
) -> Result<(), String> {
    menu::replace_instances(&state, instances, pending_count, monitor_error);
    menu::rebuild_tray(&app)
}

#[tauri::command]
fn request_instance_action(
    app: AppHandle,
    instance_id: String,
    action: String,
) -> Result<(), String> {
    if action != "open-latest" {
        return Err("Unsupported instance action.".to_string());
    }
    menu::emit_instance_action(&app, &instance_id, &action)
}

#[tauri::command]
fn request_rescan(app: AppHandle) -> Result<(), String> {
    app.emit("request-rescan", ()).map_err(|error| error.to_string())
}

#[tauri::command]
fn save_pet_position(
    app: AppHandle,
    state: State<'_, NativeState>,
    instance_id: String,
    x: f64,
    y: f64,
) -> Result<(), String> {
    let (settings, path) = {
        let mut guard = state.lock().unwrap_or_else(|error| error.into_inner());
        let preferences = guard.settings.instances.entry(instance_id).or_default();
        preferences.position = Some(PetPosition { x, y });
        (guard.settings.clone(), guard.settings_path.clone())
    };
    settings::save(&path, &settings)?;
    let _ = app.emit("settings-changed", &settings);
    Ok(())
}

#[tauri::command]
fn get_pet_position(window: WebviewWindow) -> Result<(f64, f64), String> {
    window
        .outer_position()
        .map(|position| (position.x as f64, position.y as f64))
        .map_err(|error| error.to_string())
}

#[tauri::command]
fn get_scale_factor(window: WebviewWindow) -> Result<f64, String> {
    window.scale_factor().map_err(|error| error.to_string())
}

#[tauri::command]
fn get_pet_bounds(window: WebviewWindow) -> Result<(f64, f64, f64, f64), String> {
    let monitor = window
        .current_monitor()
        .map_err(|error| error.to_string())?
        .ok_or_else(|| "Unable to resolve the current monitor.".to_string())?;
    let area = monitor.work_area();
    Ok((
        area.position.x as f64,
        area.position.y as f64,
        area.size.width as f64,
        area.size.height as f64,
    ))
}

#[tauri::command]
fn set_pet_position(window: WebviewWindow, x: f64, y: f64) -> Result<(), String> {
    window
        .set_position(tauri::PhysicalPosition::new(x, y))
        .map_err(|error| error.to_string())
}

#[tauri::command]
fn set_pet_always_on_top(window: WebviewWindow, always_on_top: bool) -> Result<(), String> {
    window
        .set_always_on_top(always_on_top)
        .map_err(|error| error.to_string())
}

#[tauri::command]
fn close_pet_window(app: AppHandle, label: String) -> Result<(), String> {
    if let Some(window) = app.get_webview_window(&label) {
        window.close().map_err(|error| error.to_string())?;
    }
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .manage(NativeState::default())
        .invoke_handler(tauri::generate_handler![
            get_home_directory,
            get_kimi_home,
            get_codex_home,
            get_claude_home,
            path_exists,
            read_text_file,
            read_directory,
            read_kimi_index,
            open_target,
            open_navigation,
            open_external,
            get_settings,
            get_native_state,
            update_app_settings,
            update_instance_settings,
            add_manual_instance,
            update_native_state,
            request_instance_action,
            request_rescan,
            save_pet_position,
            get_pet_position,
            get_scale_factor,
            get_pet_bounds,
            set_pet_position,
            set_pet_always_on_top,
            close_pet_window,
            menu::show_pet_context_menu,
            menu::open_control_panel
        ])
        .on_menu_event(|app, event| menu::handle_menu_event(app, event))
        .setup(|app| {
            #[cfg(target_os = "macos")]
            app.set_activation_policy(tauri::ActivationPolicy::Accessory);

            let settings_path = app
                .path()
                .app_data_dir()
                .map_err(|error| error.to_string())?
                .join("settings.json");
            let (settings, load_error) = match settings::load(&settings_path) {
                Ok(settings) => (settings, None),
                Err(error) => (AppSettings::default(), Some(error)),
            };
            if !settings_path.exists() {
                let _ = settings::save(&settings_path, &settings);
            }
            {
                let state = app.state::<NativeState>();
                let mut guard = state.lock().unwrap_or_else(|error| error.into_inner());
                guard.settings = settings;
                guard.settings_path = settings_path;
                guard.monitor_error = load_error;
            }

            menu::setup_tray(&app.handle().clone())?;
            let handle = app.handle().clone();
            if let Err(error) = watcher::start(handle.clone()) {
                let _ = handle.emit("kimi-monitor-error", error);
            }
            if let Err(error) = watcher::start_codex(handle.clone()) {
                let _ = handle.emit("codex-monitor-error", error);
            }
            if let Err(error) = watcher::start_claude(handle.clone()) {
                let _ = handle.emit("claude-monitor-error", error);
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running iToppy");
}
