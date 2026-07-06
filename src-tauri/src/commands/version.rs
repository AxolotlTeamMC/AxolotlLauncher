use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use tauri::{command, Url};

// #[command]
// fn check_disk_space(path: String) -> u32 {
//     if path.contains("C:") {
//         142
//     } else {
//         45
//     }
// }

// #[command]
// fn get_download_folder() -> String {
//     "C:\\Games\\Axolotl\\downloads".into()
// }

#[derive(Serialize, Deserialize, Debug)]
pub struct ManifestVersion {
  id: String,
  #[serde(rename = "type")]
  version_type: VersionType,
  url: Url,
  time: DateTime<Utc>,
  #[serde(rename = "releaseTime")]
  release_time: DateTime<Utc>,
  sha1: String,
  #[serde(rename = "complianceLevel")]
  compliance_level: u32
}

impl ManifestVersion {
  pub fn id(&self) -> &str {
    &self.id
  }

  pub fn version_type(&self) -> &VersionType {
    &self.version_type
  }

  pub fn url(&self) -> &Url {
    &self.url
  }

  pub fn time(&self) -> &DateTime<Utc> {
    &self.time
  }

  pub fn release_time(&self) -> &DateTime<Utc> {
    &self.release_time
  }

  pub fn sha1(&self) -> &str {
    &self.sha1
  }

  pub fn compliance_level(&self) -> u32 {
    self.compliance_level
  }
}

#[derive(Serialize, Deserialize, Debug, Clone, Copy, PartialEq, Eq)]
#[serde(rename_all = "snake_case")]
pub enum VersionType {
  Release,
  Snapshot,
  OldBeta,
  OldAlpha,
}

#[command]
pub async fn get_versions() -> Vec<ManifestVersion> {
  // Проверяет есть ли кеш манифеста версий на диске, если есть то показывает пользователю,
  // в фоне проверяет есть ли обновления, если есть, то обновляет новый кеш

  // в будущем решить проблему с тем, что файл может обновиться, а старый мы уже отдали
  match load_manifest_from_disk().await {
    Some(versions) => {
      // Проверяем, что если изменился манифест, то обновляем
      if check_update().await {
        let new_versions = fetch_manifest_from_api().await;
        save_manifest_to_disk(&new_versions).await;
      }
      versions
    },
    None => {
      let versions = fetch_manifest_from_api().await;
      save_manifest_to_disk(&versions).await;

      versions
    }
  }
}

// Смотрит есть ли манифест на диске, если есть то отдаём
async fn load_manifest_from_disk() -> Option<Vec<ManifestVersion>> {
  None
}

// Делает запрос к API и проверяет, если появилась новая версия выдаём тру
async fn check_update() -> bool {
  false
}

// Просто делает запрос к API и получает полный список версий
async fn fetch_manifest_from_api() -> Vec<ManifestVersion> {
  Vec::new()
}

// Открывает файл версий и обновляет его
async fn save_manifest_to_disk(version_list: &Vec<ManifestVersion>) {

}




