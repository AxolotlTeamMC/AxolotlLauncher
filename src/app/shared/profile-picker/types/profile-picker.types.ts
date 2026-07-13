import { AccountType } from '../../../core/account/account.types';

export type ProfileMenuView = 'list' | 'add-account';

export interface ProfileMenuState {
  currentView: ProfileMenuView;
  currentType: AccountType;
  savedNewNickname: string;
}

export interface OfflineProfile {
  nickname: string;
}
