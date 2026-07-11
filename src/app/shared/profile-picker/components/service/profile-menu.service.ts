import { Injectable, signal, OnDestroy } from '@angular/core';
import { invoke } from '@tauri-apps/api/core';
import { WebviewWindow } from '@tauri-apps/api/webviewWindow';
import { listen, UnlistenFn } from '@tauri-apps/api/event';

@Injectable({
  providedIn: 'root'
})
export class ProfileMenuService implements OnDestroy {
  /** Источник правды для состояния меню и стрелочки */
  readonly isOpen = signal<boolean>(false);

  private readonly windowLabel = 'profile_picker_window';
  private unlistenMenuClose: UnlistenFn | null = null;

  constructor() {
    this.initListeners();
  }

  /**
   * Инициализирует глобальные слушатели кликов и событий ОС
   */
  private async initListeners(): Promise<void> {
    // Ловим клики внутри лаунчера мимо кнопки профиля
    window.addEventListener('mousedown', async (event) => {
      const target = event.target as HTMLElement;
      if (this.isOpen() && !target.closest('#titlebar-profile')) {
        await this.close();
      }
    });

    // Ловим сигнал уничтожения окна из Rust (клики по рабочему столу)
    this.unlistenMenuClose = await listen('profile_popup_destroyed', () => {
      this.isOpen.set(false);
    });
  }

  /**
   * Управляющий триггер: открывает или закрывает окно попапа с авто-разворотом координат.
   * @param element HTML-элемент вызывающей кнопки для расчета экранных координат геометрии.
   */
  async toggle(element: HTMLElement): Promise<void> {
    if (this.isOpen()) {
      await this.close();
      return;
    }

    this.isOpen.set(true);

    const popupWidth = 240;
    const popupHeight = 300;
    const offset = 4;

    const rect = element.getBoundingClientRect();

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

    try {
      await invoke('open_popup_window', {
        title: this.windowLabel,
        x,
        y,
        routeName: 'profile-picker',
        width: popupWidth,
        height: popupHeight,
      });
    } catch (error) {
      console.error('Ошибка Tauri:', error);
      this.isOpen.set(false);
    }
  }


  /**
   * Насильно уничтожает окно попапа в ОС
   */
  async close(): Promise<void> {
    this.isOpen.set(false);
    const popup = await WebviewWindow.getByLabel(this.windowLabel);
    if (popup) {
      await popup.close();
    }
  }

  ngOnDestroy(): void {
    if (this.unlistenMenuClose) this.unlistenMenuClose();
  }
}
