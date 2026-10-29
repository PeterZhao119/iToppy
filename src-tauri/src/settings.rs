use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::fs;
use std::path::{Path, PathBuf};

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PetPosition {
    pub x: f64,
    pub y: f64,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", default)]
pub struct AgentSettings {
    pub enabled: bool,
    pub character_id_override: Option<String>,
    pub walk_enabled_override: Option<bool>,
    pub walk_speed_override: Option<String>,
    pub result_bubble_enabled_override: Option<bool>,
    pub always_on_top_override: Option<bool>,
}

impl Default for AgentSettings {
    fn default() -> Self {
        Self {
            enabled: true,
            character_id_override: None,
            walk_enabled_override: None,
            walk_speed_override: None,
            result_bubble_enabled_override: None,
            always_on_top_override: None,
        }
    }
}

#[derive(Clone, Debug, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", default)]
pub struct InstancePreferences {
    pub character_id_override: Option<String>,
    pub walk_enabled_override: Option<bool>,
    pub walk_speed_override: Option<String>,
    pub result_bubble_enabled_override: Option<bool>,
    pub always_on_top_override: Option<bool>,
    pub visible: Option<bool>,
    pub monitoring_enabled: Option<bool>,
    pub position: Option<PetPosition>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ManualInstance {
    pub agent_type: String,
    pub workspace_path: String,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", default)]
pub struct AppSettings {
    pub version: u32,
    pub visible_limit: usize,
    pub default_character_id: String,
    pub walk_enabled: bool,
    pub walk_speed: String,
    pub result_bubble_enabled: bool,
    pub always_on_top: bool,
    pub auto_show_new_tasks: bool,
    pub agents: HashMap<String, AgentSettings>,
    pub instances: HashMap<String, InstancePreferences>,
    pub manual_instances: Vec<ManualInstance>,
}

impl Default for AppSettings {
    fn default() -> Self {
        let mut agents = HashMap::new();
        agents.insert("kimi-code".to_string(), AgentSettings::default());
        agents.insert(
            "codex".to_string(),
            AgentSettings {
                character_id_override: Some("gpt".to_string()),
                ..AgentSettings::default()
            },
        );
        Self {
            version: 1,
            visible_limit: 5,
            default_character_id: "deepseek".to_string(),
            walk_enabled: true,
            walk_speed: "standard".to_string(),
            result_bubble_enabled: true,
            always_on_top: true,
            auto_show_new_tasks: true,
            agents,
            instances: HashMap::new(),
            manual_instances: Vec::new(),
        }
    }
}

impl AppSettings {
    pub fn normalize(&mut self) {
        self.version = 1;
        self.visible_limit = self.visible_limit.clamp(1, 50);
        if !matches!(self.walk_speed.as_str(), "slow" | "standard" | "fast") {
            self.walk_speed = "standard".to_string();
        }
        if !matches!(self.default_character_id.as_str(), "deepseek" | "claude" | "gpt") {
            self.default_character_id = "deepseek".to_string();
        }
    }
}

#[derive(Clone, Debug, Default, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AppSettingsPatch {
    pub visible_limit: Option<usize>,
    pub default_character_id: Option<String>,
    pub walk_enabled: Option<bool>,
    pub walk_speed: Option<String>,
    pub result_bubble_enabled: Option<bool>,
    pub always_on_top: Option<bool>,
    pub auto_show_new_tasks: Option<bool>,
    pub agents: Option<HashMap<String, AgentSettings>>,
}

pub fn load(path: &Path) -> Result<AppSettings, String> {
    if !path.exists() {
        return Ok(AppSettings::default());
    }
    let content = fs::read_to_string(path).map_err(|error| error.to_string())?;
    let mut settings: AppSettings = serde_json::from_str(&content).map_err(|error| {
        format!("Unable to parse settings '{}': {error}", path.display())
    })?;
    settings.normalize();
    Ok(settings)
}

pub fn save(path: &Path, settings: &AppSettings) -> Result<(), String> {
    let parent = path
        .parent()
        .ok_or_else(|| "Settings path has no parent directory.".to_string())?;
    fs::create_dir_all(parent).map_err(|error| error.to_string())?;
    let content = serde_json::to_string_pretty(settings).map_err(|error| error.to_string())?;
    let temporary = temporary_path(path);
    fs::write(&temporary, content).map_err(|error| error.to_string())?;
    fs::rename(&temporary, path).map_err(|error| error.to_string())
}

fn temporary_path(path: &Path) -> PathBuf {
    let mut name = path
        .file_name()
        .unwrap_or_default()
        .to_os_string();
    name.push(".tmp");
    path.with_file_name(name)
}
