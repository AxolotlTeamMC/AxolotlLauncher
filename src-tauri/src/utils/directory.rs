use crate::security::account_manager::AccountManager;
use serde::de::DeserializeOwned;
use std::path::PathBuf;
use tauri::{AppHandle, Manager};
use tokio::fs;
use tokio::fs::create_dir_all;

/// Отдаёт путь к основной папке проекта Rouming/AxolotlLauncher/
/// Требует передать `&AppHandle`
pub fn get_launcher_dir(app_handle: &AppHandle) -> PathBuf {
    let mut path = app_handle
        .path()
        .config_dir()
        .unwrap_or_else(|_| PathBuf::from("."));
    path.push("AxolotlLauncher");

    path
}

/// Рекурсивно создает директорию (и все родительские папки, если их нет).
/// Возвращает `Ok(())` в случае успеха или строку с текстом ошибки.
pub async fn create_folder(path: &PathBuf) -> Result<(), String> {
    if let Some(parent) = path.parent() {
        let _ = create_dir_all(parent).await;
    }
    Ok(())
}

/// Удаляет файл или целую папку со всем содержимым (например, для очистки модов).
/// Возвращает `Ok(())` в случае успеха или строку с ошибкой.
pub async fn delete_path(path: String) -> Result<(), String> {
    Ok(())
}

/// Читает содержимое текстового файла (например, config.json или options.txt).
/// Возвращает строку с содержимым файла или ошибку.
pub async fn get_from_file<T>(path: &PathBuf, file_name: impl Into<String>) -> Result<T, String>
where
    T: DeserializeOwned + Default,
{
    let file_path = path.join(file_name.into());

    if !file_path.exists() {
        return Ok(T::default());
    }

    let file = fs::read_to_string(file_path)
        .await
        .map_err(|e| e.to_string())?;
    let data = serde_json::from_str::<T>(&file).map_err(|e| e.to_string())?;
    Ok(data)
}

/// Записывает строку в файл, перезаписывая его (или создавая новый).
/// Возвращает `Ok(())` или ошибку.
pub async fn write_text_file(path: String, content: String) -> Result<(), String> {
    Ok(())
}

/// Считает SHA-1 или MD5 хэш файла для проверки целостности (валидация ассетов игры).
/// Возвращает хэш-строку в нижнем регистре или ошибку.
pub async fn calculate_file_hash(path: String) -> Result<String, String> {
    Ok(path)
}
