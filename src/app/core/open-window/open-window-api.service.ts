import { Injectable } from '@angular/core';
import { catchError, from, Observable, of, switchMap, throwError } from 'rxjs';
import { invoke } from '@tauri-apps/api/core';
import { WebviewWindow } from '@tauri-apps/api/webviewWindow';
import { OpenWindowApi } from './open-window.model';
import { listen } from '@tauri-apps/api/event';
import { LogicalSize, PhysicalSize, Size } from '@tauri-apps/api/dpi';

@Injectable({ providedIn: 'root' })
export class OpenWindowApiService {
  /**
   * Открываем новое окно напрямую из бэкенда Tauri
   */
  openWindow({ label, posX, posY, height, width, routeName }: OpenWindowApi): Observable<void> {
    return from(
      invoke<void>('open_popup_window', { label, posX, posY, routeName, width, height }),
    ).pipe(
      catchError((rustError) => {
        return throwError(() => rustError);
      }),
    );
  }

  /**
   * Закрываем окно через бэкенда Tauri
   */
  closeWindow(label: string): Observable<void> {
    return from(WebviewWindow.getByLabel(label)).pipe(
      switchMap((windowInstance) => {
        if (windowInstance) {
          return from(windowInstance.close());
        }
        return of(void 0);
      }),
      catchError((e) => {
        return throwError(() => new Error(e?.message || 'Tauri Close Error'));
      }),
    );
  }

  /**
   * Подписывается на глобальное событие Tauri по его идентификатору.
   * Автоматически отписывается и уничтожает слушателя Tauri при отписке от Observable.
   *
   * @param {string} listenLabel - Название (идентификатор) события Tauri для прослушивания.
   * @returns {Observable<void>} Поток, который генерирует событие каждый раз, когда Tauri шлет сигнал.
   */
  listenWindow(listenLabel: string): Observable<void> {
    return new Observable<void>((observer) => {
      let unlistenFn: (() => void) | null = null;

      listen(listenLabel, () => {
        observer.next();
      }).then((fn) => {
        unlistenFn = fn;
        if (observer.closed) fn();
      });

      return () => {
        if (unlistenFn) unlistenFn();
      };
    });
  }

  /**
   * Находит окно Tauri по его `label` и асинхронно изменяет его размер.
   * Если окно с указанным идентификатором не найдено, поток безопасно завершится.
   *
   * @param {string} label - Уникальный строковый идентификатор целевого окна Tauri.
   * @param {LogicalSize | PhysicalSize | Size} size - Новый размер окна (поддерживает типы Tauri).
   * @returns {Observable<void>} Поток, завершающий выполнение после успешного изменения размера.
   * @throws {Error} Выбрасывает ошибку, если Tauri API вернул сбой при изменении размера.
   */
  /**
   * Находит окно Tauri по его `label` и асинхронно изменяет его размер.
   * Если окно с указанным идентификатором не найдено, поток безопасно завершится.
   */
  setWindowSize(label: string, size: LogicalSize | PhysicalSize | Size): Observable<void> {
    return from(WebviewWindow.getByLabel(label)).pipe(
      switchMap((windowInstance) => {
        if (windowInstance) {
          console.log('setWindowSize: ', size);
          return from(windowInstance.setSize(size));
        }
        return of(void 0);
      }),
      catchError((e) => {
        return throwError(() => new Error(e?.message || 'Tauri Set Size Error'));
      }),
    );
  }
}
