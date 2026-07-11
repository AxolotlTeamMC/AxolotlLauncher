use crate::security::account_manager::{Account, AccountManager};
use tauri::{AppHandle, Manager, State};
use tokio::sync::RwLock;

#[tauri::command]
pub async fn get_account_list(app: AppHandle) -> Vec<Account> {
    let account_manager = app.state::<RwLock<AccountManager>>();
    let lock_account_manager = account_manager.read().await;
    lock_account_manager.accounts.clone()
}

#[tauri::command]
pub async fn add_account(app: AppHandle, account: Account) {
    let account_manager = app.state::<RwLock<AccountManager>>();
    let mut lock_account_manager = account_manager.write().await;
    lock_account_manager.add_account(account);
}

#[tauri::command]
pub async fn remove_account(app: AppHandle, account_id: String) {
    let account_manager = app.state::<RwLock<AccountManager>>();
    let mut lock_account_manager = account_manager.write().await;
    lock_account_manager.remove_account(account_id);
}

#[tauri::command]
pub async fn add_integration(app: AppHandle) {

}
