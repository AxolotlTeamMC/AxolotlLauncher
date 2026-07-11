use std::path::PathBuf;
use serde::{Deserialize, Serialize};
use tauri::{AppHandle, Manager};
use uuid::Uuid;
use crate::utils::directory::{get_from_file, get_launcher_dir};

#[derive(Serialize, Deserialize, Debug, Default, Clone, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub enum AccountType {
  #[default]
  Offline,
  Online,
}

#[derive(Serialize, Deserialize, Debug, Default, Clone, PartialEq, Eq)]
pub struct Account {
  pub id: String,
  pub name: String,
  pub account_type: AccountType,
  pub integrations: Vec<String>
}

impl Account {
  pub fn new(id: String, name: impl Into<String>, account_type: AccountType) -> Self {
    Account { id, name: name.into(), account_type, integrations: vec![] }
  }

  pub fn add_integration(&mut self, integration: impl Into<String>) {
    self.integrations.push(integration.into());
  }
}

#[derive(Serialize, Deserialize, Debug, Default, Clone, PartialEq, Eq)]
pub struct AccountManager {
  pub accounts: Vec<Account>
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

  pub async fn load_account_manager_data(app_handle: &AppHandle) -> AccountManager {
    // Написать парсинг данных
    let base_dir = get_launcher_dir(app_handle);
    let mut account_manager = get_from_file::<AccountManager>(&base_dir, "accaunt.json")
      .await
      .unwrap_or_default();

    let launcher_dir = app_handle
      .path()
      .app_config_dir()
      .unwrap_or_else(|_| PathBuf::from("."));

    let mut test_account = Account::new(Uuid::new_v4().to_string(), "SEMASEM", AccountType::Offline);

    test_account.add_integration("Discord");

    account_manager.add_account(test_account);

    account_manager
  }
}
