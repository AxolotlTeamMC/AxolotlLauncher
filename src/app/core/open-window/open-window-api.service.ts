import { Injectable } from '@angular/core';
import { catchError, from, Observable, of, switchMap, throwError } from 'rxjs';
import { invoke } from '@tauri-apps/api/core';
import { WebviewWindow } from '@tauri-apps/api/webviewWindow';
import { OpenWindowApi } from './open-window.model';
import { listen, UnlistenFn } from '@tauri-apps/api/event';
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

  setWindowSize(label: string, size: LogicalSize | PhysicalSize | Size): Observable<void> {
    return from(WebviewWindow.getByLabel(label)).pipe(
      switchMap((windowInstance) => {
        if (windowInstance) {
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
