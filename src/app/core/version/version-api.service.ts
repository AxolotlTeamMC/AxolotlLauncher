import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { invoke } from '@tauri-apps/api/core';

@Injectable({ providedIn: 'root' })
export class VersionApiService {
  /**
   * Получаем доступные версии игры напрямую из бэкенда Tauri
   */
  getVersions(): Observable<string[]> {
    return from(
      invoke<string[]>('get_versions')
    ).pipe(take(1));
  }
}
