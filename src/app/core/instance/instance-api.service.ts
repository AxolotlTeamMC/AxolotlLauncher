import {Injectable} from '@angular/core';
import {environment} from '../../../environment/environment';
import {from, Observable} from 'rxjs';
import {invoke} from '@tauri-apps/api/core';

@Injectable({ providedIn: 'root' })
export class InstanceApiService {

  /**
   * Получаем доступные instance.
   */
  getInstances(path: string): Observable<number> {
    return from(
      invoke<number>(`get_instances`, { path })
    );
  }

  /**
   * Создаём новый instance.
   */
  createInstance(path: string): Observable<number> {
    return from(
      invoke<number>(`create_instance`, { path })
    );
  }

  // /**
  //  * Получает путь к папке загрузок лаунчера.
  //  */
  // getDownloadFolder(): Observable<string> {
  //   return from(
  //     invoke<string>(`${this.baseUrl}|get_download_folder`)
  //   );
  // }
}
