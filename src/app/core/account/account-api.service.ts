import { Injectable } from '@angular/core';
import { catchError, from, Observable, of, switchMap, throwError } from 'rxjs';
import { invoke } from '@tauri-apps/api/core';
import { AccountData, LowAccount } from './account.types';

@Injectable({ providedIn: 'root' })
export class AccountApiService {
  /**
   * Позволяет получить список все аккаунтов из бэкенда Tauri
   */
  fetchAccountsFromDisk(): Observable<AccountData> {
    return from(invoke<AccountData>('get_accounts_from_disk')).pipe(
      catchError((rustError) => {
        return throwError(() => rustError);
      }),
    );
  }

  /**
   * Сохраняет аккаунт на диске из бэкенда Tauri
   */
  addAccount(newAccount: LowAccount): Observable<AccountData> {
    return from(invoke<AccountData>('save_account_to_disk', { account: newAccount })).pipe(
      catchError((rustError) => {
        return throwError(() => rustError);
      }),
    );
  }

  setActiveAccount(accountId: string): Observable<AccountData> {
    return from(invoke<AccountData>('set_active_account', { accountId })).pipe(
      catchError((rustError) => {
        return throwError(() => rustError);
      }),
    );
  }

  /**
   * Убирает аккаунт из бэкенда Tauri
   */
  removeAccount(uuid: string): Observable<void> {
    return from(invoke<void>('remove_account_from_disk', { uuid })).pipe(
      catchError((rustError) => {
        return throwError(() => rustError);
      }),
    );
  }
}
