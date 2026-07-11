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
use tokio::sync::RwLock;
use uuid::{uuid, Uuid};
use crate::commands::version::get_versions;
use crate::utils::open_popup::{open_popup_window};

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
                let initial_manager = AccountManager::load_account_manager_data(&app_handle).await;

                // Регистрируем уже заполненный менеджер как глобальное состояние Tauri
                app_handle.manage(RwLock::new(initial_manager));
            });

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![get_versions, open_popup_window])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
