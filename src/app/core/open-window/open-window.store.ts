import { VersionState } from '../version/version.model';
import { OpenWindowState } from './open-window.model';
import { patchState, signalStoreFeature, withHooks, withMethods, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { OpenWindowApiService } from './open-window-api.service';
import { pipe, switchMap, tap } from 'rxjs';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { WebviewWindow } from '@tauri-apps/api/webviewWindow';
import { LogicalSize, PhysicalSize, Size } from '@tauri-apps/api/dpi';

export interface WindowStore {
  isOpen: boolean;
}

const initialState: WindowStore = {
  isOpen: false,
};

interface ListenArgs {
  listenLabel: string;
  callback: () => void;
}

export function withTauriWindow(state: OpenWindowState) {
  return signalStoreFeature(
    withState(initialState),
    withMethods((store, windowApiService = inject(OpenWindowApiService)) => ({
      open(posX: number, posY: number) {
        windowApiService
          .openWindow({
            label: state.label,
            posX,
            posY,
            routeName: state.routeName,
            width: state.defaultWidth,
            height: state.defaultHeight,
          })
          .subscribe({
            next: (_) => {
              patchState(store, {
                isOpen: true,
              });
            },
            error: (e) => {
              console.error(`[withTauriWindow] Error Open Native Window ${state.label}:`, e);
              patchState(store, {
                isOpen: false,
              });
            },
          });
      },
      close() {
        patchState(store, {
          isOpen: false,
        });
        windowApiService.closeWindow(state.label).subscribe({
          next: (_) => {
            patchState(store, {
              isOpen: false,
            });
          },
          error: (e) => {
            console.error(`[withTauriWindow] Error Close Native Window ${state.label}:`, e);
            patchState(store, {
              isOpen: true,
            });
          },
        });
      },

      setSize(size: LogicalSize | PhysicalSize | Size) {
        windowApiService.setWindowSize(state.label, size).subscribe();
        console.log('[withTauriWindow] SetSize:', size);
      },

      _listenRx: rxMethod<ListenArgs>(
        pipe(
          switchMap((args) =>
            windowApiService.listenWindow(args.listenLabel).pipe(
              // Как только прилетел ивент из Раста — вызываем переданный коллбэк
              tap(() => args.callback()),
            ),
          ),
        ),
      ),

      listen(listenLabel: string, callback: () => void) {
        this._listenRx({ listenLabel, callback });
      },
    })),
  );
}
