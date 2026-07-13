use crate::utils::directory::{create_folder, get_from_file, get_launcher_dir};
use serde::{Deserialize, Serialize};
use std::path::PathBuf;
use tauri::{AppHandle, Manager};
use tokio::fs::{create_dir_all, File};
use tokio::io::AsyncWriteExt;
use uuid::Uuid;

#[derive(Serialize, Deserialize, Debug, Default, Clone, PartialEq, Eq)]
pub enum AccountType {
    #[default]
    Offline,
    Online,
}

#[derive(Serialize, Deserialize, Debug, Default, Clone, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct Account {
    #[serde(rename = "uuid")]
    pub id: String,
    #[serde(rename = "nickname")]
    pub name: String,
    #[serde(rename = "type")]
    pub account_type: AccountType,
    #[serde(default)]
    pub integrations: Vec<String>,
}

#[derive(Serialize, Deserialize, Debug, Default, Clone, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct LowAccount {
    #[serde(rename = "nickname")]
    pub name: String,
    #[serde(rename = "type")]
    pub account_type: AccountType,
}

impl LowAccount {
    pub fn parse(self) -> Account {
        Account {
            id: Uuid::new_v4().to_string(),
            name: self.name,
            account_type: self.account_type,
            integrations: vec![],
        }
    }
}

impl Account {
    pub fn new(id: String, name: impl Into<String>, account_type: AccountType) -> Self {
        Account {
            id,
            name: name.into(),
            account_type,
            integrations: vec![],
        }
    }

    pub fn add_integration(&mut self, integration: impl Into<String>) {
        self.integrations.push(integration.into());
    }
}

#[derive(Serialize, Deserialize, Debug, Default, Clone, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct AccountManager {
    pub accounts: Vec<Account>,
    pub active_uuid: String,
}

impl AccountManager {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn add_account(&mut self, account: Account) {
        self.accounts.push(account);
    }

    pub fn remove_account(&mut self, account_id: String) {
        self.accounts.retain(|a| a.id != account_id);
    }

  pub fn set_active_uuid(&mut self, uuid: String) {
    self.active_uuid = uuid;
  }

    /// Загружает менеджер аккаунтов из файла.
    /// Если файл или директория отсутствуют.
    pub async fn load_account_manager_data(app_handle: &AppHandle) -> AccountManager {
        let base_dir = get_launcher_dir(app_handle);
        let file_name = "accounts.json";
        let file_path = base_dir.join(file_name);

        // Если файл существует — просто читаем его структуру целиком
        if file_path.exists() {
            return get_from_file::<AccountManager>(&base_dir, file_name)
                .await
                .unwrap_or_default();
        }

        // Если файла нет — создаем директорию и пустой валидный JSON
        let _ = create_folder(&file_path).await;
        let empty_manager = AccountManager::new();

        if let Ok(json_data) = serde_json::to_string_pretty(&empty_manager) {
            if let Ok(mut file) = File::create(&file_path).await {
                let _ = file.write_all(json_data.as_bytes()).await;
            }
        }

        empty_manager
    }

    pub async fn save_accounts_data(&self, app_handle: &AppHandle) -> Result<(), String> {
        let base_dir = get_launcher_dir(app_handle);
        let file_name = "accounts.json";
        let file_path = base_dir.join(file_name);

        let _ = create_folder(&file_path).await;

        let json_data = serde_json::to_string_pretty(self)
            .map_err(|e| format!("Error serialize JSON: {}", e))?;

        let mut file = File::create(&file_path)
            .await
            .map_err(|e| format!("Do not create file for write: {}", e))?;

        file.write_all(json_data.as_bytes())
            .await
            .map_err(|e| format!("Err file write: {}", e))?;

        Ok(())
    }
}
