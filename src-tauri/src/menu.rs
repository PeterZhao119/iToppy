use crate::settings::{self, InstancePreferences};
use crate::NativeState;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use tauri::menu::{
    CheckMenuItem, Menu, MenuItem, MenuItemKind, PredefinedMenuItem, Submenu, SubmenuBuilder,
};
use tauri::tray::TrayIconBuilder;
use tauri::{
    AppHandle, Emitter, Manager, Runtime, WebviewUrl, WebviewWindow, WebviewWindowBuilder,
};

pub const TRAY_ID: &str = "itoppy-tray";

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct NavigationTarget {
    pub app_bundle_id: String,
    pub workspace_path: Option<String>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SourceInstance {
    pub agent_type: String,
    pub instance_id: String,
    pub display_name: String,
    pub navigation: NavigationTarget,
    pub data_sources: Vec<serde_json::Value>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct InstanceSettings {
    pub character_id: String,
    pub walk_enabled: bool,
    pub walk_speed: String,
    pub result_bubble_enabled: bool,
    pub always_on_top: bool,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct NativeInstanceState {
    pub instance: SourceInstance,
    pub primary_state: Option<String>,
    pub has_result: bool,
    pub running_count: usize,
    pub session_count: usize,
    pub visible: bool,
    pub monitoring_enabled: bool,
    pub display_status: String,
    pub settings: InstanceSettings,
    pub monitor_health: Option<String>,
    pub monitor_message: Option<String>,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct NativeRuntimeState {
    pub instances: Vec<NativeInstanceState>,
    pub pending_count: usize,
    pub monitor_error: Option<String>,
    pub settings_path: String,
}

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
struct InstanceAction<'a> {
    instance_id: &'a str,
    action: &'a str,
}

pub fn setup_tray(app: &AppHandle) -> Result<(), String> {
    let menu = build_tray_menu(app).map_err(|error| error.to_string())?;
    let icon = tauri::image::Image::from_bytes(include_bytes!("../icons/trayTemplate.png"))
        .map_err(|error| error.to_string())?;
    TrayIconBuilder::with_id(TRAY_ID)
        .icon(icon)
        .icon_as_template(true)
        .tooltip("iToppy")
        .menu(&menu)
        .show_menu_on_left_click(true)
        .build(app)
        .map_err(|error| error.to_string())?;
    Ok(())
}

pub fn rebuild_tray(app: &AppHandle) -> Result<(), String> {
    let Some(tray) = app.tray_by_id(TRAY_ID) else {
        return Ok(());
    };
    let menu = build_tray_menu(app).map_err(|error| error.to_string())?;
    tray.set_menu(Some(menu)).map_err(|error| error.to_string())
}

fn build_tray_menu(app: &AppHandle) -> tauri::Result<Menu<tauri::Wry>> {
    let menu = Menu::new(app)?;
    menu.append(&MenuItem::with_id(
        app,
        "open-control-panel",
        "打开控制面板…",
        true,
        None::<&str>,
    )?)?;
    menu.append(&PredefinedMenuItem::separator(app)?)?;

    let states = active_states(app);
    if states.is_empty() {
        menu.append(&MenuItem::with_id(
            app,
            "no-active-instances",
            "等待新的 Kimi Code 任务",
            false,
            None::<&str>,
        )?)?;
    }
    for state in states.iter().filter(|state| state.visible) {
        let submenu = Submenu::new(app, &state.instance.display_name, true)?;
        for item in instance_items(app, state, false)? {
            submenu.append(&item)?;
        }
        menu.append(&submenu)?;
    }

    let overflow: Vec<_> = states
        .iter()
        .filter(|state| state.display_status == "overflow")
        .collect();
    if !overflow.is_empty() {
        let submenu = Submenu::new(app, "其他活跃实例", true)?;
        for state in overflow {
            submenu.append(&MenuItem::with_id(
                app,
                action_id("enable", &state.instance.instance_id),
                &state.instance.display_name,
                true,
                None::<&str>,
            )?)?;
        }
        menu.append(&submenu)?;
    }

    menu.append(&PredefinedMenuItem::separator(app)?)?;
    menu.append(&MenuItem::with_id(
        app,
        "quit-itoppy",
        "退出 iToppy",
        true,
        None::<&str>,
    )?)?;
    Ok(menu)
}

fn active_states(app: &AppHandle) -> Vec<NativeInstanceState> {
    let state = app.state::<NativeState>();
    let guard = state.lock().unwrap_or_else(|error| error.into_inner());
    let mut states: Vec<_> = guard
        .instances
        .values()
        .filter(|instance| {
            instance.visible || instance.display_status == "overflow"
        })
        .cloned()
        .collect();
    states.sort_by(|a, b| a.instance.display_name.cmp(&b.instance.display_name));
    states
}

#[tauri::command]
pub fn show_pet_context_menu(
    window: WebviewWindow,
    instance_id: String,
) -> Result<(), String> {
    let app = window.app_handle();
    let state = app.state::<NativeState>();
    let snapshot = {
        let guard = state.lock().unwrap_or_else(|error| error.into_inner());
        guard.instances.get(&instance_id).cloned()
    }
    .ok_or_else(|| "Instance is not available.".to_string())?;
    let menu = Menu::new(app).map_err(|error| error.to_string())?;
    for item in instance_items(&app, &snapshot, true).map_err(|error| error.to_string())? {
        menu.append(&item).map_err(|error| error.to_string())?;
    }
    window.popup_menu(&menu).map_err(|error| error.to_string())
}

fn instance_items<R: Runtime>(
    app: &AppHandle<R>,
    state: &NativeInstanceState,
    include_global: bool,
) -> tauri::Result<Vec<MenuItemKind<R>>> {
    let id = &state.instance.instance_id;
    let title = match state.primary_state.as_deref() {
        Some("running") => format!("{} · 运行中", state.instance.display_name),
        Some("succeeded") | Some("succeeded_idle") => {
            format!("{} · 执行完毕", state.instance.display_name)
        }
        Some("failed") | Some("failed_idle") => {
            format!("{} · 执行失败", state.instance.display_name)
        }
        _ => state.instance.display_name.clone(),
    };
    let mut items = vec![
        MenuItemKind::MenuItem(MenuItem::with_id(
            app,
            action_id("title", id),
            title,
            false,
            None::<&str>,
        )?),
        MenuItemKind::MenuItem(MenuItem::with_id(
            app,
            action_id("open-latest", id),
            "打开最新响应并跳转",
            state.has_result,
            None::<&str>,
        )?),
        MenuItemKind::Predefined(PredefinedMenuItem::separator(app)?),
    ];

    let character = SubmenuBuilder::new(app, "切换形象").build()?;
    for (character_id, label) in [("deepseek", "DeepSeek"), ("claude", "Claude"), ("gpt", "GPT 娘")] {
        character.append(&CheckMenuItem::with_id(
            app,
            action_id(&format!("character-{character_id}"), id),
            label,
            true,
            state.settings.character_id == character_id,
            None::<&str>,
        )?)?;
    }
    items.push(MenuItemKind::Submenu(character));
    items.push(MenuItemKind::Check(CheckMenuItem::with_id(
        app,
        action_id("toggle-bubble", id),
        "结果气泡",
        true,
        state.settings.result_bubble_enabled,
        None::<&str>,
    )?));

    let walk = Submenu::new(app, "游走设置", true)?;
    walk.append(&CheckMenuItem::with_id(
        app,
        action_id("toggle-walk", id),
        "启用游走",
        true,
        state.settings.walk_enabled,
        None::<&str>,
    )?)?;
    walk.append(&PredefinedMenuItem::separator(app)?)?;
    for (speed, label) in [("slow", "慢速"), ("standard", "标准"), ("fast", "快速")] {
        walk.append(&CheckMenuItem::with_id(
            app,
            action_id(&format!("walk-speed-{speed}"), id),
            label,
            true,
            state.settings.walk_speed == speed,
            None::<&str>,
        )?)?;
    }
    items.push(MenuItemKind::Submenu(walk));
    items.push(MenuItemKind::Check(CheckMenuItem::with_id(
        app,
        action_id("toggle-top", id),
        "始终置顶",
        true,
        state.settings.always_on_top,
        None::<&str>,
    )?));
    items.push(MenuItemKind::MenuItem(MenuItem::with_id(
        app,
        action_id("hide", id),
        "隐藏并暂停监控",
        true,
        None::<&str>,
    )?));

    if include_global {
        items.push(MenuItemKind::Predefined(PredefinedMenuItem::separator(app)?));
        items.push(MenuItemKind::MenuItem(MenuItem::with_id(
            app,
            "open-control-panel",
            "打开控制面板…",
            true,
            None::<&str>,
        )?));
        items.push(MenuItemKind::MenuItem(MenuItem::with_id(
            app,
            "quit-itoppy",
            "退出 iToppy",
            true,
            None::<&str>,
        )?));
    }
    Ok(items)
}

pub fn emit_instance_action(app: &AppHandle, instance_id: &str, action: &str) -> Result<(), String> {
    app.emit("instance-action", InstanceAction { instance_id, action })
        .map_err(|error| error.to_string())
}

pub fn handle_menu_event(app: &AppHandle, event: tauri::menu::MenuEvent) {
    let id = event.id().0.as_str();
    match id {
        "open-control-panel" => {
            let _ = open_control_panel(app.clone());
        }
        "quit-itoppy" => app.exit(0),
        _ => {
            let Some((action, instance_id)) = id.split_once('|') else {
                return;
            };
            if action == "open-latest" {
                let _ = app.emit(
                    "instance-action",
                    InstanceAction {
                        instance_id,
                        action: "open-latest",
                    },
                );
                return;
            }
            mutate_instance(app, instance_id, |preferences, snapshot| match action {
                "hide" => {
                    preferences.visible = Some(false);
                    preferences.monitoring_enabled = Some(false);
                }
                "enable" => {
                    preferences.visible = Some(true);
                    preferences.monitoring_enabled = Some(true);
                }
                "toggle-bubble" => {
                    preferences.result_bubble_enabled_override =
                        Some(!snapshot.settings.result_bubble_enabled);
                }
                "toggle-walk" => {
                    preferences.walk_enabled_override = Some(!snapshot.settings.walk_enabled);
                }
                "toggle-top" => {
                    preferences.always_on_top_override = Some(!snapshot.settings.always_on_top);
                }
                "walk-speed-slow" => preferences.walk_speed_override = Some("slow".to_string()),
                "walk-speed-standard" => {
                    preferences.walk_speed_override = Some("standard".to_string())
                }
                "walk-speed-fast" => preferences.walk_speed_override = Some("fast".to_string()),
                "character-deepseek" => {
                    preferences.character_id_override = Some("deepseek".to_string())
                }
                "character-claude" => {
                    preferences.character_id_override = Some("claude".to_string())
                }
                "character-gpt" => {
                    preferences.character_id_override = Some("gpt".to_string())
                }
                _ => {}
            });
        }
    }
}

fn mutate_instance(
    app: &AppHandle,
    instance_id: &str,
    update: impl FnOnce(&mut InstancePreferences, &NativeInstanceState),
) {
    let state = app.state::<NativeState>();
    let (settings, path) = {
        let mut guard = state.lock().unwrap_or_else(|error| error.into_inner());
        let Some(snapshot) = guard.instances.get(instance_id).cloned() else {
            return;
        };
        let preferences = guard.settings.instances.entry(instance_id.to_string()).or_default();
        update(preferences, &snapshot);
        (guard.settings.clone(), guard.settings_path.clone())
    };
    if let Err(error) = settings::save(&path, &settings) {
        let _ = app.emit("kimi-monitor-error", error);
        return;
    }
    let _ = app.emit("settings-changed", &settings);
    let _ = rebuild_tray(app);
}

fn action_id(action: &str, instance_id: &str) -> String {
    format!("{action}|{instance_id}")
}

#[tauri::command]
pub fn open_control_panel(app: AppHandle) -> Result<(), String> {
    std::process::Command::new("open")
        .arg("-b")
        .arg("com.peterzhao.itoppy")
        .spawn()
        .map_err(|error| error.to_string())?;
    if let Some(window) = app.get_webview_window("control-panel") {
        window.show().map_err(|error| error.to_string())?;
        window.unminimize().map_err(|error| error.to_string())?;
        window.set_focus().map_err(|error| error.to_string())?;
        return Ok(());
    }
    let window = WebviewWindowBuilder::new(
        &app,
        "control-panel",
        WebviewUrl::App("control-panel.html".into()),
    )
    .title("iToppy 控制面板")
    .inner_size(900.0, 720.0)
    .min_inner_size(720.0, 560.0)
    .resizable(true)
    .always_on_top(false)
    .visible(true)
    .build()
    .map_err(|error| error.to_string())?;
    window.set_focus().map_err(|error| error.to_string())?;
    Ok(())
}

pub fn runtime_state(state: &NativeState) -> NativeRuntimeState {
    let guard = state.lock().unwrap_or_else(|error| error.into_inner());
    let mut instances: Vec<_> = guard.instances.values().cloned().collect();
    instances.sort_by(|a, b| a.instance.display_name.cmp(&b.instance.display_name));
    NativeRuntimeState {
        instances,
        pending_count: guard.pending_count,
        monitor_error: guard.monitor_error.clone(),
        settings_path: guard.settings_path.to_string_lossy().to_string(),
    }
}

pub fn replace_instances(
    state: &NativeState,
    instances: Vec<NativeInstanceState>,
    pending_count: usize,
    monitor_error: Option<String>,
) {
    let mut guard = state.lock().unwrap_or_else(|error| error.into_inner());
    guard.instances = instances
        .into_iter()
        .map(|instance| (instance.instance.instance_id.clone(), instance))
        .collect::<HashMap<_, _>>();
    guard.pending_count = pending_count;
    guard.monitor_error = monitor_error;
}
