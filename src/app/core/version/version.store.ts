import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { VersionState } from './version.model';
import { VersionApiService } from './version-api.service';

const initialState: VersionState = {
  versions: [],
  isLoading: false,
  error: null
};

export const VersionStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, versionApi = inject(VersionApiService)) => ({

    _applyVersions(versions: string[]) {
      patchState(store, {
        versions: versions,
        isLoading: false,
        error: null
      });
    },

    async loadVersions() {
      patchState(store, { isLoading: true, error: null });
      console.log('=== СТАРТ ЗАГРУЗКИ ВЕРСИЙ ===');

      try {
        const versionsResult = await firstValueFrom(versionApi.getVersions());
        console.log('=== ОТВЕТ ОТ API ПОЛУЧЕН ===', versionsResult);

        patchState(store, {
          versions: versionsResult,
          isLoading: false,
          error: null
        });

        console.log('=== СТЕЙТ ОБНОВЛЕН ===', store.versions());
      } catch (e: any) {
        console.error('=== КРИТИЧЕСКАЯ ОШИБКА В СТОРЕ ===', e);
        patchState(store, {
          isLoading: false,
          error: e.message || 'Не удалось загрузить версии игры'
        });
      }
    }

  }))
);
