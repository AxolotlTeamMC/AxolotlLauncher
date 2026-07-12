export type ProfileMenuView = 'list' | 'add-account';

export type ProfileType = 'offline' | 'microsoft';

export interface ProfileMenuState {
  currentView: ProfileMenuView;
  currentType: ProfileType;
  savedNewNickname: string;
}

export interface OfflineProfile {
  nickname: string;
}
