pub mod commands;
pub mod security;
pub mod utils;

use crate::security::account_manager::{Account, AccountType};
use crate::utils::directory::{get_from_file, get_launcher_dir};
use commands::version;
use security::account_manager::AccountManager;
use std::path::PathBuf;
use std::sync::Mutex;
use tauri::{AppHandle, Manager};
use uuid::{uuid, Uuid};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }

            let app_handle = app.handle().clone();

            tauri::async_runtime::block_on(async move {
                let initial_manager = load_account_manager_data(&app_handle).await;

                // Регистрируем уже заполненный менеджер как глобальное состояние Tauri
                app_handle.manage(Mutex::new(initial_manager));
            });

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![version::get_versions])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

async fn load_account_manager_data(app_handle: &AppHandle) -> AccountManager {
    // Написать парсинг данных
    let base_dir = get_launcher_dir(app_handle);
    let mut account_manager = get_from_file::<AccountManager>(&base_dir, "accaunt.json")
        .await
        .unwrap_or_default();

    let launcher_dir = app_handle
        .path()
        .app_config_dir()
        .unwrap_or_else(|_| PathBuf::from("."));

    let test_account = Account::new(Uuid::new_v4().to_string(), "SEMASEM", AccountType::Offline);

    account_manager.add_account(test_account);
    account_manager.add_integration("Discord");

    account_manager
}
