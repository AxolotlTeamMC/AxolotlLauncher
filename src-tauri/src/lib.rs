pub mod commands;
pub mod security;
pub mod utils;

use security::account_manager::AccountManager;
use tauri::{Manager};
use tokio::sync::RwLock;
use crate::commands::account::{get_accounts_from_disk, remove_account_from_disk, save_account_to_disk, set_active_account};
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
        .invoke_handler(tauri::generate_handler![
          get_versions,
          open_popup_window,
          save_account_to_disk,
          remove_account_from_disk,
          get_accounts_from_disk,
          set_active_account
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
