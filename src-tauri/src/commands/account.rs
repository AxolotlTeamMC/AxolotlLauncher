use crate::security::account_manager::{AccountManager, LowAccount};
use tauri::{AppHandle, Manager};
use tokio::sync::RwLock;

#[tauri::command]
pub async fn get_accounts_from_disk(app: AppHandle) -> AccountManager {
  let account_manager = app.state::<RwLock<AccountManager>>();
  let lock_account_manager = account_manager.read().await;
  lock_account_manager.clone()
}

#[tauri::command]
pub async fn set_active_account(app: AppHandle, account_id: String) -> AccountManager {
  let account_manager = app.state::<RwLock<AccountManager>>();
  let mut lock_account_manager = account_manager.write().await;

  lock_account_manager.set_active_uuid(account_id);

  if let Err(e) = lock_account_manager.save_accounts_data(&app).await {
    eprintln!("Err save active account: {}", e);
  }

  drop(lock_account_manager);

  get_accounts_from_disk(app).await
}

#[tauri::command]
pub async fn save_account_to_disk(app: AppHandle, account: LowAccount) -> AccountManager {
  let account_manager = app.state::<RwLock<AccountManager>>();
  let mut lock_account_manager = account_manager.write().await;

  let new_account = account.parse();
  lock_account_manager.add_account(new_account);

  if let Err(e) = lock_account_manager.save_accounts_data(&app).await {
    eprintln!("Err for write account to disk: {}", e);
  }

  drop(lock_account_manager);

  get_accounts_from_disk(app).await
}

#[tauri::command]
pub async fn remove_account_from_disk(app: AppHandle, account_id: String) -> AccountManager {
  let account_manager = app.state::<RwLock<AccountManager>>();
  let mut lock_account_manager = account_manager.write().await;

  lock_account_manager.remove_account(account_id);

  if let Err(e) = lock_account_manager.save_accounts_data(&app).await {
    eprintln!("Err for remove account from disk: {}", e);
  }

  drop(lock_account_manager);

  get_accounts_from_disk(app).await
}

#[tauri::command]
pub async fn add_integration(app: AppHandle) {}
