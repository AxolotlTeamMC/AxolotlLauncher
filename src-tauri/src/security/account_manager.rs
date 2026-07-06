use serde::{Deserialize, Serialize};

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
}

impl Account {
  pub fn new(id: String, name: impl Into<String>, account_type: AccountType) -> Self {
    Account { id, name: name.into(), account_type }
  }
}

#[derive(Serialize, Deserialize, Debug, Default, Clone, PartialEq, Eq)]
pub struct AccountManager {
  pub accounts: Vec<Account>,
  pub integrations: Vec<String>,
}

impl AccountManager {
  pub fn new() -> Self {
    Self::default()
  }

  pub fn add_account(&mut self, account: Account) {
    self.accounts.push(account);
  }

  pub fn add_integration(&mut self, integration: impl Into<String>) {
    self.integrations.push(integration.into());
  }
}
