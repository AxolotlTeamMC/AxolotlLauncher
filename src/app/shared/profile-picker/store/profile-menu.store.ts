import { OfflineProfile, ProfileMenuState, ProfileType } from '../types/profile-picker.types';
import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { withTauriWindow } from '../../../core/open-window/open-window.store';

const initialState: ProfileMenuState = {
  currentView: 'list',
  currentType: 'offline',
  savedNewNickname: '',
};

export const ProfileMenuStore = signalStore(
  { providedIn: 'root' },
  withTauriWindow({
    label: 'profile_picker_window',
    routeName: 'profile-picker',
    defaultWidth: 240,
    defaultHeight: 300,
  }),
  withState(initialState),
  withMethods((store) => ({

    /**
     * Управляющий триггер: открывает или закрывает окно попапа с авто-разворотом координат.
     * @param triggerElement HTML-элемент вызывающей кнопки для расчета экранных координат геометрии.
     */
    toggleMenu(triggerElement: HTMLElement) {
      if (store.isOpen()) {
        store.close()
        return;
      }

      const popupWidth = 240;
      const popupHeight = 300;
      const offset = 4;

      const rect = triggerElement.getBoundingClientRect();

      let x = rect.left + window.screenX;

      if (x + popupWidth > window.screen.availWidth) {
        x = window.screenX + rect.right - popupWidth - offset * 3;
      }

      let y = rect.bottom + window.screenY + offset;

      const spaceBelow = window.screen.availHeight - (rect.bottom + window.screenY);

      if (spaceBelow < popupHeight + offset) {
        y = rect.top + window.screenY - popupHeight - offset;
        console.log('[Popup Service] Недостаточно места снизу. Разворачиваем попап вверх.');
      }

      store.open(x, y)
    },

    initClickOutside() {
      window.addEventListener('mousedown', async (event) => {
        const target = event.target as HTMLElement;
        if (store.isOpen() && !target.closest('#titlebar-profile')) {
          store.close();
        }
      });
    },

    openNewProfileMenu() {
      patchState(store, {
        currentView: 'add-account',
      })
    },

    openProfileListMenu() {
      patchState(store, {
        currentView: 'list',
      })
    },

    changeProfileType(type: ProfileType) {
      patchState(store, {
        currentType: type,
      })
    },

    addNewProfile(profile: OfflineProfile) {
      patchState(store, {
        savedNewNickname: profile.nickname
      })
    },

    saveDraftOfflineProfile(profile: OfflineProfile) {
      patchState(store, {
        savedNewNickname: profile.nickname
      })
    },

    removeProfile() {

    }

  })),
  withHooks((store) => ({
    onInit() {
      store.listen('profile_popup_destroyed', () => {
        patchState(store, { isOpen: false });
      });
      store.initClickOutside();
    }
  }))
);
