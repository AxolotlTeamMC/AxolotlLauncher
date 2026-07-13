export interface AccountData {
  accounts: Account[],
  activeUuid: string
}

export interface Account {
  uuid: string;
  nickname: string;
  type: AccountType;
  integrations: [];
}

export interface LowAccount {
  nickname: string;
  type: AccountType;
}

export type AccountType = 'Offline' | 'Microsoft';

export interface AccountState {
  activeAccountUuid: string;
  accountList: Account[];
}
